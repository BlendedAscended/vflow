'use client';

import { useState, useEffect, useRef } from 'react';

/* ─── Workflow phases (one repeating cycle) ─── */
interface Phase {
  id: string;
  dur: number;
  active: string[];
  stream: string | null;
  mail?: boolean;
  log: { src: string; txt: string }[];
}

const PHASES: Phase[] = [
  {
    id: 'reception',
    dur: 3200,
    active: ['reception'],
    stream: null,
    log: [
      { src: 'Daemon', txt: 'Inbound prompt — visitor on Cal.com booking widget.' },
      { src: 'Reception', txt: 'Greeting client. Routing to PM agent.' },
    ],
  },
  {
    id: 'conference',
    dur: 4200,
    active: ['conference'],
    stream: null,
    log: [
      { src: 'PM Agent', txt: 'Ticket #4127 received. Splintering scope into 6 sub-tickets.' },
      { src: 'Lead Architect', txt: 'Tagging FE/BE/DATA. Estimating compute envelope.' },
      { src: 'Supervisor (San)', txt: 'Sub-tickets #4127.a-f dispatched.' },
    ],
  },
  {
    id: 'parallel-std',
    dur: 4400,
    active: ['design', 'fullstack'],
    stream: 'standard',
    log: [
      { src: 'Daemon', txt: 'Qwen 3.6 processing full-stack ticket #4127.c.' },
      { src: 'Design Lead', txt: 'Applying Enterprise Authority to Samurai UI matrix.' },
      { src: 'Daemon', txt: 'DeepSeek V4 Pro: scaffold render in 1.2s.' },
    ],
  },
  {
    id: 'parallel-opus',
    dur: 4400,
    active: ['design', 'fullstack'],
    stream: 'premium',
    log: [
      { src: 'OpenClaw', txt: 'Escalation: ticket #4127.d requires Opus 4.6.' },
      { src: 'Daemon', txt: 'Premium compute stream engaged — gold lane.' },
      { src: 'Full Stack', txt: 'Opus reasoning over auth flow + retry logic.' },
    ],
  },
  {
    id: 'data',
    dur: 3600,
    active: ['data'],
    stream: null,
    log: [
      { src: 'DBA Agent', txt: 'Schema diff applied. 3 migrations queued.' },
      { src: 'Data Architect', txt: 'Embedding vectors written to context cache.' },
    ],
  },
  {
    id: 'cache-hit',
    dur: 2400,
    active: ['cache'],
    stream: null,
    log: [
      { src: 'GLM 5.1', txt: 'Memory bank hit — reusing trained Galaxy Pipeline pattern.' },
      { src: 'Daemon', txt: 'No spin-up required. 0.4s response.' },
    ],
  },
  {
    id: 'boardroom',
    dur: 4800,
    active: ['boardroom'],
    stream: null,
    log: [
      { src: 'CTO (San)', txt: 'Module bundle staged for review.' },
      { src: 'OpenClaw', txt: '⏸ Awaiting CEO approval for production payment.' },
      { src: 'CEO (San)', txt: '✓ Approved. Releasing to Launch.' },
    ],
  },
  {
    id: 'launch',
    dur: 3600,
    active: ['launch'],
    stream: null,
    log: [
      { src: 'CMO Agent', txt: 'Initializing outreach for completed Galaxy Pipeline.' },
      { src: 'Sales Agent', txt: 'Drafting handoff email to client (sanitized).' },
    ],
  },
  {
    id: 'mail',
    dur: 2400,
    active: ['launch'],
    stream: null,
    mail: true,
    log: [
      { src: 'Daemon', txt: '✉ Mail sent to client@galaxy-pipeline.io.' },
      { src: 'Daemon', txt: '— cycle complete. Re-running.' },
    ],
  },
];

/* ─── Zone polygons in 1200×640 viewBox ─── */
interface ZoneRect {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  agents: string[];
  stack: string;
}

