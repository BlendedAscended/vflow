// Footer — logo + nav links + social icons + copyright.
function Footer() {
  const links = ['About', 'Services', 'Blog', 'FAQ', 'Contact', 'Support'];
  const socials = [
    { name: 'LinkedIn', color: '#0A66C2', d: 'M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z' },
    { name: 'X',        color: '#1DA1F2', d: 'M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84' },
    { name: 'YouTube',  color: '#FF0000', d: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' },
  ];

  return (
    <footer className="vf-footer">
      <div className="vf-footer__bg"></div>
      <div className="vf-container">
        <div className="vf-footer__row">
          <div className="vf-footer__brand">
            <img src="../../assets/logo.png" alt="Verbaflow"/>
            <div>
              <div className="vf-footer__name">VERBAFLOW</div>
              <div className="vf-footer__llc">LLC</div>
            </div>
          </div>

          <div className="vf-footer__links">
            {links.map(l => <a key={l} href="#" className="vf-footer__link">{l}</a>)}
            <a href="#" className="vf-footer__call-btn">Call Us</a>
          </div>

          <div className="vf-footer__socials">
            {socials.map(s =>
              <a key={s.name} href="#" style={{ color: s.color }} aria-label={s.name}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d={s.d}/></svg>
              </a>
            )}
          </div>
        </div>
        <div className="vf-footer__copy">
          © 2026 Verbaflow LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
