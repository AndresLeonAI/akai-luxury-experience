import rateLimit from 'express-rate-limit';
import type { RequestHandler } from 'express';
import type { RateLimitExceededEventHandler } from 'express-rate-limit';

const rateLimitHandler: RateLimitExceededEventHandler = (req, res) => {
  const requestId = (req as any).id ?? res.getHeader('x-request-id') ?? undefined;
  res.status(429).json({
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests.',
      requestId,
    },
  });
};

export const generalRateLimit: RequestHandler = rateLimit({
  windowMs: 60_000,
  max: 240,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const checkoutRateLimit: RequestHandler = rateLimit({
  windowMs: 60_000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const waitlistRateLimit: RequestHandler = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
