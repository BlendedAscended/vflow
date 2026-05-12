'use client';
import styles from './styles.module.css';
import { useHermesState } from '@/hooks/useHermesState';

const TOTAL_AGENTS = 6;
const ACTIVE_PROJECTS = 7;
const NEXT_SLOT_LABEL = 'Today · 14:00 EST';
const NEXT_SLOT_URL = 'https://cal.com/verbaflow';

export default function StatStrip() {
  const { agents } = useHermesState();
  const busyCount = Object.values(agents).filter((s) => s === 'busy').length;
  return (
    <div className={styles.statStrip}>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Active projects</div>
        <div className={styles.statValue}>{ACTIVE_PROJECTS}</div>
        <div className={styles.statSub}>across 4 industries</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Agents busy</div>
        <div className={`${styles.statValue} ${styles.statValueAccent}`}>
          {busyCount}/{TOTAL_AGENTS}
        </div>
        <div className={styles.statSub}>real-time from Hermes</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Next available slot</div>
        <div className={styles.statValueSmall}>{NEXT_SLOT_LABEL}</div>
        <div className={styles.statSub}>
          <a className={styles.statLink} href={NEXT_SLOT_URL} target="_blank" rel="noopener noreferrer">
            Take it →
          </a>
        </div>
      </div>
    </div>
  );
}
