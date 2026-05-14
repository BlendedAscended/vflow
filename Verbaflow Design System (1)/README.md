# Verbaflow Design System

A design system distilled from the **Verbaflow LLC** marketing site + agency page (codebase: `BlendedAscended/vflow`). Verbaflow is a Montgomery-County-based **AI agency** that designs and ships **multi-agent autonomous systems** for mid-scale companies in **healthcare, finance, and cloud-native** verticals.

> **Marketing surface tagline:** *"Autonomous systems that run your operations — without scaling your team."*
> **Agency surface tagline:** *"Production agentic infrastructure — built, shipped, operated."*

---

## 📦 Sources

This system was built from a single source-of-truth repo. None of the URLs below are guaranteed to resolve outside the org — they are recorded for traceability.

| Source | URL / Path |
|---|---|
| Codebase | `github.com/BlendedAscended/vflow@main` |
| Global tokens | `src/app/globals.css` (21 KB — both surfaces) |
| Tailwind config | `tailwind.config.ts` (Geist Sans + Geist Mono fontstack) |
| Hero / Healthie-style hero | `src/components/HeroSection.tsx` + `.vf-hero*` in globals.css |
| Pricing tiers (Scope / Deploy / Operate) | `src/components/PricingSection.tsx` |
| DNA-helix services viz | `src/components/ServicesSection.tsx` |
| Service catalog | `src/data/services.ts` (11 services, 7 categories) |
| Agency surface | `src/app/agency/*` + `.agency-page` in globals.css |
| Testimonials data | Sanity CMS, fallback in `src/components/TestimonialsSection.tsx` |
| Logo (PNG, 487×487) | `public/logo.png` → `assets/logo.png` |
| Section textures | `public/bg-section-*.png` → `assets/` |
| Style reference | `public/Style-reference.jpg` (Envato isometric pack — aspirational, not in product) |

---

## 🧭 Two surfaces, one brand

The product has **two visual systems** living side-by-side under one URL:

### 1. Marketing surface (default — every page except `/agency`)
- **Mood:** dark teal + soft mint glow, glass cards, pill buttons, slow waterfall-gradient headlines
- **Default theme:** **dark** (`html.theme-dark` or no class)
- **Light theme:** mint-paper page with cream cards (`html.theme-light` or `prefers-color-scheme: light`)
- **Anchor pages:** `/`, `/services`, `/about`, `/blog`, `/growth-plan`, `/pricing`

### 2. Agency surface (`/agency` only)
- **Mood:** Palantir/Civic × Studio White — off-white paper, ink-black type, civic-blue meeting CTA
- **Theme:** **light only**, scoped to `.agency-page` so it never inherits the dark teal
- **Use case:** the enterprise-facing "we ship production systems" page; isometric agency floor video, domain-tinted charts
- **Domain accents:** Healthcare `#00C203`, Finance `#2E75B6`, Cloud `#7C3AED` — *charts and badges only, never fills*

Treat them as **siblings, not parent/child**. Don't blend mint and Studio White on the same surface; pick one.

---

## 🗂 What's in this folder

```
.
├── README.md                ← you are here
├── SKILL.md                 ← Agent Skill manifest (for Claude Code reuse)
├── colors_and_type.css      ← CSS vars: brand palette, semantic tokens, type scale, both surfaces
├── assets/                  ← logo, section background textures, favicon, style ref
│   ├── logo.png             (487×487 — gradient "V", blue→magenta→red)
│   ├── bg-section-next.png
│   ├── bg-section-gemini.png
│   ├── bg-section-last.png
│   └── favicon.ico
├── preview/                 ← Design System tab cards (HTML, 700×N)
├── ui_kits/
│   ├── marketing/           ← Hero, Nav, Pricing, Services, Footer, Cards, Buttons
│   │   ├── README.md
│   │   ├── index.html
│   │   └── *.jsx
│   └── agency/              ← Studio-White: SocialProof bar, AgentCard, DomainBadge
│       ├── README.md
│       ├── index.html
│       └── *.jsx
```

---

## ✍️ CONTENT FUNDAMENTALS

### Voice — what Verbaflow sounds like

Verbaflow writes like a **senior engineer pitching a CFO**. The tone is:

