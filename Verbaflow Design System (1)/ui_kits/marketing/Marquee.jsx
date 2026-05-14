// Big-text marquee divider with ✦ separators.
function Marquee() {
  const items = ['AI Automation', 'Lead Response', 'Voice Workflow', 'Growth Strategy'];
  return (
    <div className="vf-marquee-band">
      <div className="vf-marquee-track">
        {[...items, ...items, ...items].map((t, i) =>
          <React.Fragment key={i}>
            <span className="vf-marquee-item">{t}</span>
            <span className="vf-marquee-star">✦</span>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

window.Marquee = Marquee;
