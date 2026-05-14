// Agency hero — Studio White paper, ink headline, two CTAs (ink primary + civic-blue meet).
function AgencyHero() {
  return (
    <section className="ag-hero">
      <div className="ag-hero__inner">
        <div className="ag-hero__col">
          <div className="ag-hero__eyebrow">
            <span className="ag-hero__eyebrow-dot"></span>
            AGENCY PRACTICE · MID-ATLANTIC
          </div>
          <h1 className="ag-hero__headline">
            Production agentic infrastructure — built, shipped, operated.
          </h1>
          <p className="ag-hero__sub">
            We deploy multi-agent systems for healthcare networks, fintech compliance teams, and
            cloud-native operations. Not pilots. Not slide decks. Systems your team runs.
          </p>
          <div className="ag-hero__ctas">
            <a href="#" className="ag-cta ag-cta--primary">Talk to an architect</a>
            <a href="#" className="ag-cta ag-cta--ghost">See live systems →</a>
            <a href="#" className="ag-cta ag-cta--meet">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Schedule a meeting
            </a>
          </div>
        </div>

        <div className="ag-hero__floor">
          {/* Iso floor placeholder — in product this is a 12 MB MP4. Substituted with a layered SVG plan view. */}
          <svg viewBox="0 0 480 320" className="ag-hero__floor-svg" aria-label="Isometric agency floor (placeholder)">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D1D5DB" strokeWidth="0.5"/>
              </pattern>
              <linearGradient id="agShadow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#F0EFF0"/>
                <stop offset="1" stopColor="#E5E5E0"/>
              </linearGradient>
            </defs>
            <rect width="480" height="320" fill="#FAFAF8"/>
            <rect width="480" height="320" fill="url(#grid)"/>

            {/* Three agent "zones" — colored stroke only */}
            <g transform="translate(40,40)">
              <rect width="160" height="100" rx="6" fill="url(#agShadow)" stroke="#00C203" strokeWidth="1.5"/>
              <text x="12" y="22" fill="#00C203" fontFamily="Geist, sans-serif" fontSize="10" fontWeight="700" letterSpacing="0.1em">HEALTHCARE</text>
              <text x="12" y="40" fill="#0F1923" fontFamily="Geist, sans-serif" fontSize="13" fontWeight="600">Claims & Auth Agents</text>
              <text x="12" y="58" fill="#4B5563" fontFamily="Geist Mono, monospace" fontSize="10">6 agents · 1,204 claims/day</text>
              <circle cx="148" cy="14" r="3" fill="#00C203"/>
            </g>
            <g transform="translate(220,40)">
              <rect width="160" height="100" rx="6" fill="url(#agShadow)" stroke="#2E75B6" strokeWidth="1.5"/>
              <text x="12" y="22" fill="#2E75B6" fontFamily="Geist, sans-serif" fontSize="10" fontWeight="700" letterSpacing="0.1em">FINANCE</text>
              <text x="12" y="40" fill="#0F1923" fontFamily="Geist, sans-serif" fontSize="13" fontWeight="600">Compliance Agents</text>
              <text x="12" y="58" fill="#4B5563" fontFamily="Geist Mono, monospace" fontSize="10">4 agents · SOC 2 Type II</text>
              <circle cx="148" cy="14" r="3" fill="#2E75B6"/>
            </g>
            <g transform="translate(130,160)">
              <rect width="220" height="100" rx="6" fill="url(#agShadow)" stroke="#7C3AED" strokeWidth="1.5"/>
              <text x="12" y="22" fill="#7C3AED" fontFamily="Geist, sans-serif" fontSize="10" fontWeight="700" letterSpacing="0.1em">CLOUD-NATIVE OPS</text>
              <text x="12" y="40" fill="#0F1923" fontFamily="Geist, sans-serif" fontSize="13" fontWeight="600">Orchestration & Infra Agents</text>
              <text x="12" y="58" fill="#4B5563" fontFamily="Geist Mono, monospace" fontSize="10">11 agents · 0 incidents 90 d</text>
              <circle cx="208" cy="14" r="3" fill="#7C3AED"/>
            </g>

            {/* Connecting paths */}
            <path d="M 120 140 L 240 160" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" fill="none"/>
            <path d="M 300 140 L 300 160" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" fill="none"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

window.AgencyHero = AgencyHero;
