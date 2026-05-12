'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';

export interface AgentDetail {
  id: string;
  number: number;
  label: string;
  role: string;
  stack: string;
  state: 'idle' | 'busy' | 'blocked' | 'away';
}

interface AgentZoneModalProps {
  open: boolean;
  agent: AgentDetail | null;
  onClose: () => void;
}

const STATE_LABEL: Record<AgentDetail['state'], string> = {
  idle: 'Idle. Ready for the next task.',
  busy: 'Currently building.',
  blocked: 'Blocked. Waiting on input.',
  away: 'Off shift.',
};

export default function AgentZoneModal({ open, agent, onClose }: AgentZoneModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !agent) return null;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`agent-${agent.id}-title`}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close agent details"
          type="button"
        >
          ×
        </button>
        <div className={styles.modalNumber}>{agent.number}</div>
        <p className={styles.modalSubtitle}>Agent zone</p>
        <h2 id={`agent-${agent.id}-title`} className={styles.modalTitle}>
          {agent.label}
        </h2>
        <p className={styles.modalBody}>{agent.role}</p>
        <p className={styles.modalBody}>
          <span className={styles.modalKey}>Stack:</span> {agent.stack}
        </p>
        <div className={styles.statusRow}>
          <span className={styles.statusDot} />
          <span>{STATE_LABEL[agent.state]}</span>
        </div>
      </div>
    </div>
  );
}
