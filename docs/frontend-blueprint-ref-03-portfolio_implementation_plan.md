# Sandeep Ghotra — Portfolio Website Implementation Plan
## Knowledge-Grounded Personal Portfolio (Kreos-Inspired)

This document is a complete implementation blueprint for building Sandeep Ghotra's personal portfolio website. It is designed to be consumed by an agentic UI tool (Gemini, Lovable, v0, or similar) as the absolute source of truth. Every component, every piece of copy, every data point must come from the Skill Ontology and Mega Pitch data below — never generate placeholder content.

---

## Table of Contents
1. Architecture Decision
2. Design System Specification
3. Data Layer — The Knowledge Base
4. Component Specifications (7 sections)
5. Interaction & Animation Specification
6. Responsive Breakpoint Strategy
7. Accessibility Requirements
8. Performance Budget
9. Deployment & Infrastructure
10. SEO & Meta Strategy

---

## 1. Architecture Decision

### Recommended Stack
- **Framework**: Next.js 14+ (App Router) with React 19
- **Styling**: Tailwind CSS v4 + CSS custom properties for theming
- **Animation**: Framer Motion for scroll-triggered and interaction animations
- **Typography**: Geist (primary), Inter (body), Geist Mono (code/metrics)
- **Icons**: Lucide React
- **Deployment**: Vercel (zero-config for Next.js)
- **Content**: Static generation (SSG) — no CMS needed, all content is baked from the knowledge base

### Why Next.js over alternatives
- Static export capability for pure portfolio (no server needed)
- Image optimization built-in (critical for portfolio)
- App Router enables layout nesting (shared navigation/footer)
- Vercel deployment is zero-friction
- React Server Components keep JS bundle small

