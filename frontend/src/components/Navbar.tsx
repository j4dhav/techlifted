import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/programs', label: 'Programs' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="TechLiftED home">
          <span className={styles.logoMark} aria-hidden>
            <svg width="26" height="26" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="navg" x1="0" y1="0" x2="0.5" y2="1">
                  <stop offset="0" stopColor="#4AA6D6" />
                  <stop offset="0.55" stopColor="#45CFC9" />
                  <stop offset="1" stopColor="#5FE3D6" />
                </linearGradient>
              </defs>
              <path d="M7 9 L16 3 L25 9 L25 14 L16 8 L7 14 Z" fill="url(#navg)" />
              <path d="M7 17 L16 11 L25 17 L25 22 L16 16 L7 22 Z" fill="url(#navg)" />
              <path d="M7 25 L16 19 L25 25 L25 30 L16 24 L7 30 Z" fill="url(#navg)" />
            </svg>
          </span>
          <span className={styles.logoText}>
            TechLift<span className={styles.logoAccent}>ED</span>
          </span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          <Link to="/apply" className={`btn btn-primary ${styles.cta}`}>
            Apply Now
          </Link>
          <button
            className={styles.burger}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={open ? styles.barTop : ''} />
            <span className={open ? styles.barMid : ''} />
            <span className={open ? styles.barBot : ''} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `${styles.mobileLink} ${isActive ? styles.active : ''}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/apply" className={`btn btn-primary btn-block ${styles.mobileCta}`}>
                Apply Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