- **Confident, not breathy.** Every claim is followed by a number, a system name, or a constraint. Never "transformative" without saying *what transformed*.
- **Plainspoken with technical receipts.** "Multi-agent claims pipeline runs 60% of our workload without a human in the loop." Not "synergy" — *workload, agents, humans-in-the-loop*.
- **Anti-slide-deck.** Recurring meta-claim: *"production systems — not slide decks"*, *"results from the field, not the slide deck"*, *"every engagement ships something real"*.
- **Mid-Atlantic professional.** Specific places ("Montgomery County"), specific industries ("trucking", "nursing operations", "trade services"), specific frameworks ("HIPAA", "SOC 2 Type II", "DOT/FMCSA", "AML/KYC").

### Casing & punctuation

- **Headlines:** Sentence case. *"Autonomous systems that run your operations."* Period at the end of declarative hero lines.
- **CTAs:** Sentence case ("Get my growth plan", "Start a project", "See live systems"). Avoid ALL CAPS on buttons. Avoid title-casing buttons.
- **Eyebrows / section labels:** **ALL CAPS, letter-spacing 0.08–0.1em**, mint-on-dark or muted-on-light. Examples: `SERVICES`, `INDIVIDUAL SERVICE PRICING`, `REVENUE GROWTH`, `INFRASTRUCTURE`.
- **Em dashes** are used heavily — usually with spaces around them — to break a clause and add a beat.
- **Ampersands** for conjunctions in service names (`AI Agents & Agentic Automation`, `Cloud, IT & Cybersecurity`).
- **Smart apostrophes** (`'`) and **smart quotes** in body copy.

### Pronouns

- **"We"** = Verbaflow. *"We design and ship multi-agent AI systems."* Never "I".
- **"You / your"** = the prospect. *"Your operations"*, *"your team"*.
- Industry references ("healthcare networks", "fintech compliance teams") are concrete and plural — never "businesses" or "customers" generically.

### Concrete vibe shifts to copy

| Don't | Do |
|---|---|
| "We help businesses grow" | "Denial rate dropped 28% in the first 90 days" |
| "Cutting-edge AI" | "OpenClaw multi-agent stack with Telegram HITL bridge" |
| "Reach out for a quote" | "Start a project" / "Get my growth plan" |
| "Solutions" | "Systems", "agents", "pipelines", "infrastructure" |
| "Innovative platform" | "Production-grade agentic system" |

### Emoji & special characters

- **Emoji are essentially absent.** Two exceptions in the entire codebase: 🔥 on a "rush rate applies" badge and ❤️ in a README signoff. **Don't add emoji.**
- **Unicode glyphs** are used as decorative dividers: `✦` between marquee items, `→` and `↺` as inline arrows in CTAs.
- **Currency:** `$` always prefixed. Ranges use spaced em dashes: `$895 – $2,495`.

---

## 🎨 VISUAL FOUNDATIONS

### Colors

**Marketing surface (dark default):**
- Page bg: **deep teal `#102023`**
- Secondary section bg: **indigo-slate `#2D2D4B`** (used on Pricing, Footer, marquee divider)
- Primary accent: **mint `#A5D6A7`** — buttons, links, gradient stops, glow halos
- Soft mint `#BEE3BA` — body text on dark, light-mode page bg
- Pale mint `#E5F3E3` — emphasis text on dark cards
- Cards on dark: `#1B2B2E` (slightly lighter than page)
- Border on dark: `#2F4144` (one stop above card)

**Marketing surface (light mode):**
- Page bg: **mint-paper `#F2F9F1`**
- Section bg 1: `#BEE3BA` (the same soft mint, used as primary tinted block)
- Section bg 2/3: dark navy `#222E3C` / `#283C41` (light-mode keeps dark sections as accent blocks)
- Cards: pure `#FFFFFF`
- Border: `#DBE5D9`

**Agency surface (light only):**
- Page bg: **studio-white `#FAFAF8`** (warm, not cool white)
- Cards: `#FFFFFF`; raised: `#F5F4F1`
- Ink text: `#0F1923` (near-black, slight teal cast)
- CTA primary: ink-on-white pill (`#0F1923` bg, white text)
- CTA meeting: **civic blue `#1A73E8`** — *only* used for "Schedule a meeting" type CTAs

### Typography

- **Family:** **Geist Sans** (Vercel) as the display + body sans, **Geist Mono** for code/metrics. Inter is loaded as `--font-body` and JetBrains Mono as `--font-mono` fallback.
- **Hero headlines use `font-weight: 500` (medium), NOT bold.** Comment in source: *"the Healthie key"*. Section H2s go extrabold (800).
- **Letter-spacing tight on display (`-0.02em`),** wide on eyebrows (`0.08–0.1em`).
- **Hero size:** `clamp(44px, 5.2vw, 76px)`; body 17px; small/eyebrow 11–12px.
- One headline pattern repeats: **plain phrase + gradient or waterfall span** (e.g. "Results from the *field,* not the slide deck"). Always one span, never two.

