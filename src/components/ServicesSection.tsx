'use client';

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { services as defaultServiceDefs, serviceCategories, type ServiceCategory } from '../data/services';
import ServicesHoverReveal from './ui/ServicesHoverReveal';
import DNATriptych from './dna/DNATriptych';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  featured?: boolean;
  active?: boolean;
  slug?: string;
  category?: string;
  shortLabel?: string;
}
interface ServicesSectionProps { services?: Service[] }

// ─── DNA Helix constants ───────────────────────────────────────────────────────
const CYCLES    = 4;
const SVG_W     = 300;
const SVG_H     = 700;
const CX        = 150;           // horizontal centre of helix
const ACCENT_HX = '#A5D6A7';    // matches --accent CSS variable

// ─── DNA Math: Hermite → Bezier sine-wave path ────────────────────────────────
function buildStrandPath(amplitude: number, phase: number, segments = 60): string {
  const totalAngle = CYCLES * 2 * Math.PI;
  const dt = totalAngle / segments;
  const dy = SVG_H / segments;

  const pts: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i * dt;
    pts.push([CX + amplitude * Math.sin(t + phase), i * dy]);
  }

  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < segments; i++) {
    const t0 = i * dt;
    const t1 = (i + 1) * dt;
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const s = dt / 3; // Hermite→Bezier tangent scale
    const cp1x = (x0 + amplitude * Math.cos(t0 + phase) * s).toFixed(2);
    const cp1y = (y0 + dy / 3).toFixed(2);
    const cp2x = (x1 - amplitude * Math.cos(t1 + phase) * s).toFixed(2);
    const cp2y = (y1 - dy / 3).toFixed(2);
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  return d;
}

function buildRungs(amplitude: number, spacing = 35) {
  const totalAngle = CYCLES * 2 * Math.PI;
  const opacities = [0.35, 0.15, 0.08];
  const count = Math.floor(SVG_H / spacing);
  const result: { x1: number; y: number; x2: number; opacity: number }[] = [];
  for (let i = 1; i < count; i++) {
    const y = i * spacing;
    const t = (y / SVG_H) * totalAngle;
    const xa = CX + amplitude * Math.sin(t);
    const xb = CX + amplitude * Math.sin(t + Math.PI);
    result.push({ x1: Math.min(xa, xb), y, x2: Math.max(xa, xb), opacity: opacities[i % 3] });
  }
  return result;
}

// ─── Pricing data ─────────────────────────────────────────────────────────────
const BASE_PRICE: Record<string, [number, number]> = {
  'AI & Automation':    [295, 500],
  'Marketing Campaigns':[395, 800],
  'Website / App Dev':  [195, 400],
  'Cloud & IT':         [495, 900],
  'Multiple Services':  [800, 1800],
};
const SCALE_MULT: Record<string, number> = {
  'Solo / Freelancer':    1,
  'Small Team (2–10)':    1.7,
  'Growing Co. (10–50)':  2.8,
  'Enterprise (50+)':     5,
};
const TIME_MULT: Record<string, number> = {
  'This week': 1.3, 'Within a month': 1, 'Next quarter': 0.9, 'Just exploring': 1,
};
const SLUG_TO_SVC: Record<string, string> = {
  'website-development': 'Website / App Dev',
  'software-development':'Website / App Dev',
  'mobile-apps':         'Website / App Dev',
  'ecommerce':           'Website / App Dev',
  'digital-marketing':   'Marketing Campaigns',
  'ai-automation':       'AI & Automation',
  'insurance-agents':    'AI & Automation',
  'hiring-agents':       'AI & Automation',
  'ai-architecture':     'AI & Automation',
  'compliance':          'Cloud & IT',
  'cloud-solutions':     'Cloud & IT',
};
const ICON_TO_PRICE: Record<string, string> = {
  website: 'From $195', marketing: 'From $495', ai: 'From $295', cloud: 'From $495',
};
const ICON_TO_CATEGORY: Record<string, string> = {
  website:   'DIGITAL PRESENCE',
  marketing: 'GROWTH MARKETING',
  ai:        'ARTIFICIAL INTELLIGENCE',
  cloud:     'INFRASTRUCTURE',
};
const TITLE_TO_SHORT: Record<string, string> = {
  'Website & app development':   'Web & Apps',
  'Marketing & social campaigns':'Marketing',
  'AI Assistants & Automation':  'AI & Auto',
  'Cloud, IT & Compliance':      'Cloud & IT',
};
// Icon-based fallback (more reliable when Sanity titles differ in casing)
const ICON_TO_SHORT: Record<string, string> = {
  website: 'Web & Apps', marketing: 'Marketing', ai: 'AI & Auto', cloud: 'Cloud & IT',
};

