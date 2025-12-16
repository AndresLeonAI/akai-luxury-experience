import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../lib/apiError.js';

export const reservationsRouter = Router();

reservationsRouter.get(
  '/by-checkout-session/:checkoutSessionId',
  asyncHandler(async (req, res) => {
    const parsed = z.object({ checkoutSessionId: z.string().min(1) }).safeParse(req.params);
    if (!parsed.success) throw parsed.error;

    const { checkoutSessionId } = parsed.data;

    const reservation = await prisma.reservation.findFirst({
      where: { stripeCheckoutSessionId: checkoutSessionId },
      select: {
        id: true,
        referenceCode: true,
        status: true,
        guests: true,
        notes: true,
        currency: true,
        depositAmount: true,
        totalAmount: true,
        stripeCheckoutSessionId: true,
        stripePaymentIntentId: true,
        stripeCustomerEmail: true,
        slot: { select: { serviceDate: true, startTime: true, label: true } },
      },
    });

    if (!reservation) {
      throw new ApiError({
        status: 404,
        code: 'RESERVATION_NOT_FOUND',
        message: 'Reservation not found.',
      });
    }

    if (reservation.status === 'PENDING_PAYMENT') {
      return res.status(202).json({
        status: reservation.status,
        nextPollMs: 1500,
      });
    }

    return res.status(200).json({
      reservationId: reservation.id,
      reference: reservation.referenceCode,
      status: reservation.status,
      date: reservation.slot.serviceDate,
      time: reservation.slot.startTime,
      guests: reservation.guests,
      notes: reservation.notes,
      customer: { email: reservation.stripeCustomerEmail },
      amount: {
        currency: reservation.currency,
        deposit: reservation.depositAmount,
        total: reservation.totalAmount,
      },
      stripe: {
        checkoutSessionId: reservation.stripeCheckoutSessionId,
        paymentIntentId: reservation.stripePaymentIntentId,
      },
    });
  })
);
