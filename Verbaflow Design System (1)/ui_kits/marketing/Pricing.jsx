// Three-tier pricing: Scope / Deploy (featured) / Operate.
function Pricing() {
  const tiers = [
    {
      name: 'Scope',
      desc: 'System scoping, architecture, and a working proof-of-concept. Know exactly what to build before you commit.',
      price: '$895', period: ' – $2,495',
      features: ['Agentic system scoping & architecture map', 'Use-case prioritization for your domain', 'Proof-of-concept deployment', 'Integration assessment (EHR, ERP, CRM)', '30-day monitoring & documented handoff'],
      cta: 'Start scoping',
    },
    {
      name: 'Deploy',
      desc: 'Full production-grade agentic system. Built, tested, and handed off running in your environment.',
      price: '$2,495', period: ' – $5,995',
      features: ['Production multi-agent system build', 'Custom LLM fine-tuning or RAG pipeline', 'HIPAA / SOC 2 compliance layer', 'Live observability dashboard', '90-day post-deploy support'],
      cta: 'Get deployed', featured: true,
    },
    {
      name: 'Operate',
      desc: 'Ongoing agentic infrastructure management, multi-system orchestration, and engineering pod access.',
      price: '$5,995', period: ' – $14,995',
      features: ['Multi-agent infrastructure management', 'Cross-domain agentic orchestration', 'Continuous model optimization', 'Dedicated engineering pod access', '24/7 incident response SLA'],
      cta: 'Scale operations',
    },
  ];

  return (
    <section className="vf-pricing">
      <div className="vf-pricing__bg"></div>
      <div className="vf-container">
        <div className="vf-pricing__head">
          <h2 className="vf-pricing__title">Every engagement ships something real.</h2>
          <p className="vf-pricing__sub">
            Every tier starts with a 30-minute scoping call. We map your operations, identify the
            highest-ROI automation paths, and build production systems — not slide decks. If we can't
            justify the build, we tell you before you pay for it.
          </p>
        </div>

        <div className="vf-pricing__grid">
          {tiers.map((t, i) => (
            <div key={t.name} className={`vf-pricing__card ${t.featured ? 'is-featured' : ''}`}>
              <h3 className="vf-pricing__name">{t.name}</h3>
              <p className="vf-pricing__desc">{t.desc}</p>
              <div className="vf-pricing__price">
                <span className="vf-pricing__price-main">{t.price}</span>
                <span className="vf-pricing__price-range">{t.period}</span>
              </div>
              <button className={`vf-pricing__cta ${t.featured ? 'is-featured' : (i === 0 ? 'is-outline' : 'is-muted')}`}>
                {t.cta}
              </button>
              <div className="vf-pricing__features">
                {t.features.map(f =>
                  <div key={f} className="vf-pricing__feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A5D6A7" strokeWidth="2"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{f}</span>
                  </div>
                )}
              </div>
              {i > 0 && (
                <div className="vf-pricing__plus">
                  Includes everything in <strong>{tiers[i - 1].name}</strong>, plus these additional capabilities.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Pricing = Pricing;