function calcPrice(svc: string, scale: string, timeline: string): [number, number] {
  const base = BASE_PRICE[svc] ?? [300, 600];
  const sm = SCALE_MULT[scale] ?? 1;
  const tm = TIME_MULT[timeline] ?? 1;
  return [Math.round(base[0] * sm * tm), Math.round(base[1] * sm * tm)];
}

// ─── Quiz steps ───────────────────────────────────────────────────────────────
const QUIZ_STEPS = [
  {
    label: 'SERVICE',
    question: 'Which service do you need?',
    options: ['AI & Automation', 'Marketing Campaigns', 'Website / App Dev', 'Cloud & IT', 'Multiple Services'],
  },
  {
    label: 'SCALE',
    question: 'What scale are you operating at?',
    options: ['Solo / Freelancer', 'Small Team (2–10)', 'Growing Co. (10–50)', 'Enterprise (50+)'],
  },
  {
    label: 'TIMELINE',
    question: 'When do you want to kick off?',
    options: ['This week', 'Within a month', 'Next quarter', 'Just exploring'],
  },
];

// ─── Service icon ─────────────────────────────────────────────────────────────
function ServiceIcon({ type }: { type?: string }) {
  const cls = 'w-5 h-5 text-[var(--accent-foreground)]';
  switch (type) {
    case 'website':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
    case 'marketing':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;
    case 'ai':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case 'cloud':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
    default:
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
  }
}

// ─── Metric cards data ────────────────────────────────────────────────────────
const METRICS = [
  { label: 'REVENUE GROWTH',  value: '+24.5%', sub: '↑ 12.3% vs last qtr', side: 'right' as const, topPct: 8  },
  { label: 'ACTIVE CLIENTS',  value: '48',     sub: '↑ 8 this month',       side: 'left'  as const, topPct: 35 },
  { label: 'CONVERSION RATE', value: '3.8%',   sub: '↑ 5.1% vs last qtr',  side: 'right' as const, topPct: 55 },
  { label: 'PERFORMANCE',     value: '94/100', sub: '↑ 3.4% this week',    side: 'left'  as const, topPct: 76 },
];

