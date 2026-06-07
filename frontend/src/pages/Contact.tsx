import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { WhatsAppIcon, ArrowRight, CheckIcon } from '../components/Icons';
import { CONTACT } from '../data/constants';
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email.';
    if (message.trim().length < 5) next.message = 'Please write a short message.';
    setErrors(next);
    if (Object.keys(next).length) return;

    // No public contact endpoint is required; compose a pre-filled email so the
    // message reaches the team reliably from any device.
    const subject = encodeURIComponent(`EduBridge enquiry from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()} (${email.trim()})`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">/ Contact</span>
          <h1 className={styles.title}>Let’s talk</h1>
          <p className={styles.sub}>
            Questions about a program, eligibility, or bringing EduBridge to your
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
                  Your email client should have opened with your message ready to
                  send. If it didn’t, reach us directly at{' '}
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
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
                <button type="submit" className="btn btn-primary btn-block">
                  Send Message <ArrowRight size={16} />
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
