// Trusted-by pill ticker — animates left, pauses on hover.
function SocialProofBar() {
  const items = ['MERIDIAN HEALTH', 'ARCACAPITAL', 'LAKESIDE NURSING', 'SUMMIT FIELD SVC',
                 'NORTHWIND TMS', 'BAYSIDE BANK', 'CAPSTONE LEGAL', 'WAYPOINT OPS'];
  return (
    <section className="ag-proof">
      <div className="ag-proof__label">Trusted by mid-scale operations teams</div>
      <div className="ag-proof__viewport">
        <div className="ag-proof__track">
          {[...items, ...items].map((t, i) =>
            <span key={i} className="ag-proof__pill">{t}</span>
          )}
        </div>
      </div>
    </section>
  );
}

window.SocialProofBar = SocialProofBar;
