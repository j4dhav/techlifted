import { Router, type Request, type Response } from 'express';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { sendCommunityInvites } from '../services/twilio';
import { integrations } from '../config/env';

export const whatsappRouter = Router();

// POST /api/whatsapp/invite — admin-only. Optional { from, to } ISO date range.
whatsappRouter.post(
  '/invite',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    if (!integrations.twilioConfigured) {
      res.status(503).json({
        error:
          'WhatsApp is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, ' +
          'TWILIO_WHATSAPP_FROM and WHATSAPP_COMMUNITY_LINK in the backend environment.',
      });
      return;
    }

    const { from, to } = (req.body || {}) as { from?: string; to?: string };

    // Validate optional dates.
    const isIso = (s?: string) => !s || !Number.isNaN(Date.parse(s));
    if (!isIso(from) || !isIso(to)) {
      res.status(400).json({ error: 'Invalid date range.' });
      return;
    }

    const result = await sendCommunityInvites(from, to);
    res.json({ success: true, ...result });
  }),
);
