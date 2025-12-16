import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './lib/env.js';
import { requestLogger } from './lib/requestLogger.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { stripeWebhookRouter } from './routes/webhooks/stripe.js';
import { generalRateLimit } from './middleware/rateLimits.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: false,
    })
  );
  app.use(requestLogger());
  app.use(generalRateLimit);

  app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  // Stripe webhooks require the raw request body for signature verification.
  app.use('/api/v1/webhooks/stripe', stripeWebhookRouter);

  app.use(express.json({ limit: '1mb' }));
  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler());
  app.use(errorHandler());

  return app;
}
