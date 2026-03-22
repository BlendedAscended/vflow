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
      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200"
      style={
        isActive
          ? {
              borderLeft: `3px solid ${domain.accent}`,
              color: '#111111',
              backgroundColor: `${domain.accent}10`,
              border: `1px solid ${domain.accent}30`,
            }
          : {
              border: '1px solid transparent',
              color: '#6B7280',
              backgroundColor: 'transparent',
            }
      }
    >
      <Icon
        size={14}
        style={{ color: isActive ? domain.accent : '#6B7280', flexShrink: 0 }}
      />
      <span className="text-xs font-semibold leading-tight truncate">{domain.name}</span>
    </button>
  );
}
