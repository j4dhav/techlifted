import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Request } from 'express';
import { env } from '../config/env';

const uploadDir = path.isAbsolute(env.uploadDir)
  ? env.uploadDir
  : path.resolve(__dirname, '../../', env.uploadDir);

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    // <field>-<timestamp>-<random>.pdf — avoids collisions & path traversal.
    const stamp = Date.now();
    const rand = crypto.randomBytes(6).toString('hex');
    const safeField = file.fieldname.replace(/[^a-z0-9_-]/gi, '');
    cb(null, `${safeField}-${stamp}-${rand}.pdf`);
  },
});

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  const isPdf =
    file.mimetype === 'application/pdf' &&
    path.extname(file.originalname).toLowerCase() === '.pdf';
  if (!isPdf) {
    cb(new Error('Only PDF files are accepted.'));
    return;
  }
  cb(null, true);
}

export const uploadApplicationFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxUploadBytes, files: 2 },
}).fields([
  { name: 'marksheet', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
]);

export { uploadDir };
