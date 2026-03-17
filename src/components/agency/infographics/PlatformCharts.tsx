'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const PURPLE     = '#7C3AED';
const PURPLE_DIM = 'rgba(124,58,237,0.10)';
const BORDER     = 'rgba(255,255,255,0.08)';
const TEXT       = '#F3F4F6';
const MUTED      = '#64748B';

// per-category palette
const CAT_COLORS = {
  cloud:       '#7C3AED',
  aiml:        '#F59E0B',
  data:        '#06B6D4',
  healthAI:    '#00c203',
  devPlatform: '#2E75B6',
};

const STACK_CATEGORIES = [
  {
    key: 'cloud',
    label: 'Cloud Infrastructure',
    icon: '☁️',
    color: CAT_COLORS.cloud,
    tools: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Databricks'],
  },
  {
    key: 'aiml',
    label: 'AI / ML Stack',
    icon: '🧠',
    color: CAT_COLORS.aiml,
    tools: ['vLLM', 'Autogen', 'LangChain', 'PyTorch', 'RAG'],
  },
  {
    key: 'data',
    label: 'Data Platform',
    icon: '📊',
    color: CAT_COLORS.data,
    tools: ['Spark', 'Airflow', 'Kafka', 'Snowflake', 'Delta Lake'],
  },
  {
    key: 'healthAI',
    label: 'Healthcare AI',
    icon: '🏥',
    color: CAT_COLORS.healthAI,
    tools: ['Epic AI', 'Azure Health', 'Glinear', 'FHIR R4', 'Clinical NLP'],
  },
  {
    key: 'devPlatform',
    label: 'Dev Platform',
    icon: '💻',
    color: CAT_COLORS.devPlatform,
    tools: ['React', 'Next.js', 'Go', 'TypeScript', 'FastAPI'],
  },
];

// ─── TOP: Tech Stack Command Center ──────────────────────────────────────────

export function PlatformTopChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${PURPLE}30`, background: PURPLE_DIM }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: PURPLE }}>
          Tech Stack Command Center
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#00c203', boxShadow: '0 0 6px #00c20380' }}
          />
          <span className="text-xs font-mono" style={{ color: MUTED }}>5 LAYERS · LIVE</span>
        </div>
      </div>

      {/* Category grid — 2 top + 3 bottom */}
      <div className="space-y-2">
        {/* Row 1: Cloud + AI/ML */}
        <div className="grid grid-cols-2 gap-2">
          {STACK_CATEGORIES.slice(0, 2).map((cat, ci) => (
            <CategoryTile key={cat.key} cat={cat} delay={ci * 0.08} inView={inView} />
          ))}
        </div>
        {/* Row 2: Data + HealthAI + Dev */}
        <div className="grid grid-cols-3 gap-2">
          {STACK_CATEGORIES.slice(2).map((cat, ci) => (
            <CategoryTile key={cat.key} cat={cat} delay={0.2 + ci * 0.08} inView={inView} />
          ))}
        </div>
      </div>

      {/* Convergence label */}
      <motion.div
        className="mt-3 px-3 py-2 rounded-lg flex items-center justify-between"
        style={{ background: 'rgba(124,58,237,0.08)', border: `1px solid ${PURPLE}25` }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
      >
        <span className="text-xs" style={{ color: MUTED }}>25 tools · 5 layers · unified under one practice</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${PURPLE}20`, color: PURPLE, border: `1px solid ${PURPLE}40` }}
        >
          Full Stack
        </span>
      </motion.div>
    </div>
  );
}

function CategoryTile({
  cat,
  delay,
  inView,
}: {
  cat: (typeof STACK_CATEGORIES)[0];
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      className="rounded-lg p-2.5"
      style={{
        border: `1px solid ${cat.color}30`,
        background: `${cat.color}08`,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      {/* Category header */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm leading-none">{cat.icon}</span>
        <span className="text-xs font-semibold truncate" style={{ color: cat.color }}>
          {cat.label}
        </span>
      </div>
      {/* Tool badges */}
      <div className="flex flex-wrap gap-1">
        {cat.tools.map((tool, ti) => (
          <motion.span
            key={tool}
            className="text-xs px-1.5 py-0.5 rounded font-mono"
            style={{
              background: `${cat.color}12`,
              border: `1px solid ${cat.color}30`,
              color: TEXT,
              fontSize: '10px',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: delay + 0.1 + ti * 0.05 }}
          >
            {tool}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── BOTTOM: Ops Intelligence Dashboard ──────────────────────────────────────

const OPS_METRICS = [
  {
    label: 'Deploy Time',
    value: '45min',
    delta: '−91%',
    context: 'was 8 hours',
    color: CAT_COLORS.cloud,
    barPct: 91,
  },
  {
    label: 'AI Accuracy',
    value: '95%',
    delta: '+95%',
    context: 'RAG document pipeline',
    color: CAT_COLORS.aiml,
    barPct: 95,
  },
  {
    label: 'Cloud Cost',
    value: '−17.5%',
    delta: 'saved',
    context: 'reserved + right-sizing',
    color: CAT_COLORS.data,
    barPct: 17,
  },
  {
    label: 'Inference Latency',
    value: '−40%',
    delta: 'faster',
    context: 'model optimization',
    color: CAT_COLORS.aiml,
    barPct: 40,
  },
  {
    label: 'CI/CD Reliability',
    value: '99.9%',
    delta: 'uptime',
    context: 'across all pipelines',
    color: CAT_COLORS.devPlatform,
    barPct: 99,
  },
  {
    label: 'Security Incidents',
    value: '−17%',
    delta: 'reduction',
    context: 'Unity Catalog governance',
    color: CAT_COLORS.healthAI,
    barPct: 17,
  },
];

export function PlatformBottomChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="rounded-xl p-4"
      style={{ border: `1px solid ${BORDER}`, background: 'rgba(124,58,237,0.03)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: PURPLE }}>
          Operations Intelligence
        </p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${PURPLE}18`, color: PURPLE, border: `1px solid ${PURPLE}40` }}
        >
          6 Signals · All Optimal
        </span>
      </div>

      {/* 2-column metric grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {OPS_METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            className="rounded-lg p-3"
            style={{
              border: `1px solid ${m.color}25`,
              background: `${m.color}06`,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.09, duration: 0.35 }}
          >
            {/* Status dot + label */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: m.color, boxShadow: `0 0 4px ${m.color}` }}
              />
              <span className="text-xs" style={{ color: MUTED }}>{m.label}</span>
            </div>

            {/* Big value */}
            <p
              className="text-lg font-bold font-mono leading-none mb-1"
              style={{ color: m.color }}
            >
              {m.value}
            </p>

            {/* Bar */}
            <div
              className="h-1 w-full rounded-full overflow-hidden mb-1.5"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: m.color }}
                initial={{ width: '0%' }}
                animate={inView ? { width: `${m.barPct}%` } : {}}
                transition={{ delay: 0.4 + i * 0.09, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>

            {/* Context */}
            <p className="text-xs leading-tight" style={{ color: MUTED, fontSize: '10px' }}>
              {m.delta} · {m.context}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