### Backgrounds

- **Section videos:** the hero and "AI Tools" sections autoplay muted MP4 at `playbackRate = 0.7`. The video sits inside an aspect-ratio container with `mix-blend-multiply` and `opacity 0.9 → 1 on hover`. Rounded **24–32px** corners.
- **Section textures:** three large PNGs (`bg-section-next.png`, `bg-section-gemini.png`, `bg-section-last.png`) — pale mint geometric shapes on faint grain — applied as `background: cover` with `opacity 0.65` light / `0.35` dark.
- **Blur orbs:** every section has 2–3 `bg-[var(--accent)]/15` `rounded-full blur-3xl` divs (~256–384px) drifting via `animate-float` / `animate-pulse-slow`. Never sharp — always at least `blur-3xl` (64px).
- **Full-bleed only on hero.** All other sections stay inside `max-w-8xl mx-auto px-6 lg:px-12`.

### Animation

- **Easing:** the 13g-CTA uses `cubic-bezier(.22,1,.36,1)` for a snap-in finish. Springs use `framer-motion` defaults (`stiffness: 220, damping: 18` on protein nodes; `320 / 30` on the pricing modal slide-in).
- **Durations:** entrances 0.4–0.8s, hovers 200–300ms, the long waterfall headline gradient is **4s ease-in-out infinite** plus a 3s shimmer.
- **Reduced motion:** stats counter has `prefers-reduced-motion` branch that snaps to final value. **Respect it.**
- **DNA helix** (services section) draws strands in over 2.3s, then loops opacity 0.5–0.68 forever. Heavy but on-brand.

### Hover states

- **Primary mint buttons:** background darkens (`#A5D6A7` → `#8FCC91`), translateY `-2px`, shadow scales from `0 4px 20px` → `0 8px 28px`.
- **Ghost buttons** (`.vf-btn--ghost`): border-color 0.5 → 0.9 alpha, background 0 → 0.08 alpha white tint, translateY `-1px`.
- **Cards:** `scale(1.005–1.05)` + `shadow-hover` (a stronger drop shadow). The middle pricing tier *always* gets `scale(1.02)` and a `ring` to mark itself as the recommended option.
- **Nav pill links:** `bg-[var(--accent)]` fills the pill on hover with a transparent → mint tint.

### Press states

- The 13g CTA goes `translateY(0)` and **switches to inset shadow** on `:active` — feels like a hardware key.
- Most other buttons just lose the translateY.

### Borders, radii & corners

- **Radius scale:** 8 / 12 / 16 / 20 / 24 / 32 / pill (9999).
- Pill (`rounded-full`) on every CTA, badge, eyebrow chip, status pill.
- **24–32px** on hero cards and image containers.
- **16–20px** on standard cards.
- Borders are **1–2px**, color `var(--border)`. Featured cards get a `ring-2 ring-[var(--accent)]/70`.

### Shadows

Two distinct shadow languages:

1. **Elegant drop** (general cards): `0 10px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04)`
2. **Glow** (mint emphasis): `0 0 20px rgba(165,214,167,0.30)` — used on the featured pricing tier, primary buttons on hover, and the hero "Get my growth plan".

The **13g CTA** uses an `inset` shadow stack to look pressed-in: `inset 1px 2px 5px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)`. Don't replicate this except on the primary nav CTA.

### Capsules & protection gradients

- The eyebrow / location chip in the hero uses a `clipPath: polygon(1.2rem 50%, 0 0, 100% 0, 100% 100%, 0 100%)` to cut a notched tag shape. Recognizable Verbaflow tic.
- Glass cards in the hero (`.vf-glass-card`) layer `rgba(255,255,255,0.88) + backdrop-filter: blur(16px)` over the dark video — *protection-gradient* style. Always paired with a tiny pill badge below the card.

### Transparency & blur

- **Backdrop-blur** appears in: nav pill (8–16px), glass cards (16px), pricing modal overlay (sm), sound buttons (8px).
- **Color-mix transparency:** `bg-[var(--accent)]/10`, `/15`, `/20` are the standard alpha steps. Never `/50` or higher on accent backgrounds — keep mint as glow, not fill.

### Imagery color vibe

- **Cool, slightly desaturated, blue-tinted.** Section videos are dark blue–teal interiors / iso renders. The hero portal uses `mix-blend-multiply` to push everything cooler.
- **Grain is implied** by the section textures, never applied via filter. No warm tones. No film grain plugin. No tint shifts.

