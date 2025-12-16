import type { RequestHandler } from 'express';

export function notFoundHandler(): RequestHandler {
  return (_req, res) => {
    const requestId = res.getHeader('x-request-id') ?? undefined;
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found.',
        requestId,
      },
    });
  };
}

