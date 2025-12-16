import express, { Router } from 'express';
import type Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { ApiError } from '../../lib/apiError.js';
import { env } from '../../lib/env.js';
import { logger } from '../../lib/logger.js';
import { prisma } from '../../lib/prisma.js';
import { stripe } from '../../lib/stripe.js';

export const stripeWebhookRouter = Router();

stripeWebhookRouter.post(
  '/',
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const signature = req.header('stripe-signature');
    if (!signature) {
      throw new ApiError({ status: 400, code: 'MISSING_STRIPE_SIGNATURE', message: 'Missing Stripe signature.' });
    }

    const rawBody = req.body as Buffer;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw new ApiError({ status: 400, code: 'INVALID_STRIPE_SIGNATURE', message: 'Invalid Stripe signature.' });
    }

    let stripeEvent;
    try {
      stripeEvent = await prisma.stripeEvent.create({
        data: {
          eventId: event.id,
          type: event.type,
          livemode: event.livemode,
          apiVersion: event.api_version ?? null,
          payload: event as unknown as Prisma.JsonObject,
        },
        select: { id: true, eventId: true, processedAt: true },
      });
    } catch (err: any) {
      if (err?.code !== 'P2002') throw err;
      stripeEvent = await prisma.stripeEvent.findUnique({
        where: { eventId: event.id },
        select: { id: true, eventId: true, processedAt: true },
      });
    }

    if (stripeEvent?.processedAt) {
      return res.status(200).json({ received: true, deduped: true });
    }

    if (!stripeEvent) {
      throw new ApiError({ status: 500, code: 'STRIPE_EVENT_ERROR', message: 'Failed to persist Stripe event.' });
    }

    const processedAt = new Date();
    let reservationId: string | null = null;

    try {
      if (
        event.type === 'checkout.session.completed' ||
        event.type === 'checkout.session.async_payment_succeeded'
      ) {
        const session = event.data.object as Stripe.Checkout.Session;
        reservationId = await handleCheckoutSessionPaid(session, processedAt);
      } else if (
        event.type === 'checkout.session.expired' ||
        event.type === 'checkout.session.async_payment_failed'
      ) {
        const session = event.data.object as Stripe.Checkout.Session;
        reservationId = await handleCheckoutSessionExpired(session, processedAt);
      }
      await prisma.stripeEvent.update({
        where: { id: stripeEvent.id },
        data: { processedAt, reservationId },
        select: { id: true },
      });
    } catch (err) {
      logger.error({ err, stripeEventId: event.id, type: event.type }, 'stripe_webhook_processing_failed');
      throw err;
    }

    res.status(200).json({ received: true });
  })
);

async function findReservationForSession(session: Stripe.Checkout.Session) {
  const sessionId = session.id;
  const reservationIdFromMetadata =
    typeof session.metadata?.reservation_id === 'string' ? session.metadata.reservation_id : undefined;

  const reservation = await prisma.reservation.findFirst({
    where: {
      OR: [
        { stripeCheckoutSessionId: sessionId },
        ...(reservationIdFromMetadata ? [{ id: reservationIdFromMetadata }] : []),
      ],
    },
    select: {
      id: true,
      status: true,
      guests: true,
      slotId: true,
      stripeCheckoutSessionId: true,
    },
  });

  return reservation ?? null;
}

