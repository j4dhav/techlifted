import { CONTACT } from '../data/constants';
import { WhatsAppIcon } from './Icons';
import styles from './WhatsAppButton.module.css';

const COMMUNITY =
  import.meta.env.VITE_WHATSAPP_COMMUNITY || CONTACT.whatsappCommunity;

export function WhatsAppButton() {
  return (
    <a
      className={styles.fab}
      href={COMMUNITY}
      target="_blank"
      rel="noreferrer"
      aria-label="Join our WhatsApp community"
    >
      <span className={styles.pulse} aria-hidden />
      <WhatsAppIcon size={28} />
      <span className={styles.label}>Join WhatsApp</span>
    </a>
  );
}
