'use client';

const ACCENT = '#00c203';
const CLAIMS = [
  {
    id: '****1847',
    code: 'ICD: Z87.891',
    denial: 'Missing Auth',
    rec: 'Appeal ↑ 91%',
    recColor: ACCENT,
  },
  {
    id: '****2203',
    code: 'CPT: 99213',
    denial: 'Duplicate',
    rec: 'Verify → Resubmit',
    recColor: '#2E75B6',
  },
  {
    id: '****3561',
    code: 'ICD: M54.5',
    denial: 'Bundling Rule',
    rec: 'Separate claim',
    recColor: '#7C3AED',
  },
];

export default function IPadMock() {
  return (
    <div
      className="mx-auto"
      style={{
        width: '100%',
        maxWidth: '560px',
      }}
    >
      {/* iPad frame */}
      <div
        style={{
          border: '10px solid #1A1A1A',
          borderRadius: '20px',
          background: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)',
        }}
      >
        {/* Home bar / camera row */}
        <div
          style={{
            height: '18px',
            background: '#1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#333' }} />
        </div>

        {/* App screen */}
        <div style={{ background: '#F9FAFB', minHeight: '280px' }}>
          {/* App top bar */}
          <div
            style={{
              background: '#FFFFFF',
              borderBottom: '1px solid #E5E7EB',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F1923' }}>
                Claim Review Queue
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { label: 'Pending', count: '4', color: '#6B7280' },
                { label: 'Flagged', count: '12', color: '#DC2626', active: true },
                { label: 'Resolved', count: '89', color: '#16A34A' },
              ].map((tab) => (
                <div
                  key={tab.label}
                  style={{
                    fontSize: '9px',
                    fontWeight: tab.active ? 700 : 500,
                    color: tab.active ? tab.color : '#9CA3AF',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: tab.active ? `${tab.color}10` : 'transparent',
                    border: tab.active ? `1px solid ${tab.color}40` : '1px solid transparent',
                  }}
                >
                  {tab.label} {tab.count}
                </div>
              ))}
            </div>
          </div>

          {/* Claim rows */}
          <div style={{ padding: '0' }}>
            {CLAIMS.map((claim, i) => (
              <div
                key={claim.id}
                style={{
                  padding: '9px 14px',
                  borderBottom: i < CLAIMS.length - 1 ? '1px solid #F3F4F6' : 'none',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'nowrap',
                }}
              >
                {/* Patient ID */}
                <span
                  style={{
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    color: '#4B5563',
                    flexShrink: 0,
                    width: '58px',
                  }}
                >
                  Pt#{claim.id}
                </span>

                {/* Code */}
                <span
                  style={{
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    color: '#6B7280',
                    flexShrink: 0,
                    width: '74px',
                  }}
                >
                  {claim.code}
                </span>

                {/* Denial reason */}
                <span
                  style={{
                    fontSize: '8px',
                    fontWeight: 600,
                    color: '#DC2626',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {claim.denial}
                </span>

                {/* AI recommendation */}
                <span
                  style={{
                    fontSize: '8px',
                    fontWeight: 600,
                    color: claim.recColor,
                    background: `${claim.recColor}10`,
                    border: `1px solid ${claim.recColor}30`,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  AI: {claim.rec}
                </span>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto', flexShrink: 0 }}>
                  <button
                    style={{
                      fontSize: '8px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      background: ACCENT,
                      border: 'none',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Appeal
                  </button>
                  <button
                    style={{
                      fontSize: '8px',
                      fontWeight: 500,
                      color: '#6B7280',
                      background: '#F3F4F6',
                      border: '1px solid #E5E7EB',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer status bar */}
          <div
            style={{
              padding: '7px 14px',
              borderTop: '1px solid #E5E7EB',
              background: '#FAFAFA',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '8px', color: '#6B7280', fontFamily: 'monospace' }}>
              12 claims need review
            </span>
            <span style={{ fontSize: '8px', color: '#9CA3AF' }}>·</span>
            <span style={{ fontSize: '8px', color: ACCENT, fontWeight: 600, fontFamily: 'monospace' }}>
              AI confidence 94%
            </span>
            <span style={{ fontSize: '8px', color: '#9CA3AF' }}>·</span>
            <span style={{ fontSize: '8px', color: '#6B7280', fontFamily: 'monospace' }}>
              Avg resolution: 4.2 hrs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
