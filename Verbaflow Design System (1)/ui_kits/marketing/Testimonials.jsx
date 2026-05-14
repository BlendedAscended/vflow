// Two-column quote testimonials.
function Testimonials() {
  const items = [
    { name: 'Dr. Sarah Lindqvist', title: 'VP of Revenue Cycle', company: 'Meridian Regional Health',
      quote: "Denial rate dropped 28% in the first 90 days. Their multi-agent claims pipeline runs 60% of our workload without a human in the loop. I don't think about prior auth queues the way I used to." },
    { name: 'Marcus Webb', title: 'Head of Compliance Engineering', company: 'ArcaCapital',
      quote: 'SOC 2 Type II controls automated end-to-end within six weeks. The reporting agents alone saved our team 40+ hours a month. This is what compliance infrastructure should look like in 2026.' },
    { name: 'Tamara Osei', title: 'Director of Nursing Operations', company: 'Lakeside Health System',
      quote: 'Agent-driven scheduling cut our unfilled shift rate by 43%. Nurses stopped calling dispatch. The system routes, notifies, and confirms — our coordinators handle escalations only now.' },
    { name: 'Brett Callahan', title: 'COO', company: 'Summit Field Services',
      quote: 'Dispatch, quoting, and job costing — fully automated. What used to take three coordinators now runs on one agent. We scaled 30% this year without adding a single back-office hire.' },
  ];

  return (
    <section className="vf-testimonials">
      <div className="vf-container">
        <h2 className="vf-testimonials__title">
          Results from the <span className="vf-gradient-text">field,</span> not the slide deck.
        </h2>
        <p className="vf-testimonials__sub">
          Healthcare networks, fintech compliance teams, nursing operations, and trade services — deployed systems, measured outcomes.
        </p>
        <div className="vf-testimonials__grid">
          {items.map(t =>
            <div key={t.name} className="vf-testimonial">
              <div className="vf-testimonial__row">
                <div className="vf-testimonial__avatar">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div className="vf-testimonial__meta">
                  <div className="vf-testimonial__name">{t.name}</div>
                  <div className="vf-testimonial__title">{t.title} at {t.company}</div>
                </div>
              </div>
              <p className="vf-testimonial__quote">{t.quote}</p>
              <div className="vf-testimonial__stars">
                {[...Array(5)].map((_, i) =>
                  <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#FACC15">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

window.Testimonials = Testimonials;
