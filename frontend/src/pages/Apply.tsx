import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckIcon, WhatsAppIcon } from '../components/Icons';
import { PROGRAM_OPTIONS, type ProgramSlug } from '../data/programs';
import {
  INDIAN_STATES,
  DEVICE_OPTIONS,
  COUNTRY_CODES,
  AI_TOOLS_START_WEEKS,
  CONTACT,
} from '../data/constants';
import { submitApplication, ApiException } from '../lib/api';
import styles from './Apply.module.css';

const COMMUNITY =
  import.meta.env.VITE_WHATSAPP_COMMUNITY || CONTACT.whatsappCommunity;
const MAX_FILE = 5 * 1024 * 1024;
const STEPS = ['Personal', 'Program', 'Documents', 'Review'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  state: string;
  school: string;
  program: ProgramSlug | '';
  preferredStartWeek: string;
  devices: string[];
  otherDevice: string;
  agree: boolean;
}

type Errors = Partial<Record<keyof FormState | 'marksheet' | 'idProof', string>>;

const initialState = (program: ProgramSlug | ''): FormState => ({
  fullName: '',
  email: '',
  countryCode: '+91',
  phone: '',
  state: '',
  school: '',
  program,
  preferredStartWeek: '',
  devices: [],
  otherDevice: '',
  agree: false,
});

