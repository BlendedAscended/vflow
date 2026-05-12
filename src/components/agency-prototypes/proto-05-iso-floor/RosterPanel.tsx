'use client';
import styles from './styles.module.css';
import { useHermesState, type AgentState } from '@/hooks/useHermesState';

const AGENTS = [
  { id: 'architect', label: 'Architect',         role: 'Plans & specs' },
  { id: 'backend',   label: 'Backend Engineer',  role: 'APIs & data' },
  { id: 'designer',  label: 'Designer',          role: 'Wireframes & tokens' },
  { id: 'delivery',  label: 'Delivery',          role: 'Pull requests & merges' },
  { id: 'validator', label: 'Validator',         role: 'Tests & reviews' },
  { id: 'marketing', label: 'Marketing',         role: 'Outreach & copy' },
] as const;

const STATE_LABEL: Record<AgentState, string> = {
  idle: 'Idle',
  busy: 'Building',
  blocked: 'Blocked',
  away: 'Away',
};

export default function RosterPanel() {
  const { agents } = useHermesState();
  return (
    <div className={styles.rosterPanel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Roster</h3>
        <span className={styles.panelMeta}>6 agents</span>
      </div>
      <div className={styles.rosterList}>
        {AGENTS.map((a) => {
          const state: AgentState = agents[a.id] ?? 'idle';
          return (
            <div key={a.id} className={styles.rosterRow}>
              <span className={`${styles.rosterDot} ${styles[`rosterDot--${state}`]}`} aria-hidden="true" />
              <div className={styles.rosterMain}>
                <div className={styles.rosterName}>{a.label}</div>
                <div className={styles.rosterRole}>{a.role}</div>
              </div>
              <span className={styles.rosterState}>{STATE_LABEL[state]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
