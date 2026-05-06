export type ProjectStatus = 'live' | 'in-progress' | 'shipped';

export interface AgencyProject {
    id: string;
    name: string;
    industry: string;
    summary: string;
    status: ProjectStatus;
    accent: string;
    metric?: string;
}

export const agencyProjects: AgencyProject[] = [
    {
        id: 'meridian',
        name: 'Meridian Health AI',
        industry: 'Healthcare',
        summary: 'RCM platform with multi-agent denial-management and HL7/FHIR pipelines.',
        status: 'live',
        accent: '#00c203',
        metric: '15M+ patient records · 28% denial drop',
    },
    {
        id: 'trustone',
        name: 'Trust One Services',
        industry: 'Insurance',
        summary: 'Claims-filing and appeal agents with carrier-API integrations.',
        status: 'live',
        accent: '#3b82f6',
        metric: 'Appeal turn-around: 21d → 2d',
    },
    {
        id: 'tensei',
        name: 'Tensei Extension',
        industry: 'AI / SaaS',
        summary: 'Browser-side agent extension built on the OpenClaw runtime.',
        status: 'in-progress',
        accent: '#818cf8',
        metric: 'v2.4 manifest in review',
    },
    {
        id: 'galaxy',
        name: 'Galaxy Pipeline',
        industry: 'Logistics',
        summary: 'TMS + dispatch automation with FMCSA-aware compliance agent.',
        status: 'in-progress',
        accent: '#22d3ee',
        metric: 'n8n hardening sprint',
    },
    {
        id: 'studio-white',
        name: 'Studio White',
        industry: 'AEC',
        summary: 'AI blueprint + 3D massing tooling for early-stage feasibility.',
        status: 'in-progress',
        accent: '#60a5fa',
        metric: 'Tokens stabilizing on OpenCodeGo',
    },
    {
        id: 'paperclip',
        name: 'Paperclip',
        industry: 'Finance',
        summary: 'Bookkeeping + AML automation with audit-trail reporting.',
        status: 'shipped',
        accent: '#a5d6a7',
        metric: 'Cycle time: -62%',
    },
    {
        id: 'gov-permits',
        name: 'County Permitting Portal',
        industry: 'Government',
        summary: 'Constituent-facing permitting + procurement portal for a US county.',
        status: 'shipped',
        accent: '#f59e0b',
        metric: '11 forms digitized · 4× faster intake',
    },
    {
        id: 'guardian',
        name: 'Guardian Compliance',
        industry: 'Compliance',
        summary: 'Always-on compliance officer agent with HIPAA + DOT + AML checks.',
        status: 'live',
        accent: '#22c55e',
        metric: '0 audit findings YTD',
    },
];
