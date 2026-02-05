import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const anyErr = err as { code?: string };

  if (anyErr?.code === '23505' || anyErr?.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Duplicate record' });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Unexpected error' });
};
