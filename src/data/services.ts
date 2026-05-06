export type ServiceCategory =
    | 'AI Agents'
    | 'Software'
    | 'Mobile'
    | 'Compliance'
    | 'Marketing'
    | 'E-commerce'
    | 'Cloud';

export interface ServiceDef {
    _id: string;
    slug: string;
    title: string;
    shortLabel: string;
    icon: 'ai' | 'website' | 'marketing' | 'cloud';
    category: ServiceCategory;
    description: string;
    longDescription: string;
    features: string[];
    price: string;
    benefits: { title: string; description: string }[];
    process: { step: number; title: string; description: string }[];
    faq: { question: string; answer: string }[];
}

export const services: ServiceDef[] = [
    {
        _id: 'f1',
        slug: 'ai-automation',
        title: 'AI Agents & Agentic Automation',
        shortLabel: 'AI Agents',
        icon: 'ai',
        category: 'AI Agents',
        description:
            'Deploy a full agent crew — architect, CEO, designer, compliance officer — built on OpenClaw with Telegram human-in-the-loop. Operations run 24/7 with humans on call.',
        longDescription:
            'We build agent teams, not chatbots. Each engagement deploys an OpenClaw stack with a CEO-agent that delegates to specialist sub-agents — architect, designer, compliance officer, recruiter — and routes ambiguous decisions to your team via Telegram. Tokens flow through OpenCodeGo so cost scales sub-linearly with usage.',
        features: ['OpenClaw Multi-Agent Stack', 'Telegram HITL Bridge', 'Gemini + OpenCodeGo Pipeline', 'Custom Tool Integrations', 'Audit Logs & Cost Caps'],
        price: 'From $295',
        benefits: [
            { title: '24/7 Operations', description: 'Agents run while you sleep, paged only when a human is needed.' },
            { title: 'Sub-linear cost', description: 'OpenCodeGo and prompt caching keep token spend predictable.' },
            { title: 'Audit-ready', description: 'Every agent action logged for compliance review.' },
        ],
        process: [
            { step: 1, title: 'Map workflow', description: 'We map the human steps an agent will replace.' },
            { step: 2, title: 'Build agents', description: 'Stand up the OpenClaw crew with the right tools.' },
            { step: 3, title: 'HITL routing', description: 'Wire Telegram approvals for high-stakes decisions.' },
            { step: 4, title: 'Operate', description: 'Monitor, tune and expand the crew over time.' },
        ],
        faq: [
            { question: 'What is OpenClaw?', answer: 'Our multi-agent runtime — a CEO agent that orchestrates specialist sub-agents and escalates to humans via Telegram.' },
            { question: 'Can humans intervene?', answer: 'Yes — every high-stakes step can route to a Telegram approval before execution.' },
        ],
    },
    {
        _id: 'f2',
        slug: 'software-development',
        title: 'Custom Software & SaaS Development',
        shortLabel: 'Custom Software',
        icon: 'website',
        category: 'Software',
        description:
            'Replace legacy software with bespoke SaaS your team actually wants to use. From TMS and government portals to internal tooling — we build, ship and maintain.',
        longDescription:
            'TMS for trucking. Government permitting portals. Internal tooling for ops teams. We pick the right stack (Next.js, Postgres, tRPC, Prisma — or whatever fits) and ship in weeks, not quarters. Every project includes a maintenance plan so the software keeps earning its keep.',
        features: ['TMS & Logistics Software', 'Government & Public-Sector Portals', 'Internal Tooling & APIs', 'Postgres + Prisma + Next.js', 'Maintenance Retainers'],
        price: 'From $495',
        benefits: [
            { title: 'Fits your business', description: 'Not a generic SaaS — built around your actual workflow.' },
            { title: 'Owned by you', description: 'You own the code, the data, and the roadmap.' },
            { title: 'Maintained', description: 'Retainers keep the system running long after launch.' },
        ],
        process: [
            { step: 1, title: 'Scope', description: 'Workshop the workflow + must-haves.' },
            { step: 2, title: 'Wireframe', description: 'Wireframe and click-through prototype.' },
            { step: 3, title: 'Build', description: 'Iterative two-week sprints with weekly demos.' },
            { step: 4, title: 'Operate', description: 'Hosting, monitoring and feature retainers.' },
        ],
        faq: [
            { question: 'Do you build TMS software?', answer: 'Yes — full TMS, dispatch, and carrier-onboarding software for fleets of every size.' },
            { question: 'Can you replace our legacy system?', answer: 'Yes — we plan a migration path that keeps the business running through cutover.' },
        ],
    },
    {
        _id: 'f3',
        slug: 'mobile-apps',
        title: 'iOS & Mobile App Development',
        shortLabel: 'Mobile Apps',
        icon: 'website',
        category: 'Mobile',
        description: 'Native iOS and cross-platform mobile apps for customer-facing brands and field operations.',
        longDescription:
            'Native iOS in Swift, or React Native / Expo when cross-platform fits. We handle App Store submission, TestFlight, push notifications, offline-first sync — and a maintenance plan after launch.',
        features: ['Native iOS (Swift)', 'React Native / Expo', 'App Store Submission', 'Push Notifications', 'Offline-first Sync'],
        price: 'From $495',
        benefits: [
            { title: 'Native feel', description: 'Apps that feel like Apple built them, not a webview.' },
            { title: 'Field-ready', description: 'Offline-first patterns for crews working without signal.' },
            { title: 'App Store certain', description: 'We have shipped through review enough times to know the traps.' },
        ],
        process: [
            { step: 1, title: 'Discover', description: 'User flows + device targets.' },
            { step: 2, title: 'Prototype', description: 'TestFlight build in week 2.' },
            { step: 3, title: 'Build', description: 'Iterative sprints with real-device testing.' },
            { step: 4, title: 'Submit', description: 'App Store review handled end-to-end.' },
        ],
        faq: [
            { question: 'iOS only?', answer: 'iOS by default. We do Android via React Native / Expo when it makes sense.' },
            { question: 'Do you handle App Store submission?', answer: 'Yes — we manage the entire review cycle.' },
        ],
    },
    {
        _id: 'f4',
        slug: 'compliance',
        title: 'Compliance Training & Compliance Automation',
        shortLabel: 'Compliance',
        icon: 'cloud',
        category: 'Compliance',
        description:
            'HIPAA, DOT/FMCSA, AML, SOC 2 — automated training, audit trails, and a compliance officer agent that flags issues before auditors do.',
        longDescription:
            'A compliance officer agent that runs continuous checks against your policies, plus training delivery and audit-trail automation. Built for healthcare, trucking, finance and any industry where an auditor will eventually knock.',
        features: ['HIPAA / DOT / AML Training', 'Audit Trail Automation', 'Compliance Officer Agent', 'Policy Drift Detection', 'Auditor-ready Reports'],
        price: 'From $495',
        benefits: [
            { title: 'Always audit-ready', description: 'Reports auto-generated; no last-minute scrambles.' },
            { title: 'Drift detection', description: 'The agent catches policy violations as they happen.' },
            { title: 'Less paperwork', description: 'Training tracked and renewed automatically.' },
        ],
        process: [
            { step: 1, title: 'Frameworks', description: 'Pick the standards (HIPAA, DOT, AML, SOC 2).' },
            { step: 2, title: 'Wire it up', description: 'Connect systems for continuous checks.' },
            { step: 3, title: 'Train', description: 'Roll out training to staff with tracking.' },
            { step: 4, title: 'Audit', description: 'Generate auditor-ready reports on demand.' },
        ],
        faq: [
            { question: 'Which frameworks?', answer: 'HIPAA, DOT/FMCSA, AML/KYC, SOC 2, and custom internal policies.' },
            { question: 'Do you sign BAAs?', answer: 'Yes — for healthcare engagements we sign Business Associate Agreements.' },
        ],
    },
    {
        _id: 'f5',
        slug: 'insurance-agents',
        title: 'Insurance Claims, Appeals & Underwriting',
        shortLabel: 'Insurance Agents',
        icon: 'ai',
        category: 'AI Agents',
        description: 'Agents that file, track, and appeal claims; underwriting copilots that 10× analyst throughput.',
        longDescription:
            'Claim-filing agents that handle the boring 80% of submissions. Appeal agents that draft denial responses with citations. Underwriting copilots that pull the right policy data into one view.',
        features: ['Claims Filing Agents', 'Appeals & Denial Automation', 'Underwriting Copilots', 'Policy Data Connectors', 'Carrier API Integrations'],
        price: 'From $495',
        benefits: [
            { title: 'Faster turnaround', description: 'Claims and appeals filed in hours, not weeks.' },
            { title: 'Higher win rate', description: 'Appeal drafts cite the right policy language every time.' },
            { title: 'Analyst leverage', description: 'Underwriters review, agents prepare.' },
        ],
        process: [
            { step: 1, title: 'Carrier mapping', description: 'Map your carriers and policy formats.' },
            { step: 2, title: 'Agent build', description: 'Stand up filing, appeal, underwriting agents.' },
            { step: 3, title: 'Pilot', description: 'Run on a slice of volume.' },
            { step: 4, title: 'Scale', description: 'Roll out to full book of business.' },
        ],
        faq: [
            { question: 'Which carriers?', answer: 'We integrate with most major carriers via API or RPA when no API exists.' },
        ],
    },
    {
        _id: 'f6',
        slug: 'digital-marketing',
        title: 'Marketing & Lead-Gen Agents',
        shortLabel: 'Marketing',
        icon: 'marketing',
        category: 'Marketing',
        description:
            'Multi-channel campaigns plus agentic lead-gen — outreach, qualification and SEO content that compounds.',
        longDescription:
            'Campaigns that target real intent. Lead-gen agents that source, qualify and book meetings. SEO content engines that compound month over month with topic clusters and entity coverage.',
        features: ['Lead-Gen Agents', 'PPC & Retargeting', 'SEO Content Engine', 'CRM Integration', 'Performance Dashboards'],
        price: 'From $395',
        benefits: [
            { title: 'Compounding SEO', description: 'Topic clusters that rank and keep ranking.' },
            { title: 'Booked meetings', description: 'Lead-gen agents fill the calendar, not the inbox.' },
            { title: 'ROAS dashboards', description: 'See exactly what paid spend returns.' },
        ],
        process: [
            { step: 1, title: 'ICP', description: 'Lock the ideal customer profile.' },
            { step: 2, title: 'Channels', description: 'Pick paid, outbound, content, or all three.' },
            { step: 3, title: 'Launch', description: 'Campaigns and agents go live.' },
            { step: 4, title: 'Optimize', description: 'Weekly tuning against ROAS goals.' },
        ],
        faq: [
            { question: 'How fast do results come?', answer: 'Paid: weeks. Outbound: 30–60 days. SEO: compounds over 90+ days.' },
        ],
    },
    {
        _id: 'f7',
        slug: 'hiring-agents',
        title: 'Hiring & Recruiting Automation',
        shortLabel: 'Hiring',
        icon: 'ai',
        category: 'AI Agents',
        description:
            'Sourcing, screening and scheduling agents that fill roles without 10 hours of a recruiter\'s week.',
        longDescription:
            'Sourcing agents that pull from LinkedIn, GitHub and niche boards. Screening workflows with rubric-graded responses. Scheduling agents that stop the back-and-forth. Recruiters review the top 5%, agents do the rest.',
        features: ['Sourcing Agents', 'Screening Workflows', 'Interview Scheduling', 'ATS Integration', 'Pipeline Dashboards'],
        price: 'From $295',
        benefits: [
            { title: '10× pipeline', description: 'Agents source while recruiters interview.' },
            { title: 'Bias-aware', description: 'Rubric-based screening with audit trails.' },
            { title: 'Less ghosting', description: 'Agents follow up so candidates do not go cold.' },
        ],
        process: [
            { step: 1, title: 'Roles', description: 'Define rubrics for the open roles.' },
            { step: 2, title: 'Source', description: 'Sourcing agents fill the top of funnel.' },
            { step: 3, title: 'Screen', description: 'Screening agents grade against rubric.' },
            { step: 4, title: 'Schedule', description: 'Scheduling agents book the calendar.' },
        ],
        faq: [
            { question: 'Will candidates know they are talking to an AI?', answer: 'Yes — we disclose. Most candidates prefer the speed.' },
        ],
    },
    {
        _id: 'f8',
        slug: 'ecommerce',
        title: 'E-commerce & Supply-Chain Platforms',
        shortLabel: 'E-commerce',
        icon: 'website',
        category: 'E-commerce',
        description: 'Custom storefronts, inventory automation and supply-chain visibility — Shopify, headless or fully bespoke.',
        longDescription:
            'Shopify when it fits. Headless when you need flexibility. Custom when neither does. Inventory automation that prevents stockouts. Supply-chain dashboards that surface SKUs at risk before customers feel it.',
        features: ['Shopify / Headless Storefronts', 'Inventory Automation', 'Supply-Chain Visibility', 'Marketplace Integration', 'Subscription Engines'],
        price: 'From $495',
        benefits: [
            { title: 'Fast to launch', description: 'Storefront live in weeks, not quarters.' },
            { title: 'No stockouts', description: 'Inventory agents reorder before you run dry.' },
            { title: 'One pane', description: 'Sales + inventory + supply-chain in one dashboard.' },
        ],
        process: [
            { step: 1, title: 'Catalog', description: 'Pull SKUs and channels.' },
            { step: 2, title: 'Storefront', description: 'Shopify, headless, or custom — your call.' },
            { step: 3, title: 'Inventory', description: 'Wire reorder rules and supplier APIs.' },
            { step: 4, title: 'Operate', description: 'Tune ROAS and reorder thresholds.' },
        ],
        faq: [
            { question: 'Shopify or custom?', answer: 'Shopify if it fits, custom if you need ownership.' },
        ],
    },
    {
        _id: 'f9',
        slug: 'ai-architecture',
        title: 'AI Architecture: Blueprints & 3D Models',
        shortLabel: 'AI Architecture',
        icon: 'ai',
        category: 'AI Agents',
        description:
            'Generate building blueprints, floor plans and 3D massing models from a brief — augment or replace expensive design cycles.',
        longDescription:
            'Describe the building. Get a floor plan. Get a 3D massing model. Iterate in minutes, not weeks. Augments AEC firms or stands in for them on early-stage feasibility studies.',
        features: ['AI-Generated Blueprints', '3D Massing & Walkthroughs', 'AEC Design Augmentation', 'Code-Compliance Hints', 'Export to Revit / SketchUp'],
        price: 'From $495',
        benefits: [
            { title: '100× faster iteration', description: 'Concepts in minutes, not weeks.' },
            { title: 'Code-aware', description: 'Hints for setbacks, egress, and zoning.' },
            { title: 'Hand-off ready', description: 'Exports your AEC team can drop into Revit.' },
        ],
        process: [
            { step: 1, title: 'Brief', description: 'Site, program, constraints.' },
            { step: 2, title: 'Generate', description: 'Floor plans and 3D mass models.' },
            { step: 3, title: 'Iterate', description: 'Tweak constraints; regenerate in minutes.' },
            { step: 4, title: 'Hand-off', description: 'Exports for your AEC team.' },
        ],
        faq: [
            { question: 'Replaces architects?', answer: 'No — augments them on early feasibility. Final stamps still come from licensed AEC.' },
        ],
    },
    {
        _id: 'f10',
        slug: 'website-development',
        title: 'Websites & Web Apps',
        shortLabel: 'Websites',
        icon: 'website',
        category: 'Software',
        description: 'Marketing sites, web apps and customer portals — fast, indexable and conversion-tuned.',
        longDescription:
            'Marketing sites that load in under a second and rank. Web apps that feel native. Customer portals that scale. Built on Next.js with the boring-on-purpose stack you can hand to any developer.',
        features: ['Marketing Sites', 'Customer Portals', 'Conversion Optimization', 'Core Web Vitals', 'CMS-driven Content'],
        price: 'From $195',
        benefits: [
            { title: 'Fast', description: 'Sub-second loads. Real Core Web Vitals scores.' },
            { title: 'Indexable', description: 'SEO-first architecture, not retrofitted.' },
            { title: 'Convertible', description: 'CRO patterns baked in from day one.' },
        ],
        process: [
            { step: 1, title: 'Brief', description: 'Goals, audience, brand.' },
            { step: 2, title: 'Wireframe', description: 'Click-through prototype.' },
            { step: 3, title: 'Build', description: 'Production build with CMS.' },
            { step: 4, title: 'Launch', description: 'DNS cutover and post-launch tuning.' },
        ],
        faq: [
            { question: 'Stack?', answer: 'Next.js + Sanity + Tailwind by default. We adapt.' },
        ],
    },
    {
        _id: 'f11',
        slug: 'cloud-solutions',
        title: 'Cloud, IT & Cybersecurity',
        shortLabel: 'Cloud & IT',
        icon: 'cloud',
        category: 'Cloud',
        description: 'Cloud architecture, cybersecurity audits and ongoing IT operations — the unbreachable foundation.',
        longDescription:
            'AWS, GCP, or hybrid. Architecture reviews, cost optimization, security audits, managed ops. We design for blast-radius containment and 24/7 incident response without your team waking up at 3am.',
        features: ['Cloud Architecture', 'Security Audits', 'Managed Operations', 'Cost Optimization', 'Incident Response'],
        price: 'From $495',
        benefits: [
            { title: 'No 3am pages', description: 'Managed ops with on-call rotations.' },
            { title: 'Lower bills', description: 'Cost optimization that pays the engagement back.' },
            { title: 'Audit-passable', description: 'Security posture ready for SOC 2 or HIPAA review.' },
        ],
        process: [
            { step: 1, title: 'Audit', description: 'Where you are, where you want to be.' },
            { step: 2, title: 'Plan', description: 'Migration / hardening roadmap.' },
            { step: 3, title: 'Execute', description: 'Architect, migrate, harden.' },
            { step: 4, title: 'Operate', description: 'Managed ops with on-call.' },
        ],
        faq: [
            { question: 'AWS, GCP or Azure?', answer: 'Whichever fits. We have shipped on all three.' },
        ],
    },
];

export const serviceCategories: ServiceCategory[] = [
    'AI Agents',
    'Software',
    'Mobile',
    'Compliance',
    'Marketing',
    'E-commerce',
    'Cloud',
];

export function getServiceBySlug(slug: string): ServiceDef | undefined {
    return services.find(s => s.slug === slug);
}
