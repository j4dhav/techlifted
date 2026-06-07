import { Link } from 'react-router-dom';
import type { Program } from '../data/programs';
import { PROGRAM_ICON, ArrowRight } from './Icons';
import styles from './ProgramCard.module.css';

interface Props {
  program: Program;
  /** 'home' shows a compact card; 'grid' shows the detailed Programs-page card. */
  variant?: 'home' | 'grid';
}

export function ProgramCard({ program, variant = 'home' }: Props) {
  const Icon = PROGRAM_ICON[program.icon];
  const rolling = program.cohortType === 'rolling';

  return (
    <article className={`${styles.card} ${variant === 'grid' ? styles.grid : ''}`}>
      <div className={styles.top}>
        <span className={styles.icon} aria-hidden>
          <Icon size={22} />
        </span>
        <span className={`badge ${rolling ? 'badge-accent' : ''}`}>
          {rolling ? 'Join Anytime' : 'Fixed Cohort'}
        </span>
      </div>

      <h3 className={styles.name}>{program.name}</h3>
      <p className={styles.desc}>
        {variant === 'grid' ? program.description : program.tagline}
      </p>

      <dl className={styles.meta}>
        <div>
          <dt>Duration</dt>
          <dd>{program.duration} · {program.cadence}</dd>
        </div>
        <div>
          <dt>Start</dt>
          <dd>{rolling ? 'Any week' : 'Jul 5, 2026'}</dd>
        </div>
        {variant === 'grid' && (
          <div className={styles.full}>
            <dt>Platform</dt>
            <dd>{program.platform}</dd>
          </div>
        )}
      </dl>

      <div className={styles.actions}>
        <Link to={`/programs/${program.slug}`} className="btn btn-ghost">
          {variant === 'grid' ? 'View Syllabus' : 'Learn More'}
        </Link>
        <Link
          to={`/apply?program=${program.slug}`}
          className={`btn btn-outline ${styles.enroll}`}
        >
          Enroll <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
