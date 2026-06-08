import { Link } from 'react-router-dom';
import { CONTACT } from '../data/constants';
import { PROGRAMS } from '../data/programs';
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from './Icons';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Link to="/" className={styles.logo}>
            TechLift<span className={styles.accent}>ED</span>
          </Link>
          <p className={styles.tag}>
            Practical engineering, coding & AI-tools programs for students across
            India. Browser-based. Mentor-led. Built for any device.
          </p>
          <div className={styles.socials}>
            <a href={CONTACT.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
              <InstagramIcon />
            </a>
            <a href={CONTACT.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <LinkedInIcon />
            </a>
            <a href={CONTACT.youtube} aria-label="YouTube" target="_blank" rel="noreferrer">
              <YouTubeIcon />
            </a>
          </div>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHead}>Programs</h4>
          {PROGRAMS.map((p) => (
            <Link key={p.slug} to={`/programs/${p.slug}`} className={styles.link}>
              {p.shortName}
            </Link>
          ))}
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHead}>Company</h4>
          <Link to="/about" className={styles.link}>About</Link>
          <Link to="/contact" className={styles.link}>Contact</Link>
          <Link to="/apply" className={styles.link}>Apply</Link>
          <Link to="/programs" className={styles.link}>All Programs</Link>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHead}>Get in touch</h4>
          <a href={`mailto:${CONTACT.email}`} className={styles.link}>
            {CONTACT.email}
          </a>
          <a href={CONTACT.whatsappCommunity} className={styles.link} target="_blank" rel="noreferrer">
            WhatsApp Community
          </a>
          <Link to="/admin" className={styles.linkMuted}>Admin</Link>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span className="mono">© {year} TECHLIFTED</span>
        <span className="mono">MADE IN INDIA · FOR INDIA</span>
      </div>
    </footer>
  );
}
