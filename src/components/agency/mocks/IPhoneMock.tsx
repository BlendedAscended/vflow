'use client';

const ALERTS = [
  {
    level: 'Critical',
    dot: '#DC2626',
    title: 'SOC 2 Control Gap',
    body: 'Framework update required — Q1 deadline',
    time: '2m ago',
    badge: { text: 'SOC 2', color: '#DC2626' },
  },
  {
    level: 'Warning',
    dot: '#D97706',
    title: 'Pipeline Latency Spike',
    body: 'P99 > 2.1s on inference endpoint',
    time: '18m ago',
    badge: { text: 'Infra', color: '#D97706' },
  },
  {
    level: 'Info',
    dot: '#16A34A',
    title: 'Q4 Audit Docs Complete',
    body: 'PCI DSS artifacts archived successfully',
    time: '1h ago',
    badge: { text: 'PCI DSS', color: '#16A34A' },
  },
];

export default function IPhoneMock() {
  return (
    <div className="flex justify-center">
      {/* iPhone frame */}
      <div
        style={{
          width: '220px',
          border: '10px solid #1A1A1A',
          borderRadius: '36px',
          background: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.14)',
          position: 'relative',
        }}
      >
        {/* Notch */}
        <div
          style={{
            height: '22px',
            background: '#1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '12px',
              borderRadius: '8px',
              background: '#000000',
            }}
          />
        </div>

        {/* Status bar */}
        <div
          style={{
            height: '16px',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 10px',
          }}
        >
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#0F1923', fontFamily: 'monospace' }}>
            9:41
          </span>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            {/* Signal */}
            {[3, 4, 5, 6].map((h) => (
              <div key={h} style={{ width: '2px', height: `${h}px`, background: '#0F1923', borderRadius: '1px' }} />
            ))}
            {/* Battery */}
            <div style={{ width: '14px', height: '7px', border: '1px solid #0F1923', borderRadius: '2px', marginLeft: '2px', padding: '1px' }}>
              <div style={{ width: '80%', height: '100%', background: '#0F1923', borderRadius: '1px' }} />
            </div>
          </div>
        </div>

        {/* App header */}
        <div
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #F3F4F6',
            padding: '7px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F1923' }}>
            ArcaFinance
          </span>
          {/* Bell with badge */}
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '7px', height: '7px', borderRadius: '50%', background: '#DC2626', border: '1.5px solid #fff' }} />
          </div>
        </div>

        {/* Alerts list */}
        <div style={{ background: '#F9FAFB' }}>
          {ALERTS.map((alert, i) => (
            <div
              key={alert.title}
              style={{
                padding: '8px 10px',
                borderBottom: i < ALERTS.length - 1 ? '1px solid #F3F4F6' : 'none',
                background: '#FFFFFF',
                borderLeft: `3px solid ${alert.dot}`,
                marginBottom: '1px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <span
                      style={{
                        fontSize: '7px',
                        fontWeight: 700,
                        color: alert.badge.color,
                        background: `${alert.badge.color}12`,
                        border: `1px solid ${alert.badge.color}30`,
                        padding: '0px 4px',
                        borderRadius: '3px',
                        flexShrink: 0,
                      }}
                    >
                      {alert.badge.text}
                    </span>
                    <span style={{ fontSize: '8px', fontWeight: 600, color: '#0F1923', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {alert.title}
                    </span>
                  </div>
                  <p style={{ fontSize: '7px', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
                    {alert.body}
                  </p>
                </div>
                <span style={{ fontSize: '7px', color: '#9CA3AF', fontFamily: 'monospace', flexShrink: 0 }}>
                  {alert.time}
                </span>
              </div>
            </div>
          ))}

          {/* Load more */}
          <div style={{ padding: '7px 10px', textAlign: 'center' }}>
            <span style={{ fontSize: '8px', color: '#2E75B6', fontWeight: 500 }}>
              Load more alerts...
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div
          style={{
            borderTop: '1px solid #E5E7EB',
            background: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '5px 0 8px',
          }}
        >
          {[
            { label: 'Alerts', active: true },
            { label: 'Pipeline', active: false },
            { label: 'Costs', active: false },
            { label: 'Settings', active: false },
          ].map((tab) => (
            <div key={tab.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '18px',
                  height: '2px',
                  background: tab.active ? '#2E75B6' : 'transparent',
                  borderRadius: '1px',
                  margin: '0 auto 3px',
                }}
              />
              <span
                style={{
                  fontSize: '7px',
                  fontWeight: tab.active ? 700 : 400,
                  color: tab.active ? '#2E75B6' : '#9CA3AF',
                }}
              >
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        {/* Home indicator */}
        <div
          style={{
            height: '14px',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '50px', height: '3px', borderRadius: '2px', background: '#1A1A1A' }} />
        </div>
      </div>
    </div>
  );
}
