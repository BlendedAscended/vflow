// Transparent nav at top of agency page — flips to white-with-blur on scroll.
function AgencyNav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`ag-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ag-nav__inner">
        <a href="#" className="ag-nav__logo">
          <img src="../../assets/logo.png" alt="Verbaflow"/>
          <span>Verbaflow LLC</span>
        </a>
        <div className="ag-nav__links">
          {['Practice', 'Systems', 'Case studies', 'Engineering', 'About'].map(l =>
            <a key={l} href="#" className="ag-nav__link">{l}</a>
          )}
        </div>
        <a href="#" className="ag-nav__cta">Talk to an architect</a>
      </div>
    </nav>
  );
}

window.AgencyNav = AgencyNav;
