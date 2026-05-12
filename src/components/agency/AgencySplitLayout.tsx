'use client';

import { useState, useRef, useCallback } from 'react';
import { agencyDomains } from '../../data/agencyDomains';
import AgencyLeftPanel from './AgencyLeftPanel';
import AgencyRightPanel from './AgencyRightPanel';

export default function AgencySplitLayout() {
  const [activeDomain, setActiveDomain] = useState<string>('healthcare');
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const handleDomainSelect = useCallback((id: string) => {
    setActiveDomain(id);
    const domain = agencyDomains.find((d) => d.id === id);
    if (domain && rightPanelRef.current) {
      const el = rightPanelRef.current.querySelector(`#${domain.frameId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleDomainVisible = useCallback((id: string) => {
    setActiveDomain(id);
  }, []);

  return (
    <>
      {/* Desktop: split screen */}
      <div
        className="hidden lg:flex agency-page"
        style={{
          height: 'calc(100vh - 64px)',
          background: 'var(--agency-bg)',
          overflow: 'hidden',
        }}
      >
        {/* Left panel — narrow sidebar */}
        <div
          className="flex-shrink-0 overflow-y-auto"
          style={{
            width: '20%',
            height: '100%',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--agency-border) transparent',
          }}
        >
          <AgencyLeftPanel
            domains={agencyDomains}
            activeDomain={activeDomain}
            onDomainSelect={handleDomainSelect}
          />
        </div>

        {/* Right panel — wide showcase */}
        <div className="flex-shrink-0" style={{ width: '80%', height: '100%' }}>
          <AgencyRightPanel
            domains={agencyDomains}
            activeDomain={activeDomain}
            onDomainVisible={handleDomainVisible}
            panelRef={rightPanelRef}
          />
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div
        className="flex flex-col lg:hidden agency-page"
        style={{ background: 'var(--agency-bg)', minHeight: 'calc(100vh - 64px)' }}
      >
        <div className="border-b" style={{ borderColor: 'var(--agency-border)' }}>
          <AgencyLeftPanel
            domains={agencyDomains}
            activeDomain={activeDomain}
            onDomainSelect={handleDomainSelect}
          />
        </div>
        <AgencyRightPanel
          domains={agencyDomains}
          activeDomain={activeDomain}
          onDomainVisible={handleDomainVisible}
          panelRef={rightPanelRef}
        />
      </div>
    </>
  );
}
