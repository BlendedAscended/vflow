# VerbaFlow Adaptive Design Engine (VADE)

> Architecture for context-aware design system selection, creative asset generation, and formal spec output.
> Status: Draft v0.1

---

## Problem Statement

Static design matrices (Enterprise Authority, Developer Dark Mode, etc.) work for known product categories. But when building landing pages, client sites, or experimental products, we need:
1. Broader template selection beyond our 5 internal matrices
2. Creative accents (pixel art, generative sketches) for personality
3. Animation concepts with concrete implementation paths
4. A formal spec layer (DESIGN.md) that any coding agent can consume
5. Visual reference suggestions for human curation (Pinterest)

---

## Solution: Adaptive Design Engine

VADE is a 5-stage pipeline that maps project context to a design system, generates creative assets, and outputs a formal DESIGN.md spec.

```
Stage 1: Context Detection
    |
    v
Stage 2: Template Selection (5 internal matrices + 54 real-world designs)
    |
    v
Stage 3: Creative Accent Generation (pixel-art, p5js, Pinterest concepts)
    |
    v
Stage 4: Animation Pipeline (manim-video, comfyui concepts)
    |
    v
Stage 5: Spec Export (DESIGN.md + tailwind theme + asset manifest)
```

---

## Stage 1: Context Detection

Input: project description, audience, platform, vibe keywords

Decision tree:

```
Is it a VerbaFlow internal product?
  YES -> Use verbaflow-design-system matrices directly
         (Samurai/Galaxy -> Developer Dark Mode,
          PriorZap/MLLC -> Enterprise Authority, etc.)
  NO  -> Continue to external template matching

External project type:
  Developer tool / API / dashboard / CLI
    -> popular-web-designs: Linear, Vercel, Supabase, Cursor, Warp, Sentry
  SaaS / productivity / team collaboration
    -> popular-web-designs: Notion, Figma, Airtable, Framer, Miro
  Fintech / crypto / institutional
    -> popular-web-designs: Stripe, Coinbase, Revolut, Kraken, Wise
  AI / ML / creative tool
    -> popular-web-designs: Claude, RunwayML, Replicate, ElevenLabs, Cohere
  Consumer / mobile / conversion-focused
    -> popular-web-designs: Airbnb, Spotify, Uber, Pinterest
  Editorial / portfolio / agency
    -> popular-web-designs: Apple, SpaceX, Cal.com, Mintlify
  Infrastructure / cloud / enterprise
    -> popular-web-designs: HashiCorp, MongoDB, IBM, ClickHouse
```

If ambiguous: present top 3 matches with rationale, let user pick.

---

## Stage 2: Template Selection

### Option A: VerbaFlow Internal Matrix (5 frameworks)

Use when building VerbaFlow products or white-label sites that must feel part of the family.

| Matrix | Best For | Key Tokens |
|--------|----------|------------|
| Enterprise Authority | Compliance, healthcare, finance | White bg, slate text, teal accents |
| Developer Dark Mode | Technical tools, dashboards, CLI | Charcoal bg, neon gradients, glassmorphism |
| Consumer Conversion | Mobile, SaaS, storefronts | Warm bg, vibrant CTAs, soft shadows |
| Studio White | Editorial, portfolio, docs | True white, extreme typography contrast, no decoration |
| Command Centre | Agency, B2B services, interactive demos | Teal-black bg, sage accent, glass cards, live metrics |

### Option B: Popular Web Designs (54 real systems)

Use when the project needs to feel like a specific brand category or when the internal matrices are too generic.

Load the full template:
```
skill_view(name="popular-web-designs", file_path="templates/stripe.md")
```

Each template provides:
- Complete color palette with exact hex values
- Typography hierarchy with font-family, weight, size, line-height
- Component styles (buttons, cards, inputs, navigation)
- Shadow/elevation system
- Responsive behavior notes
- Hermes implementation notes (CDN font links, ready-to-paste CSS)

### Option C: Hybrid Mode (recommended for client work)

1. Pick a base template from popular-web-designs (e.g., Stripe for fintech)
2. Inject VerbaFlow Command Centre accents (sage green, glassmorphism)
3. This creates a "familiar but unique" feel: recognizable category conventions + VerbaFlow brand DNA

---

## Stage 3: Creative Accent Generation

After the base template is selected, determine which creative skills add personality without breaking coherence.

### When to Use Each Creative Skill

