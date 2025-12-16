import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { assertIsoDate } from '../lib/dates.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { waitlistRateLimit } from '../middleware/rateLimits.js';

export const waitlistRouter = Router();

const isoDateSchema = z.string().refine((value) => {
  try {
    assertIsoDate(value);
    return true;
  } catch {
    return false;
  }
}, 'Invalid ISO date.');

waitlistRouter.post(
  '/',
  waitlistRateLimit,
  asyncHandler(async (req, res) => {
  const parsed = z
    .object({
      date: isoDateSchema,
      email: z.string().email(),
    })
    .safeParse(req.body);

  if (!parsed.success) throw parsed.error;
  const { date, email } = parsed.data;

  try {
    await prisma.waitlistEntry.create({
      data: { serviceDate: date, email },
    });
  } catch (err: any) {
    // Unique constraint violation => idempotent success.
    if (err?.code !== 'P2002') throw err;
  }

  res.status(201).json({ status: 'WAITLISTED' });
  })
);
