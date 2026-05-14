// Metrics row — three small bar charts, one per domain.
function MetricsRow() {
  const charts = [
    { title: 'Denials per 1,000 claims', accent: '#00C203', label: 'Healthcare',
      bars: [82, 78, 71, 66, 62, 56, 51, 44, 38, 34, 30, 28] },
    { title: 'Hours / month — manual reporting', accent: '#2E75B6', label: 'Finance',
      bars: [44, 42, 41, 38, 36, 30, 25, 18, 12, 8, 6, 4] },
    { title: 'Incidents / quarter', accent: '#7C3AED', label: 'Cloud',
      bars: [11, 9, 7, 6, 5, 4, 3, 2, 1, 1, 0, 0] },
  ];
  return (
    <section className="ag-metrics">
      <div className="ag-section-head">
        <div className="ag-eyebrow">OUTCOMES · 12-MONTH AVERAGE</div>
        <h2 className="ag-section-title">Charts that match the contract.</h2>
        <p className="ag-section-sub">Numbers tracked in production dashboards. No survey data. No anonymized aggregates.</p>
      </div>
      <div className="ag-metrics__grid">
        {charts.map(c => {
          const max = Math.max(...c.bars);
          return (
            <div key={c.title} className="ag-chart">
              <div className="ag-chart__head">
                <span className="ag-chart__domain" style={{ color: c.accent }}>{c.label.toUpperCase()}</span>
                <span className="ag-chart__title">{c.title}</span>
              </div>
              <div className="ag-chart__bars">
                {c.bars.map((b, i) =>
                  <div key={i} className="ag-chart__bar-wrap">
                    <div className="ag-chart__bar" style={{ height: `${(b / max) * 100}%`, background: c.accent }}></div>
                  </div>
                )}
              </div>
              <div className="ag-chart__axis">
                <span>Jan</span><span>Jun</span><span>Dec</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

window.MetricsRow = MetricsRow;
