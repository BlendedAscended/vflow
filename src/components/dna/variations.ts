// ─── DNA Triptych: variation configs + mock data ─────────────────────────────
// Three distinct visualisations for the Services section helices.

export interface HelixNode {
  /** Normalised position along helix axis (0..1) */
  t: number;
  /** Label displayed in overlay */
  label: string;
  /** Optional sub-label */
  sub?: string;
  /** Overlay type determines which renderer to use */
  overlayType: 'metric' | 'project' | 'iframe';
  /** Data payload for the overlay */
  data: MetricData | ProjectData | IframeData;
}

export interface MetricData {
  value: string;
  change: string;
  icon?: string;
}

export interface ProjectData {
  name: string;
  period: string;
  status: 'completed' | 'in-progress' | 'planned';
  slug?: string;
}

export interface IframeData {
  url: string;
  fallbackImg?: string;
}

export interface HelixVariation {
  /** Unique identifier */
  id: string;
  /** Display title */
  title: string;
  /** Subtitle shown below title */
  subtitle: string;
  /** Helix backbone amplitude (pixels from center) */
  amplitude: number;
  /** Number of rungs between nodes */
  rungCount: number;
  /** Rung style */
  rungStyle: 'capsule' | 'glass' | 'none';
  /** Node style */
  nodeStyle: 'puck' | 'flask' | 'orb';
  /** Node radius */
  nodeRadius: number;
  /** Emissive intensity */
  emissive: number;
  /** Primary accent color (hex) */
  accentColor: string;
  /** Secondary color for gradients */
  secondaryColor?: string;
  /** Nodes to render */
  nodes: HelixNode[];
  /** Position offset in scene (left/center/right thirds) */
  offsetX: number;
  /** Whether to show backbone strands */
  showBackbone: boolean;
  /** Whether to show an orb cloud around the helix */
  orbCloud?: {
    count: number;
    minRadius: number;
    maxRadius: number;
    opacity: number;
  };
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const METRIC_NODES: HelixNode[] = [
  {
    t: 0.1,
    label: 'Revenue',
    overlayType: 'metric',
    data: { value: '+32.4%', change: '↑ 8.2% vs last qtr', icon: 'trending-up' } as MetricData,
  },
  {
    t: 0.3,
    label: 'Team Size',
    overlayType: 'metric',
    data: { value: '600', change: '↑ 120 this year', icon: 'users' } as MetricData,
  },
  {
    t: 0.5,
    label: 'ARR',
    overlayType: 'metric',
    data: { value: '$48M', change: '↑ $12M YoY', icon: 'dollar' } as MetricData,
  },
  {
    t: 0.7,
    label: 'Retention',
    overlayType: 'metric',
    data: { value: '97.2%', change: '↑ 1.4% vs last qtr', icon: 'shield' } as MetricData,
  },
  {
    t: 0.9,
    label: 'NPS',
    overlayType: 'metric',
    data: { value: '82', change: '↑ 6 points', icon: 'star' } as MetricData,
  },
];

const PROJECT_NODES: HelixNode[] = [
  {
    t: 0.05,
    label: 'Q4 2022',
    sub: 'Foundation',
    overlayType: 'project',
    data: { name: 'VerbaFlow Inc.', period: 'Oct 2022', status: 'completed' } as ProjectData,
  },
  {
    t: 0.2,
    label: 'Q1 2023',
    sub: 'First Clients',
    overlayType: 'project',
    data: { name: 'MLLC Nonprofit', period: 'Jan 2023', status: 'completed', slug: 'mllc' } as ProjectData,
  },
  {
    t: 0.35,
    label: 'Q3 2023',
    sub: 'AI Pivot',
    overlayType: 'project',
    data: { name: 'Galaxy Platform', period: 'Jul 2023', status: 'completed', slug: 'galaxy' } as ProjectData,
  },
  {
    t: 0.5,
    label: 'Q1 2024',
    sub: 'Healthcare',
    overlayType: 'project',
    data: { name: 'PriorZap MVP', period: 'Jan 2024', status: 'completed', slug: 'priorzap' } as ProjectData,
  },
  {
    t: 0.65,
    label: 'Q3 2024',
    sub: 'Extension',
    overlayType: 'project',
    data: { name: 'Samurai Browser', period: 'Jul 2024', status: 'in-progress', slug: 'samurai' } as ProjectData,
  },
  {
    t: 0.8,
    label: 'Q1 2025',
    sub: 'Scale',
    overlayType: 'project',
    data: { name: 'Agency Vertical', period: 'Jan 2025', status: 'in-progress' } as ProjectData,
  },
  {
    t: 0.95,
    label: 'Q3 2025',
    sub: 'Enterprise',
    overlayType: 'project',
    data: { name: 'Enterprise Suite', period: 'Jul 2025', status: 'planned' } as ProjectData,
  },
];

const NETWORK_NODES: HelixNode[] = [
  {
    t: 0.1,
    label: 'Web Design',
    overlayType: 'iframe',
    data: { url: '/agency/web-design', fallbackImg: '/previews/web-design.jpg' } as IframeData,
  },
  {
    t: 0.25,
    label: 'AI Automation',
    overlayType: 'iframe',
    data: { url: '/agency/ai-automation', fallbackImg: '/previews/ai-auto.jpg' } as IframeData,
  },
  {
    t: 0.4,
    label: 'Marketing',
    overlayType: 'iframe',
    data: { url: '/agency/marketing', fallbackImg: '/previews/marketing.jpg' } as IframeData,
  },
  {
    t: 0.55,
    label: 'Cloud Solutions',
    overlayType: 'iframe',
    data: { url: '/agency/cloud', fallbackImg: '/previews/cloud.jpg' } as IframeData,
  },
  {
    t: 0.7,
    label: 'Mobile Apps',
    overlayType: 'iframe',
    data: { url: '/agency/mobile', fallbackImg: '/previews/mobile.jpg' } as IframeData,
  },
  {
    t: 0.85,
    label: 'Data Analytics',
    overlayType: 'iframe',
    data: { url: '/agency/analytics', fallbackImg: '/previews/analytics.jpg' } as IframeData,
  },
];

// ─── Adaptive granularity for project nodes ──────────────────────────────────

export function pickGranularity(n: number): 'quarter' | 'month' | 'day' {
  if (n <= 12) return 'quarter';
  if (n <= 40) return 'month';
  return 'day';
}

// ─── Variation definitions ───────────────────────────────────────────────────

export const VARIATIONS: HelixVariation[] = [
  {
    id: 'biometric-ledger',
    title: 'Biometric Ledger',
    subtitle: 'Architectural precision',
    amplitude: 45,
    rungCount: 8,
    rungStyle: 'capsule',
    nodeStyle: 'puck',
    nodeRadius: 0.35,
    emissive: 1.2,
    accentColor: '#A5D6A7',
    secondaryColor: '#81C784',
    nodes: METRIC_NODES,
    offsetX: -3.5,
    showBackbone: true,
  },
  {
    id: 'chronological-pipeline',
    title: 'Chronological Pipeline',
    subtitle: 'Growth narrative',
    amplitude: 40,
    rungCount: 12,
    rungStyle: 'glass',
    nodeStyle: 'flask',
    nodeRadius: 0.4,
    emissive: 1.0,
    accentColor: '#A5D6A7',
    secondaryColor: '#66BB6A',
    nodes: PROJECT_NODES,
    offsetX: 0,
    showBackbone: true,
  },
  {
    id: 'quantum-network',
    title: 'Quantum Network',
    subtitle: 'Interactive density',
    amplitude: 35,
    rungCount: 0,
    rungStyle: 'none',
    nodeStyle: 'orb',
    nodeRadius: 0.3,
    emissive: 0.8,
    accentColor: '#A5D6A7',
    secondaryColor: '#4CAF50',
    nodes: NETWORK_NODES,
    offsetX: 3.5,
    showBackbone: true,
    orbCloud: {
      count: 20,
      minRadius: 0.18,
      maxRadius: 0.55,
      opacity: 0.25,
    },
  },
];

// ─── Shared animation constants ──────────────────────────────────────────────

export const ANIMATION = {
  /** Rotation speed in radians per second */
  rotationSpeed: 0.12,
  /** Float amplitude in scene units */
  floatAmplitude: 0.08,
  /** Float period in seconds */
  floatPeriod: 4,
  /** Hover slow-mo target speed */
  hoverSpeed: 0.04,
  /** Hover speed transition duration (seconds) */
  hoverTransition: 0.4,
  /** Camera nudge toward hovered helix */
  cameraNudge: 0.3,
  /** Entry fog density start */
  fogDensityStart: 0.4,
  /** Entry fog density end */
  fogDensityEnd: 0.04,
  /** Entry fog transition duration */
  fogDuration: 1.6,
  /** Entry stagger delay per helix */
  staggerDelay: 0.2,
  /** Entry scale-in duration */
  scaleInDuration: 0.8,
} as const;
