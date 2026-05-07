'use client';

import { ProtoEntry } from './registry';

interface ProtoNavProps {
  items: Pick<ProtoEntry, 'id' | 'label' | 'index'>[];
}

export default function ProtoNav({ items }: ProtoNavProps) {
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: '72px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          style={{
            background: 'rgba(15,25,35,0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#a5f3fc',
            padding: '5px 12px',
            fontSize: '11px',
            fontFamily: 'monospace',
            borderRadius: '20px',
            cursor: 'pointer',
            letterSpacing: '0.4px',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(15,25,35,0.95)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(15,25,35,0.88)';
          }}
        >
          {String(item.index).padStart(2, '0')} {item.label}
        </button>
      ))}
    </nav>
  );
}
