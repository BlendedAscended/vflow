'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  const activeDomainData = domains.find((d) => d.id === activeDomain) ?? domains[0];

  return (
    <div className="flex flex-col h-full px-8 py-10" style={{ color: 'var(--agency-text)' }}>
      {/* Brand block */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="p-1.5 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #A78BFA20, #06B6D420)', border: '1px solid rgba(167,139,250,0.2)' }}
          >
            <Zap size={14} style={{ color: '#A78BFA' }} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#A78BFA' }}>
            Verbaflow Agency
          </span>
        </div>

        <h1 className="text-3xl font-bold leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
          We build production
          <br />
          <span style={{ background: 'linear-gradient(90deg, #A78BFA, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            systems that work.
          </span>
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--agency-text-muted)' }}>
          Cross-industry AI engineering and data architecture — healthcare, finance, cloud, and beyond.
        </p>
      </div>

      {/* Stats strip */}
      <div
        className="flex gap-4 mb-8 p-4 rounded-xl"
        style={{ border: '1px solid var(--agency-border)', background: 'var(--agency-bg-card)' }}
      >
        {[
          { value: '297', label: 'Resumes' },
          { value: '6', label: 'Domains' },
          { value: '18', label: 'Specializations' },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 text-center">
            <p className="text-xl font-bold font-mono" style={{ color: 'var(--agency-text)' }}>
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: 'var(--agency-text-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Domain toggles */}
      <div className="mb-6">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--agency-text-muted)' }}
        >
          Select a Domain
        </p>
        <div className="space-y-2">
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

      {/* Animated pitch text */}
      <div
        className="flex-1 mb-8 p-5 rounded-xl"
        style={{ border: `1px solid ${activeDomainData.accent}25`, background: `${activeDomainData.accent}08` }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: activeDomainData.accent }}
        >
          {activeDomainData.name} · {activeDomainData.tagline}
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeDomain}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-sm leading-relaxed"
            style={{ color: 'var(--agency-text-muted)' }}
          >
            {activeDomainData.pitchHook}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Link
          href="/growth-plan"
          className="block w-full text-center py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-300"
          style={{
            background: 'linear-gradient(90deg, #A78BFA, #06B6D4)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(167,139,250,0.4)';
            (e.currentTarget as HTMLElement).style.opacity = '0.92';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
        >
          Work With Us
        </Link>
        <Link
          href="/services"
          className="block w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300"
          style={{
            border: '1px solid var(--agency-border)',
            color: 'var(--agency-text-muted)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
            (e.currentTarget as HTMLElement).style.color = 'var(--agency-text)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--agency-border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--agency-text-muted)';
          }}
        >
          View Services
        </Link>
      </div>
    </div>
  );
}
