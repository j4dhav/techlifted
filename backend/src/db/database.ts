import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import type { ApplicationInput, ApplicationRow } from '../types';

function resolveDbPath(): string {
  const p = path.isAbsolute(env.databaseFile)
    ? env.databaseFile
    : path.resolve(__dirname, '../../', env.databaseFile);
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return p;
}

const dbPath = resolveDbPath();
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
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
`);

logger.info(`SQLite ready at ${dbPath}`);

const insertStmt = db.prepare(`
  INSERT INTO applications (
    timestamp, full_name, email, phone, state, school, program,
    preferred_start_week, devices, other_device, marksheet_file, id_file
  ) VALUES (
    @timestamp, @full_name, @email, @phone, @state, @school, @program,
    @preferred_start_week, @devices, @other_device, @marksheet_file, @id_file
  )
`);

export function insertApplication(input: ApplicationInput): ApplicationRow {
  const timestamp = new Date().toISOString();
  const info = insertStmt.run({
    timestamp,
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    state: input.state,
    school: input.school,
    program: input.program,
    preferred_start_week: input.preferredStartWeek,
    devices: JSON.stringify(input.devices),
    other_device: input.otherDevice,
    marksheet_file: input.marksheetFile,
    id_file: input.idFile,
  });
  return getApplicationById(Number(info.lastInsertRowid))!;
}

const getByIdStmt = db.prepare('SELECT * FROM applications WHERE id = ?');
export function getApplicationById(id: number): ApplicationRow | undefined {
  return getByIdStmt.get(id) as ApplicationRow | undefined;
}

const getAllStmt = db.prepare(
  'SELECT * FROM applications ORDER BY datetime(timestamp) DESC',
);
export function getAllApplications(): ApplicationRow[] {
  return getAllStmt.all() as ApplicationRow[];
}

/** Returns un-invited applications, optionally bounded by ISO date range. */
export function getUninvitedApplications(
  from?: string,
  to?: string,
): ApplicationRow[] {
  let sql = 'SELECT * FROM applications WHERE whatsapp_invited = 0';
  const params: string[] = [];
  if (from) {
    sql += ' AND datetime(timestamp) >= datetime(?)';
    params.push(from);
  }
  if (to) {
    sql += ' AND datetime(timestamp) <= datetime(?)';
    params.push(to);
  }
  sql += ' ORDER BY datetime(timestamp) ASC';
  return db.prepare(sql).all(...params) as ApplicationRow[];
}

const markInvitedStmt = db.prepare(
  'UPDATE applications SET whatsapp_invited = 1, whatsapp_invited_at = ? WHERE id = ?',
);
export function markInvited(id: number, at: string = new Date().toISOString()): void {
  markInvitedStmt.run(at, id);
}

export function countApplications(): number {
  const row = db.prepare('SELECT COUNT(*) AS c FROM applications').get() as {
    c: number;
  };
  return row.c;
}
