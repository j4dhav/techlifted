/**
 * API client. In dev, requests hit /api and Vite proxies to the backend.
 * In production, set VITE_API_BASE_URL to the deployed backend origin.
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function url(path: string): string {
  return `${API_BASE}${path}`;
}

export interface ApplicationResponse {
  success: boolean;
  id: number;
  application: Record<string, unknown>;
  sheetSynced: boolean;
  warnings: string[];
}

export interface ApiError {
  error: string;
  fields?: Record<string, string>;
}

export class ApiException extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new ApiException(
      res.status,
      (data as ApiError).error || `Request failed (${res.status})`,
      (data as ApiError).fields,
    );
  }
  return data as T;
}

/** Submit an application as multipart/form-data (supports file uploads). */
export async function submitApplication(
  form: FormData,
): Promise<ApplicationResponse> {
  const res = await fetch(url('/api/applications'), {
    method: 'POST',
    body: form,
  });
  return parse<ApplicationResponse>(res);
}

export interface AdminApplication {
  id: number;
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  school: string | null;
  program: string;
  preferredStartWeek: string | null;
  devices: string[];
  otherDevice: string | null;
  marksheetFile: string | null;
  idFile: string | null;
  whatsappInvited: boolean;
  whatsappInvitedAt: string | null;
}

export async function fetchApplications(
  token: string,
): Promise<{ count: number; total: number; applications: AdminApplication[] }> {
  const res = await fetch(url('/api/applications'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parse(res);
}

export interface InviteResult {
  success: boolean;
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

export async function sendInvites(
  token: string,
  range?: { from?: string; to?: string },
): Promise<InviteResult> {
  const res = await fetch(url('/api/whatsapp/invite'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(range || {}),
  });
  return parse<InviteResult>(res);
}

export async function fetchHealth(): Promise<Record<string, unknown>> {
  const res = await fetch(url('/api/health'));
  return parse(res);
}
