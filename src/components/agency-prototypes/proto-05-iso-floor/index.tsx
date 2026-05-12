'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import BookCallModal from './BookCallModal';
import AgentZoneModal, { type AgentDetail } from './AgentZoneModal';

type ZoneType = 'support' | 'agent';

interface Zone {
  id: string;
  label: string;
  type: ZoneType;
  number?: number;
  /** Polygon points in image-pixel coords (viewBox 2752×1536). Calibrate in browser. */
  points: string;
}

/**
 * Approximate polygon coordinates traced against the locked still
 * (`public/agency/iso-floor.png`, 2752×1536). These are rough rectangles
 * tracking each zone's bounding box. Refine to proper iso parallelograms in
 * browser by inspecting the SVG and nudging point pairs.
 */
const ZONES: Zone[] = [
  { id: 'reception',  label: 'Book a Call',       type: 'support',                points: '140,180 720,150 740,580 170,640' },
  { id: 'conference', label: 'Task Delegation',   type: 'support',                points: '780,140 1280,100 1280,580 800,580' },
  { id: 'architect',  label: 'Architect',         type: 'agent',   number: 1,     points: '1520,80 2110,80 2110,620 1520,620' },
  { id: 'backend',    label: 'Backend Engineer',  type: 'agent',   number: 2,     points: '2140,80 2752,80 2752,700 2140,700' },
  { id: 'sales',      label: 'Sales',             type: 'support',                points: '1020,540 1480,540 1480,1010 1020,1010' },
  { id: 'designer',   label: 'Designer',          type: 'agent',   number: 3,     points: '2050,700 2752,700 2752,1400 2050,1400' },
  { id: 'delivery',   label: 'Delivery',          type: 'agent',   number: 4,     points: '1220,920 2020,920 2020,1474 1220,1474' },
  { id: 'validator',  label: 'Validator',         type: 'agent',   number: 5,     points: '700,940 1180,940 1180,1474 700,1474' },
  { id: 'marketing',  label: 'Marketing',         type: 'agent',   number: 6,     points: '0,780 690,780 690,1480 0,1480' },
];

const AGENT_DETAILS: Record<string, Omit<AgentDetail, 'state'>> = {
  architect: {
    id: 'architect',
    number: 1,
    label: 'Architect',
    role: 'Plans builds from brief to spec. Owns the implementation plan and the architecture document.',
    stack: 'Opus 4.7, Stitch MCP, Pascal Editor, Hermes orchestration.',
  },
  backend: {
    id: 'backend',
    number: 2,
    label: 'Backend Engineer',
    role: 'Ships APIs, schemas, edge functions, database migrations.',
    stack: 'Sonnet 4.6, Supabase MCP, Vercel, Postgres, OpenCode.',
  },
  designer: {
    id: 'designer',
    number: 3,
    label: 'Designer',
    role: 'Wireframes, design tokens, component handoff, brand-grade visuals.',
    stack: 'Stitch MCP, Figma MCP, Higgsfield Soul 2, verbaflow-design-system skill.',
  },
  delivery: {
    id: 'delivery',
    number: 4,
    label: 'Delivery',
    role: 'Opens pull requests, owns the merge, ships to production.',
    stack: 'GitHub Actions, Vercel deploys, PM2, code-review skill.',
  },
  validator: {
    id: 'validator',
    number: 5,
    label: 'Validator',
    role: 'Tests, security review, code review across every PR before merge.',
    stack: 'Playwright, security-and-hardening skill, code-review-and-quality skill.',
  },
  marketing: {
    id: 'marketing',
    number: 6,
    label: 'Marketing',
    role: 'Outreach copy, social posts, ad packs, video prompts.',
    stack: 'ai-video-director skill, Titan v2.0 pipeline, Higgsfield Seedance.',
  },
};

export default function IsoFloor() {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const activeZone = ZONES.find((z) => z.id === activeZoneId) ?? null;
  const hoveredZone = ZONES.find((z) => z.id === hoveredZoneId) ?? null;
  const activeAgent =
    activeZone?.type === 'agent' && activeZone.id in AGENT_DETAILS
      ? { ...AGENT_DETAILS[activeZone.id], state: 'idle' as const }
      : null;

  const handleClose = () => setActiveZoneId(null);

  return (
    <section className={styles.stage}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            <span>The agency floor · live</span>
          </div>
          <h2 className={styles.title}>
            Step inside the agency.
          </h2>
        </div>
        <p className={styles.hint}>
          Click any zone. Book a discovery call at reception, or open an agent room to see who is
          running what right now.
        </p>
      </header>

      <div className={styles.canvas}>
        <Image
          src="/agency/iso-floor.png"
          alt="Verbaflow Agency isometric floor map showing nine zones: reception, task delegation, sales, and six numbered agent rooms"
          fill
          priority
          className={styles.still}
          sizes="(max-width: 1920px) 100vw, 1920px"
        />

        <svg
          viewBox="0 0 2752 1536"
          preserveAspectRatio="xMidYMid slice"
          className={styles.hitmap}
          aria-label="Interactive zones overlay"
        >
          {ZONES.map((zone) => (
            <polygon
              key={zone.id}
              points={zone.points}
              className={styles.zone}
              onClick={() => setActiveZoneId(zone.id)}
              onMouseEnter={() => setHoveredZoneId(zone.id)}
              onMouseLeave={() =>
                setHoveredZoneId((prev) => (prev === zone.id ? null : prev))
              }
              onFocus={() => setHoveredZoneId(zone.id)}
              onBlur={() =>
                setHoveredZoneId((prev) => (prev === zone.id ? null : prev))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveZoneId(zone.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${zone.label}${zone.number ? ` — agent ${zone.number}` : ''}`}
            >
              <title>{zone.label}</title>
            </polygon>
          ))}
        </svg>

        <div
          className={styles.zoneLabel}
          data-visible={hoveredZone ? 'true' : 'false'}
          aria-live="polite"
        >
          {hoveredZone?.number ? `${hoveredZone.number} · ` : ''}
          {hoveredZone?.label ?? ''}
        </div>
      </div>

      <BookCallModal open={activeZoneId === 'reception'} onClose={handleClose} />
      <AgentZoneModal open={!!activeAgent} agent={activeAgent} onClose={handleClose} />
    </section>
  );
}
