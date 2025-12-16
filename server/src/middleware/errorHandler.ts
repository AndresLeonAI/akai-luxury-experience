import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../lib/apiError.js';
import { logger } from '../lib/logger.js';

export function errorHandler(): ErrorRequestHandler {
  return (err, req, res, _next) => {
    const requestId = (req as any).id ?? res.getHeader('x-request-id') ?? undefined;

    if (err instanceof ApiError) {
      return res.status(err.status).json({
        error: {
          code: err.code,
          message: err.message,
          requestId,
          details: err.details ?? undefined,
        },
      });
    }

    if (err instanceof ZodError) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request.',
          requestId,
          details: err.flatten(),
        },
      });
    }

    logger.error({ err, requestId }, 'unhandled_error');
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected error.',
        requestId,
      },
    });
  };
}

