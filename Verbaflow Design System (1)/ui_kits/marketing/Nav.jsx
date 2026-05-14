// Sticky floating-pill nav. Logo + Services dropdown + links + 13g CTA.
function Nav() {
  const [services, setServices] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);

  return (
    <nav className="vf-nav">
      <div className="vf-nav__shell">
        <a href="#" className="vf-nav__logo">
          <img src="../../assets/logo.png" alt="Verbaflow"/>
          <span>Verbaflow LLC</span>
        </a>

        <div className="vf-nav__links">
          <div className="vf-nav__dropdown" onMouseEnter={() => setServices(true)} onMouseLeave={() => setServices(false)}>
            <button className="vf-nav__link">Services <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7"/></svg></button>
            {services && (
              <div className="vf-nav__menu">
                {[
                  'AI Agents & Automation', 'Custom Software & SaaS',
                  'Mobile Apps', 'Compliance Automation',
                  'Marketing & Lead-Gen', 'Hiring Agents',
                  'E-commerce', 'Cloud & IT',
                ].map(s => <a key={s} href="#" className="vf-nav__menu-item">{s}</a>)}
              </div>
            )}
          </div>
          {['Virtual Office', 'Agency', 'About', 'Blog', 'Contact'].map(l =>
            <a key={l} href="#" className="vf-nav__link">{l}</a>
          )}
        </div>

        <a href="#" className="vf-cta-13g">
          <span>Get started</span>
          <span className="vf-cta-13g__circle">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>

        <button className="vf-nav__burger" onClick={() => setMobile(!mobile)} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobile ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>
    </nav>
  );
}

window.Nav = Nav;
