import { Router, type Request, type Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAdmin } from '../middleware/auth';
import { validateContact } from '../utils/validation';
import { insertContactMessage, getAllContactMessages } from '../db/database';
import { appendContactToSheet } from '../services/googleSheets';
import { logger } from '../utils/logger';

export const contactRouter = Router();

// POST /api/contact — public. Save message + append to the Sheet (non-blocking).
contactRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const input = validateContact(req.body);
    const row = insertContactMessage(input);
    logger.info(`Saved contact message #${row.id} (${row.email}).`);

    const sheet = await appendContactToSheet(row);
    const warnings: string[] = [];
    if (!sheet.ok && !sheet.skipped) {
      warnings.push('Your message was received, but syncing to our records failed.');
    }

    res.status(201).json({ success: true, id: row.id, warnings });
  }),
);

// GET /api/contact — admin-only listing.
contactRouter.get(
  '/',
  requireAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    const messages = getAllContactMessages();
    res.json({ count: messages.length, messages });
  }),
);
