import { Pool } from 'pg';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import type { ApplicationInput, ApplicationRow } from '../types';

if (!env.databaseUrl) {
  logger.error(
    'DATABASE_URL is not set. The backend needs a Postgres connection string ' +
      '(e.g. from Neon). Set DATABASE_URL in your environment.',
  );
}

// Neon and most hosted Postgres require SSL; local Postgres does not.
const useSsl = !/localhost|127\.0\.0\.1/.test(env.databaseUrl);

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 5,
});

pool.on('error', (err) => logger.error('Postgres pool error', err));

/**
 * Create tables/indexes if they don't exist. Must be awaited before the server
 * starts serving requests. Column types mirror the previous SQLite shapes
 * (devices as a JSON string, timestamp as an ISO string, whatsapp_invited as
 * 0/1) so the rest of the app is unchanged.
 */
export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id                   SERIAL PRIMARY KEY,
      timestamp            TEXT    NOT NULL,
      full_name            TEXT    NOT NULL,
      email                TEXT    NOT NULL,
      phone                TEXT    NOT NULL,
      state                TEXT    NOT NULL,
      school               TEXT,
      program              TEXT    NOT NULL,
      preferred_start_week TEXT,
      devices              TEXT    NOT NULL DEFAULT '[]',
      other_device         TEXT,
      marksheet_file       TEXT,
      id_file              TEXT,
      whatsapp_invited     INTEGER NOT NULL DEFAULT 0,
      whatsapp_invited_at  TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_applications_invited
      ON applications (whatsapp_invited);
    CREATE INDEX IF NOT EXISTS idx_applications_timestamp
      ON applications (timestamp);

    CREATE TABLE IF NOT EXISTS contact_messages (
      id        SERIAL PRIMARY KEY,
      timestamp TEXT NOT NULL,
      name      TEXT NOT NULL,
      email     TEXT NOT NULL,
      message   TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_contact_timestamp
      ON contact_messages (timestamp);
  `);
  logger.info('Postgres ready (schema ensured).');
}

/* ── Applications ─────────────────────────────────────────────────────────── */

export async function insertApplication(
  input: ApplicationInput,
): Promise<ApplicationRow> {
  const timestamp = new Date().toISOString();
  const res = await pool.query<ApplicationRow>(
    `INSERT INTO applications (
       timestamp, full_name, email, phone, state, school, program,
       preferred_start_week, devices, other_device, marksheet_file, id_file
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      timestamp,
      input.fullName,
      input.email,
      input.phone,
      input.state,
      input.school,
      input.program,
      input.preferredStartWeek,
      JSON.stringify(input.devices),
      input.otherDevice,
      input.marksheetFile,
      input.idFile,
    ],
  );
  return res.rows[0];
}

export async function getApplicationById(
  id: number,
): Promise<ApplicationRow | undefined> {
  const res = await pool.query<ApplicationRow>(
    'SELECT * FROM applications WHERE id = $1',
    [id],
  );
  return res.rows[0];
}

export async function getAllApplications(): Promise<ApplicationRow[]> {
  const res = await pool.query<ApplicationRow>(
    'SELECT * FROM applications ORDER BY id DESC',
  );
  return res.rows;
}

/** Un-invited applications, optionally bounded by ISO date range. */
export async function getUninvitedApplications(
  from?: string,
  to?: string,
): Promise<ApplicationRow[]> {
  let sql = 'SELECT * FROM applications WHERE whatsapp_invited = 0';
  const params: string[] = [];
  if (from) {
    params.push(from);
    sql += ` AND timestamp >= $${params.length}`;
  }
  if (to) {
    params.push(to);
    sql += ` AND timestamp <= $${params.length}`;
  }
  sql += ' ORDER BY id ASC';
  const res = await pool.query<ApplicationRow>(sql, params);
  return res.rows;
}

export async function markInvited(
  id: number,
  at: string = new Date().toISOString(),
): Promise<void> {
  await pool.query(
    'UPDATE applications SET whatsapp_invited = 1, whatsapp_invited_at = $1 WHERE id = $2',
    [at, id],
  );
}

export async function countApplications(): Promise<number> {
  const res = await pool.query<{ c: string }>(
    'SELECT COUNT(*)::int AS c FROM applications',
  );
  return Number(res.rows[0].c);
}

/* ── Contact messages ─────────────────────────────────────────────────────── */

export interface ContactRow {
  id: number;
  timestamp: string;
  name: string;
  email: string;
  message: string;
}

export async function insertContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactRow> {
  const timestamp = new Date().toISOString();
  const res = await pool.query<ContactRow>(
    `INSERT INTO contact_messages (timestamp, name, email, message)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [timestamp, input.name, input.email, input.message],
  );
  return res.rows[0];
}

export async function getAllContactMessages(): Promise<ContactRow[]> {
  const res = await pool.query<ContactRow>(
    'SELECT * FROM contact_messages ORDER BY id DESC',
  );
  return res.rows;
}
