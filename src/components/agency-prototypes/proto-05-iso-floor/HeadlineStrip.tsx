'use client';
import styles from './styles.module.css';
import { useHermesState } from '@/hooks/useHermesState';

const TOTAL_AGENTS = 6;

export default function HeadlineStrip() {
  const agents = useHermesState(); // OLD signature — Record<string, AgentState>
  const activeCount = Object.values(agents).filter((s) => s === 'busy' || s === 'blocked').length;
  const blockedCount = Object.values(agents).filter((s) => s === 'blocked').length;

  return (
    <header className={styles.headlineStrip}>
      <div className={styles.headlineLeft}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          <span>
            Live ·{' '}
            {activeCount > 0
              ? `${activeCount} of ${TOTAL_AGENTS} agents active`
              : `${TOTAL_AGENTS} agents on the floor`}
            {blockedCount > 0 && (
              <>
                {' · '}
                <span className={styles.eyebrowAlert}>{blockedCount} blocked</span>
              </>
            )}
          </span>
        </div>
        <h2 className={styles.title}>
          Step inside <span className={styles.titleAccent}>the agency.</span>
        </h2>
        <p className={styles.hint}>
          Click any zone. Book a discovery call at reception, or open an agent room to see who is
          running what right now.
        </p>
      </div>
      <div className={styles.headlineCtas}>
        <a
          className={styles.ctaPrimary}
          href="https://cal.com/verbaflow"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a session →
        </a>
        <a className={styles.ctaSecondary} href="#agents">
          Meet the agents
        </a>
      </div>
    </header>
  );
}
