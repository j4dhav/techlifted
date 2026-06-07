import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export function NotFound() {
  return (
    <section className={styles.page}>
      <div className="container">
        <span className="eyebrow">/ 404</span>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>This page took a different path.</h2>
        <p className={styles.sub}>
          The page you’re looking for doesn’t exist or has moved. Let’s get you
          back on track.
        </p>
        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <Link to="/programs" className="btn btn-ghost">Browse Programs</Link>
        </div>
      </div>
    </section>
  );
}