### File Structure
```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, theme
│   ├── page.tsx                # Home: Hero + Domain Matrix + Timeline
│   ├── domains/
│   │   ├── [domain]/
│   │   │   └── page.tsx        # Domain detail page (health, finance, etc.)
│   ├── projects/
│   │   └── page.tsx            # Project showcase grid
│   └── contact/
│       └── page.tsx            # Contact/CTA page
├── components/
│   ├── hero/
│   │   ├── HeroSection.tsx
│   │   └── AIChatSimulation.tsx
│   ├── domains/
│   │   ├── DomainMatrix.tsx
│   │   ├── DomainToggle.tsx
│   │   └── DomainCard.tsx
│   ├── timeline/
│   │   ├── ExperienceTimeline.tsx
│   │   └── TimelineNode.tsx
│   ├── projects/
│   │   ├── ProjectGrid.tsx
│   │   └── ProjectCard.tsx
│   ├── metrics/
│   │   ├── MetricsBanner.tsx
│   │   └── MetricCard.tsx
│   ├── navigation/
│   │   ├── Navbar.tsx
│   │   ├── SideNav.tsx
│   │   └── MobileMenu.tsx
│   ├── footer/
│   │   └── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       └── SectionHeading.tsx
├── data/
│   ├── domains.ts              # Domain definitions, skills, metrics
│   ├── projects.ts             # Project portfolio data
│   ├── timeline.ts             # Experience timeline entries
│   └── metrics.ts              # Cross-domain impact metrics
├── lib/
│   ├── fonts.ts                # Font loading configuration
│   └── utils.ts                # Utility functions
├── styles/
│   └── globals.css             # Tailwind directives + custom properties
├── public/
│   └── og-image.png            # Open Graph image
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 2. Design System Specification

### Color Palette (Kreos-Inspired)

```css
:root {
  /* Core */
  --color-bg-primary: #080808;
  --color-bg-secondary: #0f1115;
  --color-bg-card: #141418;
  --color-bg-elevated: #1a1a1f;

  /* Borders */
  --color-border-subtle: rgba(255, 255, 255, 0.06);
  --color-border-default: rgba(255, 255, 255, 0.10);
  --color-border-strong: rgba(255, 255, 255, 0.15);

  /* Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #7c7c7c;
  --color-text-tertiary: #505050;
  --color-text-inverse: #080808;

  /* Surfaces */
  --color-surface-warm: #f5f4f2;
  --color-surface-cool: #f6f7f9;
  --color-surface-muted: #ededeb;

  /* Accents — one per domain */
  --color-accent-health: #00c203;       /* Kreos green */
  --color-accent-finance: #2E75B6;      /* Trust blue */
  --color-accent-cloud: #7C3AED;        /* Infrastructure purple */
  --color-accent-aiml: #F59E0B;         /* Intelligence amber */
  --color-accent-tech: #06B6D4;         /* Platform cyan */
  --color-accent-transport: #EF4444;    /* Operations red */

  /* Functional */
  --color-success: #00c203;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

### Typography Scale

```css
/* Display — Geist or Manrope */
.text-display-xl { font-size: 72px; line-height: 1.0; font-weight: 700; letter-spacing: -0.03em; }
.text-display-lg { font-size: 56px; line-height: 1.05; font-weight: 700; letter-spacing: -0.02em; }
.text-display-md { font-size: 40px; line-height: 1.1; font-weight: 600; letter-spacing: -0.02em; }

/* Headings — Geist */
.text-heading-lg { font-size: 32px; line-height: 1.2; font-weight: 600; }
.text-heading-md { font-size: 24px; line-height: 1.3; font-weight: 600; }
.text-heading-sm { font-size: 20px; line-height: 1.4; font-weight: 600; }

/* Body — Inter */
.text-body-lg { font-size: 18px; line-height: 1.6; font-weight: 400; }
.text-body-md { font-size: 16px; line-height: 1.6; font-weight: 400; }
.text-body-sm { font-size: 14px; line-height: 1.5; font-weight: 400; }

/* Utility */
.text-label { font-size: 11px; line-height: 1.4; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.text-mono { font-family: 'Geist Mono', monospace; font-size: 14px; }
```

### Spacing System
```
4px  — micro gap (icon to text)
8px  — tight (between related elements)
16px — default (within components)
24px — comfortable (between sections)
32px — tablet section gap
48px — desktop section gap (Kreos uses this)
64px — major section separation
96px — hero/section top padding
```

### Border Radius
```
4px  — subtle (badges, tags)
8px  — default (cards, inputs)
12px — comfortable (buttons)
16px — prominent (panels)
24px — large (hero cards, modals)
9999px — pill (toggle buttons, chips)
```

### Glassmorphism Pattern (for cards & panels)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}

.glass-card-hover:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
```

---

## 3. Data Layer — The Knowledge Base

ALL content on the portfolio must come from these data structures. This is the knowledge-grounded generation principle — no placeholder text anywhere.

### 3.1 Domain Definitions (`data/domains.ts`)

```typescript
export interface Domain {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  icon: string; // Lucide icon name
  resumeCount: number;
  subDomains: SubDomain[];
  techStack: TechCategory[];
  keyMetrics: Metric[];
  pitchHook: string;
  portfolioProjects: Project[];
}

export interface SubDomain {
  name: string;
  fileCount: number;
  focus: string;
}

export interface TechCategory {
  category: string;
  items: string[];
}

export interface Metric {
  label: string;
  value: string;
  context: string;
}

export const domains: Domain[] = [
  {
    id: "health",
    name: "Healthcare",
    tagline: "Clinical Floor to Balance Sheet",
    accent: "#00c203",
    icon: "Heart",
    resumeCount: 142,
    subDomains: [
      { name: "Healthcare Data Analytics", fileCount: 78, focus: "Patient analytics, population health, HEDIS, predictive modeling" },
      { name: "Revenue Cycle Management", fileCount: 23, focus: "Denial management, billing optimization, Epic HB/PB" },
      { name: "Clinical Informatics", fileCount: 20, focus: "Epic Clarity, HL7/FHIR, clinical decision support" },
      { name: "Health IT Engineering", fileCount: 10, focus: "FHIR APIs, cloud migration, interoperability" },
      { name: "Revenue Integrity", fileCount: 7, focus: "CDM optimization, Medicare/Medicaid compliance" },
      { name: "Claims", fileCount: 4, focus: "Adjudication, fraud detection, appeals automation" },
    ],
    techStack: [
      { category: "Languages", items: ["Python", "R", "SQL", "PostgreSQL", "T-SQL"] },
      { category: "Cloud", items: ["Azure Databricks", "Azure Data Factory", "AWS S3", "AWS RDS", "AWS SageMaker"] },
      { category: "EHR Systems", items: ["Epic Clarity", "Epic HB/PB Resolute", "Meditech", "Oracle Health"] },
      { category: "Standards", items: ["HL7", "FHIR R4", "SNOMED CT", "LOINC", "ICD-10", "CPT", "DRG", "HEDIS"] },
      { category: "BI", items: ["Tableau", "Power BI", "Looker", "SSRS"] },
      { category: "AI/ML", items: ["TensorFlow", "scikit-learn", "LangChain", "RAG", "Autogen"] },
    ],
    keyMetrics: [
      { label: "Denial Rate Reduction", value: "28%", context: "Through automated root cause analysis" },
      { label: "Claims Processing", value: "60%", context: "Workload reduction via multi-agent AI" },
      { label: "Patient Records", value: "15M+", context: "Managed with 100% HIPAA compliance" },
      { label: "ED Visit Reduction", value: "14%", context: "Through predictive analytics dashboards" },
      { label: "Reimbursement Accuracy", value: "+17%", context: "Epic HB/PB Resolute optimization" },
      { label: "Interoperability", value: "+28%", context: "FHIR pipeline implementation" },
    ],
    pitchHook: "I understand healthcare data from the clinical floor to the balance sheet. I have built the pipelines, optimized the revenue cycles, ensured the compliance, and deployed the AI systems.",
    portfolioProjects: [
      // Populated from health_knowledge_base.md portfolio projects
    ],
  },
  {
    id: "finance",
    name: "Finance",
    tagline: "Compliance-Grade AI at Scale",
    accent: "#2E75B6",
    icon: "TrendingUp",
    resumeCount: 14,
    subDomains: [
      { name: "Fintech/Compliance", fileCount: 6, focus: "Gen AI deployment, SOC 2, PCI DSS" },
      { name: "Banking", fileCount: 5, focus: "Real-time analytics, ML models, Capital One/Wells Fargo" },
      { name: "Insurance", fileCount: 3, focus: "Claims analytics, underwriting, risk assessment" },
    ],
    techStack: [
      { category: "Languages", items: ["Python", "TypeScript", "Go", "Rust", "SQL"] },
      { category: "AI/ML", items: ["PyTorch", "TensorFlow", "LangChain", "LlamaIndex", "RAG", "vLLM"] },
      { category: "Compliance", items: ["SOC 2", "PCI DSS", "RBAC", "OWASP", "Audit Trail Automation"] },
      { category: "Cloud", items: ["Azure Databricks", "AWS SageMaker", "Docker", "Kubernetes", "Terraform"] },
    ],
    keyMetrics: [
      { label: "CI/CD Success Rate", value: "99.9%", context: "Deployment pipeline reliability" },
      { label: "Cost Reduction", value: "35%", context: "Through Gen AI agent automation" },
      { label: "Prediction Accuracy", value: "+18%", context: "Real-time customer insights" },
      { label: "Cloud Costs", value: "-28%", context: "Azure migration optimization" },
    ],
    pitchHook: "Financial services need builders who understand that every line of code has compliance implications. I bring the AI engineering capability combined with the discipline that regulated environments demand.",
    portfolioProjects: [],
  },
  {
    id: "cloud",
    name: "Cloud Ops",
    tagline: "Automated, Governed, Monitored",
    accent: "#7C3AED",
    icon: "Cloud",
    resumeCount: 15,
    subDomains: [
      { name: "Infrastructure/DevSecOps", fileCount: 15, focus: "Terraform, AWS/Azure, Databricks lakehouse, CI/CD, monitoring" },
    ],
    techStack: [
      { category: "Cloud", items: ["AWS S3", "AWS RDS", "AWS Lambda", "AWS Control Tower", "Azure Databricks", "Azure Data Factory"] },
      { category: "IaC", items: ["Terraform", "CloudFormation", "Ansible"] },
      { category: "Containers", items: ["Docker", "Kubernetes", "Helm", "ArgoCD"] },
      { category: "Data", items: ["Databricks", "Delta Lake", "Unity Catalog", "Snowflake", "Kafka", "Spark"] },
      { category: "Monitoring", items: ["Splunk", "Prometheus", "Datadog", "PagerDuty"] },
      { category: "Security", items: ["NIST 800-53", "FedRAMP", "SOC 2", "HIPAA", "RBAC"] },
    ],
    keyMetrics: [
      { label: "Deployment Time", value: "8hr → 45min", context: "Terraform automation" },
      { label: "Cloud Cost Reduction", value: "17.5%", context: "Reserved instances + right-sizing" },
      { label: "Security Incidents", value: "-17%", context: "Unity Catalog governance" },
      { label: "Incident Detection", value: "4.5x faster", context: "Splunk observability platform" },
    ],
    pitchHook: "Infrastructure is the foundation everything else runs on. I build it right the first time: automated, governed, monitored, and cost-optimized.",
    portfolioProjects: [],
  },
  {
    id: "aiml",
    name: "AI/ML",
    tagline: "AI That Ships to Production",
    accent: "#F59E0B",
    icon: "Brain",
    resumeCount: 20,
    subDomains: [
      { name: "AI Engineering", fileCount: 12, focus: "LLMs, GenAI, RAG, multi-agent systems, LangChain" },
      { name: "Data Science", fileCount: 8, focus: "ML models, computer vision, NLP, predictive analytics" },
    ],
    techStack: [
      { category: "LLM Stack", items: ["PyTorch", "Hugging Face", "LangChain", "LlamaIndex", "Autogen", "vLLM", "RAG"] },
      { category: "Vision", items: ["YOLO v8", "Faster R-CNN", "CLIP", "SAM", "Stable Diffusion"] },
      { category: "MLOps", items: ["MLFlow", "W&B", "SageMaker", "TensorRT", "ONNX"] },
      { category: "Infrastructure", items: ["Docker", "Kubernetes", "Terraform", "ArgoCD"] },
    ],
    keyMetrics: [
      { label: "Document Accuracy", value: "95%", context: "RAG system document processing" },
      { label: "Inference Latency", value: "-40%", context: "Model optimization + caching" },
      { label: "Training Time", value: "-50%", context: "SageMaker distributed training" },
      { label: "Engagement", value: "+30%", context: "AI-powered recommendations" },
    ],
    pitchHook: "I build AI that ships. Not demos, not proof-of-concepts that sit in a slide deck. Production systems with monitoring, governance, and measurable ROI.",
    portfolioProjects: [],
  },
  {
    id: "tech",
    name: "Technology",
    tagline: "Data Platforms to Dashboards",
    accent: "#06B6D4",
    icon: "Code",
    resumeCount: 84,
    subDomains: [
      { name: "Software Engineering", fileCount: 25, focus: "Full-stack, microservices, React/Next.js, Go" },
      { name: "Data Engineering", fileCount: 22, focus: "ETL, Spark, Airflow, Kafka, Snowflake" },
      { name: "Business Intelligence", fileCount: 18, focus: "Power BI (DAX), Tableau, enterprise reporting" },
      { name: "Product Management", fileCount: 10, focus: "Agile delivery, stakeholder management" },
      { name: "Consulting/Advisory", fileCount: 9, focus: "EY, Deloitte, KPMG, Accenture" },
    ],
    techStack: [
      { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
      { category: "Backend", items: ["Python", "Go", "FastAPI", "Node.js"] },
      { category: "Data", items: ["Spark", "Airflow", "Kafka", "Snowflake", "Microsoft Fabric", "dbt"] },
      { category: "BI", items: ["Power BI (DAX)", "Tableau", "Looker", "SSRS"] },
    ],
    keyMetrics: [
      { label: "Platform Scalability", value: "3.5x", context: "Microsoft Fabric enhancement" },
      { label: "Data Errors", value: "-24%", context: "Python automation + anomaly detection" },
      { label: "Delivery Efficiency", value: "+22%", context: "Agile sprint orchestration" },
      { label: "Query Performance", value: "+17.5%", context: "SQL optimization" },
    ],
    pitchHook: "I have built data platforms at scale, delivered enterprise consulting engagements, and shipped production software. I bridge the gap between business strategy and technical execution.",
    portfolioProjects: [],
  },
];
```

### 3.2 Cross-Domain Metrics (`data/metrics.ts`)

```typescript
export const crossDomainMetrics = [
  { label: "Cost Reduction", value: "$12.5k–$45k", context: "Annual savings per project", icon: "DollarSign" },
  { label: "Efficiency Gains", value: "17–40%", context: "Processing time reductions", icon: "Zap" },
  { label: "Accuracy", value: "15–38%", context: "Error reduction via automation", icon: "Target" },
  { label: "Compliance", value: "100%", context: "Healthcare & finance environments", icon: "Shield" },
  { label: "Scalability", value: "2x–3.5x", context: "Platform improvements", icon: "TrendingUp" },
  { label: "AI Automation", value: "30–60%", context: "Workload reduction", icon: "Bot" },
  { label: "Deployment", value: "99.9%", context: "CI/CD success rate", icon: "Rocket" },
];
```

### 3.3 Experience Timeline (`data/timeline.ts`)

```typescript
export interface TimelineEntry {
  period: string;
  title: string;
  focus: string;
  domains: string[]; // domain IDs
  techHighlights: string[];
  impact: string;
}

export const timeline: TimelineEntry[] = [
  {
    period: "Foundation",
    title: "Healthcare Data & Epic EHR Systems",
    focus: "SQL-based reporting pipelines for patient access, care gaps, and HEDIS quality metrics",
    domains: ["health"],
    techHighlights: ["Epic Clarity", "SQL", "HEDIS", "ICD-10", "CPT"],
    impact: "Built fluency in CPT codes, DRG groupings, and compliance frameworks",
  },
  {
    period: "Expansion",
    title: "Revenue Cycle Management",
    focus: "Direct financial impact of data quality on claims processing and denial management",
    domains: ["health", "finance"],
    techHighlights: ["Epic HB/PB", "ETL Pipelines", "Python", "Denial Analytics"],
    impact: "28% denial rate reduction, 17% reimbursement accuracy improvement",
  },
  {
    period: "Cloud Scale",
    title: "Cloud Infrastructure & Lakehouse Architecture",
    focus: "Databricks lakehouse solutions, Terraform automation, governance frameworks",
    domains: ["cloud"],
    techHighlights: ["Terraform", "Databricks", "AWS", "Delta Lake", "Splunk"],
    impact: "Deployment time from 8 hours to 45 minutes, 17% fewer security incidents",
  },
  {
    period: "AI/ML",
    title: "Production AI Systems",
    focus: "Fine-tuning foundation models, RAG systems, multi-agent architectures",
    domains: ["aiml"],
    techHighlights: ["PyTorch", "LangChain", "RAG", "vLLM", "Autogen"],
    impact: "95% document accuracy, 40% latency reduction, 60% workload automation",
  },
  {
    period: "Enterprise",
    title: "Big 4 Consulting & Platform Engineering",
    focus: "Complex enterprise environments with multiple stakeholders and competing priorities",
    domains: ["tech"],
    techHighlights: ["EY", "Deloitte", "KPMG", "Accenture", "Power BI", "React", "Go"],
    impact: "Fortune 500 delivery, 22% efficiency improvement, 3.5x scalability",
  },
  {
    period: "Convergence",
    title: "Cross-Industry Data Architect & AI Engineer",
    focus: "Unified methodology: Profile the data → Design the architecture → Build the pipeline → Deploy with monitoring → Iterate",
    domains: ["health", "finance", "cloud", "aiml", "tech"],
    techHighlights: ["Full Stack", "Cross-Domain", "297 Resumes", "6 Domains"],
    impact: "Production systems across healthcare, finance, cloud, and enterprise technology",
  },
];
```

---

## 4. Component Specifications

### 4.1 Hero Section

**Concept**: Split-screen design inspired by Kreos. Left side introduces the candidate with the value proposition. Right side features an interactive AI chat simulation (the "Communication Brain Intelligence").

**Layout**:
```
┌──────────────────────────────────────────────────────┐
│  Navigation Bar (fixed, 64px height, z-50)           │
├──────────────────────┬───────────────────────────────┤
│                      │                               │
│  LEFT PANEL          │  RIGHT PANEL                  │
│  (55% width)         │  (45% width)                  │
│                      │                               │
│  "I build production │  ┌─────────────────────┐      │
│   systems that work" │  │ AI Chat Simulation  │      │
│                      │  │                     │      │
│  [Cross-Industry     │  │ > What domain?      │      │
│   Data Architect     │  │ < Healthcare. I've  │      │
│   & AI Engineer]     │  │   built solutions   │      │
│                      │  │   across the full   │      │
│  297 resumes.        │  │   lifecycle...      │      │
│  6 domains.          │  │                     │      │
│  18 specializations. │  │ [Health] [Finance]  │      │
│                      │  │ [Cloud] [AI/ML]     │      │
│  [View Domains ↓]    │  └─────────────────────┘      │
│                      │                               │
└──────────────────────┴───────────────────────────────┘
```

**Left Panel Content** (from Unified Mega Pitch):
- Headline: "I build production systems that work."
- Subtitle: "Cross-Industry Data Architect & AI Engineer"
- Body: "297 unique resumes. 6 domains. 18 sub-specializations."
- Secondary text: "I take messy, fragmented data environments and turn them into clean, governed, actionable infrastructure."
- CTA Button: "Explore Domains" → scrolls to Domain Matrix

**Right Panel — AI Chat Simulation**:
An interactive component that simulates a conversation. Pre-scripted responses that cycle through domains. When a user clicks a domain chip (Health, Finance, Cloud, AI/ML, Tech), the chat responds with the domain's `pitchHook` from the data layer.

**Animation**: Hero fades in on mount (opacity 0→1, y: 20→0, 0.6s spring). Chat messages appear with stagger (100ms delay between messages). Domain chips pulse subtly to invite interaction.

**Responsive**: On mobile (<810px), stack vertically — left panel full width, chat simulation below.

---

### 4.2 Domain-Specific Skill Matrix

**Concept**: Interactive grid with toggle buttons for each domain. When a user selects "Healthcare", the UI dynamically displays healthcare-specific skills, metrics, and tech stack. This is the core UX innovation — recruiters self-select the context most relevant to their hiring needs.

**Layout**:
```
┌──────────────────────────────────────────────────────┐
│  DOMAIN SKILL MATRIX                                 │
│                                                      │
│  [● Healthcare]  [○ Finance]  [○ Cloud]  [○ AI/ML]  │
│  [○ Technology]                                      │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │  Healthcare — Clinical Floor to Balance Sheet│     │
│  │                                             │     │
│  │  142 resumes across 6 sub-domains           │     │
│  │                                             │     │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │     │
│  │  │ 28%      │ │ 15M+     │ │ 60%      │    │     │
│  │  │ Denial ↓ │ │ Records  │ │ Claims ↓ │    │     │
│  │  └──────────┘ └──────────┘ └──────────┘    │     │
│  │                                             │     │
│  │  Sub-Domains:                               │     │
│  │  ┌───────────────────┐ ┌────────────────┐   │     │
│  │  │ Data Analytics 78 │ │ RCM         23 │   │     │
│  │  └───────────────────┘ └────────────────┘   │     │
│  │  ┌───────────────────┐ ┌────────────────┐   │     │
│  │  │ Clinical Info  20 │ │ Health IT   10 │   │     │
│  │  └───────────────────┘ └────────────────┘   │     │
│  │                                             │     │
│  │  Tech Stack:                                │     │
│  │  Epic Clarity · HL7/FHIR · SNOMED CT ·      │     │
│  │  Python · Tableau · LangChain · RAG ...     │     │
│  │                                             │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

**Behavior**:
- Default: Healthcare selected (largest domain, 142 resumes)
- Toggle is mutually exclusive — one domain active at a time
- Active toggle gets the domain's accent color
- Content area transitions with Framer Motion `AnimatePresence` (fade + slide, 200ms)
- Metrics animate in with counting effect (0 → final value, 1.2s ease-out)
- Sub-domain cards show file count as a badge

**Data Binding**: Each domain toggle reads from `domains.ts`. The selected domain's `subDomains`, `techStack`, and `keyMetrics` populate the content area.

---

### 4.3 Experience Narrative Timeline

**Concept**: Vertical timeline with nodes representing career progression. Each node highlights specific responsibilities, tech stacks, and quantifiable impact. Drawing from the Unified Mega Pitch narrative.

**Layout**:
```
┌──────────────────────────────────────────────────────┐
│  EXPERIENCE NARRATIVE                                │
│                                                      │
│  ●──── Foundation                                    │
│  │     Healthcare Data & Epic EHR Systems            │
│  │     SQL reporting, HEDIS, ICD-10, CPT             │
│  │     "Built fluency in the data layer most         │
│  │      healthcare orgs struggle with"               │
│  │                                                   │
│  ●──── Expansion                                     │
│  │     Revenue Cycle Management                      │
│  │     28% denial reduction, 17% accuracy ↑          │
│  │     Epic HB/PB · ETL · Python · Denial Analytics  │
│  │                                                   │
│  ●──── Cloud Scale                                   │
│  │     Lakehouse Architecture                        │
│  │     8hr→45min deployment, -17% security incidents │
│  │     Terraform · Databricks · AWS · Splunk         │
│  │                                                   │
│  ●──── AI/ML                                         │
│  │     Production AI Systems                         │
│  │     95% accuracy, -40% latency, 60% automation    │
│  │     PyTorch · LangChain · RAG · Autogen           │
│  │                                                   │
│  ●──── Enterprise                                    │
│  │     Big 4 Consulting                              │
│  │     Fortune 500, 22% efficiency, 3.5x scale       │
│  │     EY · Deloitte · KPMG · Power BI · React       │
│  │                                                   │
│  ●──── Convergence                                   │
│        Cross-Industry Data Architect & AI Engineer    │
│        297 resumes · 6 domains · Production systems   │
└──────────────────────────────────────────────────────┘
```

**Animation**: Timeline nodes appear on scroll (intersection observer). Each node fades in from left with 150ms stagger. The connecting line draws progressively as the user scrolls (SVG `stroke-dashoffset` animation).

**Interaction**: Hovering a node highlights the associated domain tags (color-coded pills). Clicking expands the node to show detailed narrative text from the Mega Pitch.

---

### 4.4 Cross-Domain Metrics Banner

**Concept**: A horizontal scroll or flex-wrap strip of key metrics that establish credibility immediately. Placed between the Hero and Domain Matrix.

**Data**: From `crossDomainMetrics` array. 7 metric cards.

**Card Design**:
```tsx
<div className="glass-card p-6 text-center min-w-[160px]">
  <Icon className="mx-auto mb-2 text-accent" size={20} />
  <p className="text-display-md text-white font-bold">{value}</p>
  <p className="text-body-sm text-secondary">{label}</p>
  <p className="text-label text-tertiary mt-1">{context}</p>
</div>
```

**Animation**: Metrics count up from 0 when scrolled into view. Use `useInView` from Framer Motion + a custom counter hook.

---

### 4.5 Project Showcase Grid

**Concept**: Filterable grid of portfolio projects, each card showing the project name, tech stack, domain tag, and key impact metric.

**Filter**: Domain-based filter chips (same as Domain Matrix toggles). "All" shows every project.

**Card**: Glass card with domain accent border-left. Hover reveals full description overlay.

---

### 4.6 Navigation

**Desktop**: Fixed top bar (64px) with transparent background that gets `backdrop-blur` on scroll. Logo left, nav links center, CTA right.

**Mobile**: Hamburger menu → full-screen overlay with domain links.

**Kreos Pattern**: 58px fixed header, z-10. Use `scroll-padding-top: 64px` for anchor navigation.

---

### 4.7 Footer

Minimal footer with contact info, social links (GitHub, LinkedIn), and the pitch close: "Let us look at the problem together and build the solution."

---

## 5. Interaction & Animation Specification

### Scroll-Triggered Animations (Framer Motion)

```typescript
// Standard fade-up for sections
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
};

// Stagger children
const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.1 } },
};

// Domain toggle content swap
const contentSwap = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.25 },
};
```

### Hover Effects
- Cards: `translateY(-2px)` + border color brightens
- Buttons: `scale(0.98)` on active press
- Domain chips: Background fills with domain accent color
- Timeline nodes: Glow effect using `box-shadow` with domain accent

### Page Transitions
Use Next.js App Router layout with Framer Motion `AnimatePresence` for route transitions (fade, 200ms).

---

## 6. Responsive Breakpoint Strategy

```
Mobile-first approach. All styles start at 390px and scale up.

sm:  640px   — Side margins expand, text scales up
md:  810px   — 2-column layouts begin (Kreos tablet)
lg:  1200px  — Full desktop layout, sidebar nav appears (Kreos desktop)
xl:  1440px  — Max content width, generous margins
2xl: 2000px  — Ultra-wide: content stays centered, bg extends

Hero:      Stack vertical (<810px) → Split horizontal (≥810px)
Domain:    Single column (<810px) → 2-col grid (≥810px) → Full layout (≥1200px)
Timeline:  Centered single column always (responsive by nature)
Metrics:   Horizontal scroll (<810px) → Flex wrap (≥810px) → Single row (≥1200px)
```

---

## 7. Accessibility Requirements

- Color contrast: 4.5:1 minimum for body text, 3:1 for large text
- All interactive elements keyboard-focusable with visible focus rings
- Domain toggles operable via arrow keys
- Timeline navigable via Tab
- `aria-labels` on all icon-only buttons
- `prefers-reduced-motion`: disable all animations, show content immediately
- `prefers-color-scheme`: respect system dark/light preference (default dark)
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Skip-to-content link as first focusable element

---

## 8. Performance Budget

- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total JS bundle**: < 150KB gzipped (use dynamic imports for domain data)
- **Font loading**: `font-display: swap`, preload primary font
- **Images**: Next.js `<Image>` with WebP, lazy loading below fold
- **Lighthouse score**: 90+ across all categories

---

## 9. Deployment & Infrastructure

- **Platform**: Vercel (optimal for Next.js)
- **Domain**: Custom domain via Vercel DNS
- **Analytics**: Vercel Analytics (built-in, privacy-friendly)
- **Build**: Static export (`output: 'export'` in next.config) if no server features needed
- **CI**: Vercel auto-deploys on push to main
- **Preview**: Automatic preview deployments for PRs

---

## 10. SEO & Meta Strategy

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: "Sandeep Ghotra | Cross-Industry Data Architect & AI Engineer",
  description: "297 resumes. 6 domains. Production systems across healthcare, finance, cloud, AI/ML, and enterprise technology.",
  openGraph: {
    title: "Sandeep Ghotra — Portfolio",
    description: "Full-stack data architect building production AI systems across healthcare, finance, and enterprise technology.",
    images: ["/og-image.png"],
  },
};
```

Each domain page gets its own meta tags:
- `/domains/health` → "Healthcare Data Architect | Epic, FHIR, HIPAA"
- `/domains/finance` → "Enterprise AI Engineer for Financial Services"
- `/domains/cloud` → "Cloud Infrastructure Architect | AWS, Terraform, Databricks"
- `/domains/aiml` → "Applied AI Engineer | LLMs, RAG, Production ML"
- `/domains/tech` → "Full-Stack Data & Platform Engineer"

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Next.js project setup with App Router
- Design system: colors, typography, spacing as CSS custom properties
- Font loading (Geist, Inter, Geist Mono)
- Data layer: all TypeScript files in `data/`
- Navigation component
- Responsive layout shell

### Phase 2: Core Components (Week 2)
- Hero Section with static content
- AI Chat Simulation component
- Domain Matrix with toggle functionality
- Cross-Domain Metrics Banner
- Glassmorphism card components

### Phase 3: Interactive Features (Week 3)
- Experience Timeline with scroll animations
- Domain Matrix content transitions
- Metric counting animations
- Project showcase grid with filtering
- Mobile menu and responsive polish

### Phase 4: Polish & Deploy (Week 4)
- Accessibility audit and fixes
- Performance optimization (bundle analysis, image optimization)
- SEO meta tags
- Vercel deployment
- Lighthouse audit → iterate to 90+
- OG image creation
