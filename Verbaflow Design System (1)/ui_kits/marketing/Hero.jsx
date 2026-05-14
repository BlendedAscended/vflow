// Healthie-style hero: dark teal + medium-weight headline + ghost CTAs + glass stat card.
function Hero() {
  return (
    <section className="vf-hero">
      <div className="vf-hero__bg-orb vf-hero__bg-orb--1"></div>
      <div className="vf-hero__bg-orb vf-hero__bg-orb--2"></div>

      <div className="vf-hero__inner">
        <div className="vf-hero__col">
          <div className="vf-hero__badge">
            <span className="vf-hero__badge-dot"></span>
            DEPLOYING IN MONTGOMERY COUNTY
          </div>
          <h1 className="vf-hero__headline">
            Autonomous systems that run your operations.
            {' '}<span className="vf-hero__headline-accent">Without scaling your team.</span>
          </h1>
          <p className="vf-hero__sub">
            We design and ship multi-agent AI systems for mid-scale companies. Healthcare,
            finance, and cloud-native teams — autonomous workflows in weeks, not quarters.
          </p>
          <div className="vf-hero__ctas">
            <a href="#" className="vf-btn vf-btn--primary">Get my growth plan</a>
            <a href="#" className="vf-btn vf-btn--ghost">Start a project</a>
          </div>
          <div className="vf-hero__micro">No-commit 30-min scoping call · production handoff in 6–8 weeks</div>
        </div>

        <div className="vf-hero__col vf-hero__col--right">
          <div className="vf-glass-card">
            <div className="vf-glass-card__header">
              <span className="vf-glass-card__tag">MERIDIAN HEALTH · Q3</span>
              <span className="vf-glass-card__status">● Live</span>
            </div>
            <div className="vf-glass-card__metric">
              <span className="vf-glass-card__metric-label">Denial rate</span>
              <span className="vf-glass-card__metric-value">−28%</span>
              <span className="vf-glass-card__metric-delta">↓ first 90 days</span>
            </div>
            <div className="vf-glass-card__divider"></div>
            <div className="vf-glass-card__row"><span className="vf-glass-card__row-label">Claims / day</span><span className="vf-glass-card__row-val">1,204</span></div>
            <div className="vf-glass-card__row"><span className="vf-glass-card__row-label">No-touch ratio</span><span className="vf-glass-card__row-val vf-glass-card__row-val--green">60%</span></div>
            <div className="vf-glass-card__row"><span className="vf-glass-card__row-label">SLA</span><span className="vf-glass-card__row-val">&lt; 24h</span></div>
          </div>
          <div className="vf-glass-badge">
            <span>Agent: claim-router-v3 · just dispatched</span>
            <span className="vf-glass-badge__time">2s ago</span>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
