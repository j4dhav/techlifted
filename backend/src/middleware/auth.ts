import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { logger } from '../utils/logger';

/**
 * Admin gate. Accepts the token via `Authorization: Bearer <token>` or the
 * `x-admin-token` header. Requires ADMIN_TOKEN to be configured.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!env.adminToken) {
    logger.warn('Admin endpoint hit but ADMIN_TOKEN is not configured.');
    res.status(503).json({
      error: 'Admin access is not configured on this server.',
    });
    return;
  }

  const header = req.header('authorization') || '';
  const bearer = header.toLowerCase().startsWith('bearer ')
    ? header.slice(7).trim()
    : '';
  const provided = bearer || req.header('x-admin-token') || '';

  if (!provided || !timingSafeEqual(provided, env.adminToken)) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }
  next();
}

/** Constant-time string comparison to avoid token-length/timing leaks. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