const ZONES: Record<string, ZoneRect> = {
  reception: {
    x: 40,
    y: 60,
    w: 240,
    h: 160,
    label: 'RECEPTION',
    agents: ['Receptionist'],
    stack: 'Cal.com · Meet',
  },
  conference: {
    x: 320,
    y: 60,
    w: 320,
    h: 160,
    label: 'CONFERENCE ROOM',
    agents: ['PM', 'Lead Architect', 'Supervisor'],
    stack: 'OpenClaw · Paperclip',
  },
  design: {
    x: 680,
    y: 60,
    w: 220,
    h: 160,
    label: 'DESIGN STUDIO',
    agents: ['Design Lead', 'UI Agent'],
    stack: 'Qwen 3.6',
  },
  fullstack: {
    x: 940,
    y: 60,
    w: 220,
    h: 160,
    label: 'FULL STACK STUDIO',
    agents: ['FE Agent', 'BE Agent'],
    stack: 'DeepSeek V4 / Opus 4.6',
  },
  cache: {
    x: 540,
    y: 270,
    w: 180,
    h: 100,
    label: 'CONTEXT CACHE',
    agents: ['GLM 5.1'],
    stack: 'Memory Bank',
  },
  data: {
    x: 940,
    y: 260,
    w: 220,
    h: 130,
    label: 'DATA DEPT',
    agents: ['DBA', 'Data Scientist'],
    stack: 'Vectors · Postgres',
  },
  boardroom: {
    x: 320,
    y: 420,
    w: 320,
    h: 160,
    label: 'EXECUTIVE BOARDROOM',
    agents: ['CEO (San)', 'CTO (San)'],
    stack: 'Human-in-loop',
  },
  launch: {
    x: 680,
    y: 420,
    w: 480,
    h: 160,
    label: 'LAUNCH · MARKETING & SALES',
    agents: ['CMO', 'Sales'],
    stack: 'Outreach Engine',
  },
};

interface Point {
  x: number;
  y: number;
}

const center = (z: ZoneRect): Point => ({ x: z.x + z.w / 2, y: z.y + z.h / 2 });

/* ─── Path waypoints for the ticket (for animation) ─── */
function pathFor(phaseId: string, t: number): Point {
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
  const lerpPt = (p1: Point, p2: Point, k: number): Point => ({
    x: lerp(p1.x, p2.x, k),
    y: lerp(p1.y, p2.y, k),
  });
  const r = center(ZONES.reception);
  const c = center(ZONES.conference);
  const d = center(ZONES.design);
  const f = center(ZONES.fullstack);
  const dt = center(ZONES.data);
  const ca = center(ZONES.cache);
  const b = center(ZONES.boardroom);
  const l = center(ZONES.launch);

  switch (phaseId) {
    case 'reception':
      return lerpPt(r, c, t);
    case 'conference':
      return c;
    case 'parallel-std':
      return t < 0.5 ? lerpPt(c, d, t * 2) : lerpPt(c, f, (t - 0.5) * 2);
    case 'parallel-opus':
      return t < 0.5 ? lerpPt(c, f, t * 2) : lerpPt(c, d, (t - 0.5) * 2);
    case 'data':
      return lerpPt(f, dt, t);
    case 'cache-hit':
      return ca;
    case 'boardroom':
      return lerpPt(dt, b, t);
    case 'launch':
      return lerpPt(b, l, t);
    case 'mail':
      return l;
    default:
      return r;
  }
}

