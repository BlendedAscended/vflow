'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';

interface BookCallModalProps {
  open: boolean;
  onClose: () => void;
  originPoint: { x: number; y: number } | null;
}

export default function BookCallModal({ open, onClose, originPoint }: BookCallModalProps) {
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

  if (!open) return null;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-call-title"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        style={{
          transformOrigin: originPoint
            ? `${originPoint.x}px ${originPoint.y}px`
            : '50% 50%',
        }}
      >
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close booking dialog"
          type="button"
        >
          ×
        </button>
        <p className={styles.modalSubtitle}>Reception</p>
        <h2 id="book-call-title" className={styles.modalTitle}>
          Book a discovery call
        </h2>
        <p className={styles.modalBody}>
          Fifteen minutes. We hear the brief, the agency floor wakes up, agents get assigned within the
          hour. No deck. No pre-call form.
        </p>

        <div className={styles.statusRow}>
          <span className={styles.statusDot} />
          <span>
            <span className={styles.modalKey}>San</span> is available today, 14:00 EST.
          </span>
        </div>

        <a
          className={styles.modalCta}
          href="https://cal.com/verbaflow"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open scheduler →
        </a>
      </div>
    </div>
  );
}
