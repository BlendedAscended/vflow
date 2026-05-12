'use client';
import styles from './styles.module.css';
import { useHermesState, type ActivityEvent } from '@/hooks/useHermesState';

function formatRelative(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  if (Number.isNaN(diff)) return '';
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleString();
}

export default function ActivityFeed() {
  const { events } = useHermesState();
  const recent = events.slice(0, 8);
  return (
    <div className={styles.activityFeed}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Activity</h3>
        <span className={styles.panelMeta}>last 24h · live</span>
      </div>
      {recent.length === 0 ? (
        <div className={styles.activityEmpty}>
          No activity yet. Agents are warming up.
        </div>
      ) : (
        <div className={styles.activityList}>
          {recent.map((e: ActivityEvent, i: number) => (
            <div key={`${e.ts}-${i}`} className={`${styles.activityRow} ${styles[`activity--${e.level}`]}`}>
              <span className={styles.activityDot} aria-hidden="true" />
              <div className={styles.activityMain}>
                <div className={styles.activityMessage}>
                  <span className={styles.activityAgent}>{e.agent}</span> {e.message}
                </div>
                <div className={styles.activityTime}>{formatRelative(e.ts)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
