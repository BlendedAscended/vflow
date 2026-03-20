'use client';

import { motion } from 'framer-motion';
import { Heart, TrendingUp, Layers } from 'lucide-react';
import type { AgencyDomain } from '../../data/agencyDomains';
import { HealthcareTopChartV2, HealthcareBottomChart } from './infographics/HealthcareCharts';
import { FinanceTopChart, FinanceBottomChart, UMDChart, CDSChart } from './infographics/FinanceCharts';
import { PlatformTopChart, PlatformBottomChart } from './infographics/PlatformCharts';
import ThreeAgencyBackground from './ThreeAgencyBackground';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Heart,
  TrendingUp,
  Layers,
};

// Which domain IDs get infographic treatment
const TOP_CHART: Record<string, React.ComponentType> = {
  healthcare: HealthcareTopChartV2,
  finance:    FinanceTopChart,
  platform:   PlatformTopChart,
};
// Extra charts rendered between metrics grid and bottom chart
const MID_CHARTS: Record<string, React.ComponentType[]> = {
  finance: [UMDChart, CDSChart],
};
const BOTTOM_CHART: Record<string, React.ComponentType> = {
  healthcare: HealthcareBottomChart,
  finance:    FinanceBottomChart,
  platform:   PlatformBottomChart,
};

interface ProjectFrameProps {
  domain: AgencyDomain;
  isActive: boolean;
}

export default function ProjectFrame({ domain, isActive }: ProjectFrameProps) {
  const Icon = ICON_MAP[domain.iconName] ?? Layers;
  const TopChart    = TOP_CHART[domain.id]  ?? null;
  const midCharts   = MID_CHARTS[domain.id] ?? [];
  const BottomChart = BOTTOM_CHART[domain.id] ?? null;

  return (
    <motion.div
      id={domain.frameId}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        border: isActive ? `1px solid ${domain.accent}40` : '1px solid var(--agency-border)',
        background: 'var(--agency-bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isActive
          ? `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${domain.accent}20`
          : '0 8px 32px rgba(0,0,0,0.4)',
        borderLeft: isActive ? `4px solid ${domain.accent}` : '4px solid transparent',
      }}
    >
      {/* Accent top bar */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${domain.accent}, ${domain.accent}40)` }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div
            className="p-2.5 rounded-xl flex-shrink-0"
            style={{ backgroundColor: `${domain.accent}18`, border: `1px solid ${domain.accent}30` }}
          >
            <Icon size={20} style={{ color: domain.accent }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--agency-text)' }}>
              {domain.name}
            </h3>
            <p className="text-sm" style={{ color: 'var(--agency-text-muted)' }}>
              {domain.tagline}
            </p>
          </div>
          {isActive && (
            <div
              className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
              style={{
                color: domain.accent,
                backgroundColor: `${domain.accent}18`,
                border: `1px solid ${domain.accent}40`,
              }}
            >
              Active
            </div>
          )}
        </div>

        {/* ── TOP INFOGRAPHIC (Healthcare / Finance only) ─────────────── */}
        {TopChart && (
          <div className="mb-5">
            <TopChart />
          </div>
        )}

        {/* Metrics grid */}
        <div
          className="grid gap-3 mb-5"
          style={{ gridTemplateColumns: `repeat(${Math.min(domain.metrics.length, 3)}, 1fr)` }}
        >
          {domain.metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: (idx: number) => ({
                  opacity: 1,
                  y: 0,
                  transition: { delay: idx * 0.1, duration: 0.4 },
                }),
              }}
              className="rounded-xl p-4 text-center"
              style={{
                border: '1px solid var(--agency-border)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <p
                className="text-2xl font-bold font-mono leading-tight mb-1"
                style={{ color: domain.accent }}
              >
                {metric.value}
              </p>
              <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--agency-text)' }}>
                {metric.label}
              </p>
              <p className="text-xs mt-1 leading-tight" style={{ color: 'var(--agency-text-muted)' }}>
                {metric.subtext}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── MID INFOGRAPHICS (Finance: UMD + CDS) ──────────────────── */}
        {midCharts.map((MidChart, i) => (
          <div key={i} className="mb-5">
            <MidChart />
          </div>
        ))}

        {/* ── BOTTOM INFOGRAPHIC (Healthcare / Finance only) ──────────── */}
        {BottomChart && (
          <div className="mb-5">
            <BottomChart />
          </div>
        )}

        {/* 3D Visual Analysis */}
        {isActive && (
          <div className="mb-6 h-48 rounded-xl overflow-hidden border border-[var(--agency-border)] bg-black/20">
            <div className="absolute top-3 left-4 z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--agency-text-muted)] opacity-60">
                3D Performance Model
              </p>
            </div>
            <ThreeAgencyBackground activeDomain={domain.id} />
          </div>
        )}

        {/* Tech stack */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--agency-text-muted)' }}
          >
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {domain.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  border: '1px solid var(--agency-border)',
                  color: 'var(--agency-text-muted)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