/* ─── Comic-style receptionist (SVG, friendly) ─── */
const Receptionist = () => (
  <g transform="translate(80, 110)">
    {/* Speech bubble */}
    <g transform="translate(60, -38)">
      <rect
        x="0"
        y="0"
        rx="8"
        ry="8"
        width="118"
        height="34"
        fill="#fff"
        stroke="#0a1020"
        strokeWidth="2"
      />
      <polygon points="14,34 22,46 30,34" fill="#fff" stroke="#0a1020" strokeWidth="2" />
      <polygon points="16,34 22,44 28,34" fill="#fff" />
      <text
        x="59"
        y="22"
        textAnchor="middle"
        fontFamily="DM Mono, monospace"
        fontSize="13"
        fontWeight="700"
        fill="#0a1020"
      >
        Book a call!
      </text>
    </g>
    {/* Body — chunky comic style */}
    {/* Hair */}
    <ellipse cx="30" cy="22" rx="20" ry="16" fill="#1f2937" stroke="#0a1020" strokeWidth="2" />
    {/* Face */}
    <circle cx="30" cy="32" r="16" fill="#fde6c8" stroke="#0a1020" strokeWidth="2" />
    {/* Eyes */}
    <circle cx="24" cy="32" r="1.8" fill="#0a1020" />
    <circle cx="36" cy="32" r="1.8" fill="#0a1020" />
    {/* Smile */}
    <path
      d="M 22 38 Q 30 44 38 38"
      stroke="#0a1020"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Cheek dot */}
    <circle cx="20" cy="37" r="1.6" fill="#fbb6c4" />
    <circle cx="40" cy="37" r="1.6" fill="#fbb6c4" />
    {/* Body */}
    <path d="M 10 50 Q 30 46 50 50 L 56 80 L 4 80 Z" fill="#22d3a9" stroke="#0a1020" strokeWidth="2" />
    {/* Headset */}
    <path d="M 14 24 Q 30 8 46 24" stroke="#0a1020" strokeWidth="2.5" fill="none" />
    <circle cx="14" cy="26" r="3" fill="#fbbf24" stroke="#0a1020" strokeWidth="1.5" />
    <circle cx="46" cy="26" r="3" fill="#fbbf24" stroke="#0a1020" strokeWidth="1.5" />
    {/* Mic */}
    <path d="M 14 28 Q 8 36 18 42" stroke="#0a1020" strokeWidth="1.5" fill="none" />
    <circle cx="18" cy="42" r="2" fill="#0a1020" />
  </g>
);

