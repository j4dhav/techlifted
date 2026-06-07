import { Router, type Request, type Response } from 'express';
import { uploadApplicationFiles } from '../middleware/upload';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAdmin } from '../middleware/auth';
import { validateApplication } from '../utils/validation';
import {
  insertApplication,
  getAllApplications,
  countApplications,
} from '../db/database';
import { appendApplicationToSheet } from '../services/googleSheets';
import { logger } from '../utils/logger';
import type { ApplicationRow } from '../types';

export const applicationsRouter = Router();

/** Map a DB row to a clean API shape (devices parsed, booleans real). */
function serialize(row: ApplicationRow) {
  let devices: string[] = [];
  try {
    devices = JSON.parse(row.devices) as string[];
  } catch {
    devices = [];
  }
  return {
    id: row.id,
    timestamp: row.timestamp,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    state: row.state,
    school: row.school,
    program: row.program,
    preferredStartWeek: row.preferred_start_week,
    devices,
    otherDevice: row.other_device,
    marksheetFile: row.marksheet_file,
    idFile: row.id_file,
    whatsappInvited: Boolean(row.whatsapp_invited),
    whatsappInvitedAt: row.whatsapp_invited_at,
  };
}

// POST /api/applications — public submission endpoint.
applicationsRouter.post(
  '/',
  uploadApplicationFiles,
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as
      | { [field: string]: Express.Multer.File[] }
      | undefined;
    const marksheetFile = files?.marksheet?.[0]?.filename ?? null;
    const idFile = files?.idProof?.[0]?.filename ?? null;

    // Throws ValidationError -> 400 via centralized handler.
    const input = validateApplication(req.body, { marksheetFile, idFile });

    const row = insertApplication(input);
    logger.info(`Saved application #${row.id} (${row.email}).`);

    // Append to Google Sheets — non-blocking for the applicant.
    const sheet = await appendApplicationToSheet(row);

    const warnings: string[] = [];
    if (!sheet.ok && !sheet.skipped) {
      warnings.push(
        'Your application was saved, but syncing to our records sheet failed. Our team will reconcile it.',
      );
    }

    res.status(201).json({
      success: true,
      id: row.id,
      application: serialize(row),
      sheetSynced: sheet.ok,
      warnings,
    });
  }),
);

// GET /api/applications — admin-only listing.
applicationsRouter.get(
  '/',
  requireAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    const rows = getAllApplications();
    res.json({
      count: rows.length,
      total: countApplications(),
      applications: rows.map(serialize),
    });
  }),
);