### Layout rules

- **Container:** `max-w-8xl mx-auto px-6 lg:px-12` (≈1536px). Hero & footer go wider; everything else stays inside.
- **Grid:** Tailwind's default 12-col not used directly — sections write explicit `grid-cols-1 lg:grid-cols-2` or 3.
- **Vertical rhythm:** 16/24 between elements, 64/96 between sections (`py-16 lg:py-24`).
- **Sticky nav** at top, always. Theme toggle is a floating pill bottom-right on desktop.

### Cards (canonical anatomy)

```
┌────────────────────────────────────────┐
│ ◯ EYEBROW          $price-chip         │   ← 7×7 icon tile (mint fill), 9px caps eyebrow
│                                        │
│ Title (xl, bold)                       │
│ Description (sm, muted)                │
│ ✓ feature line                         │
│ ✓ feature line                         │
│ ✓ feature line                         │
│                                        │
│ [Learn More →]  [Get Started →]        │   ← muted neutral + mint outline
└────────────────────────────────────────┘
  16–20px radius · 1px border · alternates bg between section-bg-2 / section-bg-3
```

---

## 🎯 ICONOGRAPHY

- **Primary icon system:** **`lucide-react`** (declared in `package.json`) — the codebase uses Lucide for all general-purpose icons. **Stroke-only, 2px, rounded line caps.** When working in HTML/static contexts, link Lucide via CDN: `https://unpkg.com/lucide-static/font/lucide.css`.
- **Inline SVG service icons:** the four core service categories (`website`, `marketing`, `ai`, `cloud`) ship as inline 24×24 stroke SVGs in `ServicesSection.tsx`. They're hand-tuned, not Lucide — keep them inline if recreating that component. Standard pattern: `viewBox 0 0 24 24`, `stroke="currentColor"`, `strokeWidth={2}`, `strokeLinecap="round"`, `strokeLinejoin="round"`, rendered at `w-5 h-5`.
- **Social icons** in the footer are inline 20×20 **filled** SVGs (LinkedIn, Twitter/X, Facebook, Instagram, YouTube) with brand colors (`#0A66C2`, `#1DA1F2`, etc.). Filled style is reserved for socials — don't mix with the stroked Lucide set.
- **Icon containers:** mint-filled `7×7` rounded squares (`rounded-lg`) wrap small icons. Larger feature icons sit inside `40×40 rounded-xl` chips with `bg-[ACCENT]/22` tint.
- **No icon font.** No emoji. No Material Symbols. **No bluish-purple gradient icon stickers.**
- **Sparkle / decorative glyph:** `✦` is used as a marquee separator (`<span className="vf-marquee-star">✦</span>`). Reserved for marquee dividers — don't put it on buttons.
- **Domain accents** on the agency page apply to icon strokes too — a healthcare badge uses a green-stroke heart-pulse, finance uses a blue-stroke chart, cloud uses a violet-stroke server. Color = `var(--accent-health)` etc., never the body ink.

When in doubt: **stroked Lucide 24×24, currentColor, 2px stroke**.

---

## 📑 Index

| File | What it has |
|---|---|
| `colors_and_type.css` | All CSS variables, semantic type classes, both surfaces |
| `SKILL.md` | Agent-Skill front-matter manifest (for Claude Code import) |
| `assets/` | Logo, section textures, favicon |
| `preview/` | 700-wide cards rendered in the Design System tab |
| `ui_kits/marketing/` | Hero, Nav, Pricing, Services, Footer, Cards, Buttons (Marketing surface) |
| `ui_kits/agency/` | Social-proof ticker, Agent card, Domain badge (Agency / Studio-White surface) |

---

## ⚠️ Substitutions to flag

- **Geist Sans / Geist Mono** are pulled from **Google Fonts** in `colors_and_type.css`. The codebase uses `next/font/google` which serves the official Vercel build; CSS-served Google Fonts is metrically identical but a different distribution. If hand-off needs the canonical files, point clients at `https://vercel.com/font`.
- **No PNG/SVG icon set** was checked into `public/` beyond the logo and a few Next.js defaults. The Lucide CDN substitution is documented above — **ask the user if a custom icon library is intended**.
- The **logo's gradient (blue → magenta → red)** does not match the mint accent system on the rest of the brand. Treated as-is per source, but **worth surfacing**: is the logo due for a refresh, or is the marketing palette intentionally distinct?
