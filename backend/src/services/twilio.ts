import twilio from 'twilio';
import { env, integrations } from '../config/env';
import { logger } from '../utils/logger';
import { getUninvitedApplications, markInvited } from '../db/database';
import { isValidE164, normalizeToE164 } from '../utils/phone';
import type { WhatsAppInviteResult } from '../types';

type TwilioClient = ReturnType<typeof twilio>;
let client: TwilioClient | null = null;

function getClient(): TwilioClient {
  if (client) return client;
  client = twilio(env.twilio.accountSid, env.twilio.authToken);
  return client;
}

function buildMessage(): string {
  return (
    'Welcome to EduBridge! Tap to join our student community for class ' +
    `updates and support: ${env.twilio.communityLink}`
  );
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Send WhatsApp community invites to every un-invited applicant in the
 * (optional) date range. Idempotent: marks each recipient invited on success
 * so re-running never double-sends. Never throws — returns a summary.
 */
export async function sendCommunityInvites(
  from?: string,
  to?: string,
): Promise<WhatsAppInviteResult> {
  const result: WhatsAppInviteResult = {
    sent: 0,
    skipped: 0,
    failed: 0,
    details: [],
  };

  if (!integrations.twilioConfigured) {
    logger.warn('Twilio not configured — cannot send invites.');
    throw new Error(
      'Twilio/WhatsApp is not configured. Set TWILIO_* and WHATSAPP_COMMUNITY_LINK.',
    );
  }

  const recipients = getUninvitedApplications(from, to);
  if (recipients.length === 0) {
    logger.info('No un-invited applicants in range.');
    return result;
  }

  const twilioClient = getClient();
  const body = buildMessage();
  const fromAddr = env.twilio.whatsappFrom.startsWith('whatsapp:')
    ? env.twilio.whatsappFrom
    : `whatsapp:${env.twilio.whatsappFrom}`;

  for (const app of recipients) {
    const e164 = normalizeToE164(app.phone);
    if (!e164 || !isValidE164(e164)) {
      result.skipped++;
      result.details.push({
        id: app.id,
        phone: app.phone,
        status: 'skipped',
        reason: 'Invalid phone number.',
      });
      continue;
    }

    const maxAttempts = 3;
    let sent = false;
    let lastErr = '';
    let messageSid: string | undefined;

    for (let attempt = 1; attempt <= maxAttempts && !sent; attempt++) {
      try {
        const message = await twilioClient.messages.create({
          from: fromAddr,
          to: `whatsapp:${e164}`,
          body,
        });
        messageSid = message.sid;
        sent = true;
      } catch (err) {
        lastErr = err instanceof Error ? err.message : String(err);
        logger.warn(
          `WhatsApp send attempt ${attempt}/${maxAttempts} failed for #${app.id}: ${lastErr}`,
        );
        if (attempt < maxAttempts) await sleep(attempt * 500);
      }
    }

    if (sent) {
      markInvited(app.id);
      result.sent++;
      result.details.push({
        id: app.id,
        phone: e164,
        status: 'sent',
        messageSid,
      });
    } else {
      result.failed++;
      result.details.push({
        id: app.id,
        phone: e164,
        status: 'failed',
        reason: lastErr,
      });
    }
  }

  logger.info(
    `WhatsApp invites done: sent=${result.sent} skipped=${result.skipped} failed=${result.failed}`,
  );
  return result;
}
