'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import BookCallModal from './BookCallModal';
import AgentZoneModal, { type AgentDetail } from './AgentZoneModal';
import StatusBar from './StatusBar';
import HeadlineStrip from './HeadlineStrip';
import StatStrip from './StatStrip';
import { useHermesState, type AgentState } from '@/hooks/useHermesState';

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

const WALKING_PATHS: Array<{ id: string; from: string; to: string; d: string }> = [
  { id: 'p-conference-architect', from: 'conference', to: 'architect',  d: 'M 1180 350 Q 1400 300 1700 350' },
  { id: 'p-architect-designer',   from: 'architect',  to: 'designer',   d: 'M 1810 600 Q 1900 700 2400 900' },
  { id: 'p-backend-designer',     from: 'backend',    to: 'designer',   d: 'M 2440 700 Q 2400 800 2400 900' },
  { id: 'p-sales-delivery',       from: 'sales',      to: 'delivery',   d: 'M 1240 980 Q 1400 1100 1620 1200' },
  { id: 'p-marketing-validator',  from: 'marketing',  to: 'validator',  d: 'M 350 1200 Q 500 1300 900 1300' },
  { id: 'p-validator-delivery',   from: 'validator',  to: 'delivery',   d: 'M 940 1300 Q 1100 1300 1620 1300' },
];

export default function IsoFloor() {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [activeWalks, setActiveWalks] = useState<string[]>([]);
  const [originPoint, setOriginPoint] = useState<{ x: number; y: number } | null>(null);
  const agents = useHermesState();

  const openZone = (zoneId: string, e: React.MouseEvent<SVGPolygonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOriginPoint({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setActiveZoneId(zoneId);
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        size: 2 + Math.random() * 2,
      })),
    [],
  );

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const path = WALKING_PATHS[Math.floor(Math.random() * WALKING_PATHS.length)];
      const walkId = `${path.id}::${Date.now()}`;
      setActiveWalks((w) => [...w, walkId]);
      setTimeout(() => setActiveWalks((w) => w.filter((id) => id !== walkId)), 2600);
      const next = 8000 + Math.random() * 4000;
      setTimeout(tick, next);
    };
    const initial = setTimeout(tick, 3000);
    return () => { alive = false; clearTimeout(initial); };
  }, []);

  const removeWalk = (id: string) => setActiveWalks((w) => w.filter((x) => x !== id));

  const activeZone = ZONES.find((z) => z.id === activeZoneId) ?? null;
  const hoveredZone = ZONES.find((z) => z.id === hoveredZoneId) ?? null;
  const activeAgent =
    activeZone?.type === 'agent' && activeZone.id in AGENT_DETAILS
      ? { ...AGENT_DETAILS[activeZone.id], state: (agents[activeZone.id] ?? 'idle') as AgentState }
      : null;

  const handleClose = () => {
    setActiveZoneId(null);
    setOriginPoint(null);
  };

  return (
    <section className={styles.stage}>
      <div className={styles.particleLayer} aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            className={styles.particle}
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <StatusBar />

      <HeadlineStrip />

      <div className={styles.canvas}>
        <Image
          src="/agency/iso-floor.png"
          alt="Verbaflow Agency isometric floor map showing nine zones: reception, task delegation, sales, and six numbered agent rooms"
          fill
          priority
          className={styles.still}
          sizes="(max-width: 1920px) 100vw, 1920px"
        />

        {/* Ambient glow pulses over six hot features */}
        <div
          className={styles.ambientGlow}
          style={{ top: '18%', left: '4%', width: 140, height: 140, animationDelay: '0s' }}
          aria-hidden="true"
        />
        <div
          className={styles.ambientGlow}
          style={{ top: '8%', left: '28%', width: 160, height: 160, animationDelay: '0.5s' }}
          aria-hidden="true"
        />
        <div
          className={styles.ambientGlow}
          style={{ top: '38%', left: '38%', width: 150, height: 150, animationDelay: '1.0s' }}
          aria-hidden="true"
        />
        <div
          className={styles.ambientGlow}
          style={{ top: '14%', left: '58%', width: 180, height: 180, animationDelay: '1.5s' }}
          aria-hidden="true"
        />
        <div
          className={styles.ambientGlow}
          style={{ top: '18%', left: '86%', width: 120, height: 120, animationDelay: '2.0s' }}
          aria-hidden="true"
        />
        <div
          className={styles.ambientGlow}
          style={{ top: '46%', left: '78%', width: 170, height: 170, animationDelay: '2.5s' }}
          aria-hidden="true"
        />

        <svg
          viewBox="0 0 2752 1536"
          preserveAspectRatio="xMidYMid slice"
          className={styles.hitmap}
          aria-label="Interactive zones overlay"
        >
          <defs>
            {WALKING_PATHS.map((p) => (
              <path key={p.id} id={p.id} d={p.d} fill="none" />
            ))}
          </defs>
          {/* Always-visible faint dashed path tracks */}
          {WALKING_PATHS.map((p) => (
            <path
              key={`track-${p.id}`}
              d={p.d}
              fill="none"
              stroke="rgba(79, 219, 200, 0.15)"
              strokeWidth="3"
              strokeDasharray="10 8"
            />
          ))}
          {/* Walking dots — one per active animation */}
          {activeWalks.map((walkId) => (
            <circle key={walkId} r="9" fill="#71f8e4" opacity="0.95">
              <animateMotion
                dur="2.5s"
                repeatCount="1"
              >
                <mpath href={`#${walkId.split('::')[0]}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.95;0.95;0"
                keyTimes="0;0.15;0.85;1"
                dur="2.5s"
                repeatCount="1"
              />
            </circle>
          ))}

          {ZONES.map((zone) => (
            <polygon
              key={zone.id}
              points={zone.points}
              className={styles.zone}
              onClick={(e) => openZone(zone.id, e)}
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
                  const rect = (e.currentTarget as SVGPolygonElement).getBoundingClientRect();
                  setOriginPoint({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  });
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

      <StatStrip />

      <BookCallModal open={activeZoneId === 'reception'} onClose={handleClose} originPoint={originPoint} />
      <AgentZoneModal open={!!activeAgent} agent={activeAgent} onClose={handleClose} originPoint={originPoint} />
    </section>
  );
}
