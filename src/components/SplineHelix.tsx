'use client';

import Spline from '@splinetool/react-spline';
import { Suspense } from 'react';

interface SplineHelixProps {
  sceneUrl?: string;
  className?: string;
}

export default function SplineHelix({ 
  sceneUrl = "https://prod.spline.design/your-unique-id/scene.splinecode",
  className = ""
}: SplineHelixProps) {
  const isPlaceholder = sceneUrl.includes("your-unique-id");

  if (isPlaceholder) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-[var(--section-bg-3)]/30 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[var(--border)] ${className}`}>
        <div className="text-center p-8">
          <p className="text-sm font-bold text-[var(--accent)] mb-2 uppercase tracking-widest">3D Component Ready</p>
          <p className="text-xs text-[var(--text-accent)] opacity-70 max-w-[200px] mx-auto">
            Please update the <code>sceneUrl</code> in <code>ServicesSection.tsx</code> with your Spline export URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative min-h-[500px] ${className}`}>
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--section-bg-3)]/50 backdrop-blur-sm rounded-3xl border border-[var(--border)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-accent)] opacity-50">
              Loading 3D Experience...
            </p>
          </div>
        </div>
      }>
        <Spline 
          scene={sceneUrl} 
          onError={(e) => {
            console.error('Spline error:', e);
          }}
          onLoad={(spline) => {
            console.log('Spline scene loaded');
          }}
        />
      </Suspense>
    </div>
  );
}
