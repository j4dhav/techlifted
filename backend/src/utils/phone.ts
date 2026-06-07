import { env } from '../config/env';

/**
 * Normalize a phone number to E.164.
 * Accepts numbers with or without country code; defaults to the configured
 * country code (India / +91) when no leading + is present.
 */
export function normalizeToE164(
  raw: string,
  defaultCountryCode = env.defaultCountryCode,
): string | null {
  if (!raw) return null;
  let s = raw.trim();

  // Strip everything except digits and a leading +.
  const hasPlus = s.startsWith('+');
  let digits = s.replace(/[^\d]/g, '');

  if (hasPlus) {
    s = '+' + digits;
  } else {
    // Handle Indian "0" trunk prefix or a bare 10-digit mobile.
    const cc = defaultCountryCode.replace(/[^\d]/g, '');
    if (digits.startsWith('00')) {
      s = '+' + digits.slice(2);
    } else if (digits.startsWith(cc) && digits.length > 10) {
      s = '+' + digits;
    } else {
      // drop a leading trunk 0, then prepend the default country code
      digits = digits.replace(/^0+/, '');
      s = defaultCountryCode + digits;
    }
  }

  // E.164: + followed by up to 15 digits, first digit non-zero.
  if (!/^\+[1-9]\d{6,14}$/.test(s)) return null;
  return s;
}

export function isValidE164(s: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(s);
}
