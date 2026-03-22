'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import type { AgencyDomain } from '../../data/agencyDomains';
import DomainToggle from './DomainToggle';

interface AgencyLeftPanelProps {
  domains: AgencyDomain[];
  activeDomain: string;
  onDomainSelect: (id: string) => void;
}

export default function AgencyLeftPanel({ domains, activeDomain, onDomainSelect }: AgencyLeftPanelProps) {
  return (
    <div className="flex flex-col h-full px-5 py-8" style={{ color: 'var(--agency-text)' }}>
      {/* Brand block — compact */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED20' }}
          >
            <Zap size={12} style={{ color: '#7C3AED' }} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6B7280' }}>
            Agency
          </span>
        </div>

        <h1 className="text-xl font-bold leading-tight" style={{ color: '#111111', letterSpacing: '-0.02em' }}>
          Production systems
          <br />
          that work.
        </h1>
      </div>

      {/* Stats — vertical stack, no card */}
      <div className="mb-6 space-y-3">
        {[
          { value: '297', label: 'Resumes' },
          { value: '6', label: 'Domains' },
          { value: '18', label: 'Specializations' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <p className="text-lg font-bold font-mono" style={{ color: '#111111' }}>
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Domain toggles */}
      <div className="mb-6">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-2"
          style={{ color: '#6B7280' }}
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

      {/* CTA — compact Studio White style */}
      <div className="mt-auto space-y-2">
        <Link
          href="/growth-plan"
          className="block w-full text-center py-2.5 px-4 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:opacity-90"
          style={{ background: '#111111' }}
        >
          Work With Us
        </Link>

        <div className="grid grid-cols-2 gap-1.5">
          <a
            href="https://cal.com/sandeep-singh/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-[#E5E5E0]"
            style={{
              border: '1px solid #E5E5E0',
              color: '#6B7280',
            }}
          >
            <span>30 min</span>
          </a>
          <a
            href="https://cal.com/sandeep-singh/45-min-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-[#E5E5E0]"
            style={{
              border: '1px solid #E5E5E0',
              color: '#6B7280',
            }}
          >
            <span>45 min</span>
          </a>
        </div>

        <Link
          href="/services"
          className="block w-full text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-[#E5E5E0]"
          style={{
            border: '1px solid #E5E5E0',
            color: '#6B7280',
          }}
        >
          View Services
        </Link>
      </div>
    </div>
  );
}
