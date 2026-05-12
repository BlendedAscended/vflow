import type { MockNavItem } from '../components/agency/mocks/SaaSBrowserMock';

export interface AgencyMetric {
  value: string;
  label: string;
  subtext: string;
}

export interface AgencyDomain {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  accentVar: string;
  iconName: string;
  pitchHook: string;
  metrics: AgencyMetric[];
  techStack: string[];
  frameId: string;
  // SaaS mock fields
  mockUrl: string;
  appName: string;
  navItems: MockNavItem[];
  deviceMock?: 'ipad-healthcare' | 'iphone-finance';
}

export const agencyDomains: AgencyDomain[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    tagline: 'Autonomous Revenue Cycle & Clinical AI',
    accent: '#00c203',
    accentVar: 'var(--color-accent-health)',
    iconName: 'Heart',
    pitchHook:
      'Multi-agent systems that prevent denials before they happen, close prior auth loops without human queues, and process millions of patient records with full HIPAA coverage. Deployed for regional health networks — not pilots, production.',
    metrics: [
      { value: '28%', label: 'Denial Rate Reduction', subtext: 'Automated root cause analysis' },
      { value: '60%', label: 'Claims Processing', subtext: 'Workload reduction via multi-agent AI' },
      { value: '15M+', label: 'Patient Records', subtext: 'Managed with full HIPAA compliance' },
    ],
    techStack: ['Epic Clarity', 'HL7/FHIR', 'Python', 'RAG', 'Azure Databricks'],
    frameId: 'frame-healthcare',
    mockUrl: 'app.meridianhealth.io/rcm/claims',
    appName: 'Meridian Health AI',
    navItems: [
      { iconName: 'LayoutDashboard', label: 'Dashboard',  active: true  },
      { iconName: 'FileText',        label: 'Claims Mgmt'               },
      { iconName: 'ShieldCheck',     label: 'Prior Auth'                },
      { iconName: 'Activity',        label: 'Revenue Cycle'             },
      { iconName: 'BarChart3',       label: 'CDS Analytics'             },
      { iconName: 'Settings',        label: 'Configure →', configure: true },
    ],
    deviceMock: 'ipad-healthcare',
  },
  {
    id: 'finance',
    name: 'Finance',
    tagline: 'Compliance-Grade Agentic Infrastructure',
    accent: '#2E75B6',
    accentVar: 'var(--color-accent-finance)',
    iconName: 'TrendingUp',
    pitchHook:
      'Agentic pipelines built for regulated environments. SOC 2 controls automated end-to-end, real-time cost and compliance monitoring, AI-driven audit-ready reporting. Every system ships with the discipline that fintech and financial services demand.',
    metrics: [
      { value: '99.9%', label: 'CI/CD Success Rate', subtext: 'Deployment pipeline reliability' },
      { value: '35%', label: 'Cost Reduction', subtext: 'Through Gen AI agent automation' },
      { value: '18%', label: 'Accuracy Gain', subtext: 'Real-time customer predictions' },
    ],
    techStack: ['PyTorch', 'LangChain', 'SOC 2', 'PCI DSS', 'Kubernetes'],
    frameId: 'frame-finance',
    mockUrl: 'app.arcafinance.com/compliance',
    appName: 'ArcaFinance Suite',
    navItems: [
      { iconName: 'LayoutDashboard', label: 'Overview',    active: true  },
      { iconName: 'Activity',        label: 'Pipeline'                   },
      { iconName: 'DollarSign',      label: 'Cost Analysis'              },
      { iconName: 'ShieldCheck',     label: 'Compliance'                 },
      { iconName: 'BarChart3',       label: 'Reporting'                  },
      { iconName: 'Settings',        label: 'Configure →', configure: true },
    ],
    deviceMock: 'iphone-finance',
  },
  {
    id: 'platform',
    name: 'Intelligent Engineering',
    tagline: 'Full-Stack Agentic Platform Engineering',
    accent: '#7C3AED',
    accentVar: 'var(--color-accent-cloud)',
    iconName: 'Layers',
    pitchHook:
      'We architect and ship the full agent stack — self-healing Terraform infrastructure, multi-model inference layers, and zero-downtime CI/CD pipelines. From Databricks Lakehouse to vLLM serving. One engineering team, every layer, no handoffs.',
    metrics: [
      { value: '8hr→45min', label: 'Deploy Speed',        subtext: 'Terraform CI/CD pipeline'          },
      { value: '95%',       label: 'AI Accuracy',         subtext: 'RAG document processing'            },
      { value: '17.5%',     label: 'Cloud Cost Reduction', subtext: 'Reserved instances + right-sizing' },
    ],
    techStack: [
      'AWS', 'Azure', 'Databricks', 'Terraform',
      'vLLM', 'Autogen', 'LangChain', 'PyTorch',
      'React', 'Next.js', 'Spark', 'Kubernetes',
    ],
    frameId: 'frame-platform',
    mockUrl: 'ops.cloudstride.io/infra/dashboard',
    appName: 'CloudStride Ops',
    navItems: [
      { iconName: 'Server',          label: 'Infrastructure', active: true },
      { iconName: 'GitBranch',       label: 'CI/CD Pipelines'             },
      { iconName: 'Cpu',             label: 'AI Model Hub'                },
      { iconName: 'DollarSign',      label: 'Cost Management'             },
      { iconName: 'Layers',          label: 'Platform'                    },
      { iconName: 'Settings',        label: 'Configure →',  configure: true },
    ],
  },
];
