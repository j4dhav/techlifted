import { Router, type Request, type Response } from 'express';
import { integrations } from '../config/env';
import { countApplications } from '../db/database';
import { asyncHandler } from '../middleware/errorHandler';

export const healthRouter = Router();

// GET /api/health — liveness + integration/config visibility.
healthRouter.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    let applications = 0;
    let dbOk = true;
    try {
      applications = await countApplications();
    } catch {
      dbOk = false;
    }
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbOk,
      applications,
      integrations: {
        googleSheets: integrations.sheetsConfigured,
        twilioWhatsApp: integrations.twilioConfigured,
      },
    });
  }),
);
