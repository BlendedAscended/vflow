'use client';

import { Video, Zap } from 'lucide-react';
import type { AgencyDomain } from '../../data/agencyDomains';
import DomainToggle from './DomainToggle';

const TICKER_ITEMS = [
  'Multi-agent claims automation — zero manual reviews',
  'Fintech compliance engine — SOC 2 ready',
  'Revenue cycle AI deployed in 6 weeks',
  'Self-healing infrastructure pipeline',
  'Denial prevention across 15M+ records',
  'Agentic system for a regional health network',
];

interface AgencyLeftPanelProps {
  domains: AgencyDomain[];
  activeDomain: string;
  onDomainSelect: (id: string) => void;
}

export default function AgencyLeftPanel({ domains, activeDomain, onDomainSelect }: AgencyLeftPanelProps) {
  const tickerText = TICKER_ITEMS.join(' · ') + ' · ';

  return (
    <div className="flex flex-col h-full" style={{ color: 'var(--agency-text)' }}>
      {/* Brand block */}
      <div className="px-5 pt-8 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED20' }}
          >
            <Zap size={12} style={{ color: '#7C3AED' }} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--agency-text-faint)' }}>
            Verbaflow Agency
          </span>
        </div>

        <h1
          className="text-2xl font-bold leading-tight mb-2"
          style={{
            color: 'var(--agency-text)',
            fontFamily: 'var(--font-serif-display, Georgia, serif)',
            letterSpacing: '-0.02em',
          }}
        >
          Agentic systems
          <br />
          for the companies
          <br />
          that actually build.
        </h1>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--agency-text-muted)' }}>
          Mid-scale · Healthcare · Finance · Infrastructure
        </p>
      </div>

      {/* Social proof ticker */}
      <div
        style={{
          borderTop: '1px solid var(--agency-border)',
          borderBottom: '1px solid var(--agency-border)',
          background: 'var(--agency-bg-raised)',
          height: '28px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="agency-ticker-track">
          <span
            style={{
              fontSize: '9px',
              color: 'var(--agency-text-muted)',
              fontFamily: 'var(--font-geist-mono, monospace)',
              whiteSpace: 'nowrap',
              paddingRight: '0',
            }}
          >
            {tickerText}{tickerText}
          </span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-5 py-5">
        <div className="flex gap-5">
          {[
            { value: '24+', label: 'Agents Shipped' },
            { value: '$4.2M', label: 'Revenue Impact' },
            { value: '6wk', label: 'Avg Deploy' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="text-lg font-bold font-mono" style={{ color: 'var(--agency-text)' }}>
                {stat.value}
              </span>
              <span className="text-[10px] leading-tight" style={{ color: 'var(--agency-text-muted)' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <div className="px-5 pb-5 space-y-2">
        <a
          href="https://cal.com/sandeep-singh/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90"
          style={{
            background: 'var(--agency-cta-primary-bg)',
            color: 'var(--agency-cta-primary-text)',
          }}
        >
          Book 30 min
        </a>

        <a
          href="https://meet.google.com/PLACEHOLDER"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-blue-50"
          style={{
            border: '1.5px solid #1A73E8',
            color: '#1A73E8',
            background: 'transparent',
          }}
        >
          <Video size={14} />
          Open Google Meet
        </a>

        <p
          className="text-center text-[10px] leading-relaxed"
          style={{ color: 'var(--agency-text-faint)' }}
        >
          No prep needed · 30 minutes · Async option available
        </p>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--agency-border)', marginBottom: '16px' }} />

      {/* Domain toggles */}
      <div className="px-5 flex-1">
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
    </div>
  );
}
