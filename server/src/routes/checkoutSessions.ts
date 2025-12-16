import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import type Stripe from 'stripe';
import { asyncHandler } from '../lib/asyncHandler.js';
import { ApiError } from '../lib/apiError.js';
import { assertIsoDate, getTodayIsoDateInTimezone, getWeekdayFromIsoDate, isIsoDateBefore } from '../lib/dates.js';
import { env } from '../lib/env.js';
import { prisma } from '../lib/prisma.js';
import { sha256Hex, stableStringify } from '../lib/hash.js';
import { generateReferenceCode } from '../lib/referenceCode.js';
import { stripe } from '../lib/stripe.js';
import { getServiceTimes } from '../lib/serviceTimes.js';
import { checkoutRateLimit } from '../middleware/rateLimits.js';

export const checkoutSessionsRouter = Router();

const isoDateSchema = z.string().refine((value) => {
  try {
    assertIsoDate(value);
    return true;
  } catch {
    return false;
  }
}, 'Invalid ISO date.');

const customerSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().min(1).max(200).optional(),
    phone: z.string().min(1).max(50).optional(),
  })
  .strict()
  .optional();

const bodySchema = z
  .object({
    date: isoDateSchema,
    time: z.string().min(1),
    guests: z.coerce.number().int(),
    notes: z.string().max(2000).optional(),
    customer: customerSchema,
  })
  .strict();

const IDEMPOTENCY_SCOPE = 'checkout_session_create';