export function Apply() {
  const [params] = useSearchParams();
  const preProgram = (params.get('program') as ProgramSlug) || '';
  const validPre = PROGRAM_OPTIONS.some((p) => p.value === preProgram)
    ? preProgram
    : '';

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() => initialState(validPre));
  const [marksheet, setMarksheet] = useState<File | null>(null);
  const [idProof, setIdProof] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState<null | { id: number; warnings: string[] }>(
    null,
  );

  const isAiTools = form.program === 'ai-tools';

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleDevice = (device: string) => {
    setForm((f) => {
      const has = f.devices.includes(device);
      const devices = has
        ? f.devices.filter((d) => d !== device)
        : [...f.devices, device];
      return { ...f, devices };
    });
    setErrors((e) => ({ ...e, devices: undefined }));
  };

  function validateFile(file: File | null, field: 'marksheet' | 'idProof'): string | null {
    if (!file) return null; // optional
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) return 'Only PDF files are accepted.';
    if (file.size > MAX_FILE) return 'File is larger than 5MB.';
    setErrors((e) => ({ ...e, [field]: undefined }));
    return null;
  }

  function validateStep(s: number): boolean {
    const e: Errors = {};
    if (s === 0) {
      if (form.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
      if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address.';
      const digits = form.phone.replace(/\D/g, '');
      if (digits.length < 6) e.phone = 'Enter a valid phone number.';
      if (!form.state) e.state = 'Please select your state.';
    }
    if (s === 1) {
      if (!form.program) e.program = 'Please choose a program.';
      if (form.devices.length === 0) e.devices = 'Select at least one device.';
      if (form.devices.includes('Other') && !form.otherDevice.trim())
        e.otherDevice = 'Please describe your other device.';
    }
    if (s === 2) {
      const mErr = marksheet
        ? validateFile(marksheet, 'marksheet')
        : null;
      const iErr = idProof ? validateFile(idProof, 'idProof') : null;
      if (mErr) e.marksheet = mErr;
      if (iErr) e.idProof = iErr;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setServerError('');
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    if (!form.agree) {
      setErrors((e) => ({ ...e, agree: 'You must agree to be contacted.' }));
      return;
    }
    setSubmitting(true);
    setServerError('');

    const fd = new FormData();
    fd.append('fullName', form.fullName.trim());
    fd.append('email', form.email.trim());
    fd.append('countryCode', form.countryCode);
    fd.append('phone', form.phone.trim());
    fd.append('state', form.state);
    fd.append('school', form.school.trim());
    fd.append('program', form.program);
    if (isAiTools && form.preferredStartWeek)
      fd.append('preferredStartWeek', form.preferredStartWeek);
    fd.append('devices', JSON.stringify(form.devices));
    if (form.devices.includes('Other'))
      fd.append('otherDevice', form.otherDevice.trim());
    fd.append('agree', String(form.agree));
    if (marksheet) fd.append('marksheet', marksheet);
    if (idProof) fd.append('idProof', idProof);

    try {
      const res = await submitApplication(fd);
      setSuccess({ id: res.id, warnings: res.warnings || [] });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.fields) {
          // Map server field errors back into the form & jump to the step.
          setErrors(err.fields as Errors);
          const f = err.fields;
          if (f.fullName || f.email || f.phone || f.state) setStep(0);
          else if (f.program || f.devices || f.otherDevice) setStep(1);
        }
        setServerError(err.message);
      } else {
        setServerError('Network error — please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const programLabel = useMemo(
    () =>
      form.program
        ? PROGRAM_OPTIONS.find((p) => p.value === form.program)?.label
        : '—',
    [form.program],
  );

  if (success) {
    return <SuccessState id={success.id} warnings={success.warnings} />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <div className={`container ${styles.wrap}`}>
        <div className={styles.head}>
          <span className="eyebrow">/ Application</span>
          <h1 className={styles.title}>Apply to TechLiftED</h1>
          <p className={styles.sub}>
            Takes about three minutes. Your details are only used to enrol you
            and share class updates.
          </p>
        </div>

        {/* Progress bar */}
        <div className={styles.progress}>
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`${styles.pStep} ${i === step ? styles.pActive : ''} ${
                i < step ? styles.pDone : ''
              }`}
            >
              <span className={styles.pDot}>
                {i < step ? <CheckIcon size={14} /> : i + 1}
              </span>
              <span className={styles.pLabel}>{label}</span>
            </div>
          ))}
          <div className={styles.pTrack}>
            <div
              className={styles.pFill}
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className={styles.card}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ── Step 1: Personal ─────────────────────────────────── */}
              {step === 0 && (
                <div className={styles.stepBody}>
                  <h2 className={styles.stepTitle}>Personal information</h2>
                  <Field label="Full Name" required error={errors.fullName}>
                    <input
                      className={styles.input}
                      value={form.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Email" required error={errors.email}>
                    <input
                      className={styles.input}
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Phone Number" required error={errors.phone} hint="Used for WhatsApp class updates">
                    <div className={styles.phoneRow}>
                      <select
                        className={styles.code}
                        value={form.countryCode}
                        onChange={(e) => update('countryCode', e.target.value)}
                        aria-label="Country code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                      <input
                        className={styles.input}
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="98765 43210"
                        autoComplete="tel-national"
                      />
                    </div>
                  </Field>
                  <div className={styles.grid2}>
                    <Field label="State" required error={errors.state}>
                      <select
                        className={styles.input}
                        value={form.state}
                        onChange={(e) => update('state', e.target.value)}
                      >
                        <option value="">Select your state…</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="School / College" hint="Optional">
                      <input
                        className={styles.input}
                        value={form.school}
                        onChange={(e) => update('school', e.target.value)}
                        placeholder="Your institution"
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Step 2: Program & Devices ───────────────────────── */}
              {step === 1 && (
                <div className={styles.stepBody}>
                  <h2 className={styles.stepTitle}>Program & devices</h2>
                  <Field label="Program" required error={errors.program}>
                    <select
                      className={styles.input}
                      value={form.program}
                      onChange={(e) => update('program', e.target.value as ProgramSlug)}
                    >
                      <option value="">Choose a program…</option>
                      {PROGRAM_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </Field>

                  {isAiTools && (
                    <Field
                      label="Preferred start week"
                      hint="AI Tools is rolling — join any week"
                    >
                      <select
                        className={styles.input}
                        value={form.preferredStartWeek}
                        onChange={(e) => update('preferredStartWeek', e.target.value)}
                      >
                        <option value="">No preference / start ASAP</option>
                        {AI_TOOLS_START_WEEKS.map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </Field>
                  )}

                  <Field
                    label="Devices you’ll use"
                    required
                    error={errors.devices}
                    hint="Select all that apply"
                  >
                    <div className={styles.devices}>
                      {DEVICE_OPTIONS.map((d) => {
                        const checked = form.devices.includes(d);
                        return (
                          <button
                            type="button"
                            key={d}
                            className={`${styles.device} ${checked ? styles.deviceOn : ''}`}
                            onClick={() => toggleDevice(d)}
                            aria-pressed={checked}
                          >
                            <span className={styles.deviceBox}>
                              {checked && <CheckIcon size={13} />}
                            </span>
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  {form.devices.includes('Other') && (
                    <Field label="Describe your other device" required error={errors.otherDevice}>
                      <input
                        className={styles.input}
                        value={form.otherDevice}
                        onChange={(e) => update('otherDevice', e.target.value)}
                        placeholder="e.g. Smart TV with browser"
                      />
                    </Field>
                  )}
                </div>
              )}

              {/* ── Step 3: Documents ───────────────────────────────── */}
              {step === 2 && (
                <div className={styles.stepBody}>
                  <h2 className={styles.stepTitle}>Documents</h2>
                  <p className={styles.optionalNote}>
                    Both documents are optional — you can skip this step and
                    submit later. PDF only, max 5MB each.
                  </p>
                  <FileField
                    label="Marksheet / Transcript"
                    file={marksheet}
                    error={errors.marksheet}
                    onSelect={(f) => {
                      const err = validateFile(f, 'marksheet');
                      if (err) { setErrors((e) => ({ ...e, marksheet: err })); return; }
                      setMarksheet(f);
                    }}
                    onClear={() => { setMarksheet(null); setErrors((e) => ({ ...e, marksheet: undefined })); }}
                  />
                  <FileField
                    label="ID Proof"
                    file={idProof}
                    error={errors.idProof}
                    onSelect={(f) => {
                      const err = validateFile(f, 'idProof');
                      if (err) { setErrors((e) => ({ ...e, idProof: err })); return; }
                      setIdProof(f);
                    }}
                    onClear={() => { setIdProof(null); setErrors((e) => ({ ...e, idProof: undefined })); }}
                  />
                </div>
              )}

              {/* ── Step 4: Review ──────────────────────────────────── */}
              {step === 3 && (
                <div className={styles.stepBody}>
                  <h2 className={styles.stepTitle}>Review & submit</h2>
                  <dl className={styles.review}>
                    <Row label="Full Name" value={form.fullName} />
                    <Row label="Email" value={form.email} />
                    <Row label="Phone" value={`${form.countryCode} ${form.phone}`} />
                    <Row label="State" value={form.state} />
                    <Row label="School / College" value={form.school || '—'} />
                    <Row label="Program" value={programLabel || '—'} />
                    {isAiTools && (
                      <Row label="Preferred Start" value={form.preferredStartWeek || 'No preference'} />
                    )}
                    <Row label="Devices" value={
                      form.devices.length
                        ? form.devices
                            .map((d) => (d === 'Other' && form.otherDevice ? `Other: ${form.otherDevice}` : d))
                            .join(', ')
                        : '—'
                    } />
                    <Row label="Marksheet" value={marksheet?.name || 'Not uploaded'} />
                    <Row label="ID Proof" value={idProof?.name || 'Not uploaded'} />
                  </dl>

                  <label className={`${styles.agree} ${errors.agree ? styles.agreeErr : ''}`}>
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) => update('agree', e.target.checked)}
                    />
                    <span>
                      I agree to be contacted via email and WhatsApp about my
                      application and class updates.
                    </span>
                  </label>
                  {errors.agree && <p className={styles.error}>{errors.agree}</p>}
                  {serverError && <p className={styles.serverError}>{serverError}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className={styles.nav}>
            {step > 0 ? (
              <button className="btn btn-ghost" onClick={back} disabled={submitting}>
                Back
              </button>
            ) : (
              <Link to="/programs" className="btn btn-ghost">Cancel</Link>
            )}

            {step < STEPS.length - 1 ? (
              <button className="btn btn-primary" onClick={next}>
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
                {!submitting && <ArrowRight size={16} />}
              </button>
            )}
          </div>
        </div>

        <p className={styles.privacy}>
          By applying you agree to our friendly use of your data solely to run
          your enrolment. We never sell your information.
        </p>
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function Field({
  label, required, error, hint, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.req}>*</span>}
        {hint && <span className={styles.hint}>{hint}</span>}
      </label>
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function FileField({
  label, file, error, onSelect, onClear,
}: {
  label: string;
  file: File | null;
  error?: string;
  onSelect: (f: File) => void;
  onClear: () => void;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}<span className={styles.hint}>PDF · max 5MB</span></label>
      {file ? (
        <div className={styles.fileChosen}>
          <span className={styles.fileIcon}>PDF</span>
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          <button type="button" className={styles.fileClear} onClick={onClear}>Remove</button>
        </div>
      ) : (
        <label className={styles.dropzone}>
          <input
            type="file"
            accept="application/pdf,.pdf"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onSelect(f);
              e.target.value = '';
            }}
          />
          <span className={styles.dropIcon}>↑</span>
          <span>Tap to upload <strong>{label}</strong></span>
          <span className={styles.dropHint}>PDF only · up to 5MB</span>
        </label>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.reviewRow}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function SuccessState({ id, warnings }: { id: number; warnings: string[] }) {
  return (
    <section className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <div className={`container ${styles.successWrap}`}>
        <motion.div
          className={styles.successCard}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.successIcon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
          >
            <CheckIcon size={34} />
          </motion.div>
          <span className="eyebrow">/ Application #{id}</span>
          <h1 className={styles.successTitle}>You’re enrolled! 🎉</h1>
          <p className={styles.successSub}>
            Check your email for course details, and tap below to join our
            WhatsApp community for class updates and support.
          </p>

          {warnings.length > 0 && (
            <div className={styles.warnBox}>
              {warnings.map((w, i) => (
                <p key={i}>⚠️ {w}</p>
              ))}
            </div>
          )}

          <a
            href={COMMUNITY}
            target="_blank"
            rel="noreferrer"
            className={`btn ${styles.waBtn}`}
          >
            <WhatsAppIcon size={20} /> Join the WhatsApp Community
          </a>
          <Link to="/" className={`btn btn-ghost ${styles.homeBtn}`}>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
