'use client';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

export default function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const i = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className={styles.statusBar} role="banner">
      <div className={styles.statusGroup}>
        <span className={styles.led} aria-hidden="true" />
        <span className={styles.brand}>VERBAFLOW · AGENCY FLOOR</span>
        <span className={styles.version}>v3.2</span>
      </div>
      <div className={styles.statusGroup}>
        <a className={styles.statusNav} href="#services">SERVICES</a>
        <a className={styles.statusNav} href="#agents">AGENTS</a>
        <a className={styles.statusNav} href="#pricing">PRICING</a>
        <a className={styles.statusNav} href="https://cal.com/verbaflow" target="_blank" rel="noopener noreferrer">BOOK</a>
        <span className={styles.statusTime}>
          {time}<span className={styles.tz}> EST</span>
        </span>
      </div>
    </div>
  );
}