| Skill | Use Case | Integration Point |
|-------|----------|-------------------|
| **pixel-art** | Retro gaming sections, 8-bit mascots, loading states, easter eggs | Hero section accent, footer mascot, 404 page |
| **p5js** | Generative backgrounds, interactive data viz, particle systems, shader effects | Hero background replacement, dashboard ambient art |
| **architecture-diagram** | Dark-themed SVG diagrams for docs, API architecture, infrastructure overviews | Documentation pages, pitch decks, about page |
| **baoyu-infographic** | Educational explainers, process flows, feature comparison charts | Landing page feature sections, how-it-works pages |
| **baoyu-comic** | Tutorial strips, onboarding sequences, brand storytelling | Onboarding flows, blog post illustrations |
| **humanizer** | Strip AI-isms from marketing copy, add real voice | All microcopy, CTAs, testimonials |
| **manim-video** | Animated math/algo explanations, data visualization animations, logo reveals | Explainer videos, social media clips, hero background loops |
| **songwriting-and-ai-music** | Brand audio identity, podcast intros, ambient background tracks | Audio branding, video soundtracks |
| **touchdesigner-mcp** | Real-time visual performances, live data art, interactive installations | Event displays, live dashboards, art-directed landing pages |

### Pinterest Concept Bridge

When we need human-curated visual reference:

1. Generate 3-5 search terms based on the selected template + creative accents
2. User searches these on Pinterest manually
3. Selected references feed back into Stage 2 for refinement

Example for a "developer dark mode + pixel art" project:
```
Search terms:
- "dark mode dashboard UI glassmorphism"
- "pixel art space background seamless"
- "neon terminal aesthetic wallpaper"
- "retro pixel mascot character design"
- "cyberpunk data visualization dark"
```

---

## Stage 4: Animation Pipeline

Two tracks based on output requirements:

### Track A: Code-Based Animation (manim-video)

Use when the animation is algorithmic, mathematical, or data-driven.

Examples:
- Animated algorithm explanation for Galaxy docs
- Revenue growth curve animation for PriorZap landing page
- Network topology animation for Samurai architecture page

Output: MP4/GIF file that can be embedded as `<video>` or used as social media content.

### Track B: AI-Generated Animation (comfyui)

Use when the animation is artistic, atmospheric, or brand-focused.

Examples:
- Animated hero background (floating particles, light rays)
- Logo reveal with particle effects
- Ambient looping video for landing page backgrounds

Output: Video file or image sequence.

### Track C: Real-Time (p5js / Three.js / Spline)

Use when the animation must be interactive or procedural in the browser.

Examples:
- Mouse-reactive particle field (p5js)
- Volumetric beam hero (Three.js — already in verbaflow-design-system)
- 3D product showcase (Spline — already in vflow2.0 stack)

---

## Stage 5: Spec Export (DESIGN.md)

Regardless of which template and creative accents were chosen, the final output is always a formal DESIGN.md spec.

### Why DESIGN.md

- Machine-readable tokens (YAML frontmatter) + human-readable rationale (Markdown body)
- Any coding agent (Claude Code, OpenCode, Codex, Copilot) can consume it
- WCAG contrast validation built-in
- Exports to Tailwind theme JSON or W3C DTCG format
- Version diffable — track design system evolution over time

### File Structure

```
project-root/
├── DESIGN.md              # Master spec (tokens + rationale)
├── design/
│   ├── tailwind.theme.json   # Tailwind config export
│   ├── tokens.json           # W3C DTCG export
│   ├── assets/
│   │   ├── hero-animation.mp4    # manim or comfyui output
│   │   ├── pixel-mascot.png      # pixel-art output
│   │   ├── generative-bg.js      # p5js sketch
│   │   └── pinterest-refs.txt    # Suggested search terms
│   └── README.md             # How to use this design system
└── src/
    └── ...                   # Implementation
```

### DESIGN.md Content

```yaml
---
version: alpha
name: "ClientProject-Fintech"
description: "Stripe-inspired fintech landing page with VerbaFlow Command Centre accents"
colors:
  primary: "#635BFF"          # From Stripe template
  secondary: "#0A2540"        # From Stripe template
  accent: "#A5D6A7"           # VerbaFlow sage injection
  surface: "#FFFFFF"
  surface-elevated: "#F6F9FC"
typography:
  h1:
    fontFamily: "Source Sans 3"  # Stripe sohne substitute
    fontSize: "4rem"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 4px
  md: 8px
  lg: 16px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  section: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
  card-feature:
    backgroundColor: "{colors.surface-elevated}"
    rounded: "{rounded.lg}"
    padding: "32px"
    shadow: "0 4px 6px rgba(10, 37, 64, 0.05)"
  glass-card:
    backgroundColor: "rgba(255, 255, 255, 0.06)"
    backdropFilter: "blur(16px)"
    border: "1px solid rgba(255, 255, 255, 0.12)"
    rounded: "{rounded.lg}"
creative:
  pixel-accent: "hero-footer-mascot"
  animation-hero: "volumetric-beam"
  pinterest-terms:
    - "fintech dark mode dashboard"
    - "purple gradient landing page"
    - "glassmorphism card design"
---

## Overview

Stripe-inspired fintech landing with VerbaFlow sage accents.
Target: business owners seeking payment infrastructure.

## Colors

- **Primary (#635BFF):** Stripe purple for CTAs and key actions.
- **Accent (#A5D6A7):** VerbaFlow sage for hover states and trust signals.

## Typography

Source Sans 3 for display (light weight elegance), Inter for body.

## Creative Accents

- Pixel-art mascot in footer (retro-gaming easter egg for developer audience)
- Volumetric beam hero animation (existing Three.js component)
- Glassmorphism cards for feature sections

## Animation

- Hero: Volumetric beam with scroll-driven hand choreography
- Feature cards: Staggered fade-in-up on scroll
- Footer mascot: Subtle idle bounce animation

## Pinterest References

Search terms for human curation:
- fintech dark mode dashboard
- purple gradient landing page
- glassmorphism card design
```

