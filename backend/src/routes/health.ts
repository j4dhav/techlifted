import { Router, type Request, type Response } from 'express';
import { integrations } from '../config/env';
import { countApplications } from '../db/database';

export const healthRouter = Router();

// GET /api/health — liveness + integration/config visibility.
healthRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    applications: countApplications(),
    integrations: {
      googleSheets: integrations.sheetsConfigured,
      twilioWhatsApp: integrations.twilioConfigured,
    },
  });
});
