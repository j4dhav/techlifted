import { Reveal, RevealGroup } from '../components/Reveal';
import { ProgramCard } from '../components/ProgramCard';
import { PROGRAMS } from '../data/programs';
import styles from './Programs.module.css';

export function Programs() {
  return (
    <>
      <section className={styles.head}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">Programs</span>
            <h1 className={styles.title}>
              Focused programs.
              <br />
              <span className="gradient-text">Real outcomes.</span>
            </h1>
            <p className={styles.sub}>
              Each program is short, mentor-led, and ends with something you
              built. Choose a fixed 4-week cohort or join our rolling AI-tools
              track any week of the year.
            </p>
          </Reveal>

          <RevealGroup className={styles.tags}>
            {[
              ['2', 'Fixed 4-week cohorts'],
              ['1', 'Rolling 12-week track'],
              ['100%', 'Browser-based'],
              ['₹0', 'Tools cost'],
            ].map(([v, l]) => (
              <Reveal as="div" key={l} className={styles.tag}>
                <span className={styles.tagVal}>{v}</span>
                <span className={styles.tagLabel}>{l}</span>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <RevealGroup className={styles.grid}>
            {PROGRAMS.map((p) => (
              <Reveal as="div" key={p.slug}>
                <ProgramCard program={p} variant="grid" />
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
