'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ACCENT = '#00c203';
const ACCENT_DIM = 'rgba(0,194,3,0.15)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#F3F4F6';
const MUTED = '#64748B';

// ─── TOP: Denial Rate Before/After Bar Chart ─────────────────────────────────

export function HealthcareTopChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const bars = [
    { label: 'Before AI', value: 35.5, max: 40, color: '#475569', sublabel: 'Industry avg denial rate' },
    { label: 'After AI',  value: 25.6, max: 40, color: ACCENT,    sublabel: '↓ 28% via root-cause AI' },
  ];

  return (
    <div
      ref={ref}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${BORDER}`, background: 'rgba(0,194,3,0.04)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
        Denial Rate Reduction
      </p>

      <div className="space-y-3">
        {bars.map((bar, i) => {
          const pct = (bar.value / bar.max) * 100;
          return (
            <div key={bar.label}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-medium" style={{ color: TEXT }}>{bar.label}</span>
                <span className="text-sm font-bold font-mono" style={{ color: bar.color }}>
                  {bar.value}%
                </span>
              </div>
              {/* Track */}
              <div className="h-2.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: bar.color, originX: 0 }}
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.9, delay: i * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  // actual width = pct% of track
                  custom={pct}
                >
                  {/* invisible — we control width via the track container */}
                </motion.div>
              </div>
              {/* workaround: use width on the bar wrapper */}
              <style>{`
                .hbar-${i} { width: ${pct}%; }
              `}</style>
              <p className="text-xs mt-0.5" style={{ color: MUTED }}>{bar.sublabel}</p>
            </div>
          );
        })}
      </div>

      {/* Delta badge */}
      <div className="flex items-center gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: ACCENT_DIM, color: ACCENT, border: `1px solid ${ACCENT}40` }}
        >
          ↓ 9.9 pts
        </div>
        <span className="text-xs" style={{ color: MUTED }}>
          28% reduction · Automated root cause analysis
        </span>
      </div>
    </div>
  );
}

// ─── TOP (fixed width bars via separate approach) ────────────────────────────

export function HealthcareTopChartV2() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const bars = [
    { label: 'Before AI', value: 35.5, color: '#475569', sublabel: 'Industry avg denial rate' },
    { label: 'After AI',  value: 25.6, color: ACCENT,    sublabel: '↓28% via root-cause analysis' },
  ];
  const maxVal = 40;

  return (
    <div
      ref={ref}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${BORDER}`, background: 'rgba(0,194,3,0.04)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
          Claim Denial Rate
        </p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: ACCENT_DIM, color: ACCENT, border: `1px solid ${ACCENT}40` }}
        >
          −28%
        </span>
      </div>

      <div className="space-y-4">
        {bars.map((bar, i) => (
          <div key={bar.label}>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs font-medium" style={{ color: TEXT }}>{bar.label}</span>
              <span className="text-base font-bold font-mono" style={{ color: bar.color }}>{bar.value}%</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: bar.color, boxShadow: i === 1 ? `0 0 8px ${ACCENT}60` : 'none' }}
                initial={{ width: '0%' }}
                animate={inView ? { width: `${(bar.value / maxVal) * 100}%` } : { width: '0%' }}
                transition={{ duration: 1.0, delay: i * 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>{bar.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Mini stat row */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
        {[
          { v: '15M+', l: 'Records' },
          { v: '100%', l: 'HIPAA' },
          { v: '$2.4M', l: 'Recovered' },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <p className="text-sm font-bold font-mono" style={{ color: ACCENT }}>{s.v}</p>
            <p className="text-xs" style={{ color: MUTED }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BOTTOM: Multi-Agent Claims Pipeline Flow ─────────────────────────────────

const PIPELINE_NODES = [
  { id: 'inbound',  label: 'Claim\nInbound',     icon: '📥', pct: '100%',  color: '#475569' },
  { id: 'triage',   label: 'AI\nTriage',          icon: '🤖', pct: '↓',    color: '#7C3AED' },
  { id: 'agents',   label: 'Multi-Agent\nAnalysis', icon: '⚙️', pct: '×3',  color: '#2E75B6' },
  { id: 'resolve',  label: 'Auto\nResolve',        icon: '✅', pct: '60%',  color: ACCENT   },
];

export function HealthcareBottomChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${BORDER}`, background: 'rgba(0,194,3,0.03)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
          Claims Processing Pipeline
        </p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: ACCENT_DIM, color: ACCENT, border: `1px solid ${ACCENT}40` }}
        >
          60% Automated
        </span>
      </div>

      {/* Pipeline nodes */}
      <div className="flex items-center justify-between gap-1 mb-4">
        {PIPELINE_NODES.map((node, i) => (
          <div key={node.id} className="flex items-center gap-1 flex-1">
            {/* Node */}
            <motion.div
              className="flex-1 rounded-xl p-2 text-center"
              style={{
                border: `1px solid ${node.color}40`,
                background: `${node.color}10`,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            >
              <div className="text-lg mb-1">{node.icon}</div>
              <p className="text-xs font-semibold leading-tight whitespace-pre-line" style={{ color: node.color }}>
                {node.label}
              </p>
              <p className="text-xs font-bold font-mono mt-1" style={{ color: TEXT }}>{node.pct}</p>
            </motion.div>

            {/* Connector arrow */}
            {i < PIPELINE_NODES.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ delay: i * 0.15 + 0.3, duration: 0.3 }}
                style={{ originX: 0, flexShrink: 0 }}
              >
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path
                    d="M0 6H12M8 2L14 6L8 10"
                    stroke={MUTED}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Throughput bar */}
      <div>
        <div className="flex justify-between text-xs mb-1" style={{ color: MUTED }}>
          <span>Manual workload</span>
          <span>AI-handled</span>
        </div>
        <div className="h-2 w-full rounded-full flex overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            style={{ background: '#475569', height: '100%' }}
            initial={{ width: '100%' }}
            animate={inView ? { width: '40%' } : { width: '100%' }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.div
            style={{ background: ACCENT, height: '100%', boxShadow: `0 0 6px ${ACCENT}80` }}
            initial={{ width: '0%' }}
            animate={inView ? { width: '60%' } : { width: '0%' }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span style={{ color: MUTED }}>40% manual</span>
          <span style={{ color: ACCENT, fontWeight: 600 }}>60% autonomous</span>
        </div>
      </div>
    </div>
  );
}
