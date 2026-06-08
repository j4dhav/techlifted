import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { WhatsAppIcon, ArrowRight, CheckIcon } from '../components/Icons';
import { CONTACT } from '../data/constants';
import { submitContact, ApiException } from '../lib/api';
import styles from './Contact.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COMMUNITY =
  import.meta.env.VITE_WHATSAPP_COMMUNITY || CONTACT.whatsappCommunity;

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email.';
    if (message.trim().length < 5) next.message = 'Please write a short message.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiException && err.fields) {
        setErrors(err.fields);
      } else {
        // Network/server error — fall back to a pre-filled email so the
        // message still reaches the team.
        setServerError(
          'We couldn’t send that just now. You can email us directly instead.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">/ Contact</span>
          <h1 className={styles.title}>Let’s talk</h1>
          <p className={styles.sub}>
            Questions about a program, eligibility, or bringing TechLiftED to your
            school? We usually reply within a day.
          </p>
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.formCard}>
            {sent ? (
              <div className={styles.thanks}>
                <span className={styles.thanksIcon}><CheckIcon size={28} /></span>
                <h2>Thanks, {name.split(' ')[0]}!</h2>
                <p>
                  Your message has been received — we’ll get back to you within a
                  day at <strong>{email}</strong>. For anything urgent, reach us
                  on <a href={COMMUNITY} target="_blank" rel="noreferrer">WhatsApp</a>.
                </p>
                <button className="btn btn-ghost" onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2 className={styles.formTitle}>Send a message</h2>
                <div className={styles.field}>
                  <label className={styles.label}>Name <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }}
                    placeholder="Your name"
                  />
                  {errors.name && <p className={styles.error}>{errors.name}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Message <span className={styles.req}>*</span></label>
                  <textarea
                    className={styles.textarea}
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setErrors((x) => ({ ...x, message: undefined })); }}
                    placeholder="How can we help?"
                    rows={5}
                  />
                  {errors.message && <p className={styles.error}>{errors.message}</p>}
                </div>
                {serverError && (
                  <p className={styles.serverError}>
                    {serverError}{' '}
                    <a
                      href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
                        `TechLiftED enquiry from ${name.trim()}`,
                      )}&body=${encodeURIComponent(
                        `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`,
                      )}`}
                    >
                      Email {CONTACT.email}
                    </a>
                  </p>
                )}
                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Message'}
                  {!submitting && <ArrowRight size={16} />}
                </button>
              </form>
            )}
          </Reveal>

          <Reveal index={1} className={styles.sideCol}>
            <div className={styles.infoCard}>
              <span className="eyebrow">/ Email</span>
              <a href={`mailto:${CONTACT.email}`} className={styles.infoValue}>
                {CONTACT.email}
              </a>
              <p className={styles.infoNote}>Best for detailed questions.</p>
            </div>

            <a href={COMMUNITY} target="_blank" rel="noreferrer" className={styles.waCard}>
              <span className={styles.waIcon}><WhatsAppIcon size={26} /></span>
              <div>
                <strong>WhatsApp Community</strong>
                <span>Join for class updates & quick support</span>
              </div>
              <ArrowRight size={18} />
            </a>

            <div className={styles.infoCard}>
              <span className="eyebrow">/ Response time</span>
              <span className={styles.infoValue}>~24 hours</span>
              <p className={styles.infoNote}>Mon–Sat, IST.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
