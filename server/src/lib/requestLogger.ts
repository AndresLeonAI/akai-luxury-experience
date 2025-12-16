import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import { logger } from './logger.js';

export function requestLogger() {
  return pinoHttp({
    logger,
    genReqId: (req: Request, res: Response) => {
      const requestId =
        (req.headers['x-request-id'] as string | undefined) ?? randomUUID();
      res.setHeader('x-request-id', requestId);
      return requestId;
    },
    customProps: (req: Request) => ({
      requestId: (req as any).id,
      method: req.method,
      path: req.originalUrl,
    }),
  });
}
