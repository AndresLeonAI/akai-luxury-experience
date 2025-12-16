import { env } from '../lib/env.js';
import { logger } from '../lib/logger.js';
import { expireHoldsOnce } from './expireHolds.js';

export function startScheduler() {
  const intervalMs = env.HOLD_EXPIRY_SWEEP_INTERVAL_SECONDS * 1000;

  const timer = setInterval(async () => {
    try {
      const result = await expireHoldsOnce(new Date());
      if (result.expired > 0) {
        logger.info({ ...result }, 'holds_expired');
      }
    } catch (err) {
      logger.error({ err }, 'holds_expiry_sweep_failed');
    }
  }, intervalMs);
  timer.unref();

  return () => clearInterval(timer);
}

