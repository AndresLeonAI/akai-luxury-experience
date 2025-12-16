import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../lib/apiError.js';
import {
  assertIsoDate,
  getTodayIsoDateInTimezone,
  getWeekdayFromIsoDate,
  isIsoDateBefore,
  listIsoDatesInclusive,
} from '../lib/dates.js';
import { env } from '../lib/env.js';
import { getServiceTimes } from '../lib/serviceTimes.js';
import { asyncHandler } from '../lib/asyncHandler.js';

export const availabilityRouter = Router();

const isoDateSchema = z.string().refine((value) => {
  try {
    assertIsoDate(value);
    return true;
  } catch {
    return false;
  }
}, 'Invalid ISO date.');

availabilityRouter.get(
  '/',
  asyncHandler(async (req, res) => {
  const parsed = z
    .object({ date: isoDateSchema })
    .safeParse(req.query);

  if (!parsed.success) throw parsed.error;
  const { date } = parsed.data;

  const today = getTodayIsoDateInTimezone();
  const weekday = getWeekdayFromIsoDate(date);
  const isClosed = env.CLOSED_WEEKDAYS.includes(weekday);

  const serviceTimes = getServiceTimes();
  const existing = await prisma.serviceSlot.findMany({
    where: { serviceDate: date, startTime: { in: serviceTimes.map((s) => s.time) } },
    select: {
      startTime: true,
      label: true,
      capacityTotal: true,
      capacityConfirmed: true,
      capacityHeld: true,
      isEnabled: true,
    },
  });
  const byTime = new Map(existing.map((s) => [s.startTime, s]));

  const slots = serviceTimes.map((s) => {
    const row = byTime.get(s.time);
    const capacityTotal = row?.capacityTotal ?? env.CAPACITY_TOTAL;
    const capacityConfirmed = row?.capacityConfirmed ?? 0;
    const capacityHeld = row?.capacityHeld ?? 0;
    const isEnabled = (row?.isEnabled ?? true) && !isClosed && !isIsoDateBefore(date, today);
    const remaining = Math.max(0, capacityTotal - capacityConfirmed - capacityHeld);

    const status = !isEnabled
      ? 'unavailable'
      : remaining <= 0
        ? 'unavailable'
        : remaining <= env.LIMITED_THRESHOLD
          ? 'limited'
          : 'available';

    return {
      time: s.time,
      label: row?.label ?? s.label,
      capacity: capacityTotal,
      confirmed: capacityConfirmed,
      held: capacityHeld,
      remaining,
      status,
    };
  });

  res.status(200).json({
    date,
    timezone: env.TIMEZONE,
    slots,
    pricing: {
      currency: env.CURRENCY,
      pricePerPerson: env.PRICE_PER_PERSON_AMOUNT,
      depositBps: env.DEPOSIT_BPS,
    },
  });
  })
);

availabilityRouter.get(
  '/range',
  asyncHandler(async (req, res) => {
  const parsed = z
    .object({ from: isoDateSchema, to: isoDateSchema })
    .safeParse(req.query);

  if (!parsed.success) throw parsed.error;
  const { from, to } = parsed.data;
  if (to < from) {
    throw new ApiError({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: '`to` must be >= `from`.',
    });
  }

  const dates = listIsoDatesInclusive(from, to);
  if (dates.length > env.AVAILABILITY_RANGE_MAX_DAYS) {
    throw new ApiError({
      status: 400,
      code: 'RANGE_TOO_LARGE',
      message: `Range too large (max ${env.AVAILABILITY_RANGE_MAX_DAYS} days).`,
    });
  }

  const serviceTimes = getServiceTimes();
  const existing = await prisma.serviceSlot.findMany({
    where: {
      serviceDate: { gte: from, lte: to },
      startTime: { in: serviceTimes.map((s) => s.time) },
    },
    select: {
      serviceDate: true,
      startTime: true,
      capacityTotal: true,
      capacityConfirmed: true,
      capacityHeld: true,
      isEnabled: true,
    },
  });

  const grouped = new Map<string, Map<string, typeof existing[number]>>();
  for (const row of existing) {
    const day = grouped.get(row.serviceDate) ?? new Map<string, typeof row>();
    day.set(row.startTime, row);
    grouped.set(row.serviceDate, day);
  }

  const today = getTodayIsoDateInTimezone();
  const result = dates.map((date) => {
    const weekday = getWeekdayFromIsoDate(date);
    const isClosed = env.CLOSED_WEEKDAYS.includes(weekday);
    if (isClosed) return { date, status: 'unavailable' as const };
    if (isIsoDateBefore(date, today)) return { date, status: 'unavailable' as const };

    const dayRows = grouped.get(date);
    let maxRemaining = 0;
    let anyEnabled = false;
    for (const { time } of serviceTimes) {
      const row = dayRows?.get(time);
      const isEnabled = row?.isEnabled ?? true;
      if (!isEnabled) continue;
      anyEnabled = true;
      const capacityTotal = row?.capacityTotal ?? env.CAPACITY_TOTAL;
      const capacityConfirmed = row?.capacityConfirmed ?? 0;
      const capacityHeld = row?.capacityHeld ?? 0;
      const remaining = Math.max(0, capacityTotal - capacityConfirmed - capacityHeld);
      if (remaining > maxRemaining) maxRemaining = remaining;
    }

    if (!anyEnabled || maxRemaining <= 0) return { date, status: 'unavailable' as const };
    if (maxRemaining <= env.LIMITED_THRESHOLD) return { date, status: 'limited' as const };
    return { date, status: 'available' as const };
  });

  res.status(200).json({
    from,
    to,
    timezone: env.TIMEZONE,
    dates: result,
  });
  })
);
