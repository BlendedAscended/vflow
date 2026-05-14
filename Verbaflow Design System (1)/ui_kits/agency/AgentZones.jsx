// Three domain zone cards — Healthcare (green), Finance (blue), Cloud (violet).
const ZONES = [
  { domain: 'HEALTHCARE', accent: '#00C203', accentBg: 'rgba(0,194,3,0.10)',
    title: 'Claims, prior auth & nursing ops',
    body: 'Multi-agent claims pipelines, denial-prevention copilots, nurse-shift routing. Built to clear EHR and revenue-cycle stacks already in production.',
    metrics: [['1,204', 'claims / day'], ['−28%', 'denial rate'], ['60%', 'no-touch']],
    stack: ['Epic / Cerner', 'OpenClaw', 'HIPAA BAA', 'PostgreSQL'],
  },
  { domain: 'FINANCE',    accent: '#2E75B6', accentBg: 'rgba(46,117,182,0.10)',
    title: 'Compliance, controls & reporting',
    body: 'SOC 2 Type II automation, AML/KYC pipelines, audit-trail agents. We replace 40-hour-a-month reporting work with continuous controls.',
    metrics: [['6w', 'to SOC 2 Type II'], ['40h', 'saved / month'], ['100%', 'audit trail']],
    stack: ['Vanta', 'Plaid', 'Snowflake', 'Auth0'],
  },
  { domain: 'CLOUD',      accent: '#7C3AED', accentBg: 'rgba(124,58,237,0.10)',
    title: 'Infrastructure, dispatch & orchestration',
    body: 'Multi-region cloud architecture, agentic dispatch and job-costing for field services, observability for engineering pods.',
    metrics: [['11', 'agents in prod'], ['0', 'incidents 90 d'], ['30%', 'YoY scale']],
    stack: ['AWS', 'GCP', 'Datadog', 'Kubernetes'],
  },
];

function AgentZones() {
  return (
    <section className="ag-zones">
      <div className="ag-section-head">
        <div className="ag-eyebrow">PRACTICE AREAS</div>
        <h2 className="ag-section-title">Three domains, one operating system.</h2>
        <p className="ag-section-sub">Every engagement starts with a 30-minute scoping call. We map your operations against the agent topology we already run for your peers.</p>
      </div>

      <div className="ag-zones__grid">
        {ZONES.map(z =>
          <article key={z.domain} className="ag-zone">
            <div className="ag-zone__top">
              <span className="ag-zone__badge" style={{ color: z.accent, background: z.accentBg }}>
                <span className="ag-zone__dot" style={{ background: z.accent }}></span>
                {z.domain}
              </span>
              <span className="ag-zone__status">● LIVE</span>
            </div>
            <h3 className="ag-zone__title">{z.title}</h3>
            <p className="ag-zone__body">{z.body}</p>
            <div className="ag-zone__metrics">
              {z.metrics.map(([v, l]) =>
                <div key={l} className="ag-zone__metric">
                  <div className="ag-zone__metric-v" style={{ color: z.accent }}>{v}</div>
                  <div className="ag-zone__metric-l">{l}</div>
                </div>
              )}
            </div>
            <div className="ag-zone__stack-label">Integrates with</div>
            <div className="ag-zone__stack">
              {z.stack.map(s => <span key={s} className="ag-zone__chip">{s}</span>)}
            </div>
            <a href="#" className="ag-zone__cta">Read case study →</a>
          </article>
        )}
      </div>
    </section>
  );
}

window.AgentZones = AgentZones;
