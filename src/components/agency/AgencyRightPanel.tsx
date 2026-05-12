'use client';

import { useEffect, type RefObject } from 'react';
import type { AgencyDomain } from '../../data/agencyDomains';
import ProjectFrame from './ProjectFrame';

interface AgencyRightPanelProps {
  domains: AgencyDomain[];
  activeDomain: string;
  onDomainVisible: (id: string) => void;
  panelRef: RefObject<HTMLDivElement | null>;
}

export default function AgencyRightPanel({
  domains,
  activeDomain,
  onDomainVisible,
  panelRef,
}: AgencyRightPanelProps) {
  useEffect(() => {
    const container = panelRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let best: IntersectionObserverEntry | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        });
        if (best) {
          const id = (best as IntersectionObserverEntry).target.id.replace('frame-', '');
          onDomainVisible(id);
        }
      },
      { root: container, threshold: [0.3, 0.5, 0.7] }
    );

    domains.forEach((d) => {
      const el = container.querySelector(`#${d.frameId}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [domains, panelRef, onDomainVisible]);

  return (
    <div
      ref={panelRef}
      className="w-full h-full overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--agency-border) transparent',
      }}
    >
      <div className="px-6 pt-8 pb-16 space-y-6">
        {/* Intro text above frames */}
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--agency-text-muted)' }}>
            Systems Portfolio
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--agency-text-muted)' }}>
            Each system is live. Scroll to inspect ↓
          </p>
        </div>

        {domains.map((domain) => (
          <ProjectFrame key={domain.id} domain={domain} isActive={activeDomain === domain.id} />
        ))}
      </div>
    </div>
  );
}
