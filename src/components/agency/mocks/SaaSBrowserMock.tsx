'use client';

import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Activity,
  Server,
  GitBranch,
  Cpu,
  DollarSign,
  Settings,
  Zap,
  Heart,
  Layers,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Activity,
  Server,
  GitBranch,
  Cpu,
  DollarSign,
  Settings,
  Zap,
  Heart,
  Layers,
};

export interface MockNavItem {
  iconName: string;
  label: string;
  active?: boolean;
  configure?: boolean;
}

interface SaaSBrowserMockProps {
  url: string;
  appName: string;
  navItems: MockNavItem[];
  accentColor: string;
  children: React.ReactNode;
}

export default function SaaSBrowserMock({
  url,
  appName,
  navItems,
  accentColor,
  children,
}: SaaSBrowserMockProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border:  '1px solid var(--agency-border)',
        background: 'var(--agency-bg-card)',
      }}
    >
      {/* Browser chrome bar */}
      <div
        className="flex items-center gap-3 px-3"
        style={{
          height: '32px',
          background:  'var(--agency-bg-chrome)',
          borderBottom: '1px solid var(--agency-border)',
        }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28C840' }} />
        </div>

        {/* URL bar — centered */}
        <div
          className="flex-1 flex items-center justify-center"
        >
          <div
            className="flex items-center gap-1.5 px-2.5 rounded"
            style={{
              background: 'var(--agency-bg-card)',
              border: '1px solid var(--agency-border)',
              height: '18px',
              maxWidth: '260px',
              width: '100%',
            }}
          >
            {/* Lock icon */}
            <svg width="8" height="9" viewBox="0 0 8 9" fill="none" style={{ flexShrink: 0 }}>
              <rect x="1" y="3.5" width="6" height="5" rx="1" stroke="#9CA3AF" strokeWidth="1"/>
              <path d="M2.5 3.5V2.5a1.5 1.5 0 013 0v1" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span
              className="truncate"
              style={{
                fontSize: '9px',
                color: 'var(--agency-text-faint)',
                fontFamily: 'var(--font-geist-mono, monospace)',
                lineHeight: 1,
              }}
            >
              {url}
            </span>
          </div>
        </div>

        {/* Spacer to balance traffic lights */}
        <div style={{ width: '42px', flexShrink: 0 }} />
      </div>

      {/* App layout */}
      <div className="flex" style={{ minHeight: '340px' }}>
        {/* Sidebar nav */}
        <div
          className="flex-shrink-0 flex flex-col py-3"
          style={{
            width: '136px',
            borderRight: '1px solid var(--agency-border)',
            background: 'var(--agency-bg-raised)',
          }}
        >
          {/* App name */}
          <div
            className="px-3 mb-3"
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: accentColor,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {appName}
          </div>

          {/* Nav items */}
          <div className="flex flex-col gap-0.5 px-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = ICON_MAP[item.iconName] ?? Layers;

              if (item.configure) {
                return (
                  <a
                    key={item.label}
                    href="https://cal.com/sandeep-singh/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors duration-150"
                    style={{
                      border:     `1px solid ${accentColor}30`,
                      background: `${accentColor}08`,
                      marginTop: 'auto',
                    }}
                    title="Configure this dashboard for your workflow"
                  >
                    {/* Pulsing dot */}
                    <span
                      className="animate-pulse flex-shrink-0"
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: accentColor,
                        boxShadow: `0 0 4px ${accentColor}`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '9px',
                        color: accentColor,
                        fontStyle: 'italic',
                        fontWeight: 600,
                      }}
                    >
                      {item.label}
                    </span>
                  </a>
                );
              }

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded transition-colors duration-150"
                  style={
                    item.active
                      ? {
                          borderLeft: `2px solid ${accentColor}`,
                          background: `${accentColor}08`,
                          color: 'var(--agency-text)',
                        }
                      : {
                          color: 'var(--agency-text-muted)',
                        }
                  }
                >
                  <Icon
                    size={10}
                    style={{
                      color: item.active ? accentColor : 'var(--agency-text-faint)',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: item.active ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden p-3">
          {children}
        </div>
      </div>
    </div>
  );
}
