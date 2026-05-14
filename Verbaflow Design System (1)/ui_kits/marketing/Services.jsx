// Services section — eyebrow heading + filter chips + service cards in a two-column grid.
const SERVICES = [
  { icon: 'ai', category: 'Artificial Intelligence', price: 'From $295',
    title: 'AI Agents & Agentic Automation',
    desc: 'Deploy a full agent crew — architect, CEO, designer, compliance officer — built on OpenClaw with Telegram HITL.',
    features: ['OpenClaw multi-agent stack', 'Telegram HITL bridge', 'Audit logs & cost caps'] },
  { icon: 'website', category: 'Software', price: 'From $495',
    title: 'Custom Software & SaaS',
    desc: 'Replace legacy software with bespoke SaaS your team actually wants to use. TMS, government portals, internal tooling.',
    features: ['TMS & logistics software', 'Government portals', 'Postgres + Next.js'] },
  { icon: 'cloud', category: 'Compliance', price: 'From $495',
    title: 'Compliance Automation',
    desc: 'HIPAA, DOT/FMCSA, AML, SOC 2 — automated training, audit trails, and a compliance officer agent.',
    features: ['HIPAA / DOT / AML training', 'Audit-trail automation', 'Policy drift detection'] },
  { icon: 'marketing', category: 'Marketing', price: 'From $395',
    title: 'Lead-Gen Agents',
    desc: 'Multi-channel campaigns plus agentic lead-gen — outreach, qualification and SEO content that compounds.',
    features: ['Lead-gen agents', 'PPC & retargeting', 'SEO content engine'] },
];

const ICONS = {
  ai:        'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  website:   'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
  cloud:     'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
  marketing: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
};

function ServiceCard({ svc, alt }) {
  return (
    <div className="vf-svc-card" style={{ background: alt ? 'var(--section-bg-2)' : 'var(--section-bg-3)' }}>
      <div className="vf-svc-card__top">
        <div className="vf-svc-card__icon-row">
          <div className="vf-svc-card__icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#102023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS[svc.icon]}/>
            </svg>
          </div>
          <span className="vf-svc-card__category">{svc.category}</span>
        </div>
        <span className="vf-svc-card__price">{svc.price}</span>
      </div>
      <h3 className="vf-svc-card__title">{svc.title}</h3>
      <p className="vf-svc-card__desc">{svc.desc}</p>
      <div className="vf-svc-card__features">
        {svc.features.map(f =>
          <div key={f} className="vf-svc-card__feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A5D6A7" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
            <span>{f}</span>
          </div>
        )}
      </div>
      <div className="vf-svc-card__ctas">
        <a href="#" className="vf-svc-card__cta-primary">Learn More →</a>
        <a href="#" className="vf-svc-card__cta-secondary">Get Started →</a>
      </div>
    </div>
  );
}

function Services() {
  const [filter, setFilter] = React.useState('All');
  const categories = ['All', 'AI Agents', 'Software', 'Compliance', 'Marketing', 'Cloud'];

  return (
    <section className="vf-services">
      <div className="vf-services__bg"></div>
      <div className="vf-container">
        <div className="vf-services__head">
          <div className="vf-services__notched-tag">
            Where strategy, technology, and automation converge, predictable growth emerges.
          </div>
          <h2 className="vf-services__title">
            Build a smarter, <span className="vf-gradient-text">stronger brand.</span>
          </h2>
          <p className="vf-services__sub">
            Click any service card to get your custom price estimate.
          </p>
        </div>

        <div className="vf-services__filters">
          {categories.map(c =>
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`vf-services__filter ${filter === c ? 'is-active' : ''}`}
            >{c}</button>
          )}
        </div>

        <div className="vf-services__grid">
          {SERVICES.map((s, i) => <ServiceCard key={s.title} svc={s} alt={i % 2 === 1}/>)}
        </div>
      </div>
    </section>
  );
}

window.Services = Services;
