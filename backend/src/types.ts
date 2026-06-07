export type ProgramSlug = 'engineering' | 'coding' | 'ai-tools';

export type DeviceOption =
  | 'Desktop Computer'
  | 'Laptop'
  | 'Tablet'
  | 'Smartphone'
  | 'Other';

/** Shape of a validated, sanitized application ready for persistence. */
export interface ApplicationInput {
  fullName: string;
  email: string;
  phone: string; // E.164, e.g. +919876543210
  state: string;
  school: string | null;
  program: ProgramSlug;
  preferredStartWeek: string | null;
  devices: string[];
  otherDevice: string | null;
  marksheetFile: string | null;
  idFile: string | null;
  agree: boolean;
}

/** Full DB row representation. */
export interface ApplicationRow {
  id: number;
  timestamp: string;
  full_name: string;
  email: string;
  phone: string;
  state: string;
  school: string | null;
  program: string;
  preferred_start_week: string | null;
  devices: string; // JSON array string
  other_device: string | null;
  marksheet_file: string | null;
  id_file: string | null;
  whatsapp_invited: number; // 0 | 1
  whatsapp_invited_at: string | null;
}

export interface WhatsAppInviteResult {
  sent: number;
  skipped: number;
  failed: number;
  details: Array<{
    id: number;
    phone: string;
    status: 'sent' | 'skipped' | 'failed';
    reason?: string;
    messageSid?: string;
  }>;
}
