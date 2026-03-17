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
}

export const agencyDomains: AgencyDomain[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    tagline: 'Clinical Floor to Balance Sheet',
    accent: '#00c203',
    accentVar: 'var(--color-accent-health)',
    iconName: 'Heart',
    pitchHook:
      'We understand healthcare data from the clinical floor to the balance sheet. We build the pipelines, optimize revenue cycles, ensure compliance, and deploy AI systems that process millions of patient records at scale.',
    metrics: [
      { value: '28%', label: 'Denial Rate Reduction', subtext: 'Automated root cause analysis' },
      { value: '60%', label: 'Claims Processing', subtext: 'Workload reduction via multi-agent AI' },
      { value: '15M+', label: 'Patient Records', subtext: 'Managed with full HIPAA compliance' },
    ],
    techStack: ['Epic Clarity', 'HL7/FHIR', 'Python', 'RAG', 'Azure Databricks'],
    frameId: 'frame-healthcare',
  },
  {
    id: 'finance',
    name: 'Finance',
    tagline: 'Compliance-Grade AI at Scale',
    accent: '#2E75B6',
    accentVar: 'var(--color-accent-finance)',
    iconName: 'TrendingUp',
    pitchHook:
      'Financial services need builders who understand that every line of code has compliance implications. We bring AI engineering capability combined with the discipline that regulated environments demand — SOC 2, PCI DSS, and production-ready.',
    metrics: [
      { value: '99.9%', label: 'CI/CD Success Rate', subtext: 'Deployment pipeline reliability' },
      { value: '35%', label: 'Cost Reduction', subtext: 'Through Gen AI agent automation' },
      { value: '18%', label: 'Accuracy Gain', subtext: 'Real-time customer predictions' },
    ],
    techStack: ['PyTorch', 'LangChain', 'SOC 2', 'PCI DSS', 'Kubernetes'],
    frameId: 'frame-finance',
  },
  {
    id: 'platform',
    name: 'Intelligent Engineering',
    tagline: 'Cloud · AI · Data · Platform',
    accent: '#7C3AED',
    accentVar: 'var(--color-accent-cloud)',
    iconName: 'Layers',
    pitchHook:
      'We build the complete stack — cloud infrastructure that never sleeps, AI systems that ship to production, and full-stack platforms at enterprise scale. From Terraform IaC and Databricks Lakehouse to vLLM inference and clinical superintelligence. One engineering discipline, every layer.',
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
  },
];