async function handleCheckoutSessionPaid(session: Stripe.Checkout.Session, now: Date): Promise<string | null> {
  let reservation = await findReservationForSession(session);
  if (!reservation) {
    logger.warn({ stripeCheckoutSessionId: session.id }, 'stripe_webhook_reservation_not_found');
    return null;
  }

  const paymentStatus = session.payment_status;
  const stripeCustomerEmail =
    typeof session.customer_details?.email === 'string' ? session.customer_details.email : null;
  const stripePaymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;

  if (paymentStatus !== 'paid') {
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'REQUIRES_MANUAL_REVIEW',
        stripeCustomerEmail,
        stripePaymentIntentId,
      },
      select: { id: true },
    });
    return reservation.id;
  }

  if (reservation.status === 'CONFIRMED') {
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        stripeCustomerEmail: stripeCustomerEmail ?? undefined,
        stripePaymentIntentId: stripePaymentIntentId ?? undefined,
      },
      select: { id: true },
    });
    return reservation.id;
  }

  if (reservation.status === 'CANCELLED') {
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'REQUIRES_MANUAL_REVIEW',
        stripeCustomerEmail,
        stripePaymentIntentId,
      },
      select: { id: true },
    });
    return reservation.id;
  }

  if (reservation.status === 'PENDING_PAYMENT') {
    try {
      const didConfirm = await prisma.$transaction(async (tx) => {
        const updated = await tx.reservation.updateMany({
          where: { id: reservation!.id, status: 'PENDING_PAYMENT' },
          data: {
            status: 'CONFIRMED',
            stripeCustomerEmail,
            stripePaymentIntentId,
            paidAt: now,
            confirmedAt: now,
          },
        });
        if (updated.count !== 1) return false;

        await tx.serviceSlot.update({
          where: { id: reservation!.slotId },
          data: {
            capacityHeld: { decrement: reservation!.guests },
            capacityConfirmed: { increment: reservation!.guests },
          },
          select: { id: true },
        });
        return true;
      });

      if (didConfirm) return reservation.id;
    } catch (err: any) {
      if (err?.code === 'P2004') {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            status: 'REQUIRES_MANUAL_REVIEW',
            stripeCustomerEmail,
            stripePaymentIntentId,
          },
          select: { id: true },
        });
        return reservation.id;
      }
      throw err;
    }

    // Status changed concurrently (e.g., expiry job). Re-fetch and continue.
    reservation = await prisma.reservation.findUnique({
      where: { id: reservation.id },
      select: {
        id: true,
        status: true,
        guests: true,
        slotId: true,
        stripeCheckoutSessionId: true,
      },
    });
    if (!reservation) return null;
  }

  if (reservation.status === 'EXPIRED') {
    const slot = await prisma.serviceSlot.findUnique({
      where: { id: reservation.slotId },
      select: { capacityTotal: true, capacityConfirmed: true, capacityHeld: true },
    });
    if (!slot) return reservation.id;

    const remaining = slot.capacityTotal - slot.capacityConfirmed - slot.capacityHeld;
    if (remaining < reservation.guests) {
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          status: 'REQUIRES_MANUAL_REVIEW',
          stripeCustomerEmail,
          stripePaymentIntentId,
        },
        select: { id: true },
      });
      return reservation.id;
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.serviceSlot.update({
          where: { id: reservation.slotId },
          data: { capacityConfirmed: { increment: reservation.guests } },
          select: { id: true },
        });

        await tx.reservation.update({
          where: { id: reservation.id },
          data: {
            status: 'CONFIRMED',
            stripeCustomerEmail,
            stripePaymentIntentId,
            paidAt: now,
            confirmedAt: now,
          },
          select: { id: true },
        });
      });
      return reservation.id;
    } catch (err: any) {
      if (err?.code === 'P2004') {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            status: 'REQUIRES_MANUAL_REVIEW',
            stripeCustomerEmail,
            stripePaymentIntentId,
          },
          select: { id: true },
        });
        return reservation.id;
      }
      throw err;
    }
  }

  await prisma.reservation.update({
    where: { id: reservation.id },
    data: {
      stripeCustomerEmail,
      stripePaymentIntentId,
    },
    select: { id: true },
  });
  return reservation.id;
}

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session, now: Date): Promise<string | null> {
  const reservation = await findReservationForSession(session);
  if (!reservation) {
    logger.warn({ stripeCheckoutSessionId: session.id }, 'stripe_webhook_reservation_not_found');
    return null;
  }

  await prisma.$transaction(async (tx) => {
    const updated = await tx.reservation.updateMany({
      where: { id: reservation.id, status: 'PENDING_PAYMENT' },
      data: { status: 'EXPIRED' },
    });
    if (updated.count !== 1) return;

    await tx.serviceSlot.update({
      where: { id: reservation.slotId },
      data: { capacityHeld: { decrement: reservation.guests } },
      select: { id: true },
    });
  });

  // Use Stripe-collected email if present (non-source-of-truth, just for follow-up).
  const stripeCustomerEmail =
    typeof session.customer_details?.email === 'string' ? session.customer_details.email : null;
  if (stripeCustomerEmail) {
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { stripeCustomerEmail },
      select: { id: true },
    });
  }

  // If expired webhook arrives late after payment, Stripe will also emit completed; that handler will decide next.
  return reservation.id;
}
