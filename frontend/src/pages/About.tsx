import { Link } from 'react-router-dom';
import { Reveal, RevealGroup } from '../components/Reveal';
import { ArrowRight } from '../components/Icons';
import styles from './About.module.css';

const TEAM = [
  { name: 'Atharv Jadhav', role: 'Founder & Lead Mentor' },
  { name: 'Anil Jadhav', role: 'Board of Directors' },
  { name: 'Anushka Jadhav', role: 'Board of Directors' },
];

const TIMELINE = [
  { when: '2026 · Q1', title: 'The idea', body: 'TechLiftED starts with a simple question: why should hands-on tech learning need expensive hardware or software?' },
  { when: '2026 · Q2', title: 'Curriculum built', body: 'Three browser-first programs designed around free tools and weekly, project-driven outcomes.' },
  { when: '2026 · Jul', title: 'First cohorts', body: 'Engineering, Coding, and the rolling AI-Tools track open to students worldwide.' },
  { when: 'Beyond', title: 'Scaling access', body: 'More tracks, more languages, and partnerships with schools and colleges across the globe.' },
];

const VALUES = [
  { title: 'Access over polish', body: 'If it doesn’t run on a budget phone over a slow connection, we rethink it.' },
  { title: 'Build, don’t memorise', body: 'Every week ends in something you made. Theory serves the project, never the reverse.' },
  { title: 'Free by default', body: 'We design around free tiers so cost is never the reason someone can’t start.' },
];

export function About() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.glow} aria-hidden />
        <div className="container">
          <Reveal>
            <span className="eyebrow">About</span>
            <h1 className={styles.title}>
              Lifting students from
              <br />
              <span className="gradient-text">curiosity to capability.</span>
            </h1>
            <p className={styles.lead}>
              TechLiftED exists to make practical, project-based tech education
              reachable for every student — anywhere in the world, regardless of
              their device, budget, or background. We teach with free,
              browser-based tools and live mentors, so the only thing you need to
              begin is curiosity.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className={styles.mission}>
            <span className="eyebrow">Our Mission</span>
            <p className={styles.missionText}>
              To make hands-on technology education genuinely accessible to
              anyone, anywhere, on any device — so that a learner’s potential is
              never limited by the cost of hardware, software, or where they
              happen to live. We turn curiosity into capability for students
              around the world.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <RevealGroup className={styles.values}>
            {VALUES.map((v) => (
              <Reveal as="div" key={v.title} className={styles.valueCard}>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Team</span>
            <h2>The people behind TechLiftED</h2>
            <p>A small team building practical tech education for everyone.</p>
          </Reveal>
          <RevealGroup className={styles.team}>
            {TEAM.map((m) => (
              <Reveal as="div" key={m.name} className={styles.member}>
                <h3 className={styles.memberName}>{m.name}</h3>
                <span className={styles.memberRole}>{m.role}</span>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Journey</span>
            <h2>Where we’re headed</h2>
          </Reveal>
          <RevealGroup className={styles.timeline}>
            {TIMELINE.map((t) => (
              <Reveal as="div" key={t.title} className={styles.tItem}>
                <span className={styles.tWhen}>{t.when}</span>
                <div className={styles.tDot} aria-hidden />
                <div className={styles.tBody}>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Partners */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className={styles.partners}>
            <span className="eyebrow">Partners</span>
            <div className={styles.partnerGrid}>
              {['SCHOOL', 'COLLEGE', 'NGO', 'STARTUP', 'COMMUNITY'].map((p) => (
                <div key={p} className={styles.partnerLogo}>{p}</div>
              ))}
            </div>
            <p className={styles.partnerNote}>
              Partner logos are placeholders. Interested in bringing TechLiftED to
              your institution? <Link to="/contact">Get in touch.</Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container">
        <Reveal className={styles.cta}>
          <h2>Ready to build something?</h2>
          <Link to="/apply" className="btn btn-primary btn-lg">
            Apply Now <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