/* ─── Hex node for Context Cache ─── */
const ContextCacheNode = ({ active }: { active: boolean }) => {
  const cx = 630;
  const cy = 320;
  return (
    <g className={`vf-cache ${active ? 'vf-cache-on' : ''}`}>
      {/* Outer hex */}
      <polygon
        points={`${cx - 50},${cy} ${cx - 25},${cy - 43} ${cx + 25},${cy - 43} ${cx + 50},${cy} ${cx + 25},${cy + 43} ${cx - 25},${cy + 43}`}
        fill="rgba(8,16,32,0.85)"
        stroke={active ? '#fbbf24' : '#22d3a9'}
        strokeWidth="2"
      />
      {/* Inner hex */}
      <polygon
        points={`${cx - 30},${cy} ${cx - 15},${cy - 26} ${cx + 15},${cy - 26} ${cx + 30},${cy} ${cx + 15},${cy + 26} ${cx - 15},${cy + 26}`}
        fill="none"
        stroke={active ? '#fbbf24' : 'rgba(34,211,169,0.5)'}
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      {/* Pulse rings */}
      {active && (
        <polygon
          points={`${cx - 50},${cy} ${cx - 25},${cy - 43} ${cx + 25},${cy - 43} ${cx + 50},${cy} ${cx + 25},${cy + 43} ${cx - 25},${cy + 43}`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          opacity="0.6"
        >
          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.4s" repeatCount="indefinite" />
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.18;1"
            dur="1.4s"
            additive="sum"
            repeatCount="indefinite"
            from={`${cx} ${cy}`}
          />
        </polygon>
      )}
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fontFamily="DM Mono, monospace"
        fontSize="9"
        letterSpacing="2"
        fill={active ? '#fbbf24' : '#22d3a9'}
        fontWeight="700"
      >
        CONTEXT
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontFamily="DM Mono, monospace"
        fontSize="9"
        letterSpacing="2"
        fill={active ? '#fbbf24' : '#22d3a9'}
        fontWeight="700"
      >
        CACHE
      </text>
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fontFamily="DM Mono, monospace"
        fontSize="7"
        letterSpacing="1.5"
        fill="rgba(165,243,252,0.6)"
      >
        GLM 5.1
      </text>
    </g>
  );
};

/* ─── Zone block ─── */
const Zone = ({
  id,
  active,
  mailFlash,
}: {
  id: string;
  active: boolean;
  mailFlash: boolean;
}) => {
  const z = ZONES[id];
  const stroke = active ? '#fbbf24' : 'rgba(56,189,248,0.55)';
  const strokeW = active ? 2.5 : 1.2;

  return (
    <g className={`vf-zone ${active ? 'vf-zone-on' : ''}`}>
      {/* Glow boundary (active only) */}
      {active && (
        <rect
          x={z.x - 4}
          y={z.y - 4}
          width={z.w + 8}
          height={z.h + 8}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
          opacity="0.35"
          filter="url(#vf-glow)"
        />
      )}
      {/* Zone rectangle */}
      <rect
        x={z.x}
        y={z.y}
        width={z.w}
        height={z.h}
        fill={active ? 'rgba(251,191,36,0.06)' : 'rgba(8,16,32,0.55)'}
        stroke={stroke}
        strokeWidth={strokeW}
        strokeDasharray={active ? 'none' : '4 3'}
      />
      {/* Corner ticks */}
      {(
        [
          [z.x, z.y],
          [z.x + z.w, z.y],
          [z.x, z.y + z.h],
          [z.x + z.w, z.y + z.h],
        ] as [number, number][]
      ).map(([x, y], i) => {
        const dx = i % 2 === 0 ? 8 : -8;
        const dy = i < 2 ? 8 : -8;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x + dx} y2={y} stroke={stroke} strokeWidth="2" />
            <line x1={x} y1={y} x2={x} y2={y + dy} stroke={stroke} strokeWidth="2" />
          </g>
        );
      })}
      {/* Label */}
      <text
        x={z.x + 10}
        y={z.y + 18}
        fontFamily="DM Mono, monospace"
        fontSize="11"
        letterSpacing="1.5"
        fill={active ? '#fbbf24' : 'rgba(165,243,252,0.85)'}
        fontWeight="700"
      >
        ▸ {z.label}
      </text>
      {/* Stack tag */}
      <text
        x={z.x + 10}
        y={z.y + z.h - 10}
        fontFamily="DM Mono, monospace"
        fontSize="8"
        letterSpacing="1"
        fill="rgba(165,243,252,0.55)"
      >
        {z.stack}
      </text>
      {/* Agent dots */}
      {z.agents.map((a, i) => (
        <g key={a} transform={`translate(${z.x + 12 + i * 70}, ${z.y + 30})`}>
          <circle cx="0" cy="0" r="3" fill={active ? '#fbbf24' : '#22d3a9'}>
            {active && (
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="0.9s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <text x="8" y="3" fontFamily="DM Mono, monospace" fontSize="8" fill="rgba(165,243,252,0.75)">
            {a}
          </text>
        </g>
      ))}
      {/* Mail envelope (only on launch zone, only during mail phase) */}
      {id === 'launch' && mailFlash && (
        <g transform={`translate(${z.x + z.w - 60}, ${z.y + z.h / 2 - 10})`}>
          <rect x="0" y="0" width="40" height="26" rx="2" fill="#fbbf24" stroke="#0a1020" strokeWidth="1.5" />
          <polyline points="0,0 20,16 40,0" fill="none" stroke="#0a1020" strokeWidth="1.5" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`${z.x + z.w - 60} ${z.y + z.h / 2 - 10};${z.x + z.w + 80} ${z.y + z.h / 2 - 40}`}
            dur="1.6s"
            fill="freeze"
          />
          <animate attributeName="opacity" values="1;1;0" dur="1.6s" fill="freeze" />
        </g>
      )}
    </g>
  );
};

