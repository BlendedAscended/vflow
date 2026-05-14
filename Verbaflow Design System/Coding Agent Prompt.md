# Verbaflow Website — Motion & Structure Upgrade (13g.fr-inspired)

**Paste this entire document into your coding agent (Claude Code / Cursor / etc.) as a single task.**

---

## 🎯 Mission

Upgrade the Verbaflow marketing site (Next.js / React / Tailwind) with the motion vocabulary and structural principles of [13g.fr](https://13g.fr). We are not rebranding — brand tokens (dark teal `#102023`, accent green `#A5D6A7`, DM Sans, DM Mono) stay. We are layering motion craft and editorial structure on top of the existing IA.

Work in three waves. **Do not skip ahead.** Ship, verify, commit after each wave.

---

## 📦 Wave 0 — Foundations (do first, 15 minutes)

These are global changes every later wave depends on.

### 0.1 — Global easing swap

In `app/globals.css` (or wherever animations live), find every occurrence of:
- `ease-out`
- `cubic-bezier(0.4, 0, 0.2, 1)` (the Tailwind `ease-in-out` default)
- `ease` (bare)

…inside `transition:` and `animation:` declarations, and replace with:

```css
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
```

Add that variable to `:root`. Bump every animation/transition `duration` **+20%** (e.g. `300ms → 400ms`, `600ms → 720ms`, `1000ms → 1200ms`). Do NOT touch hover micro-interactions under 150ms.

### 0.2 — Add three motion utility classes to globals.css

```css
:root {
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-std: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scroll reveal — replaces any existing animate-fade-in-up */
.vf-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s var(--ease-out-expo), transform 1s var(--ease-out-expo);
}
.vf-reveal.is-visible { opacity: 1; transform: translateY(0); }
.vf-reveal-d1 { transition-delay: 80ms; }
.vf-reveal-d2 { transition-delay: 160ms; }
.vf-reveal-d3 { transition-delay: 240ms; }
.vf-reveal-d4 { transition-delay: 320ms; }

@media (prefers-reduced-motion: reduce) {
  .vf-reveal, .vf-reveal * { opacity: 1 !important; transform: none !important; transition: none !important; }
}
```

### 0.3 — Create a single `useReveal` hook

Create `hooks/useReveal.ts`:

```ts
"use client";
import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      }),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}
```

Replace any existing per-component IntersectionObserver code with this hook. Search for `new IntersectionObserver` across the codebase and consolidate.

### 0.4 — Respect reduced motion everywhere

Wrap any JS-driven animation in:
```ts
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReduced) { /* skip animation, set final state immediately */ }
```

---

## 🚀 Wave 1 — The Three Highest-Leverage Changes (1–2 hours)

Ship this PR first. It delivers 70% of the perceived polish gain.

### 1.1 — Global easing swap
Already done in Wave 0. Verify every existing animation now feels "longer and smoother."

### 1.2 — Kinetic headline in HeroSection.tsx

Modify `components/sections/HeroSection.tsx`. Replace the static H1 with a rotating final word.

```tsx
const rotatingWords = ["best customers.", "high-intent leads.", "loyal advocates."];

// In JSX:
<h1 className="hero-headline">
  Connect with more of your<br/>
  <span className="vf-word-mask">
    {rotatingWords.map((w, i) => (
      <span key={i} className={`vf-word vf-word--${i+1}`}>{w}</span>
    ))}
  </span>
</h1>
```

Add to `globals.css`:

```css
.vf-word-mask {
  display: inline-block; position: relative;
  height: 1.15em; min-width: 340px; vertical-align: bottom;
  overflow: hidden;
}
.vf-word {
  display: block; position: absolute; left: 0; top: 0; white-space: nowrap;
  background: linear-gradient(135deg, #A5D6A7 0%, #6ec97a 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.vf-word--1 { animation: vf-rotate-1 5s infinite; }
.vf-word--2 { animation: vf-rotate-2 5s infinite; }
.vf-word--3 { animation: vf-rotate-3 5s infinite; }
@keyframes vf-rotate-1 { 0%,28%{transform:translateY(0);opacity:1} 33%,100%{transform:translateY(-110%);opacity:0} }
@keyframes vf-rotate-2 { 0%,28%{transform:translateY(110%);opacity:0} 33%,61%{transform:translateY(0);opacity:1} 66%,100%{transform:translateY(-110%);opacity:0} }
@keyframes vf-rotate-3 { 0%,61%{transform:translateY(110%);opacity:0} 66%,94%{transform:translateY(0);opacity:1} 99%,100%{transform:translateY(-110%);opacity:0} }
```

Also bump the H1 size: change `clamp(44px, 5.2vw, 76px)` → `clamp(56px, 7vw, 110px)`. Cut sub-headline copy by ~30% (shorter is better).

### 1.3 — Counter stats band (new component)

Create `components/sections/StatsBand.tsx`. Mount it **between `<HeroSection />` and `<ServicesSection />`** in `app/page.tsx`.

```tsx
"use client";
import { useEffect, useRef } from "react";

const stats = [
  { target: 247, prefix: "+", suffix: "", label: "Leads / month" },
  { target: 68,  prefix: "",  suffix: "%", label: "Response rate" },
  { target: 1204, prefix: "+", suffix: "", label: "Tasks automated" },
];

function Counter({ target, prefix, suffix, label }: typeof stats[0]) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.unobserve(el);
      const dur = 1600, start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return (
    <div className="vf-counter">
      <div className="vf-counter__num">
        <span className="vf-counter__sign">{prefix}</span>
        <span ref={ref}>0</span>{suffix}
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
          {stats.map((s) => <Counter key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
```

Add to `globals.css`:

```css
.vf-stats-band { padding: 80px 0; border-block: 1px solid rgba(255,255,255,.06); }
.vf-stats-band__row { display: flex; gap: 64px; justify-content: center; flex-wrap: wrap; }
.vf-counter { display: flex; flex-direction: column; align-items: center; }
.vf-counter__num { font-size: clamp(56px, 7vw, 88px); font-weight: 600; letter-spacing: -.04em; line-height: 1; color: var(--accent); font-variant-numeric: tabular-nums; }
.vf-counter__sign { color: var(--accent); }
.vf-counter__label { font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--text-3); margin-top: 12px; }
```

**Replace the numbers above with real Verbaflow data** before merging. If we don't have real numbers yet, ask me — don't ship placeholders to prod.

---

## 🎬 Wave 2 — The Nine Motion Primitives (one PR per primitive, 1–2 days)

Ship each as a separate PR so each can be reviewed in isolation.

### Primitive 01 — Kinetic headline swap
✅ Done in Wave 1.

### Primitive 02 — Letter-by-letter rise on H2s
Create `components/ui/AnimatedHeadline.tsx`:

```tsx
"use client";
import { useEffect, useRef } from "react";

export default function AnimatedHeadline({ children, as: Tag = "h2", className = "" }: {
  children: string; as?: keyof JSX.IntrinsicElements; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.unobserve(el);
      el.querySelectorAll<HTMLElement>(".vf-char").forEach((c, i) => {
        c.style.animation = `vf-char-rise .9s cubic-bezier(0.19,1,0.22,1) ${i*30}ms forwards`;
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as any} className={className}>
      <span className="vf-char-mask">
        {[...children].map((ch, i) => (
          <span key={i} className="vf-char">{ch === " " ? "\u00a0" : ch}</span>
        ))}
      </span>
    </Tag>
  );
}
```

```css
.vf-char-mask { display: inline-block; overflow: hidden; vertical-align: bottom; }
.vf-char { display: inline-block; transform: translateY(110%); }
@keyframes vf-char-rise { to { transform: translateY(0); } }
```

Apply to every H2 in: `ServicesSection`, `PricingSection`, `TestimonialsSection`, `FAQSection`, `ContactSection`.

### Primitive 03 — Marquee (two flavors)
Create `components/ui/Marquee.tsx`:

```tsx
export default function Marquee({ children, speed = 22, variant = "logo" }: {
  children: React.ReactNode; speed?: number; variant?: "logo" | "big";
}) {
  return (
    <div className={`vf-marquee vf-marquee--${variant}`}>
      <div className="vf-marquee__track" style={{ animationDuration: `${speed}s` }}>
        {children}{children}
      </div>
    </div>
  );
}
```

```css
.vf-marquee { width: 100%; overflow: hidden; mask-image: linear-gradient(90deg,transparent,black 8%,black 92%,transparent); -webkit-mask-image: linear-gradient(90deg,transparent,black 8%,black 92%,transparent); }
.vf-marquee__track { display: flex; width: max-content; animation: vf-marquee linear infinite; gap: 64px; align-items: center; }
.vf-marquee:hover .vf-marquee__track { animation-play-state: paused; }
@keyframes vf-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

.vf-marquee--big .vf-marquee__track { gap: 32px; }
.vf-marquee--big .vf-marquee-item { font-size: clamp(46px,5.5vw,80px); font-weight: 700; letter-spacing: -.03em; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,.4); white-space: nowrap; transition: color .3s, -webkit-text-stroke-color .3s; }
.vf-marquee--big .vf-marquee-item:hover { color: var(--accent); -webkit-text-stroke-color: var(--accent); }
.vf-marquee--big .vf-marquee-star { color: var(--accent); font-size: clamp(36px,4vw,60px); }
```

**Use 1:** Upgrade `TrustBar.tsx` from static pills → `<Marquee variant="logo">` of sector logos/names.

**Use 2:** Insert `<Marquee variant="big">` between `ServicesSection` and `PricingSection` with items like `AI Automation ✦ Lead Response ✦ Voice Workflow ✦` (use `<span className="vf-marquee-item">` and `<span className="vf-marquee-star">✦</span>`).

### Primitive 04 — Scroll-reveal with ease-out-expo
✅ Infrastructure done in Wave 0 (`vf-reveal` class + `useReveal` hook).

**Apply:** Add `className="vf-reveal"` and use the `useReveal()` hook on every card/row in `ServicesSection`, `PricingSection`, `TestimonialsSection`, `FAQSection`. Stagger cards with `vf-reveal-d1/d2/d3/d4`.

### Primitive 05 — Counter
✅ Done in Wave 1.

### Primitive 06 — Magnetic CTA (hero only)
Create `components/ui/MagneticButton.tsx`:

```tsx
"use client";
import { useRef } from "react";

export default function MagneticButton({ children, className = "", ...props }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const b = ref.current!; const r = b.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top  - r.height / 2;
    b.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <button ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}
            className={`vf-btn-magnetic ${className}`} {...props}>
      {children}
    </button>
  );
}
```

```css
.vf-btn-magnetic { transition: transform .5s var(--ease-out-expo), box-shadow .4s; }
.vf-btn-magnetic:hover { box-shadow: 0 12px 32px rgba(165,214,167,.35); }
.vf-btn-magnetic .vf-arrow { display: inline-block; transition: transform .4s var(--ease-out-expo); }
.vf-btn-magnetic:hover .vf-arrow { transform: translateX(6px); }
```

**Apply ONLY to:** the hero primary CTA ("Get my growth plan") and pricing CTAs. Do not magnetize every button — it loses meaning.

Also add arrow-slide (`<span className="vf-arrow">→</span>`) to every `vf-btn--primary` globally.

### Primitive 07 — 3-pillar hover-expand (restructure ServicesSection)
Refactor `ServicesSection.tsx` from its current 2×2 grid into **three horizontal pillars**: *Attract · Convert · Automate*. Hovering any pillar expands it from `flex: 1` → `flex: 1.6`.

```tsx
const pillars = [
  { title: "Attract",   desc: "AI-qualified inbound from the channels your buyers already use.", bg: "linear-gradient(135deg,#1d4d3a,#0d2a21)" },
  { title: "Convert",   desc: "Voice + chat workflows that respond in under 60 seconds.",         bg: "linear-gradient(135deg,#2d2d4b,#16162a)" },
  { title: "Automate",  desc: "Back-office tasks run themselves — scheduling, follow-up, CRM.",   bg: "linear-gradient(135deg,#4b321d,#2a1a0d)" },
];

<div className="vf-pillars">
  {pillars.map((p) => (
    <article key={p.title} className="vf-pillar">
      <div className="vf-pillar__bg" style={{ background: p.bg }} />
      <div className="vf-pillar__content">
        <h3>{p.title}</h3>
        <p>{p.desc}</p>
      </div>
    </article>
  ))}
</div>
```

```css
.vf-pillars { display: flex; gap: 16px; height: 520px; }
.vf-pillar { flex: 1; position: relative; overflow: hidden; border-radius: 20px; cursor: pointer; transition: flex .7s var(--ease-out-expo); }
.vf-pillar:hover { flex: 1.6; }
.vf-pillar__bg { position: absolute; inset: 0; transition: transform .8s var(--ease-out-expo); }
.vf-pillar:hover .vf-pillar__bg { transform: scale(1.08); }
.vf-pillar__content { position: absolute; bottom: 28px; left: 28px; right: 28px; color: #fff; }
.vf-pillar__content h3 { font-size: 32px; font-weight: 700; letter-spacing: -.02em; margin-bottom: 8px; }
.vf-pillar__content p { font-size: 14px; line-height: 1.6; opacity: .85; }
@media (max-width: 768px) { .vf-pillars { flex-direction: column; height: auto; } .vf-pillar { min-height: 280px; flex: 1 !important; } }
```

### Primitive 08 — Ambient drift backgrounds
Add to `ContactSection` and `FAQSection` containers (which currently use flat `bg-[var(--section-bg-1)]`):

```css
.vf-ambient { position: relative; overflow: hidden; }
.vf-ambient::before, .vf-ambient::after {
  content: ""; position: absolute; width: 600px; height: 600px; border-radius: 50%;
  filter: blur(80px); opacity: .35; pointer-events: none;
}
.vf-ambient::before {
  background: radial-gradient(circle, rgba(165,214,167,.45), transparent);
  top: -120px; left: 5%;
  animation: vf-drift-a 14s ease-in-out infinite;
}
.vf-ambient::after {
  background: radial-gradient(circle, rgba(110,201,122,.35), transparent);
  bottom: -120px; right: 5%;
  animation: vf-drift-b 18s ease-in-out infinite reverse;
}
@keyframes vf-drift-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-30px) scale(1.08)} }
@keyframes vf-drift-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,35px) scale(.96)} }
@media (prefers-reduced-motion: reduce) {
  .vf-ambient::before, .vf-ambient::after { animation: none; }
}
```

Add `className="vf-ambient"` to the root of each section's wrapper.

### Primitive 09 — Custom cursor (portfolio only — DEFERRED)
**Do not ship globally.** Hurts accessibility for form users. Create the component but only mount it on a future Portfolio / Case Studies page. Skip for now; leave a TODO in `components/ui/CursorDot.tsx`.

---

## 🧭 Wave 3 — Apply the Recommendation Map (the 8 cards)

These are the concrete per-section changes. Each one references the primitives above.

| # | Section | Change | Primitives used |
|---|---------|--------|-----------------|
| 1 | `HeroSection.tsx` | Kinetic headline + magnetic primary CTA | 01, 06 |
| 2 | **New** `StatsBand.tsx` between Hero & Services | 3-counter proof band | 05 |
| 3 | `TrustBar.tsx` | Pills → drifting logo marquee | 03 |
| 4 | **New** divider between Services & Pricing | Big outlined-text marquee with ✦ glyphs | 03 |
| 5 | `globals.css` | `ease-out` → `ease-out-expo`, +20% duration | 04 |
| 6 | `ServicesSection.tsx` | 2×2 grid → 3 hover-expand pillars | 07 |
| 7 | All H2s globally | Wrap in `<AnimatedHeadline>` | 02 |
| 8 | `ContactSection` + `FAQSection` | Add `vf-ambient` class for drifting radials | 08 |

Cards 1, 2, and 5 are Wave 1 (already shipped). Cards 3, 4, 6, 7, 8 are Wave 2.

---

## 🧱 Wave 4 — Structural Learnings Beyond Motion (plan before coding)

Don't bulk-ship these. Discuss each with me first. Listed in order of leverage.

### S1 — Oversized typography
**Change:** hero H1 `clamp(44px, 5.2vw, 76px)` → `clamp(56px, 7vw, 110px)`. Cut hero sub-copy word count by ~30%. Big type replaces whitespace.
**Already done** in Wave 1.1 for the hero. Audit other page H1s (About, Pricing) and apply same scale.

### S2 — One-word positioning
**Change:** Rewrite service titles as single verbs. Currently multi-word. Propose:
- `Lead Generation` → **Attract**
- `AI Response` → **Convert**
- `Workflow Automation` → **Automate**
- `Scaling Systems` → **Scale**
This aligns with the 3-pillar restructure in Primitive 07.
**Action:** Propose new copy to me; don't rewrite unilaterally.

### S3 — Case-study-first homepage
**Change:** Add a "Recent wins" strip between Hero and Services (or StatsBand and Services). 3 client logos, each with one-line result: "+40% booked calls for [Client]", "+3x leads for [Client]", "-60% response time for [Client]".
**Action:** Flag that this requires case-study content (logos, metrics, permission). Block on content, not code.

### S4 — Numbered sections
**Change:** Add a `/ 01`, `/ 02`, `/ 03` mono-font counter to the corner of each section header. Free editorial structure.

```tsx
// In each section:
<span className="vf-section-num">/ 0{n}</span>
```
```css
.vf-section-num { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--accent); letter-spacing: .08em; margin-bottom: 8px; display: block; }
```

Sequence: `01 Services / 02 Pricing / 03 Testimonials / 04 FAQ / 05 Contact`.

### S5 — Asymmetric grids
**Change:** Break one grid per page. Hero content block at 60% width (not 100%). Case studies (when added) as 70/30 or 40/60. Testimonials: one oversized featured quote + two smaller satellites rather than 3 equal cards.
**Action:** Propose per-section. Start with `TestimonialsSection` — easiest win.

### S6 — Accent color restraint
**Rule:** Accent green (`#A5D6A7`) appears **max 3 times per viewport height**. Currently it's on the button, badge, glow ring, border, and text-2 — that's 5+ hits. Audit and reduce.
**Action:** Change `--text-2` from accent-tinted → warm off-white (`#E8EEE9` or similar). Keep accent for CTAs and one "key number" per section only. Run the audit with me after Wave 2.

---

## ✅ Deliverable Checklist (paste into PR descriptions)

**Wave 1 PR — "Foundations + Top 3":**
- [ ] Global `ease-out` → `cubic-bezier(0.19, 1, 0.22, 1)` swap with +20% durations
- [ ] `useReveal` hook, `vf-reveal` classes, `prefers-reduced-motion` honored
- [ ] Hero H1 kinetic word rotation + larger size
- [ ] `StatsBand` component mounted between Hero and Services (with real data)
- [ ] All buttons get `<span className="vf-arrow">→</span>` with slide-on-hover

**Wave 2 PRs — one per primitive:**
- [ ] `AnimatedHeadline` component + applied to all H2s (Primitive 02)
- [ ] `Marquee` component (Primitive 03) — TrustBar refactor + Services↔Pricing divider
- [ ] `MagneticButton` (Primitive 06) — hero CTA + pricing CTAs only
- [ ] `ServicesSection` refactor to 3-pillar hover-expand (Primitive 07)
- [ ] `vf-ambient` applied to ContactSection + FAQSection (Primitive 08)
- [ ] Scroll-reveal applied to all card grids (Primitive 04)

**Wave 4 — discussion PRs (draft only, awaiting sign-off):**
- [ ] Typography scale audit across all pages
- [ ] One-word service titles proposal
- [ ] Case-study strip (content-blocked)
- [ ] Numbered section labels
- [ ] One asymmetric grid per page
- [ ] Accent color restraint audit

---

## ⚠️ Critical Rules

1. **Never hide the cursor site-wide.** Primitive 09 is deferred — do not ship it.
2. **Every JS animation must check `prefers-reduced-motion`** and skip/shorten accordingly.
3. **Don't replace real numbers with placeholders in StatsBand.** Ask for real Verbaflow metrics.
4. **Don't magnetize every button.** Only hero + pricing CTAs.
5. **Test mobile at each wave.** Marquees, pillars, and counters all need mobile-specific layout.
6. **Commit after each primitive.** One PR per primitive so rollback is surgical.
7. **If you invent content, flag it.** Service title rewrites, case-study copy, and hero sub-copy edits need my approval before merge.

---

## 📎 Reference

Live motion demos of all 9 primitives rebuilt in Verbaflow brand:
→ `13G Motion Analysis.html` (this project)

Source of inspiration (for design reference only — do not copy assets):
→ https://13g.fr
