import { google, sheets_v4 } from 'googleapis';
import { env, integrations } from '../config/env';
import { logger } from '../utils/logger';
import type { ApplicationRow } from '../types';

const HEADER_ROW = [
  'Timestamp', 'Full Name', 'Email', 'Phone', 'State', 'School', 'Program',
  'Preferred Start Week', 'Devices', 'Marksheet', 'ID', 'WhatsApp Invited',
];

const PROGRAM_LABELS: Record<string, string> = {
  engineering: 'Electrical & Mechanical Engineering',
  coding: 'Coding — Python',
  'ai-tools': 'AI Tools & Applications',
};

let sheetsClient: sheets_v4.Sheets | null = null;
let headerEnsured = false;

function getClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;

  const json = Buffer.from(env.google.serviceAccountB64, 'base64').toString('utf8');
  const credentials = JSON.parse(json) as {
    client_email: string;
    private_key: string;
  };

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Ensure the target tab exists and has a header row. Runs once per process.
 * Failures here are non-fatal — the append attempt will surface real errors.
 */
async function ensureHeader(client: sheets_v4.Sheets): Promise<void> {
  if (headerEnsured) return;
  const spreadsheetId = env.google.spreadsheetId;
  const title = env.google.sheetName;

  const meta = await client.spreadsheets.get({ spreadsheetId });
  const exists = (meta.data.sheets || []).some(
    (s) => s.properties?.title === title,
  );

  if (!exists) {
    await client.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title } } }],
      },
    });
  }

  // Check whether row 1 already holds headers.
  const head = await client.spreadsheets.values.get({
    spreadsheetId,
    range: `${title}!A1:L1`,
  });
  if (!head.data.values || head.data.values.length === 0) {
    await client.spreadsheets.values.update({
      spreadsheetId,
      range: `${title}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADER_ROW] },
    });
  }
  headerEnsured = true;
}

function rowFromApplication(app: ApplicationRow): string[] {
  let devices = '';
  try {
    devices = (JSON.parse(app.devices) as string[]).join(', ');
  } catch {
    devices = app.devices;
  }
  if (app.other_device) devices += ` (Other: ${app.other_device})`;

  return [
    app.timestamp,
    app.full_name,
    app.email,
    app.phone,
    app.state,
    app.school || '',
    PROGRAM_LABELS[app.program] || app.program,
    app.preferred_start_week || '',
    devices,
    app.marksheet_file || '',
    app.id_file || '',
    app.whatsapp_invited ? 'Yes' : 'No',
  ];
}

export interface SheetsAppendOutcome {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

/**
 * Append one application row to the configured Google Sheet.
 * Retries transient failures up to 3 times with backoff. Never throws —
 * returns an outcome so the caller can keep the DB save authoritative.
 */
export async function appendApplicationToSheet(
  app: ApplicationRow,
): Promise<SheetsAppendOutcome> {
  if (!integrations.sheetsConfigured) {
    logger.warn('Google Sheets not configured — skipping append.');
    return { ok: false, skipped: true };
  }

  const maxAttempts = 3;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const client = getClient();
      await ensureHeader(client);
      await client.spreadsheets.values.append({
        spreadsheetId: env.google.spreadsheetId,
        range: `${env.google.sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [rowFromApplication(app)] },
      });
      logger.info(`Appended application #${app.id} to Google Sheet.`);
      return { ok: true };
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn(
        `Sheets append attempt ${attempt}/${maxAttempts} failed for #${app.id}: ${msg}`,
      );
      if (attempt < maxAttempts) await sleep(attempt * 500);
    }
  }

  const error = lastErr instanceof Error ? lastErr.message : String(lastErr);
  logger.error(`Sheets append permanently failed for #${app.id}.`, error);
  return { ok: false, error };
}
