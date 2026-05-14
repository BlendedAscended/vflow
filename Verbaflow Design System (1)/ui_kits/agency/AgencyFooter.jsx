// Quiet ink-on-paper footer.
function AgencyFooter() {
  const cols = [
    ['Practice', ['Healthcare', 'Finance', 'Cloud ops', 'Engineering pod']],
    ['Engagements', ['Scope', 'Deploy', 'Operate', 'Audit']],
    ['Company', ['About', 'Engineering blog', 'Careers', 'Contact']],
  ];
  return (
    <footer className="ag-footer">
      <div className="ag-footer__top">
        <div className="ag-footer__brand">
          <div className="ag-footer__brand-row">
            <img src="../../assets/logo.png" alt="Verbaflow"/>
            <span>Verbaflow LLC</span>
          </div>
          <p className="ag-footer__brand-tag">Production agentic infrastructure for mid-scale companies. Montgomery County, MD.</p>
          <a href="#" className="ag-cta ag-cta--meet" style={{ marginTop: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Schedule a meeting
          </a>
        </div>

        {cols.map(([title, items]) =>
          <div key={title} className="ag-footer__col">
            <div className="ag-footer__col-title">{title}</div>
            {items.map(i => <a key={i} href="#" className="ag-footer__col-link">{i}</a>)}
          </div>
        )}
      </div>
      <div className="ag-footer__base">
        <span>© 2026 Verbaflow LLC</span>
        <span>HIPAA · SOC 2 Type II · DOT/FMCSA</span>
      </div>
    </footer>
  );
}

window.AgencyFooter = AgencyFooter;
