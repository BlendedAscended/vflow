'use client';

import { Heart, TrendingUp, Layers } from 'lucide-react';
import type { AgencyDomain } from '../../data/agencyDomains';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Heart,
  TrendingUp,
  Layers,
};

interface DomainToggleProps {
  domain: AgencyDomain;
  isActive: boolean;
  onClick: () => void;
}

export default function DomainToggle({ domain, isActive, onClick }: DomainToggleProps) {
  const Icon = ICON_MAP[domain.iconName] ?? Layers;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300"
      style={
        isActive
          ? {
              border: `1px solid ${domain.accent}`,
              color: domain.accent,
              backgroundColor: `${domain.accent}15`,
              boxShadow: `0 0 16px ${domain.accent}30`,
            }
          : {
              border: '1px solid var(--agency-border)',
              color: 'var(--agency-text-muted)',
              backgroundColor: 'transparent',
            }
      }
    >
      <Icon
        size={16}
        style={{ color: isActive ? domain.accent : 'var(--agency-text-muted)', flexShrink: 0 }}
      />
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold leading-tight">{domain.name}</span>
        {isActive && (
          <span className="text-xs leading-tight mt-0.5 truncate" style={{ color: 'var(--agency-text-muted)' }}>
            {domain.tagline}
          </span>
        )}
      </div>
      {isActive && (
        <div
          className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: domain.accent, boxShadow: `0 0 6px ${domain.accent}` }}
        />
      )}
    </button>
  );
}
