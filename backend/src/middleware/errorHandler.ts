import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ValidationError } from '../utils/validation';
import { logger } from '../utils/logger';

/** Wrap async route handlers so rejected promises reach the error handler. */
export function asyncHandler<
  T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
>(fn: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found.' });
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Field-level validation errors -> 400 with a fields map.
  if (err instanceof ValidationError) {
    res.status(400).json({ error: 'Validation failed.', fields: err.fields });
    return;
  }

  // Multer upload errors -> 400 with a friendly message.
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 5MB.'
        : `Upload error: ${err.message}`;
    res.status(400).json({ error: message });
    return;
  }

  if (err instanceof Error && err.message === 'Only PDF files are accepted.') {
    res.status(400).json({ error: err.message });
    return;
  }

  logger.error('Unhandled error', err);
  res.status(500).json({ error: 'Something went wrong on our end.' });
}
