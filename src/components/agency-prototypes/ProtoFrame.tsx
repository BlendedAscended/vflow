'use client';

import { Suspense, ReactNode } from 'react';

interface ProtoFrameProps {
  id: string;
  label: string;
  index: number;
  wrapperClass?: string;
  children: ReactNode;
}

export default function ProtoFrame({ id, label, index, wrapperClass, children }: ProtoFrameProps) {
  return (
    <section
      id={id}
      data-prototype={id}
      style={{
        isolation: 'isolate' as const,
        containerType: 'inline-size' as const,
        position: 'relative',
        marginBottom: '3rem',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          background: 'rgba(15,25,35,0.9)',
          color: '#fff',
          padding: '6px 14px',
          fontSize: '12px',
          fontFamily: 'monospace',
          borderRadius: '0 0 8px 0',
          letterSpacing: '0.5px',
        }}
      >
        {String(index).padStart(2, '0')} &middot; {label}
      </div>

      {wrapperClass ? (
        <div className={wrapperClass}>
          <Suspense fallback={<div style={{ padding: '2rem', opacity: 0.4 }}>Loading...</div>}>
            {children}
          </Suspense>
        </div>
      ) : (
        <Suspense fallback={<div style={{ padding: '2rem', opacity: 0.4 }}>Loading...</div>}>
          {children}
        </Suspense>
      )}
    </section>
  );
}