checkoutSessionsRouter.post(
  '/',
  checkoutRateLimit,
  asyncHandler(async (req, res) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) throw parsed.error;

    const { date, time, guests, notes, customer } = parsed.data;

    const serviceTimes = getServiceTimes();
    if (!serviceTimes.some((t) => t.time === time)) {
      throw new ApiError({ status: 400, code: 'INVALID_TIME', message: 'Invalid time.' });
    }
    if (guests < env.MIN_GUESTS || guests > env.MAX_GUESTS) {
      throw new ApiError({ status: 400, code: 'INVALID_GUESTS', message: 'Invalid guests.' });
    }

    const today = getTodayIsoDateInTimezone();
    if (isIsoDateBefore(date, today)) {
      throw new ApiError({ status: 400, code: 'PAST_DATE', message: 'Date is in the past.' });
    }
    const weekday = getWeekdayFromIsoDate(date);
    if (env.CLOSED_WEEKDAYS.includes(weekday)) {
      throw new ApiError({ status: 409, code: 'DATE_CLOSED', message: 'No availability for this date.' });
    }

    const idempotencyKeyHeader =
      (req.header('idempotency-key') ?? req.header('Idempotency-Key'))?.trim() || undefined;
    const requestHash = sha256Hex(
      stableStringify({
        date,
        time,
        guests,
        notes: notes ?? '',
        customer: customer ?? null,
      })
    );

    let idempotencyRecord:
      | {
          id: string;
          key: string;
          scope: string;
          requestHash: string;
          status: string;
          responseBody: Prisma.JsonValue | null;
          reservationId: string | null;
        }
      | null
      | undefined;

    if (idempotencyKeyHeader) {
      try {
        idempotencyRecord = await prisma.idempotencyKey.create({
          data: {
            key: idempotencyKeyHeader,
            scope: IDEMPOTENCY_SCOPE,
            requestHash,
            status: 'IN_PROGRESS',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
          select: {
            id: true,
            key: true,
            scope: true,
            requestHash: true,
            status: true,
            responseBody: true,
            reservationId: true,
          },
        });
      } catch (err: any) {
        if (err?.code !== 'P2002') throw err;
        idempotencyRecord = await prisma.idempotencyKey.findUnique({
          where: { key_scope: { key: idempotencyKeyHeader, scope: IDEMPOTENCY_SCOPE } },
          select: {
            id: true,
            key: true,
            scope: true,
            requestHash: true,
            status: true,
            responseBody: true,
            reservationId: true,
          },
        });
      }

      if (!idempotencyRecord) {
        throw new ApiError({ status: 500, code: 'IDEMPOTENCY_ERROR', message: 'Failed to load idempotency key.' });
      }

      if (idempotencyRecord.requestHash !== requestHash) {
        throw new ApiError({
          status: 409,
          code: 'IDEMPOTENCY_CONFLICT',
          message: 'Idempotency-Key reuse with different payload.',
        });
      }

      if (idempotencyRecord.status === 'COMPLETED' && idempotencyRecord.responseBody) {
        return res.status(200).json(idempotencyRecord.responseBody);
      }
    }

    const now = new Date();
    const defaultHoldExpiresAt = new Date(now.getTime() + env.HOLD_TTL_MINUTES * 60 * 1000);

    const pricing = {
      currency: env.CURRENCY,
      pricePerPersonAmount: env.PRICE_PER_PERSON_AMOUNT,
      depositBps: env.DEPOSIT_BPS,
    };
    const totalAmount = guests * pricing.pricePerPersonAmount;
    const depositAmount = Math.floor((totalAmount * pricing.depositBps) / 10000);

    type ReservationForCheckout = {
      id: string;
      referenceCode: string;
      status: string;
      guests: number;
      notes: string | null;
      currency: string;
      pricePerPersonAmount: number;
      depositBps: number;
      depositAmount: number;
      totalAmount: number;
      holdExpiresAt: Date;
      stripeCheckoutSessionId: string | null;
    };

    let reservation: ReservationForCheckout | null = null;
    if (idempotencyRecord?.reservationId) {
      reservation = await prisma.reservation.findUnique({
        where: { id: idempotencyRecord.reservationId },
        select: {
          id: true,
          referenceCode: true,
          status: true,
          guests: true,
          notes: true,
          currency: true,
          pricePerPersonAmount: true,
          depositBps: true,
          depositAmount: true,
          totalAmount: true,
          holdExpiresAt: true,
          stripeCheckoutSessionId: true,
        },
      });

      if (reservation && reservation.holdExpiresAt.getTime() < now.getTime()) {
        throw new ApiError({ status: 409, code: 'HOLD_EXPIRED', message: 'Reservation hold expired.' });
      }
    }

    if (!reservation) {
      reservation = await prisma.$transaction(async (tx) => {
        const label = serviceTimes.find((t) => t.time === time)?.label ?? time;
        const slot = await tx.serviceSlot.upsert({
          where: { serviceDate_startTime: { serviceDate: date, startTime: time } },
          update: {},
          create: {
            serviceDate: date,
            startTime: time,
            label,
            capacityTotal: env.CAPACITY_TOTAL,
          },
          select: {
            id: true,
            capacityTotal: true,
            capacityConfirmed: true,
            capacityHeld: true,
            isEnabled: true,
          },
        });

        if (!slot.isEnabled) {
          throw new ApiError({ status: 409, code: 'SLOT_DISABLED', message: 'Slot unavailable.' });
        }
        const remaining = slot.capacityTotal - slot.capacityConfirmed - slot.capacityHeld;
        if (remaining < guests) {
          throw new ApiError({ status: 409, code: 'SLOT_SOLD_OUT', message: 'No availability.' });
        }

        // Reserve held capacity first; DB check constraint enforces no oversell under concurrency.
        try {
          await tx.serviceSlot.update({
            where: { id: slot.id },
            data: { capacityHeld: { increment: guests } },
            select: { id: true },
          });
        } catch (err: any) {
          const prismaCode = err?.code;
          if (prismaCode === 'P2004') {
            throw new ApiError({ status: 409, code: 'SLOT_SOLD_OUT', message: 'No availability.' });
          }
          throw err;
        }

        let created: ReservationForCheckout | undefined;
        for (let attempt = 0; attempt < 8; attempt++) {
          try {
            created = await tx.reservation.create({
              data: {
                referenceCode: generateReferenceCode(),
                slotId: slot.id,
                status: 'PENDING_PAYMENT',
                guests,
                notes: notes || null,
                currency: pricing.currency,
                pricePerPersonAmount: pricing.pricePerPersonAmount,
                depositBps: pricing.depositBps,
                depositAmount,
                totalAmount,
                holdExpiresAt: defaultHoldExpiresAt,
              },
              select: {
                id: true,
                referenceCode: true,
                status: true,
                guests: true,
                notes: true,
                currency: true,
                pricePerPersonAmount: true,
                depositBps: true,
                depositAmount: true,
                totalAmount: true,
                holdExpiresAt: true,
                stripeCheckoutSessionId: true,
              },
            });
            break;
          } catch (err: any) {
            if (err?.code !== 'P2002') throw err;
          }
        }

        if (!created) {
          throw new ApiError({
            status: 500,
            code: 'REFERENCE_GENERATION_FAILED',
            message: 'Failed to create reservation.',
          });
        }

        if (idempotencyRecord) {
          await tx.idempotencyKey.update({
            where: { id: idempotencyRecord.id },
            data: { reservationId: created.id },
            select: { id: true },
          });
        }

        return created;
      });
    }

    if (reservation.status !== 'PENDING_PAYMENT') {
      throw new ApiError({
        status: 409,
        code: 'RESERVATION_NOT_PENDING',
        message: 'Reservation is not pending payment.',
      });
    }

    const holdExpiresAt = reservation.holdExpiresAt;

    const frontendOrigin = env.FRONTEND_ORIGIN.replace(/\/$/, '');
    const successUrl = `${frontendOrigin}/#/confirmation?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontendOrigin}/#/reservations?canceled=1`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: reservation.currency,
            unit_amount: reservation.depositAmount,
            product_data: {
              name: 'AKAI Omakase Deposit',
              description: `${guests} guests · ${date} ${time}`,
            },
          },
        },
      ],
      metadata: {
        reservation_id: reservation.id,
        reference_code: reservation.referenceCode,
        service_date: date,
        service_time: time,
        guests: String(guests),
      },
      client_reference_id: reservation.referenceCode,
    };

    if (typeof customer?.email === 'string') sessionParams.customer_email = customer.email;

    // Stripe Checkout may enforce a minimum expires_at; only set it when configured TTL is compatible.
    if (env.HOLD_TTL_MINUTES >= 30) {
      sessionParams.expires_at = Math.floor(holdExpiresAt.getTime() / 1000);
    }

    let session: Stripe.Checkout.Session;
    if (reservation.stripeCheckoutSessionId) {
      session = await stripe.checkout.sessions.retrieve(reservation.stripeCheckoutSessionId);
    } else {
      session = await stripe.checkout.sessions.create(sessionParams, {
        idempotencyKey: idempotencyKeyHeader,
      });

      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { stripeCheckoutSessionId: session.id },
        select: { id: true },
      });
    }

    const responseBody = {
      reservationId: reservation.id,
      reference: reservation.referenceCode,
      status: reservation.status,
      holdExpiresAt: reservation.holdExpiresAt.toISOString(),
      amount: {
        currency: reservation.currency,
        deposit: reservation.depositAmount,
        total: reservation.totalAmount,
      },
      stripe: {
        checkoutSessionId: session.id,
        checkoutUrl: session.url,
      },
    };

    if (idempotencyRecord) {
      await prisma.idempotencyKey.update({
        where: { id: idempotencyRecord.id },
        data: { status: 'COMPLETED', responseBody },
        select: { id: true },
      });
    }

    res.status(reservation.stripeCheckoutSessionId ? 200 : 201).json(responseBody);
  })
);
