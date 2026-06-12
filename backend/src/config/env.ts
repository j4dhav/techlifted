import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend package root regardless of cwd.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function optional(name: string, fallback = ''): string {
  const v = process.env[name];
  return v === undefined || v === '' ? fallback : v;
}

function asNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: asNumber('PORT', 4000),

  // Comma-separated list of allowed CORS origins.
  corsOrigins: optional('CORS_ORIGIN', 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  // Admin token gating GET /api/applications and the WhatsApp invite endpoint.
  adminToken: optional('ADMIN_TOKEN'),

  // Postgres connection string (Neon, Render, or any Postgres). Required.
  databaseUrl: optional('DATABASE_URL'),

  // Upload storage directory.
  uploadDir: optional('UPLOAD_DIR', 'uploads'),
  maxUploadBytes: asNumber('MAX_UPLOAD_BYTES', 5 * 1024 * 1024), // 5MB

  // Google Sheets
  google: {
    // base64-encoded service-account JSON
    serviceAccountB64: optional('GOOGLE_SERVICE_ACCOUNT_BASE64'),
    spreadsheetId: optional('GOOGLE_SHEET_ID'),
    sheetName: optional('GOOGLE_SHEET_NAME', 'TechLiftED Enrollment Data'),
  },

  // Twilio WhatsApp
  twilio: {
    accountSid: optional('TWILIO_ACCOUNT_SID'),
    authToken: optional('TWILIO_AUTH_TOKEN'),
    whatsappFrom: optional('TWILIO_WHATSAPP_FROM'), // e.g. "whatsapp:+14155238886"
    communityLink: optional('WHATSAPP_COMMUNITY_LINK'),
  },

  defaultCountryCode: optional('DEFAULT_COUNTRY_CODE', '+91'),
};

export const integrations = {
  get sheetsConfigured(): boolean {
    return Boolean(env.google.serviceAccountB64 && env.google.spreadsheetId);
  },
  get twilioConfigured(): boolean {
    return Boolean(
      env.twilio.accountSid &&
        env.twilio.authToken &&
        env.twilio.whatsappFrom &&
        env.twilio.communityLink,
    );
  },
};
