import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

export async function expireHoldsOnce(now = new Date()): Promise<{ scanned: number; expired: number }> {
  const candidates = await prisma.reservation.findMany({
    where: { status: 'PENDING_PAYMENT', holdExpiresAt: { lt: now } },
    select: { id: true, guests: true, slotId: true },
    take: 200,
  });

  let expired = 0;
  for (const reservation of candidates) {
    try {
      const didExpire = await prisma.$transaction(async (tx) => {
        const updated = await tx.reservation.updateMany({
          where: { id: reservation.id, status: 'PENDING_PAYMENT', holdExpiresAt: { lt: now } },
          data: { status: 'EXPIRED' },
        });
        if (updated.count !== 1) return false;

        await tx.serviceSlot.update({
          where: { id: reservation.slotId },
          data: { capacityHeld: { decrement: reservation.guests } },
          select: { id: true },
        });
        return true;
      });

      if (didExpire) expired += 1;
    } catch (err) {
      logger.error({ err, reservationId: reservation.id }, 'expire_hold_failed');
    }
  }

  return { scanned: candidates.length, expired };
}

