import { Link, useParams, Navigate } from 'react-router-dom';
import { Reveal, RevealGroup } from '../components/Reveal';
import { Accordion } from '../components/Accordion';
import { PROGRAM_ICON, ArrowRight, CheckIcon } from '../components/Icons';
import { PROGRAM_BY_SLUG, type ProgramSlug } from '../data/programs';
import styles from './ProgramDetail.module.css';

/** Infinite marquee of the 12 AI-tools topics. */
function Ticker({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className={styles.ticker} aria-hidden>
      <div className={styles.tickerTrack}>
        {doubled.map((t, i) => (
          <span key={i} className={styles.tickerItem}>
            <span className={styles.tickerNum}>
              W{(i % items.length) + 1}
            </span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const program = slug ? PROGRAM_BY_SLUG[slug as ProgramSlug] : undefined;

  if (!program) return <Navigate to="/programs" replace />;

  const Icon = PROGRAM_ICON[program.icon];
  const rolling = program.cohortType === 'rolling';

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden />
        <div className="container">
          <Reveal>
            <Link to="/programs" className={styles.back}>
              ← All programs
            </Link>
          </Reveal>

          <div className={styles.heroGrid}>
            <Reveal className={styles.heroMain}>
              <div className={styles.heroTop}>
                <span className={styles.icon} aria-hidden>
                  <Icon size={26} />
                </span>
                <span className={`badge ${rolling ? 'badge-accent' : ''}`}>
                  {program.cohortLabel}
                </span>
              </div>
              <h1 className={styles.title}>{program.name}</h1>
              <p className={styles.tagline}>{program.description}</p>
              <div className={styles.heroCtas}>
                <Link
                  to={`/apply?program=${program.slug}`}
                  className="btn btn-primary btn-lg"
                >
                  Enroll Now <ArrowRight size={18} />
                </Link>
                <a href="#syllabus" className="btn btn-ghost btn-lg">
                  View Syllabus
                </a>
              </div>
            </Reveal>

            <Reveal index={1} className={styles.specCard}>
              <h3 className={styles.specHead}>Program at a glance</h3>
              <dl className={styles.specs}>
                <div><dt>Duration</dt><dd>{program.duration}</dd></div>
                <div><dt>Commitment</dt><dd>{program.cadence}</dd></div>
                <div><dt>Format</dt><dd>{program.cohortLabel}</dd></div>
                <div><dt>Start</dt><dd>{program.startLabel}</dd></div>
                <div><dt>Platform</dt><dd>{program.platform}</dd></div>
                <div><dt>Prerequisites</dt><dd>{program.prerequisites}</dd></div>
              </dl>
            </Reveal>
          </div>

          {rolling && (
            <Reveal className={styles.tickerWrap}>
              <span className={`eyebrow ${styles.tickerLabel}`}>
                12 standalone topics · Join Anytime
              </span>
              <Ticker items={program.syllabus.map((s) => s.title)} />
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Syllabus ──────────────────────────────────────────────────── */}
      <section className="section" id="syllabus">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Syllabus</span>
            <h2>{rolling ? 'Week-by-week topics' : 'Your 4-week journey'}</h2>
            <p>
              {rolling
                ? 'Every week is a complete, standalone topic — attend the ones you want, in any order.'
                : 'Each week builds on the last, ending in an original capstone you design yourself.'}
            </p>
          </Reveal>

          <RevealGroup className={styles.timeline}>
            {program.syllabus.map((w) => (
              <Reveal as="div" key={w.week} className={styles.week}>
                <div className={styles.weekMarker}>
                  <span className={styles.weekNum}>W{w.week}</span>
                </div>
                <div className={styles.weekBody}>
                  <h3>{w.title}</h3>
                  <p>{w.detail}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Outcomes + Eligibility ────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.twoCol}>
            <Reveal className={styles.panel}>
              <span className="eyebrow">Learning Outcomes</span>
              <h2 className={styles.panelTitle}>What you’ll walk away with</h2>
              <ul className={styles.outcomes}>
                {program.outcomes.map((o) => (
                  <li key={o}>
                    <span className={styles.check}><CheckIcon size={14} /></span>
                    {o}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal index={1} className={styles.panel}>
              <span className="eyebrow">Eligibility</span>
              <h2 className={styles.panelTitle}>Who it’s for</h2>
              <div className={styles.eligibility}>
                <p>
                  <strong>Prerequisites:</strong> {program.prerequisites}
                </p>
                <p>
                  This program is designed for complete beginners and works on
                  any device with a browser — including an Android phone on a
                  variable connection. You’ll need an internet connection and
                  about {program.cadence.toLowerCase()} of focused time.
                </p>
                <div className={styles.instructor}>
                  <span className={`eyebrow`}>Your Mentor</span>
                  <strong className={styles.instName}>
                    {program.instructor.role}
                  </strong>
                  <p>{program.instructor.blurb}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.faqLayout}>
            <Reveal className={styles.faqHead}>
              <span className="eyebrow">FAQ</span>
              <h2>Questions, answered</h2>
              <p className="text-muted">
                Still unsure? Reach out on{' '}
                <Link to="/contact">our contact page</Link> or WhatsApp.
              </p>
            </Reveal>
            <Reveal index={1} className={styles.faqBody}>
              <Accordion items={program.faqs} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Enroll CTA ────────────────────────────────────────────────── */}
      <section className="container">
        <Reveal className={styles.enrollBand}>
          <div>
            <h2>Ready to start {program.shortName}?</h2>
            <p>
              {rolling
                ? 'Pick your start week and apply — you can join any topic, any time.'
                : `Cohort starts the week of July 5, 2026. Apply now to reserve your seat.`}
            </p>
          </div>
          <Link
            to={`/apply?program=${program.slug}`}
            className="btn btn-primary btn-lg"
          >
            Enroll Now <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
