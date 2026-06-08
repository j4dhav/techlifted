import type { ApplicationInput, ProgramSlug } from '../types';
import { normalizeToE164 } from './phone';
import { env } from '../config/env';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
] as const;

export const PROGRAM_SLUGS: ProgramSlug[] = ['engineering', 'coding', 'ai-tools'];

export const VALID_DEVICES = [
  'Desktop Computer', 'Laptop', 'Tablet', 'Smartphone', 'Other',
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ASCII control characters: 0x00-0x1F and 0x7F (built via escapes to keep the
// source file free of raw control bytes).
const CONTROL_RE = new RegExp('[\\x00-\\x1F\\x7F]', 'g');

export class ValidationError extends Error {
  public readonly fields: Record<string, string>;
  constructor(fields: Record<string, string>) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

/** Trim, collapse whitespace, and strip control characters. */
function clean(v: unknown, max = 500): string {
  if (typeof v !== 'string') return '';
  return v
    .replace(CONTROL_RE, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

/** Validate and sanitize a contact-form submission. */
export function validateContact(body: {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}): ContactInput {
  const errors: Record<string, string> = {};

  const name = clean(body.name, 120);
  if (name.length < 2) errors.name = 'Please enter your name.';

  const email = clean(body.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) errors.email = 'A valid email is required.';

  const message = clean(body.message, 2000);
  if (message.length < 5) errors.message = 'Please write a short message.';

  if (Object.keys(errors).length > 0) throw new ValidationError(errors);
  return { name, email, message };
}

interface RawBody {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  countryCode?: unknown;
  state?: unknown;
  school?: unknown;
  program?: unknown;
  preferredStartWeek?: unknown;
  devices?: unknown;
  otherDevice?: unknown;
  agree?: unknown;
}

/**
 * Validate and sanitize an inbound application payload.
 * `files` carries already-saved upload filenames (or null).
 */
export function validateApplication(
  body: RawBody,
  files: { marksheetFile: string | null; idFile: string | null },
): ApplicationInput {
  const errors: Record<string, string> = {};

  const fullName = clean(body.fullName, 120);
  if (fullName.length < 2) errors.fullName = 'Full name is required.';

  const email = clean(body.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) errors.email = 'A valid email is required.';

  // Phone may arrive split (countryCode + phone) or combined.
  const cc = clean(body.countryCode, 6);
  const rawPhone = clean(body.phone, 20);
  let combined: string;
  if (rawPhone.startsWith('+')) {
    // Already international — use as-is and ignore the separate country code.
    combined = rawPhone;
  } else {
    // National number: drop any trunk leading zero(s), then prepend the
    // country code so we don't end up with e.g. +91 0 98765…
    const national = rawPhone.replace(/\D/g, '').replace(/^0+/, '');
    combined = `${cc || env.defaultCountryCode}${national}`;
  }
  const phone = normalizeToE164(combined);
  if (!rawPhone) errors.phone = 'Phone number is required.';
  else if (!phone) errors.phone = 'Enter a valid phone number.';

  const state = clean(body.state, 80);
  if (!state) errors.state = 'State is required.';
  else if (!(INDIAN_STATES as readonly string[]).includes(state))
    errors.state = 'Select a valid state.';

  const schoolRaw = clean(body.school, 160);
  const school = schoolRaw.length ? schoolRaw : null;

  const program = clean(body.program, 40) as ProgramSlug;
  if (!program) errors.program = 'Program selection is required.';
  else if (!PROGRAM_SLUGS.includes(program))
    errors.program = 'Select a valid program.';

  // Devices: accept JSON string or array.
  let devicesArr: string[] = [];
  let rawDevices: unknown = body.devices;
  if (typeof rawDevices === 'string') {
    const asString = rawDevices;
    try {
      rawDevices = JSON.parse(asString);
    } catch {
      rawDevices = asString.split(',');
    }
  }
  if (Array.isArray(rawDevices)) {
    devicesArr = rawDevices
      .map((d) => clean(d, 40))
      .filter((d) => (VALID_DEVICES as readonly string[]).includes(d));
  }
  if (devicesArr.length === 0)
    errors.devices = 'Select at least one device you will use.';

  const otherDeviceRaw = clean(body.otherDevice, 120);
  const otherDevice =
    devicesArr.includes('Other') && otherDeviceRaw ? otherDeviceRaw : null;
  if (devicesArr.includes('Other') && !otherDeviceRaw)
    errors.otherDevice = 'Please describe your "Other" device.';

  // Preferred start week only meaningful for the rolling ai-tools program.
  const startWeekRaw = clean(body.preferredStartWeek, 60);
  const preferredStartWeek =
    program === 'ai-tools' && startWeekRaw ? startWeekRaw : null;

  const agree =
    body.agree === true || body.agree === 'true' || body.agree === 'on';
  if (!agree)
    errors.agree = 'You must agree to be contacted via email and WhatsApp.';

  if (Object.keys(errors).length > 0) throw new ValidationError(errors);

  return {
    fullName,
    email,
    phone: phone!,
    state,
    school,
    program,
    preferredStartWeek,
    devices: devicesArr,
    otherDevice,
    marksheetFile: files.marksheetFile,
    idFile: files.idFile,
    agree,
  };
}
