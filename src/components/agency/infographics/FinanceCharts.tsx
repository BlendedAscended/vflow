'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ACCENT      = '#2E75B6';
const ACCENT_DIM  = 'rgba(46,117,182,0.08)';
const BORDER      = '#E5E5E0';
const TEXT        = '#111111';
const MUTED       = '#6B7280';
const TEAL        = '#0D9488';
const TEAL_DIM    = 'rgba(13,148,136,0.06)';
const AMBER       = '#D97706';
const AMBER_DIM   = 'rgba(217,119,6,0.06)';
const SLATE       = '#CBD5E1';
const TRACK       = '#F0F0EC';

// ─── TOP: 99.9% Reliability Arc Gauge ────────────────────────────────────────

function ReliabilityArc({ pct, inView }: { pct: number; inView: boolean }) {
  // SVG arc: semi-circle, r=48, center=(60,60), sweep 180°
  const r = 48;
  const cx = 60;
  const cy = 58;
  const circumference = Math.PI * r;          // half-circle arc length
  const filled = (pct / 100) * circumference;
  const gap = circumference - filled;

  // Arc path: start left, sweep right (bottom of semicircle)
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;

  return (
    <svg viewBox="0 0 120 68" className="w-full" style={{ maxHeight: 90 }}>
      {/* Track arc */}
      <path
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
        fill="none"
        stroke="${TRACK}"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Filled arc */}
      <motion.path
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
        fill="none"
        stroke={ACCENT}
        strokeWidth="8"
        strokeLinecap="round"
        style={{
          strokeDasharray: `${circumference}`,
        }}
        initial={{ strokeDashoffset: circumference }}
        animate={inView ? { strokeDashoffset: gap } : { strokeDashoffset: circumference }}
        transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
      />

      {/* Tick marks */}
      {[0, 25, 50, 75, 100].map((tick) => {
        const angle = Math.PI * (1 - tick / 100); // 180° → 0°
        const innerR = r - 10;
        const outerR = r - 6;
        const x1 = cx + innerR * Math.cos(angle);
        const y1 = cy - innerR * Math.sin(angle);
        const x2 = cx + outerR * Math.cos(angle);
        const y2 = cy - outerR * Math.sin(angle);
        return (
          <line
            key={tick}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#D1D5DB"
            strokeWidth="1"
          />
        );
      })}

      {/* Center value */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="16" fontWeight="700"
        fontFamily="monospace" fill={ACCENT}>
        99.9%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="6.5" fill={MUTED}
        fontFamily="sans-serif" letterSpacing="0.5">
        CI/CD SUCCESS
      </text>

      {/* Left / Right labels */}
      <text x={startX - 2} y={cy + 16} textAnchor="middle" fontSize="6" fill={MUTED} fontFamily="monospace">0%</text>
      <text x={endX + 2}  y={cy + 16} textAnchor="middle" fontSize="6" fill={MUTED} fontFamily="monospace">100%</text>
    </svg>
  );
}

