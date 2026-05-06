export interface Industry {
    id: string;
    label: string;
    icon: string;
    tagline: string;
    subNiches: string[];
    freeText?: boolean;
}

export const industries: Industry[] = [
    {
        id: 'finance',
        label: 'Finance & Fintech',
        icon: '🏦',
        tagline: 'Lending, advisory, AML and back-office automation.',
        subNiches: [
            'Lending & Underwriting',
            'AML / KYC Compliance',
            'Bookkeeping Automation',
            'Wealth & Advisor Tools',
            'Payments & Treasury',
            'Other',
        ],
    },
    {
        id: 'healthcare',
        label: 'Healthcare & Wellness',
        icon: '⚕️',
        tagline: 'Clinical ops, compliance and patient-facing agents.',
        subNiches: [
            'Pediatric / Specialty Dental',
            'Telehealth Platforms',
            'Clinical Documentation',
            'HIPAA Compliance Training',
            'Insurance Claims & Appeals',
            'Other',
        ],
    },
    {
        id: 'trucking',
        label: 'Trucking & Logistics',
        icon: '🚛',
        tagline: 'TMS, dispatch and DOT compliance built for fleets.',
        subNiches: [
            'TMS Build / Replace',
            'Fleet & Dispatch Automation',
            'Carrier Onboarding',
            'DOT / FMCSA Compliance',
            'Freight Marketplace',
            'Other',
        ],
    },
    {
        id: 'insurance',
        label: 'Insurance',
        icon: '🛡️',
        tagline: 'Claims, appeals and underwriting agents.',
        subNiches: [
            'Claims Automation',
            'Appeals & Denials',
            'Underwriting Agents',
            'Broker Portals',
            'Other',
        ],
    },
    {
        id: 'government',
        label: 'Government & Public Sector',
        icon: '🏛️',
        tagline: 'Permits, procurement and constituent portals.',
        subNiches: [
            'Permits / Licensing Portal',
            'Constituent Services',
            'Procurement Portal',
            'Compliance Training',
            'Other',
        ],
    },
    {
        id: 'aec',
        label: 'Architecture & Real Estate',
        icon: '🏛',
        tagline: 'AI blueprints, 3D models and property ops.',
        subNiches: [
            'AI Blueprints',
            '3D Modeling',
            'Property Management Portal',
            'Listings Operations',
            'Construction Pre-design',
            'Other',
        ],
    },
    {
        id: 'construction',
        label: 'Construction',
        icon: '🏗️',
        tagline: 'Trades, GCs and project ops.',
        subNiches: [
            'Roofing',
            'Plumbing',
            'HVAC',
            'Electrical',
            'Landscaping',
            'General Contracting',
            'Remodeling',
            'Painting',
            'Flooring',
            'Other',
        ],
    },
    {
        id: 'retail',
        label: 'Retail & E-commerce',
        icon: '🛍️',
        tagline: 'Storefronts, supply chain and growth marketing.',
        subNiches: [
            'Shopify / Custom Storefront',
            'Inventory & Supply Chain',
            'Marketing Automation',
            'Marketplace Integration',
            'Other',
        ],
    },
    {
        id: 'tech',
        label: 'Technology & SaaS',
        icon: '💻',
        tagline: 'AI features, internal tooling and platform engineering.',
        subNiches: [
            'AI Features in Existing Product',
            'Internal Tooling',
            'Platform Engineering',
            'Developer Productivity',
            'Other',
        ],
    },
    {
        id: 'manufacturing',
        label: 'Manufacturing & Supply Chain',
        icon: '🏭',
        tagline: 'WMS, vendor portals and QA automation.',
        subNiches: [
            'WMS / Inventory',
            'Vendor Portals',
            'QA & Compliance',
            'IoT / Telemetry',
            'Other',
        ],
    },
    {
        id: 'marketing-hr',
        label: 'Marketing & Hiring',
        icon: '📣',
        tagline: 'Lead-gen agents and recruiting funnels.',
        subNiches: [
            'Lead-Gen Agents',
            'Recruiting Funnels',
            'Outreach Automation',
            'Brand & Content Ops',
            'Other',
        ],
    },
    {
        id: 'service',
        label: 'Service Business',
        icon: '🔧',
        tagline: 'Booking, CRM and field operations.',
        subNiches: [
            'Booking / Scheduling',
            'CRM Automation',
            'Field Operations',
            'Quoting & Invoicing',
            'Other',
        ],
    },
    {
        id: 'other',
        label: 'Something Else',
        icon: '🌐',
        tagline: 'Tell us what you do — we will tailor the plan.',
        subNiches: [],
        freeText: true,
    },
];

export function getIndustry(id: string): Industry | undefined {
    return industries.find(i => i.id === id);
}