---

## Implementation Workflow

### For New Projects

1. **Detect context** — ask user or infer from project description
2. **Select template** — present top 3 options from 54+5 catalog
3. **Confirm creative accents** — ask which creative skills to inject
4. **Generate DESIGN.md** — write formal spec with tokens + rationale
5. **Generate assets** — run pixel-art, p5js, manim, or comfyui as needed
6. **Export config** — tailwind.theme.json + tokens.json
7. **Hand off to coding agent** — provide DESIGN.md + asset manifest

### For Existing Projects (Re-skin)

1. **Audit current design** — what matrix/template is it using now?
2. **Select new template** — map to closest match in 54+5 catalog
3. **Generate migration DESIGN.md** — diff old vs new tokens
4. **Run `npx @google/design.md diff`** — validate no regressions
5. **Apply incrementally** — component by component, not all at once

---

## Skills Required

| Stage | Skills |
|-------|--------|
| Context Detection | `verbaflow-design-system`, `find-skills` |
| Template Selection | `popular-web-designs`, `verbaflow-design-system` |
| Creative Accents | `pixel-art`, `p5js`, `architecture-diagram`, `baoyu-infographic`, `baoyu-comic`, `humanizer` |
| Animation | `manim-video`, `comfyui`, `p5js` |
| Spec Export | `design-md`, `design-director` |
| Implementation | `frontend-blueprint`, `claude-design` |
| Quality | `code-review-and-quality`, `dogfood` |

---

## Example: Galaxy Landing Page

**Context:** AI multi-agent platform, developer audience, needs to feel cutting-edge

**Template Selection:**
- Base: `popular-web-designs` -> `voltagent.md` (void-black, emerald accent, terminal-native)
- Injection: VerbaFlow Developer Dark Mode glassmorphism patterns

**Creative Accents:**
- `pixel-art`: 8-bit agent mascot for footer
- `p5js`: Network node visualization as hero background
- `architecture-diagram`: System architecture SVG for docs section

**Animation:**
- `manim-video`: Agent orchestration flow animation for social media
- Real-time: p5js particle network in hero

**DESIGN.md Output:**
- Colors: void-black base, emerald accent, terminal-green highlights
- Typography: Geist + JetBrains Mono
- Creative: pixel mascot, p5js network, manim explainer

**Pinterest Terms:**
- "cyberpunk terminal UI"
- "network visualization dark"
- "pixel art robot mascot"
- "void black website design"

---

## Example: PriorZap Marketing Site

**Context:** Healthcare denial prevention, enterprise buyers, needs trust + authority

**Template Selection:**
- Base: VerbaFlow Enterprise Authority Matrix
- Injection: `popular-web-designs` -> `stripe.md` (weight-300 elegance, purple gradients)

**Creative Accents:**
- `baoyu-infographic`: Denial prevention process flow
- `humanizer`: All marketing copy stripped of AI-isms

**Animation:**
- `manim-video`: Revenue impact curve animation
- Real-time: Interactive metric dashboard (existing Command Centre component)

**DESIGN.md Output:**
- Colors: white bg, slate text, teal status + stripe purple for CTAs
- Typography: Inter + Source Sans 3
- Creative: infographic process flow, humanized copy

**Pinterest Terms:**
- "healthcare SaaS dashboard"
- "enterprise landing page clean"
- "medical trust design"

---

## File Locations

- This spec: `verbaflow_lake/adaptive-design-engine.md`
- Skills catalog: `verbaflow_lake/tools-and-skills-reference.md`
- Design system: `~/.hermes/skills/verbaflow-design-system/SKILL.md`
- Popular designs: `~/.hermes/skills/popular-web-designs/SKILL.md`
- DESIGN.md spec: `~/.hermes/skills/design-md/SKILL.md`