export function FinanceTopChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const uptime = [
    { label: 'Q1 2024', value: 99.97 },
    { label: 'Q2 2024', value: 99.91 },
    { label: 'Q3 2024', value: 99.95 },
    { label: 'Q4 2024', value: 99.99 },
  ];
  return (
    <div
      ref={ref}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${BORDER}`, background: 'rgba(46,117,182,0.04)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
          Pipeline Reliability
        </p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: ACCENT_DIM, color: ACCENT, border: `1px solid ${ACCENT}40` }}
        >
          Enterprise-Grade
        </span>
      </div>

      {/* Arc gauge */}
      <ReliabilityArc pct={99.9} inView={inView} />

      {/* Quarterly uptime bars */}
      <div className="grid grid-cols-4 gap-2 mt-2">
        {uptime.map((q, i) => {
          const fillH = ((q.value - 99.8) / 0.2) * 32; // scale 99.8-100 → 0-32px
          return (
            <div key={q.label} className="flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center" style={{ height: 36 }}>
                <motion.div
                  className="w-5 rounded-t-sm"
                  style={{ background: ACCENT, opacity: 0.7 + i * 0.075 }}
                  initial={{ height: 0 }}
                  animate={inView ? { height: Math.max(fillH, 6) } : { height: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs font-mono font-bold" style={{ color: ACCENT }}>{q.value}%</p>
              <p className="text-xs" style={{ color: MUTED }}>{q.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BOTTOM: GenAI Cost Savings Breakdown ─────────────────────────────────────

const COST_ROWS = [
  { label: 'Manual Processing',  before: 100, after: 63, saving: 37, category: 'Operations' },
  { label: 'Compliance Tooling', before: 100, after: 68, saving: 32, category: 'Regulatory' },
  { label: 'Data Pipeline',      before: 100, after: 72, saving: 28, category: 'Engineering' },
  { label: 'Reporting & BI',     before: 100, after: 60, saving: 40, category: 'Analytics' },
];

export function FinanceBottomChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const totalSaving = 35;

  return (
    <div
      ref={ref}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${BORDER}`, background: 'rgba(46,117,182,0.03)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
          GenAI Cost Reduction
        </p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: ACCENT_DIM, color: ACCENT, border: `1px solid ${ACCENT}40` }}
        >
          −35% Total
        </span>
      </div>

      <div className="space-y-3">
        {COST_ROWS.map((row, i) => (
          <div key={row.label}>
            <div className="flex justify-between items-center mb-1">
              <div>
                <span className="text-xs font-medium" style={{ color: TEXT }}>{row.label}</span>
                <span
                  className="ml-2 text-xs px-1.5 py-0.5 rounded"
                  style={{ background: '${TRACK}', color: MUTED }}
                >
                  {row.category}
                </span>
              </div>
              <span className="text-xs font-bold font-mono" style={{ color: ACCENT }}>−{row.saving}%</span>
            </div>

            {/* Stacked bar: after (blue) + saving (lighter) = full 100% */}
            <div className="h-2.5 w-full rounded-full overflow-hidden flex" style={{ background: '${TRACK}' }}>
              {/* Remaining cost (after AI) */}
              <motion.div
                style={{ background: '#334155', height: '100%' }}
                initial={{ width: '100%' }}
                animate={inView ? { width: `${row.after}%` } : { width: '100%' }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              />
              {/* Saved portion */}
              <motion.div
                style={{
                  background: `linear-gradient(90deg, ${ACCENT}80, ${ACCENT})`,
                  height: '100%',
                }}
                initial={{ width: '0%' }}
                animate={inView ? { width: `${row.saving}%` } : { width: '0%' }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total savings summary */}
      <div
        className="flex items-center justify-between mt-4 pt-3 px-3 py-2 rounded-lg"
        style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30` }}
      >
        <div>
          <p className="text-xs font-semibold" style={{ color: TEXT }}>Total Annual Savings</p>
          <p className="text-xs" style={{ color: MUTED }}>Across 4 GenAI deployments</p>
        </div>
        <div className="text-right">
          <motion.p
            className="text-xl font-bold font-mono"
            style={{ color: ACCENT }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
          >
            {totalSaving}%
          </motion.p>
          <p className="text-xs" style={{ color: MUTED }}>Cost reduction</p>
        </div>
      </div>
    </div>
  );
}

// ─── UMD: Utilization Management & Documentation ─────────────────────────────
//
// Prior auth outcome donut  +  Length-of-Stay comparison by DRG category
// ─────────────────────────────────────────────────────────────────────────────

const AUTH_SLICES = [
  { label: 'Auto-Approved',        pct: 67, color: TEAL  },
  { label: 'Peer Review → Apprvd', pct: 24, color: ACCENT },
  { label: 'Denied',               pct:  9, color: SLATE  },
];

/** Builds SVG arc path for a donut slice given start/end angles (radians). */
function donutPath(cx: number, cy: number, r: number, startA: number, endA: number, w: number) {
  const outerR = r;
  const innerR = r - w;
  const x1o = cx + outerR * Math.cos(startA);
  const y1o = cy + outerR * Math.sin(startA);
  const x2o = cx + outerR * Math.cos(endA);
  const y2o = cy + outerR * Math.sin(endA);
  const x1i = cx + innerR * Math.cos(endA);
  const y1i = cy + innerR * Math.sin(endA);
  const x2i = cx + innerR * Math.cos(startA);
  const y2i = cy + innerR * Math.sin(startA);
  const large = endA - startA > Math.PI ? 1 : 0;
  return `M ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o}
          L ${x1i} ${y1i} A ${innerR} ${innerR} 0 ${large} 0 ${x2i} ${y2i} Z`;
}

const LOS_ROWS = [
  { drg: 'Cardiology',  before: 4.2, after: 3.1, unit: 'days' },
  { drg: 'Orthopedics', before: 3.8, after: 2.9, unit: 'days' },
  { drg: 'Oncology',    before: 6.1, after: 5.0, unit: 'days' },
];

export function UMDChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  // Build donut slices (angles in radians, start from -90° = top)
  let cursor = -Math.PI / 2;
  const slices = AUTH_SLICES.map((s) => {
    const sweep = (s.pct / 100) * 2 * Math.PI;
    const start = cursor;
    const end   = cursor + sweep - 0.03; // tiny gap
    cursor = cursor + sweep;
    return { ...s, start, end };
  });

  const CX = 44; const CY = 44; const R = 32; const W = 10;
  const maxLOS = 7;

  return (
    <div
      ref={ref}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${TEAL}30`, background: TEAL_DIM }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
          Utilization Management
        </p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(13,148,136,0.2)', color: TEAL, border: `1px solid ${TEAL}50` }}
        >
          Prior Auth Outcomes
        </span>
      </div>

      <div className="flex gap-4 items-start">
        {/* Donut chart */}
        <div className="flex-shrink-0">
          <svg viewBox="0 0 88 88" width={88} height={88}>
            {slices.map((s, i) => (
              <motion.path
                key={s.label}
                d={donutPath(CX, CY, R, s.start, s.end, W)}
                fill={s.color}
                style={{  }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.5, ease: 'backOut' }}
              />
            ))}
            {/* Centre label */}
            <text x={CX} y={CY - 5} textAnchor="middle" fontSize="10" fontWeight="700"
              fontFamily="monospace" fill={TEAL}>91%</text>
            <text x={CX} y={CY + 8} textAnchor="middle" fontSize="5.5" fill={MUTED}
              fontFamily="sans-serif">APPROVAL</text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 justify-center flex-1">
          {AUTH_SLICES.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: TEXT }}>{s.label}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-1 w-full rounded-full mt-0.5 overflow-hidden"
                  style={{ background: '${TRACK}' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                    initial={{ width: '0%' }}
                    animate={inView ? { width: `${s.pct}%` } : {}}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.7 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* LOS comparison */}
      <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${TEAL}20` }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: TEAL }}>
          Length of Stay Reduction by DRG
        </p>
        <div className="space-y-2.5">
          {LOS_ROWS.map((row, i) => {
            const savePct = Math.round(((row.before - row.after) / row.before) * 100);
            return (
              <div key={row.drg}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium" style={{ color: TEXT }}>{row.drg}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs line-through" style={{ color: MUTED }}>
                      {row.before}d
                    </span>
                    <span className="text-xs font-bold font-mono" style={{ color: TEAL }}>
                      {row.after}d
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(13,148,136,0.15)', color: TEAL }}
                    >
                      −{savePct}%
                    </span>
                  </div>
                </div>
                {/* Before bar */}
                <div className="relative h-2 w-full rounded-full overflow-hidden"
                  style={{ background: '${TRACK}' }}>
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{ background: SLATE }}
                    initial={{ width: '0%' }}
                    animate={inView ? { width: `${(row.before / maxLOS) * 100}%` } : {}}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                  />
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${TEAL}, ${TEAL}CC)`,
                    }}
                    initial={{ width: '0%' }}
                    animate={inView ? { width: `${(row.after / maxLOS) * 100}%` } : {}}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost per episode footer */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${TEAL}20` }}>
        {[
          { v: '$12.4K→$9.8K', l: 'Cost / Episode' },
          { v: '−21%',         l: 'Episode Cost'   },
          { v: '48hr→6hr',     l: 'Auth Turnaround' },
        ].map((s) => (
          <motion.div
            key={s.l}
            className="text-center rounded-lg p-2"
            style={{ background: 'rgba(13,148,136,0.08)', border: `1px solid ${TEAL}20` }}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1 }}
          >
            <p className="text-xs font-bold font-mono leading-tight" style={{ color: TEAL }}>{s.v}</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>{s.l}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── CDS: Clinical Decision Support ROI ──────────────────────────────────────
//
// Horizontal adherence bars per alert category  +  cost-avoidance bubbles
// ─────────────────────────────────────────────────────────────────────────────

const CDS_ROWS = [
  { category: 'Treatment Protocol',  adherence: 76, avoided: 520, icon: '🏥' },
  { category: 'Drug Interactions',   adherence: 94, avoided: 340, icon: '💊' },
  { category: 'Clinical Documenting',adherence: 91, avoided: 290, icon: '📋' },
  { category: 'Duplicate Orders',    adherence: 87, avoided: 180, icon: '🔁' },
];
const MAX_AVOIDED = 600;
const TOTAL_AVOIDED = CDS_ROWS.reduce((s, r) => s + r.avoided, 0);

export function CDSChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${AMBER}30`, background: AMBER_DIM }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: AMBER }}>
          Clinical Decision Support ROI
        </p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(217,119,6,0.2)', color: AMBER, border: `1px solid ${AMBER}50` }}
        >
          $1.33M Avoided
        </span>
      </div>

      {/* Per-category rows */}
      <div className="space-y-3 mb-4">
        {CDS_ROWS.map((row, i) => (
          <motion.div
            key={row.category}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">{row.icon}</span>
              <span className="text-xs font-medium flex-1" style={{ color: TEXT }}>{row.category}</span>
              {/* Adherence pill */}
              <span
                className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: `${row.adherence >= 90 ? TEAL : AMBER}18`,
                  color: row.adherence >= 90 ? TEAL : AMBER,
                  border: `1px solid ${row.adherence >= 90 ? TEAL : AMBER}40`,
                }}
              >
                {row.adherence}%
              </span>
              {/* Cost avoidance */}
              <span className="text-xs font-bold font-mono" style={{ color: AMBER }}>
                ${row.avoided}K
              </span>
            </div>

            {/* Dual bar: adherence (top) + cost avoidance (bottom) */}
            <div className="space-y-1">
              {/* Adherence bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-right flex-shrink-0" style={{ color: MUTED }}>
                  Adherence
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: '${TRACK}' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: row.adherence >= 90 ? TEAL : AMBER,
                    }}
                    initial={{ width: '0%' }}
                    animate={inView ? { width: `${row.adherence}%` } : {}}
                    transition={{ delay: 0.4 + i * 0.12, duration: 0.8, ease: [0.25,0.1,0.25,1] }}
                  />
                </div>
              </div>

              {/* Cost avoidance bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-right flex-shrink-0" style={{ color: MUTED }}>
                  Savings
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: '${TRACK}' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${AMBER}80, ${AMBER})`,
                    }}
                    initial={{ width: '0%' }}
                    animate={inView ? { width: `${(row.avoided / MAX_AVOIDED) * 100}%` } : {}}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.8, ease: [0.25,0.1,0.25,1] }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bubble legend — cost avoidance scale */}
      <div className="pt-3" style={{ borderTop: `1px solid ${AMBER}20` }}>
        <p className="text-xs mb-2" style={{ color: MUTED }}>Annual cost avoidance breakdown</p>
        <div className="flex items-end justify-around">
          {CDS_ROWS.map((row, i) => {
            const size = 16 + (row.avoided / MAX_AVOIDED) * 28;
            return (
              <motion.div
                key={row.category}
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 200 }}
              >
                <div
                  className="rounded-full flex items-center justify-center font-bold font-mono"
                  style={{
                    width: size,
                    height: size,
                    background: `${AMBER}20`,
                    border: `1.5px solid ${AMBER}60`,
                    color: AMBER,
                    fontSize: size > 32 ? 9 : 7,
                  }}
                >
                  ${row.avoided}K
                </div>
                <span className="text-xs text-center leading-tight" style={{ color: MUTED, maxWidth: 52 }}>
                  {row.icon}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Total */}
        <motion.div
          className="flex items-center justify-between mt-3 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(217,119,6,0.12)', border: `1px solid ${AMBER}30` }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
        >
          <div>
            <p className="text-xs font-semibold" style={{ color: TEXT }}>Total Cost Avoidance</p>
            <p className="text-xs" style={{ color: MUTED }}>4 CDS alert categories · annual</p>
          </div>
          <p className="text-lg font-bold font-mono" style={{ color: AMBER }}>
            ${(TOTAL_AVOIDED / 1000).toFixed(2)}M
          </p>
        </motion.div>
      </div>
    </div>
  );
}
