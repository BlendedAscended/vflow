'use client';

import Link from 'next/link';
import { Video } from 'lucide-react';
import type { AgencyDomain } from '../../data/agencyDomains';
import DomainToggle from './DomainToggle';

interface AgencyLeftPanelProps {
  domains: AgencyDomain[];
  activeDomain: string;
  onDomainSelect: (id: string) => void;
}

const TICKER_ITEMS = [
  'Built for a hospital system',
  'Fintech compliance engine deployed',
  'Shipped in 6 weeks',
  'Revenue cycle AI for regional health network',
  'SOC 2 pipeline for asset management firm',
  'Multi-agent claims processing at scale',
  'Cloud infra for 15M+ patient records',
];

// Duplicate for seamless loop (kept for future ticker use)
const _TICKER_TEXT = [...TICKER_ITEMS, ...TICKER_ITEMS]
  .map((t) => `${t} ·`)
  .join('  ');
void _TICKER_TEXT;

export default function AgencyLeftPanel({ domains, activeDomain, onDomainSelect }: AgencyLeftPanelProps) {
  return (
    <div
      className="flex flex-col h-full px-5 py-8"
      style={{ color: 'var(--agency-text)' }}
    >
      {/* Brand block */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'var(--agency-text-faint)' }}
          >
            Agency
          </span>
        </div>

        {/* Serif display headline */}
        <h1
          className="text-xl font-bold leading-tight"
          style={{
            fontFamily: 'var(--font-serif-display), Georgia, serif',
            color: 'var(--agency-text)',
            letterSpacing: '-0.01em',
          }}
        >
          Production systems
          <br />
          that work.
        </h1>
      </div>

      {/* Stats — mono, vertical */}
      <div className="mb-4 space-y-2.5">
        {[
          { value: '297', label: 'Resumes delivered' },
          { value: '6',   label: 'Industry domains'  },
          { value: '18',  label: 'Specializations'   },
        ].map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <span
              className="text-lg font-bold font-mono"
              style={{ color: 'var(--agency-text)' }}
            >
              {stat.value}
            </span>
            <span className="text-xs" style={{ color: 'var(--agency-text-muted)' }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Social proof ticker */}
      <div
        className="mb-5 overflow-hidden"
        style={{
          borderTop:    '1px solid var(--agency-border)',
          borderBottom: '1px solid var(--agency-border)',
          background:   'var(--agency-bg-raised)',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="agency-ticker-track whitespace-nowrap" style={{ fontSize: '9px', color: 'var(--agency-text-faint)', fontFamily: 'var(--font-geist-mono, monospace)', letterSpacing: '0.02em' }}>
          {/* Two copies for seamless loop */}
          {[0, 1].map((copy) => (
            <span key={copy} className="pr-8">
              {TICKER_ITEMS.map((item, i) => (
                <span key={i}>
                  {item}
                  <span className="mx-2 opacity-40">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <div className="mb-5 space-y-2">
        <a
          href="https://cal.com/sandeep-singh/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: 'var(--agency-cta-primary-bg)',
            color:      'var(--agency-cta-primary-text)',
          }}
        >
          Book 30 min
        </a>

        <a
          href="https://meet.google.com/PLACEHOLDER"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
          style={{
            background:   'transparent',
            border:       '1.5px solid #1A73E8',
            color:        '#1A73E8',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(26,115,232,0.06)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
          }}
        >
          <Video size={13} />
          Open Google Meet
        </a>

        <p
          className="text-center text-[9px] leading-tight"
          style={{ color: 'var(--agency-text-faint)' }}
        >
          No prep needed · 30 minutes · Async option available
        </p>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--agency-border)', marginBottom: '12px' }} />

      {/* Domain toggles */}
      <div className="mb-4">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--agency-text-faint)' }}
        >
          Domains
        </p>
        <div className="space-y-1.5">
          {domains.map((domain) => (
            <DomainToggle
              key={domain.id}
              domain={domain}
              isActive={activeDomain === domain.id}
              onClick={() => onDomainSelect(domain.id)}
            />
          ))}
        </div>
      </div>

      {/* View Services — bottom ghost link */}
      <div className="mt-auto">
        <Link
          href="/services"
          className="block w-full text-center py-2 px-4 rounded-lg text-xs font-medium transition-all duration-200"
          style={{
            border: '1px solid var(--agency-border)',
            color:  'var(--agency-text-muted)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--agency-bg-raised)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
          }}
        >
          View Services
        </Link>
      </div>
    </div>
  );
}
