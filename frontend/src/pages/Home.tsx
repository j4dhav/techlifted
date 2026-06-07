import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Reveal, RevealGroup } from '../components/Reveal';
import { ProgramCard } from '../components/ProgramCard';
import { ArrowRight, CheckIcon } from '../components/Icons';
import { PROGRAMS } from '../data/programs';
import { STATS } from '../data/constants';
import styles from './Home.module.css';

const heroStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const heroItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const TESTIMONIALS = [
  {
    quote:
      'I built a working night-light circuit in Tinkercad without owning a single component. The live mentor made debugging actually fun.',
    name: 'Sneha R.',
    detail: 'Class 11 · Pune',
    program: 'Engineering',
  },
  {
    quote:
      'Went from never having coded to shipping my own quiz game in Python in four weeks. The weekly builds kept me hooked.',
    name: 'Arjun M.',
    detail: 'B.Sc. 1st year · Hyderabad',
    program: 'Coding — Python',
  },
  {
    quote:
      'I joined AI Tools in week 6 for prompt engineering and stayed for everything. Being able to drop in any week is perfect for my schedule.',
    name: 'Fatima K.',
    detail: 'Working professional · Delhi',
    program: 'AI Tools',
  },
];

const WHY = [
  { title: 'Runs on any device', body: 'Everything is browser-based and works on a low-end Android phone over a patchy connection.' },
  { title: 'Live mentors, not videos', body: 'Real instructors each week who debug with you and review what you build.' },
  { title: 'Build something real', body: 'Every program ends with an original project you designed and shipped yourself.' },
  { title: 'Free tools only', body: 'Tinkercad, Replit, Colab, and free AI tiers — no expensive software required.' },
];

export function Home() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden />
        <motion.div
          className={`container ${styles.heroInner}`}
          variants={heroStagger}
          initial="hidden"
          animate="visible"
        >
          <motion.span className={`eyebrow ${styles.heroEyebrow}`} variants={heroItem}>
            <span className={styles.dot} /> Cohorts open · Starts July 2026
          </motion.span>

          <motion.h1 className={styles.heroTitle} variants={heroItem}>
            Build real tech skills,
            <br />
            <span className="gradient-text">from any device.</span>
          </motion.h1>

          <motion.p className={styles.heroSub} variants={heroItem}>
            EduBridge is a mentor-led platform bringing hands-on engineering,
            coding, and AI-tools programs to students across India — all in the
            browser, all on free tools.
          </motion.p>

          <motion.div className={styles.heroCtas} variants={heroItem}>
            <Link to="/apply" className="btn btn-primary btn-lg">
              Apply Now <ArrowRight size={18} />
            </Link>
            <Link to="/programs" className="btn btn-ghost btn-lg">
              Explore Programs
            </Link>
          </motion.div>

          <motion.div className={styles.heroTrust} variants={heroItem}>
            {['No prerequisites', 'No installs', 'Free tools'].map((t) => (
              <span key={t} className={styles.trustItem}>
                <CheckIcon size={15} /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          className={`container ${styles.stats}`}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          {STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Programs ──────────────────────────────────────────────────── */}
      <section className="section" id="programs">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">/ Programs</span>
            <h2>Three ways to start building</h2>
            <p>
              Short, focused, and project-driven. Pick a fixed 4-week cohort or
              drop into our rolling AI-tools track any week.
            </p>
          </Reveal>

          <RevealGroup className={styles.programGrid}>
            {PROGRAMS.map((p) => (
              <Reveal as="div" key={p.slug}>
                <ProgramCard program={p} />
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Why EduBridge ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className={styles.whyLayout}>
            <Reveal className={styles.whyHead}>
              <span className="eyebrow">/ Why EduBridge</span>
              <h2>Engineered for how Indian students actually learn.</h2>
              <p className="text-muted">
                Most of our students join on an Android phone over mobile data.
                Every choice we make — tools, format, pacing — respects that.
              </p>
              <Link to="/about" className="btn btn-outline">
                Our mission <ArrowRight size={16} />
              </Link>
            </Reveal>

            <RevealGroup className={styles.whyGrid}>
              {WHY.map((w) => (
                <Reveal as="div" key={w.title} className={styles.whyCard}>
                  <span className={styles.whyIcon}>
                    <CheckIcon size={16} />
                  </span>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </Reveal>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">/ Student Stories</span>
            <h2>Built by students like you</h2>
          </Reveal>

          <RevealGroup className={styles.testGrid}>
            {TESTIMONIALS.map((t) => (
              <Reveal as="div" key={t.name} className={styles.testCard}>
                <div className={styles.quoteMark} aria-hidden>“</div>
                <p className={styles.quote}>{t.quote}</p>
                <div className={styles.testFoot}>
                  <div className={styles.avatar} aria-hidden>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <span className={styles.testName}>{t.name}</span>
                    <span className={styles.testDetail}>{t.detail}</span>
                  </div>
                  <span className={`badge badge-accent ${styles.testBadge}`}>
                    {t.program}
                  </span>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── CTA band ──────────────────────────────────────────────────── */}
      <section className="container">
        <Reveal className={styles.ctaBand}>
          <div className={styles.ctaGlow} aria-hidden />
          <div className={styles.ctaContent}>
            <span className="eyebrow">/ Ready when you are</span>
            <h2>Your first project is one application away.</h2>
            <p>
              Apply in under three minutes. No fees to start, no prerequisites,
              and you can join the AI-tools track any week.
            </p>
          </div>
          <Link to="/apply" className="btn btn-primary btn-lg">
            Apply Now <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