/* ─── Compute streams (curves between zones) ─── */
interface ComputeStreamProps {
  from: string;
  to: string;
  kind: string;
  active: boolean;
  splinter?: boolean;
}

const ComputeStream = ({ from, to, kind, active, splinter }: ComputeStreamProps) => {
  const a = center(ZONES[from]);
  const b = center(ZONES[to]);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 10;
  const path = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;

  const isPremium = kind === 'premium';
  const color = !active
    ? 'rgba(56,189,248,0.18)'
    : isPremium
      ? '#fbbf24'
      : '#22d3a9';
  const width = !active ? 1 : isPremium ? 4 : 2.5;

  return (
    <g className={`vf-stream ${active ? 'vf-stream-on' : ''}`}>
      {/* Glow underlay when active */}
      {active && (
        <path d={path} fill="none" stroke={color} strokeWidth={width + 6} opacity="0.25" filter="url(#vf-glow)" />
      )}
      {/* Main path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={isPremium ? 'none' : '6 4'}
      />
      {/* Flowing dots when active */}
      {active &&
        [0, 0.33, 0.66].map((offset, i) => (
          <circle key={i} r={isPremium ? 5 : 3.5} fill={color}>
            <animateMotion
              dur={isPremium ? '1.2s' : '1.6s'}
              repeatCount="indefinite"
              begin={`${offset * (isPremium ? 1.2 : 1.6)}s`}
              path={path}
            />
            {isPremium && (
              <animate attributeName="r" values="5;7;5" dur="0.5s" repeatCount="indefinite" />
            )}
          </circle>
        ))}
      {/* Splinter sparkles when active + splinter */}
      {active && splinter && (
        <circle cx={mx} cy={my} r="2" fill={color}>
          <animate attributeName="r" values="2;6;2" dur="0.7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="0.7s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

/* ─── Live ticket dot following the path ─── */
const TicketDot = ({ pos, splinter }: { pos: Point; splinter: boolean }) => (
  <g>
    {/* trail */}
    <circle cx={pos.x} cy={pos.y} r="14" fill="rgba(251,191,36,0.15)" />
    <circle cx={pos.x} cy={pos.y} r="9" fill="rgba(251,191,36,0.3)" />
    <rect
      x={pos.x - 6}
      y={pos.y - 4}
      width="12"
      height="8"
      fill="#fbbf24"
      stroke="#0a1020"
      strokeWidth="1"
    />
    <text
      x={pos.x}
      y={pos.y + 1.5}
      textAnchor="middle"
      fontFamily="DM Mono, monospace"
      fontSize="5"
      fontWeight="700"
      fill="#0a1020"
    >
      #4127
    </text>
    {/* Splinter starbursts when in conference */}
    {splinter &&
      [0, 60, 120, 180, 240, 300].map((angle) => (
        <circle key={angle} cx={pos.x} cy={pos.y} r="2.5" fill="#fbbf24">
          <animate
            attributeName="cx"
            values={`${pos.x};${pos.x + 30 * Math.cos((angle * Math.PI) / 180)}`}
            dur="0.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${pos.y};${pos.y + 30 * Math.sin((angle * Math.PI) / 180)}`}
            dur="0.8s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="1;0" dur="0.8s" repeatCount="indefinite" />
        </circle>
      ))}
  </g>
);

/* ─── CEO approval gate badge ─── */
const ApprovalGate = ({ visible, approved }: { visible: boolean; approved: boolean }) => {
  if (!visible) return null;
  const z = ZONES.boardroom;
  return (
    <g transform={`translate(${z.x + z.w / 2 - 110}, ${z.y + z.h / 2 + 18})`}>
      <rect
        x="0"
        y="0"
        width="220"
        height="34"
        rx="3"
        fill={approved ? 'rgba(34,211,169,0.15)' : 'rgba(251,191,36,0.18)'}
        stroke={approved ? '#22d3a9' : '#fbbf24'}
        strokeWidth="1.5"
      />
      {/* Hand-on-lever icon */}
      <g transform="translate(8, 8)">
        {approved ? (
          <>
            <circle cx="9" cy="9" r="8" fill="none" stroke="#22d3a9" strokeWidth="1.5" />
            <polyline points="5,9 8,12 13,6" fill="none" stroke="#22d3a9" strokeWidth="2" />
          </>
        ) : (
          <>
            <rect x="3" y="2" width="12" height="14" rx="1" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            <circle cx="9" cy="9" r="2" fill="#fbbf24">
              <animate attributeName="opacity" values="1;0.2;1" dur="0.9s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </g>
      <text
        x="32"
        y="14"
        fontFamily="DM Mono, monospace"
        fontSize="9"
        fontWeight="700"
        fill={approved ? '#22d3a9' : '#fbbf24'}
        letterSpacing="1"
      >
        {approved ? 'CEO APPROVED' : 'AWAITING CEO APPROVAL'}
      </text>
      <text
        x="32"
        y="25"
        fontFamily="DM Mono, monospace"
        fontSize="7"
        fill="rgba(165,243,252,0.65)"
        letterSpacing="0.8"
      >
        {approved ? 'releasing to launch' : 'production payment gate · human in loop'}
      </text>
    </g>
  );
};

/* ─── Feed entry type ─── */
interface FeedEntry {
  ts: string;
  src: string;
  txt: string;
  kind: string;
}

/* ─── Dispatch Feed (terminal log on the side) ─── */
const DispatchFeed = ({ entries }: { entries: FeedEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [entries]);
  return (
    <div className="vf-feed">
      <div className="vf-feed-head">
        <span className="vf-feed-led" />
        <span>DAEMON (OpenClaw) DISPATCH FEED</span>
        <span className="vf-feed-mode">read-only · sanitized</span>
      </div>
      <div className="vf-feed-body" ref={ref}>
        {entries.map((e, i) => (
          <div key={i} className={`vf-feed-line vf-feed-${e.kind || 'std'}`}>
            <span className="vf-ts">[{e.ts}]</span>
            <span className="vf-src">{e.src}:</span>
            <span className="vf-msg">{e.txt}</span>
          </div>
        ))}
      </div>
      <div className="vf-feed-foot">
        <span>● cycle simulating</span>
        <span>tick {entries.length}</span>
      </div>
    </div>
  );
};

/* ─── Main HologramFloor component ─── */
const VerbaFlowHologramFloor = () => {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseT, setPhaseT] = useState(0);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const startRef = useRef<number>(performance.now());
  const lastLogPhaseRef = useRef(-1);

  const phase = PHASES[phaseIdx];

  /* Animation loop */
  useEffect(() => {
    startRef.current = performance.now();
    const FPS = 30;
    const interval = setInterval(() => {
      setPhaseT((prevT) => {
        const now = performance.now();
        const elapsed = now - startRef.current;
        const t = Math.min(elapsed / phase.dur, 1);
        if (t >= 1) {
          startRef.current = now;
          setPhaseIdx((i) => (i + 1) % PHASES.length);
          return 0;
        }
        return t;
      });
    }, 1000 / FPS);
    return () => clearInterval(interval);
  }, [phaseIdx, phase.dur]);

  /* Push log entries when phase changes */
  useEffect(() => {
    if (lastLogPhaseRef.current === phaseIdx) return;
    lastLogPhaseRef.current = phaseIdx;
    const now = new Date();
    const ts = (offset = 0) => {
      const d = new Date(now.getTime() + offset);
      return d.toTimeString().slice(0, 8);
    };
    const newEntries: FeedEntry[] = phase.log.map((l, i) => ({
      ts: ts(i * 400),
      src: l.src,
      txt: l.txt,
      kind:
        l.src === 'OpenClaw' || l.src === 'Daemon'
          ? 'sys'
          : l.src.includes('CEO')
            ? 'exec'
            : l.src.includes('Opus') || l.txt.includes('Opus')
              ? 'gold'
              : 'std',
    }));
    setFeed((prev) => [...prev, ...newEntries].slice(-12));
  }, [phaseIdx, phase]);

  /* Active zones from phase */
  const activeSet = new Set(phase.active);

  /* Compute streams active state by phase */
  const streams: ComputeStreamProps[] = [
    { from: 'reception', to: 'conference', kind: 'standard', active: phase.id === 'reception' },
    {
      from: 'conference',
      to: 'design',
      kind: phase.id === 'parallel-opus' ? 'premium' : 'standard',
      active: phase.id === 'parallel-std' || phase.id === 'parallel-opus',
      splinter: phase.id === 'parallel-std' || phase.id === 'parallel-opus',
    },
    {
      from: 'conference',
      to: 'fullstack',
      kind: phase.id === 'parallel-opus' ? 'premium' : 'standard',
      active: phase.id === 'parallel-std' || phase.id === 'parallel-opus',
      splinter: phase.id === 'parallel-std' || phase.id === 'parallel-opus',
    },
    { from: 'fullstack', to: 'data', kind: 'standard', active: phase.id === 'data' },
    { from: 'data', to: 'cache', kind: 'standard', active: phase.id === 'cache-hit' },
    { from: 'design', to: 'cache', kind: 'standard', active: phase.id === 'cache-hit' },
    { from: 'data', to: 'boardroom', kind: 'standard', active: phase.id === 'boardroom' },
    { from: 'boardroom', to: 'launch', kind: 'standard', active: phase.id === 'launch' },
  ];

  const ticketPos = pathFor(phase.id, phaseT);
  const splinter = phase.id === 'conference';
  const mailFlash = phase.id === 'mail';

  return (
    <div className="vf-floor-shell">
      {/* HEADER bar */}
      <div className="vf-floor-head">
        <div className="vf-floor-title">
          <span className="vf-floor-led" />
          <span>▣ VERBAFLOW · LIVE FLOOR · HOLOGRAM MODE</span>
        </div>
        <div className="vf-phase-track">
          {PHASES.map((p, i) => (
            <span
              key={p.id}
              className={`vf-phase-pip ${i === phaseIdx ? 'on' : i < phaseIdx ? 'done' : ''}`}
            >
              <span className="vf-phase-dot" />
              <span className="vf-phase-name">{p.id.replace('-', ' ')}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="vf-floor-body">
        {/* SVG floor plan */}
        <div className="vf-floor-canvas">
          <svg
            viewBox="0 0 1200 640"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              {/* Grid pattern */}
              <pattern id="vf-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="rgba(56,189,248,0.08)"
                  strokeWidth="0.5"
                />
              </pattern>
              <pattern id="vf-grid-major" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke="rgba(56,189,248,0.16)"
                  strokeWidth="0.8"
                />
              </pattern>
              {/* Glow filter */}
              <filter id="vf-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background grid */}
            <rect x="0" y="0" width="1200" height="640" fill="url(#vf-grid)" />
            <rect x="0" y="0" width="1200" height="640" fill="url(#vf-grid-major)" />

            {/* Outer building outline */}
            <rect
              x="20"
              y="40"
              width="1160"
              height="560"
              fill="none"
              stroke="rgba(56,189,248,0.4)"
              strokeWidth="1.5"
              strokeDasharray="8 4"
            />

            {/* Compute streams (drawn first, behind zones) */}
            {streams.map((s, i) => (
              <ComputeStream key={i} {...s} />
            ))}

            {/* Connections to context cache (decorative dashed) */}
            <line
              x1={center(ZONES.conference).x}
              y1={center(ZONES.conference).y}
              x2={center(ZONES.cache).x}
              y2={center(ZONES.cache).y}
              stroke="rgba(34,211,169,0.2)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            <line
              x1={center(ZONES.boardroom).x}
              y1={center(ZONES.boardroom).y}
              x2={center(ZONES.cache).x}
              y2={center(ZONES.cache).y}
              stroke="rgba(34,211,169,0.2)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />

            {/* Zones */}
            {Object.keys(ZONES)
              .filter((k) => k !== 'cache')
              .map((id) => (
                <Zone key={id} id={id} active={activeSet.has(id)} mailFlash={mailFlash} />
              ))}

            {/* Reception comic character */}
            <Receptionist />

            {/* Cal.com / Meet icon next to reception */}
            <g transform="translate(220, 180)">
              <rect
                x="0"
                y="0"
                width="50"
                height="28"
                rx="3"
                fill="rgba(8,16,32,0.85)"
                stroke="rgba(56,189,248,0.6)"
                strokeWidth="1"
              />
              <text
                x="25"
                y="12"
                textAnchor="middle"
                fontFamily="DM Mono, monospace"
                fontSize="7"
                fontWeight="700"
                fill="#22d3a9"
                letterSpacing="1"
              >
                CAL.COM
              </text>
              <text
                x="25"
                y="22"
                textAnchor="middle"
                fontFamily="DM Mono, monospace"
                fontSize="6"
                fill="rgba(165,243,252,0.6)"
                letterSpacing="1"
              >
                + MEET
              </text>
            </g>

            {/* Context Cache hex node */}
            <ContextCacheNode active={phase.id === 'cache-hit'} />

            {/* CEO approval gate */}
            <ApprovalGate
              visible={phase.id === 'boardroom' || phase.id === 'launch' || phase.id === 'mail'}
              approved={phase.id === 'launch' || phase.id === 'mail'}
            />

            {/* Live ticket */}
            <TicketDot pos={ticketPos} splinter={splinter} />

            {/* Footer scale + watermark */}
            <text
              x="30"
              y="630"
              fontFamily="DM Mono, monospace"
              fontSize="8"
              fill="rgba(165,243,252,0.4)"
              letterSpacing="1.5"
            >
              SCALE 1:120 · GRID 20U · OPENCLAW ORCHESTRATION · PAPERCLIP MULTI-AGENT
            </text>
            <text
              x="1170"
              y="630"
              textAnchor="end"
              fontFamily="DM Mono, monospace"
              fontSize="8"
              fill="rgba(165,243,252,0.4)"
              letterSpacing="1.5"
            >
              CYCLE #{Math.floor((Date.now() / 1000) % 9999)} · SIM v3.2
            </text>
          </svg>
        </div>

        {/* Side feed */}
        <DispatchFeed entries={feed} />
      </div>

      {/* Footer legend */}
      <div className="vf-floor-legend">
        <span className="vf-leg">
          <span className="vf-leg-line vf-leg-std" /> Standard compute · Qwen 3.6 / DeepSeek V4 Pro
        </span>
        <span className="vf-leg">
          <span className="vf-leg-line vf-leg-prem" /> Premium compute · Opus 4.6 (escalation)
        </span>
        <span className="vf-leg">
          <span className="vf-leg-line vf-leg-cache" /> Context Cache · GLM 5.1 memory hit
        </span>
        <span className="vf-leg">
          <span className="vf-leg-pip" /> Active zone (workflow phase)
        </span>
        <span className="vf-leg" style={{ marginLeft: 'auto', color: 'rgba(165,243,252,0.5)' }}>
          ↻ Trained workflow · repeating identically · single ticket #4127
        </span>
      </div>
    </div>
  );
};

export default VerbaFlowHologramFloor;
