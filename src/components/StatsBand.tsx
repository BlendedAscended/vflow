"use client";
import { useEffect, useRef } from "react";

const stats = [
  { target: 247,  prefix: "+", suffix: "",  label: "Leads / month" },
  { target: 68,   prefix: "",  suffix: "%", label: "Response rate" },
  { target: 1204, prefix: "+", suffix: "",  label: "Tasks automated" },
];

function Counter({ target, prefix, suffix, label }: (typeof stats)[0]) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.textContent = target.toLocaleString();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        const dur = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
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

export default function StatsBand() {
  return (
    <section className="vf-stats-band">
      <div className="vf-container">
        <div className="vf-stats-band__row">
          {stats.map((s) => (
            <Counter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
