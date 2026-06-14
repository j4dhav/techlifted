import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import { WhatsAppIcon, CheckIcon } from '../components/Icons';
import {
  fetchApplications,
  fetchContactMessages,
  sendInvites,
  ApiException,
  type AdminApplication,
  type ContactMessage,
  type InviteResult,
} from '../lib/api';
import { PROGRAM_OPTIONS } from '../data/programs';
import styles from './Admin.module.css';

const TOKEN_KEY = 'techlifted_admin_token';

function programLabel(slug: string): string {
  return PROGRAM_OPTIONS.find((p) => p.value === slug)?.label || slug;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');
  const [authed, setAuthed] = useState(false);
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [inviting, setInviting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [lastResult, setLastResult] = useState<InviteResult | null>(null);

  async function load(tok: string) {
    setLoading(true);
    setAuthError('');
    try {
      const data = await fetchApplications(tok);
      setApps(data.applications);
      setTotal(data.total);
      setAuthed(true);
      sessionStorage.setItem(TOKEN_KEY, tok);
      // Load contact messages too (non-fatal if it fails).
      try {
        const c = await fetchContactMessages(tok);
        setMessages(c.messages);
      } catch {
        setMessages([]);
      }
    } catch (err) {
      setAuthed(false);
      sessionStorage.removeItem(TOKEN_KEY);
      if (err instanceof ApiException && err.status === 401) {
        setAuthError('Invalid admin token.');
      } else if (err instanceof ApiException && err.status === 503) {
        setAuthError('Admin access is not configured on the server (set ADMIN_TOKEN).');
      } else {
        setAuthError('Could not reach the server. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  }

  // Auto-load if a token is already stored.
  useEffect(() => {
    if (token) load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleInvite() {
    setInviting(true);
    setLastResult(null);
    try {
      const range: { from?: string; to?: string } = {};
      if (from) range.from = new Date(from).toISOString();
      if (to) {
        // Include the whole 'to' day.
        const d = new Date(to);
        d.setHours(23, 59, 59, 999);
        range.to = d.toISOString();
      }
      const res = await sendInvites(token, range);
      setLastResult(res);
      setToast({
        type: 'success',
        message: `Invites: ${res.sent} sent · ${res.skipped} skipped · ${res.failed} failed`,
      });
      await load(token); // refresh invited flags
    } catch (err) {
      const msg =
        err instanceof ApiException ? err.message : 'Failed to send invites.';
      setToast({ type: 'error', message: msg });
    } finally {
      setInviting(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAuthed(false);
    setApps([]);
    setMessages([]);
  }

  /* ── Login gate ───────────────────────────────────────────────────────── */
  if (!authed) {
    return (
      <section className={styles.gate}>
        <div className={styles.glow} aria-hidden />
        <Reveal className={styles.gateCard}>
          <span className="eyebrow">Admin</span>
          <h1 className={styles.gateTitle}>Admin access</h1>
          <p className={styles.gateSub}>
            Enter your admin token to view applications and send WhatsApp invites.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (token) load(token); }}
          >
            <input
              className={styles.input}
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin token"
              autoFocus
            />
            {authError && <p className={styles.error}>{authError}</p>}
            <button className="btn btn-primary btn-block" disabled={loading || !token}>
              {loading ? 'Checking…' : 'Unlock'}
            </button>
          </form>
          <p className={styles.gateHint}>
            The token is the <code>ADMIN_TOKEN</code> set in your backend
            environment.
          </p>
        </Reveal>
      </section>
    );
  }

  /* ── Dashboard ────────────────────────────────────────────────────────── */
  const invitedCount = apps.filter((a) => a.whatsappInvited).length;

  return (
    <section className={styles.dash}>
      <div className="container">
        <div className={styles.dashHead}>
          <div>
            <span className="eyebrow">Admin Dashboard</span>
            <h1 className={styles.dashTitle}>Applications</h1>
          </div>
          <button className="btn btn-ghost" onClick={logout}>Sign out</button>
        </div>

        <div className={styles.statRow}>
          <Stat label="Total" value={String(total)} />
          <Stat label="Invited" value={String(invitedCount)} />
          <Stat label="Pending Invite" value={String(apps.length - invitedCount)} />
        </div>

        {/* Invite control */}
        <div className={styles.inviteCard}>
          <div className={styles.inviteInfo}>
            <h3>Send WhatsApp community invites</h3>
            <p>
              Messages every applicant not yet invited (optionally within a date
              range). Already-invited people are skipped automatically.
            </p>
          </div>
          <div className={styles.inviteControls}>
            <label className={styles.dateField}>
              <span>From</span>
              <input type="date" className={styles.date} value={from} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label className={styles.dateField}>
              <span>To</span>
              <input type="date" className={styles.date} value={to} onChange={(e) => setTo(e.target.value)} />
            </label>
            <button className={`btn ${styles.inviteBtn}`} onClick={handleInvite} disabled={inviting}>
              <WhatsAppIcon size={18} />
              {inviting ? 'Sending…' : 'Send Invites'}
            </button>
          </div>
        </div>

        {lastResult && lastResult.details.length > 0 && (
          <details className={styles.details}>
            <summary>Last run details ({lastResult.details.length})</summary>
            <div className={styles.detailList}>
              {lastResult.details.map((d) => (
                <div key={d.id} className={styles.detailRow}>
                  <span className={`${styles.pill} ${styles[d.status]}`}>{d.status}</span>
                  <span className="mono">#{d.id}</span>
                  <span className="mono">{d.phone}</span>
                  {d.reason && <span className={styles.reason}>{d.reason}</span>}
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Table */}
        {loading ? (
          <p className={styles.loading}>Loading…</p>
        ) : apps.length === 0 ? (
          <div className={styles.empty}>
            <p>No applications yet.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Submitted</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Program</th>
                  <th>Devices</th>
                  <th>Invited</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id}>
                    <td className="mono">{a.id}</td>
                    <td className={styles.nowrap}>
                      {new Date(a.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: '2-digit',
                      })}
                    </td>
                    <td>
                      <strong>{a.fullName}</strong>
                      {a.school && <span className={styles.sub2}>{a.school}</span>}
                    </td>
                    <td>
                      <a href={`mailto:${a.email}`}>{a.email}</a>
                      <span className={`mono ${styles.sub2}`}>{a.phone}</span>
                    </td>
                    <td>{[a.state, a.country].filter(Boolean).join(', ') || '—'}</td>
                    <td>
                      {programLabel(a.program)}
                      {a.preferredStartWeek && (
                        <span className={styles.sub2}>{a.preferredStartWeek}</span>
                      )}
                    </td>
                    <td>
                      <span className={styles.deviceList}>
                        {a.devices.join(', ')}
                        {a.otherDevice ? ` (${a.otherDevice})` : ''}
                      </span>
                    </td>
                    <td>
                      {a.whatsappInvited ? (
                        <span className={styles.invitedYes}><CheckIcon size={14} /> Yes</span>
                      ) : (
                        <span className={styles.invitedNo}>No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Contact messages */}
        <div className={styles.messagesHead}>
          <span className="eyebrow">Contact Messages</span>
          <h2 className={styles.dashTitle}>Messages ({messages.length})</h2>
        </div>
        {messages.length === 0 ? (
          <div className={styles.empty}><p>No messages yet.</p></div>
        ) : (
          <div className={styles.messageList}>
            {messages.map((m) => (
              <div key={m.id} className={styles.messageCard}>
                <div className={styles.messageTop}>
                  <strong>{m.name}</strong>
                  <a href={`mailto:${m.email}`}>{m.email}</a>
                  <span className={`mono ${styles.messageDate}`}>
                    {new Date(m.timestamp).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className={styles.messageBody}>{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`${styles.toast} ${toast.type === 'error' ? styles.toastErr : styles.toastOk}`}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
