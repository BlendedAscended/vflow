// Three big animated counters — runs once on mount.
function Counter({ target, prefix = '', suffix = '', label }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = target.toLocaleString();
      return;
    }
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return (
    <div className="vf-counter">
      <div className="vf-counter__num">
        <span className="vf-counter__sign">{prefix}</span>
        <span ref={ref}>0</span>
        {suffix}
      </div>
      <div className="vf-counter__label">{label}</div>
    </div>
  );
}

function StatsBand() {
  return (
    <section className="vf-stats-band">
      <div className="vf-container">
        <div className="vf-stats-band__row">
          <Counter target={247} prefix="+" label="Leads / month"/>
          <Counter target={68} suffix="%" label="Response rate"/>
          <Counter target={1204} prefix="+" label="Tasks automated"/>
        </div>
      </div>
    </section>
  );
}

window.StatsBand = StatsBand;