// ─── Protein node SVG shape ────────────────────────────────────────────────────
function ProteinNode({
  cx, cy, label, onClick,
}: { cx: number; cy: number; label: string; onClick: () => void }) {
  return (
    <motion.g
      style={{ cursor: 'pointer' }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      aria-label={`Open pricing quiz for ${label}`}
    >
      {/* Outer glow ellipse */}
      <ellipse cx={cx} cy={cy} rx={62} ry={26} fill={ACCENT_HX} opacity={0.10} />
      {/* Mid glow */}
      <ellipse cx={cx} cy={cy} rx={56} ry={21} fill={ACCENT_HX} opacity={0.07} />
      {/* Main body */}
      <ellipse cx={cx} cy={cy} rx={52} ry={18} fill="var(--section-bg-3)" stroke={ACCENT_HX} strokeWidth={1.8} opacity={0.97} />
      {/* Inner ring */}
      <ellipse cx={cx} cy={cy} rx={43} ry={12} fill="none" stroke={ACCENT_HX} strokeWidth={1} opacity={0.40} />
      {/* Surface fold bezier A */}
      <path d={`M ${cx - 34} ${cy - 7} Q ${cx} ${cy - 16} ${cx + 34} ${cy - 7}`} fill="none" stroke={ACCENT_HX} strokeWidth={0.9} opacity={0.25} />
      {/* Surface fold bezier B */}
      <path d={`M ${cx - 26} ${cy + 5} Q ${cx} ${cy + 11} ${cx + 26} ${cy + 5}`} fill="none" stroke={ACCENT_HX} strokeWidth={0.9} opacity={0.16} />
      {/* Label */}
      <text
        x={cx} y={cy + 0.5}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="9.5" fontWeight="700" fill={ACCENT_HX}
        letterSpacing="0.8" style={{ fontFamily: 'var(--font-geist-sans, sans-serif)' }}
      >
        {label}
      </text>
    </motion.g>
  );
}

// ─── Strand triple-layer renderer ─────────────────────────────────────────────
interface StrandProps {
  path: string;
  isInView: boolean;
  helixPhase: 'drawing' | 'idle';
  drawDelay: number;
}

function Strand({ path, isInView, helixPhase, drawDelay }: StrandProps) {
  const layers = [
    { width: 1, translateX: 4, opacity: 0.08, idleOp: [0.06, 0.10, 0.06] },
    { width: 2, translateX: 2, opacity: 0.20, idleOp: [0.16, 0.24, 0.16] },
    { width: 4, translateX: 0, opacity: 0.60, idleOp: [0.50, 0.68, 0.50] },
  ];
  return (
    <g>
      {layers.map((l, li) => (
        <motion.path
          key={li}
          d={path}
          fill="none"
          stroke={ACCENT_HX}
          strokeWidth={l.width}
          strokeLinecap="round"
          transform={l.translateX ? `translate(${l.translateX}, 0)` : undefined}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            !isInView ? {}
            : helixPhase === 'drawing'
              ? { pathLength: 1, opacity: l.opacity }
              : { opacity: l.idleOp }
          }
          transition={
            helixPhase === 'drawing'
              ? { duration: 2, ease: 'easeInOut', delay: drawDelay + li * 0.04 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
          }
        />
      ))}
    </g>
  );
}

// ─── DNA Helix Visualization ───────────────────────────────────────────────────
interface HelixProps {
  services: Service[];
  amplitude: number;
  onProteinClick: (svc: Service) => void;
}

function HelixVisualization({ services, amplitude, onProteinClick }: HelixProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [helixPhase, setHelixPhase] = useState<'drawing' | 'idle'>('drawing');

  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => setHelixPhase('idle'), 2300);
    return () => clearTimeout(t);
  }, [isInView]);

  const path1 = useMemo(() => buildStrandPath(amplitude, 0), [amplitude]);
  const path2 = useMemo(() => buildStrandPath(amplitude, Math.PI), [amplitude]);
  const rungList = useMemo(() => buildRungs(amplitude, 35), [amplitude]);

  // Protein positions: evenly spaced along SVG_H, centred on the X axis
  const proteinCount = Math.min(services.length, 4);
  const proteins = services.slice(0, proteinCount).map((svc, i) => ({
    svc,
    cy: SVG_H * ((i + 1) / (proteinCount + 1)),
    label: svc.shortLabel ?? TITLE_TO_SHORT[svc.title] ?? ICON_TO_SHORT[svc.icon ?? ''] ?? svc.title.split(' ').slice(0, 2).join(' '),
  }));

  return (
    <div ref={ref} className="relative w-full h-full">

      {/* Metric cards – absolute HTML overlaid on the SVG */}
      {METRICS.map((m, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-10"
          style={{
            top: `${m.topPct}%`,
            ...(m.side === 'left' ? { left: 0 } : { right: 0 }),
          }}
          initial={{ opacity: 0, scale: 0.9, x: m.side === 'right' ? 16 : -16 }}
          animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ delay: 2.4 + i * 0.2, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          whileHover={{ y: -2 }}
        >
          <div className="bg-[var(--section-bg-3)]/90 backdrop-blur-sm border border-[var(--border)] rounded-2xl px-3.5 py-2.5 min-w-[130px] shadow-lg">
            <div className="text-[8px] font-bold uppercase tracking-widest mb-1 opacity-50"
              style={{ color: 'var(--text-accent)' }}>
              {m.label}
            </div>
            <div className="text-2xl font-extrabold leading-none mb-0.5" style={{ color: ACCENT_HX }}>
              {m.value}
            </div>
            <div className="text-[10px] opacity-55" style={{ color: 'var(--text-accent)' }}>
              {m.sub}
            </div>
          </div>
        </motion.div>
      ))}

      {/* SVG helix – centered, full height */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="mx-auto h-full"
        style={{ width: '55%', minWidth: 160, overflow: 'visible' }}
      >
        {/* Base-pair rungs */}
        <g>
          {rungList.map((r, i) => (
            <motion.line
              key={i}
              x1={r.x1} y1={r.y} x2={r.x2} y2={r.y}
              stroke={ACCENT_HX}
              strokeWidth={0.8}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: r.opacity, scaleX: 1 } : {}}
              transition={{ delay: 2 + i * 0.008, duration: 0.25 }}
              style={{ transformOrigin: `${(r.x1 + r.x2) / 2}px ${r.y}px` }}
            />
          ))}
        </g>

        {/* Strand 1 – three layers */}
        <Strand path={path1} isInView={isInView} helixPhase={helixPhase} drawDelay={0} />
        {/* Strand 2 – three layers */}
        <Strand path={path2} isInView={isInView} helixPhase={helixPhase} drawDelay={0.15} />

        {/* Protein nodes */}
        {proteins.map((p, i) => (
          <motion.g
            key={p.svc._id}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.9 + i * 0.22, type: 'spring', stiffness: 220, damping: 18 }}
          >
            <ProteinNode
              cx={CX}
              cy={p.cy}
              label={p.label}
              onClick={() => onProteinClick(p.svc)}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

// ─── Shared quiz body (used inline on desktop + modal on mobile) ──────────────
interface QuizBodyProps {
  step: number;
  answers: string[];
  showResult: boolean;
  onSelect: (opt: string) => void;
  onAdvance: () => void;
  onReset: () => void;
  onClose?: () => void;
}

function QuizBody({ step, answers, showResult, onSelect, onAdvance, onReset, onClose }: QuizBodyProps) {
  const current = QUIZ_STEPS[step];
  const chosen = answers[step];
  const isRush = answers[2] === 'This week';
  const [pMin, pMax] = showResult ? calcPrice(answers[0], answers[1], answers[2]) : [0, 0];
  const CAL_URL = 'https://cal.com/sandeep-singh/30min';

  return (
    <>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: ACCENT_HX }}>
              Individual Service Pricing
            </p>
            <h3 className="text-[var(--text-secondary)] text-lg font-bold leading-snug">
              3 Questions → Your Price &amp; Meeting
            </h3>
          </div>
          <div className="flex gap-2 mt-0.5">
            {showResult && (
              <button onClick={onReset} className="text-[var(--text-accent)] opacity-50 hover:opacity-90 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
              </button>
            )}
            {onClose && (
              <button onClick={onClose} className="text-[var(--text-accent)] opacity-50 hover:opacity-90 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!showResult && (
          <div className="mt-4 space-y-1.5">
            <div className="flex gap-1.5">
              {QUIZ_STEPS.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-500"
                  style={{ background: i <= step ? ACCENT_HX : 'var(--border)' }} />
              ))}
            </div>
            <div className="flex">
              {QUIZ_STEPS.map((s, i) => (
                <div key={i} className="flex-1 text-[8px] font-bold uppercase tracking-wider transition-colors duration-300"
                  style={{ color: i <= step ? ACCENT_HX : 'var(--text-accent)', opacity: i <= step ? 1 : 0.35 }}>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-sm text-[var(--text-accent)] mb-4">{current.question}</p>
              <div className="space-y-2">
                {current.options.map(opt => {
                  const active = chosen === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => onSelect(opt)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all duration-200 text-left text-sm font-medium"
                      style={{
                        borderColor: active ? ACCENT_HX : 'var(--border)',
                        background: active ? `${ACCENT_HX}18` : 'transparent',
                        color: active ? ACCENT_HX : 'var(--text-accent)',
                      }}
                    >
                      {opt}
                      {active && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT_HX} strokeWidth={2.5}>
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
            >
              <div className="rounded-2xl p-5 mb-3 text-center border border-[var(--border)]"
                style={{ background: 'var(--section-bg-2)' }}>
                <p className="text-[9px] uppercase tracking-widest font-bold mb-2 opacity-60" style={{ color: 'var(--text-accent)' }}>
                  Estimated Investment
                </p>
                <p className="text-4xl font-extrabold leading-none mb-2" style={{ color: ACCENT_HX }}>
                  ${pMin.toLocaleString()} – ${pMax.toLocaleString()}
                </p>
                <p className="text-[11px] opacity-55 mb-3" style={{ color: 'var(--text-accent)' }}>
                  {answers[0]} · {answers[1]}
                </p>
                {isRush && (
                  <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full">
                    🔥 Rush rate applies
                  </span>
                )}
              </div>

              <div className="rounded-2xl px-4 py-3 mb-3 flex items-center gap-3 border border-[var(--border)]"
                style={{ background: 'var(--section-bg-2)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ACCENT_HX}22` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT_HX} strokeWidth={2}>
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>30-min Discovery Call</p>
                  <p className="text-[11px] opacity-55" style={{ color: 'var(--text-accent)' }}>Quick overview &amp; fit check</p>
                </div>
              </div>

              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: ACCENT_HX, color: 'var(--accent-foreground)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book on cal.com
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>

              <button onClick={onReset}
                className="w-full mt-3 text-center text-[11px] opacity-40 hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-accent)' }}>
                ↺ Start over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next / Calculate footer */}
      {!showResult && (
        <div className="px-6 pb-6">
          <button
            onClick={onAdvance}
            disabled={!chosen}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: chosen ? ACCENT_HX : 'var(--border)',
              color: chosen ? 'var(--accent-foreground)' : 'var(--text-accent)',
              opacity: chosen ? 1 : 0.5,
              cursor: chosen ? 'pointer' : 'not-allowed',
            }}
          >
            {step < 2 ? 'Next' : 'Calculate My Price'}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

// ─── Inline quiz panel (desktop right column) ─────────────────────────────────
interface InlinePanelProps {
  step: number;
  answers: string[];
  showResult: boolean;
  onSelect: (opt: string) => void;
  onAdvance: () => void;
  onReset: () => void;
}

function InlinePricingPanel(props: InlinePanelProps) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-[var(--border)] overflow-hidden"
      style={{ background: 'var(--section-bg-3)', minHeight: 420 }}
    >
      <QuizBody {...props} />
    </div>
  );
}

// ─── Pricing Quiz Modal (mobile) ──────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledSlug?: string;
}

function PricingModal({ isOpen, onClose, prefilledSlug }: ModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [showResult, setShowResult] = useState(false);

  const reset = useCallback(() => {
    setStep(0);
    setAnswers(['', '', '']);
    setShowResult(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const mapped = SLUG_TO_SVC[prefilledSlug ?? ''] ?? '';
      if (mapped) {
        setAnswers([mapped, '', '']);
        setStep(1);
      } else {
        reset();
      }
    }
  }, [isOpen, prefilledSlug, reset]);

  function select(opt: string) {
    const next = [...answers];
    next[step] = opt;
    setAnswers(next);
  }

  function advance() {
    if (step < 2) setStep(s => s + 1);
    else setShowResult(true);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col pointer-events-auto"
            style={{ width: 'min(420px, 92vw)', background: 'var(--section-bg-3)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <QuizBody
              step={step}
              answers={answers}
              showResult={showResult}
              onSelect={select}
              onAdvance={advance}
              onReset={reset}
              onClose={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main ServicesSection ──────────────────────────────────────────────────────
const ServicesSection = ({ services }: ServicesSectionProps) => {
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizSlug, setQuizSlug] = useState<string | undefined>();

  // Inline panel state (desktop right column)
  const [panelStep, setPanelStep] = useState(0);
  const [panelAnswers, setPanelAnswers] = useState<string[]>(['', '', '']);
  const [panelResult, setPanelResult] = useState(false);

  const resetPanel = useCallback(() => {
    setPanelStep(0);
    setPanelAnswers(['', '', '']);
    setPanelResult(false);
  }, []);

  function panelSelect(opt: string) {
    const next = [...panelAnswers];
    next[panelStep] = opt;
    setPanelAnswers(next);
  }

  function panelAdvance() {
    if (panelStep < 2) setPanelStep(s => s + 1);
    else setPanelResult(true);
  }

  const defaultServices: Service[] = defaultServiceDefs.map(s => ({
    _id: s._id,
    title: s.title,
    icon: s.icon,
    slug: s.slug,
    description: s.description,
    features: s.features.slice(0, 3),
    price: s.price,
    category: s.category,
    shortLabel: s.shortLabel,
  }));

  const allServices = services && services.length > 0 ? services : defaultServices;

  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All');
  const displayServices = activeCategory === 'All'
    ? allServices
    : allServices.filter(s => s.category === activeCategory);

  function openQuiz(svc: Service) {
    // On mobile → open drawer modal
    setQuizSlug(svc.slug);
    setQuizOpen(true);
    // On desktop → pre-fill the inline panel to step 1 with this service
    const mapped = SLUG_TO_SVC[svc.slug ?? ''] ?? '';
    if (mapped) {
      setPanelAnswers([mapped, '', '']);
      setPanelStep(1);
      setPanelResult(false);
    } else {
      resetPanel();
    }
  }

  return (
    <section id="services" className="w-full bg-[var(--section-bg-2)] text-[var(--text-secondary)] py-16 lg:py-24 relative overflow-hidden">

      {/* Background decorations */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-30"
        style={{ backgroundImage: 'url(/bg-section-gemini.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      />

      {/* WebGL circuit-board hover reveal — z-0, behind all content */}
      <ServicesHoverReveal className="absolute inset-0 z-[1]" />

      <div className="absolute top-10 right-16 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-10 left-8 w-64 h-64 bg-[var(--accent)]/8 rounded-full blur-3xl animate-float pointer-events-none" />

      {/* Headings — above waterfall beam */}
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-20">

        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="inline-block mb-5 pt-2">
            <div
              className="text-[var(--accent)] text-xs font-bold uppercase tracking-wider bg-[var(--accent)]/10 pl-10 pr-6 py-2.5 rounded-r-2xl w-fit mx-auto"
              style={{ clipPath: 'polygon(1.2rem 50%, 0 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              Where strategy, technology, and automation converge, predictable growth emerges.
            </div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-secondary)] mb-4 leading-tight">
            Build a Smarter, <span className="gradient-text"> Stronger Brand.</span>
          </h2>
          <p className="text-[var(--text-accent)] opacity-70 text-lg max-w-xl mx-auto mb-6">
            Click any node on the helix or a service card to get your custom price estimate.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-stretch gap-2 max-w-2xl mx-auto text-xs">
            <div className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--section-bg-3)]">
              <span className="font-bold uppercase tracking-widest opacity-60" style={{ color: ACCENT_HX }}>À-la-carte · this page</span>
              <span className="block opacity-70 mt-0.5" style={{ color: 'var(--text-accent)' }}>Pick one service. Per-project pricing from $195.</span>
            </div>
            <a href="/growth-plan" className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[var(--accent)]/60 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition-all">
              <span className="font-bold uppercase tracking-widest" style={{ color: ACCENT_HX }}>Growth Plan · $19 →</span>
              <span className="block opacity-80 mt-0.5" style={{ color: 'var(--text-accent)' }}>Funded transformation track · wireframe + tech stack.</span>
            </a>
          </div>
        </div>
      </div>

      {/* DNA Triptych: three holographic 3D helices */}
      <DNATriptych />

      {/* Content — below waterfall beam */}
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Two-column layout: services left, helix right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_500px] gap-6 lg:gap-10 items-start">

          {/* ── Left: service cards ── */}
          <div className="space-y-3">
            {/* Column header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--text-accent)' }}>
                Services
              </span>
              <button
                onClick={() => { setQuizSlug(undefined); setQuizOpen(true); }}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-[var(--accent)]/40 transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
                style={{ color: ACCENT_HX }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                </svg>
                Get My Price
              </button>
            </div>

            {/* Category filter chips */}
            <div className="flex flex-wrap gap-1.5 mb-3 px-1">
              {(['All', ...serviceCategories] as const).map(cat => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200"
                    style={{
                      borderColor: active ? ACCENT_HX : 'var(--border)',
                      background: active ? `${ACCENT_HX}1f` : 'transparent',
                      color: active ? ACCENT_HX : 'var(--text-accent)',
                      opacity: active ? 1 : 0.7,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {displayServices.map((svc, i) => {
              const category = (svc.category ?? ICON_TO_CATEGORY[svc.icon ?? ''] ?? 'SERVICES').toUpperCase();
              const displayPrice = svc.price ?? ICON_TO_PRICE[svc.icon ?? ''] ?? '';
              return (
                <motion.div
                  key={svc._id}
                  className="group rounded-2xl border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent)]/60 hover:shadow-lg overflow-hidden"
                  style={{ background: i % 2 === 0 ? 'var(--section-bg-3)' : 'var(--section-bg-2)' }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.005 }}
                >
                  <div className="p-5 lg:p-6">
                    {/* Top row: category + price */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: ACCENT_HX }}>
                          <ServiceIcon type={svc.icon} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-55"
                          style={{ color: ACCENT_HX }}>
                          {category}
                        </span>
                      </div>
                      {displayPrice && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-xl border border-[var(--accent)]/30"
                          style={{ color: ACCENT_HX, background: `${ACCENT_HX}12` }}>
                          {displayPrice}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-2 leading-snug">
                      {svc.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[var(--text-accent)] text-sm leading-relaxed mb-4 opacity-80">
                      {svc.description}
                    </p>

                    {/* Features */}
                    {svc.features && svc.features.length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        {svc.features.slice(0, 3).map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke={ACCENT_HX} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                            </svg>
                            <span className="text-xs" style={{ color: 'var(--text-accent)', opacity: 0.75 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA row */}
                    <div className="flex items-center gap-3">
                      <a
                        href={svc.slug ? `/services/${svc.slug}` : (svc.ctaLink ?? '#contact')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90"
                        style={{ background: 'var(--muted-foreground)', color: 'var(--section-bg-1)' }}
                      >
                        Learn More
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </a>
                      <button
                        onClick={() => openQuiz(svc)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-200 hover:bg-[var(--accent)]/10"
                        style={{ borderColor: `${ACCENT_HX}50`, color: ACCENT_HX }}
                      >
                        Get Started →
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Right: inline pricing quiz ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--text-accent)' }}>
                  Individual Service Pricing
                </span>
                <span className="text-[9px] font-medium opacity-40 italic" style={{ color: 'var(--text-accent)' }}>
                  Scroll to explore · tap + to add
                </span>
              </div>

              <InlinePricingPanel
                step={panelStep}
                answers={panelAnswers}
                showResult={panelResult}
                onSelect={panelSelect}
                onAdvance={panelAdvance}
                onReset={resetPanel}
              />
            </div>
          </div>
        </div>

        {/* Mobile CTA for quiz (below cards on small screens) */}
        <div className="mt-8 text-center lg:hidden">
          <button
            onClick={() => { setQuizSlug(undefined); setQuizOpen(true); }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90"
            style={{ background: ACCENT_HX, color: 'var(--accent-foreground)' }}
          >
            Get My Custom Price Estimate
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Pricing quiz modal */}
      <PricingModal
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        prefilledSlug={quizSlug}
      />
    </section>
  );
};

export default ServicesSection;
