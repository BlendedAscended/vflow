## 2026-05-16 02:15 (UTC) — Volumetric beam: frock-shaped bottom spread with ragged edges

**Changes:**
- `src/components/VolumetricBeam.tsx`
  - Frock silhouette: narrow shaft (0.08→0.20), wider plume (0.20→0.32), dramatic mega flare (0.32→0.50). Was capped at 0.36.
  - Asymmetric noise: two layered sin waves (`flareNoise` + `flareJitter`) kick in at t>0.5 and t>0.6, creating organic ragged hem that varies per-row over time. Prevents the bottom from reading as a smooth symmetric cone.

## 2026-05-16 01:45 (UTC) — Business-First Prompt Architecture: complete two-axis spec

**Changes:**
- `verbaflow_lake/business-first-prompt-architecture.md` — 78,158 bytes, 19 sections
  - Two-axis superset model: Competitor DNA (X-axis, validated patterns) + Adaptive Template (Y-axis, 54 popular-web-designs tokens)
  - Stage 0-7 pipeline: competitor mining → template selection → enhanced questionnaire → profile extraction → architect → designer prompt → Stitch → human review → deploy
  - Enhanced questionnaire: 10 industry-specific field sets (dental, legal, restaurant, salon, home services, healthcare, real estate, auto, fitness, fintech)
  - Template-to-niche mapping: 20 primary niches mapped to best-fit popular-web-designs template
  - Competitor curation seed table: 6 industries (dental, legal, restaurant, home services, real estate, auto) with 3-5 reference sites each, surgical element extraction
  - Adaptive DESIGN.md 3-mode spec: `client-business-website`, `growth-plan-wireframe`, `agency-vertical-landing`
  - Service sub-types: `web-design` → 10 industry-specific page structures, integrations, tone, and color overrides
  - $400 package architecture: self-service → review → payment → deploy pipeline with 10-15 min human touch
  - Superset rules: 3+ refs minimum, max 35% single-source influence, 70/20/10 composition split
  - Perspective guardrails: Mode A (client website) vs Mode B (growth plan) vs Mode C (agency landing)

**Design decisions:**
- Competitor DNA uses static curated YAML table, not LLM — prevents hallucinated reference sites
- Template selection is deterministic lookup, not generative — 54 templates mapped by niche
- Client references get 50% weight; curated table fills remaining 50%
- All industry-specific questionnaire fields are optional; GBP auto-fills gaps
- VerbaFlow service slugs NEVER appear in Mode A designer prompts

**No code execution in this pass.** Document is a specification awaiting implementation approval.

## 2026-05-16 01:25 (UTC) — Volumetric beam: fat filament bundle, ground spread, soft edges

**Changes:**
- `src/components/VolumetricBeam.tsx`
  - Fix 2: Replaced thin 1-3px laser core with three-element filament bundle: wide hot body (~28-50px), sharp central spine (~2.5-6px), and two off-axis ghost filaments drifting at ±18px. Body uses vertical fade + additive horizontal gradient for soft lateral falloff.
  - Fix 3: Softened fog cone gradient from 5 stops (sharp 0.22/0.78 shoulders) to 7 stops (long 0.12/0.88 tails) for diffuse halo edges matching Ref B multi-strand fade.
  - Fix 5: Widened landing pool radius from W*0.55 to W*0.85 for broad surface spread. Added (g) ground streak: thin horizontal smear at hero/Services boundary, 60-80px tall, synced to landingBoost pulse.
  - Fix 6a: Updated MUTED mint palette to match --section-bg-2 (#2d2d4b → RGB 45,45,75) so beam residual blends into Services background.

**Already applied in prior commit 79404d8:**
- Fix 1: Landing pool fillRect full canvas (no seam)
- Fix 4: Plume/mega cone width trimmed ~20% (0.096/0.064)
- Fix 6b: LavaFade steepened to pow(1.0-fadeT, 2.4)
- Fix 6c: Core fade stop at heroRatio+0.08

**Verification:** `npm run build` passes clean.
## 2026-05-16 00:50 (UTC) — Volumetric beam: kill seam, color-grade overlap, slim plume

**Changes:**
- `src/components/VolumetricBeam.tsx`
  - Fix 1: Landing pool fillRect now draws full canvas height (removed hard top-edge seam at heroRatio*0.7)
  - Fix 2a: MUTED mint palette changed to RGB(34,46,60) matching --section-bg-2 so beam fades *into* Services bg
  - Fix 2b: lavaFade curve steepened from pow(fadeT,1.8) to pow(1-fadeT,2.4) — overlap zone drops to near-zero alpha faster
  - Fix 2c: Core line overlap band shortened from heroRatio+0.15 to heroRatio+0.08
  - Fix 3: Plume delta reduced 20% (0.12→0.096), mega-cone delta reduced 20% (0.08→0.064). Peak width 0.40→0.36
- No changes to page.tsx, globals.css, or bottomSpread

## 2026-05-15 22:45 (UTC) — Pac-Man automated + wall bounce

**Changes:**
- `src/components/ui/ServicesHoverReveal.tsx`
  - Pac-Man now auto-spawns immediately on mount (no hover delay)
  - Removed hover-based spawn/despawn timers — always active
  - Wall bounce: reverses direction when hitting section edges instead of clamping
  - Grid intersections still trigger random direction changes, but no longer blocked by bounds
  - Removed glow-radius visibility mask — Pac-Man is always visible when active
  - Still passes naturally behind service cards (z-index below content layer)

---

## 2026-05-15 22:30 (UTC) — Services hover reveal fix + Pac-Man wanderer

**Changes:**
- Fixed `src/components/ui/ServicesHoverReveal.tsx` wrapper collapsing to 0 height: removed forced `relative` class so caller's `absolute inset-0` fills the section
- Fixed hover listeners bound to wrapper (sibling of content): now attached to `host = wrap.parentElement` so mouse events fire over service cards and helix
- Added Pac-Man character that wanders the 56 px circuit grid after 1 s hover:
  - Spawns at cursor location, snaps to nearest grid intersection
  - Moves at 84 px/sec with random direction changes at intersections
  - Classic CSS clip-path chomping animation (0.25 s alternate)
  - Only visible inside the glow radius (soft fade at edge)
  - Naturally occludes behind service cards (z-index below content layer)
  - Shader "eat" effect: temporarily clears green circuit lines within 18 px radius
  - Despawns 2 s after mouseleave; respawns on re-hover

---

## 2026-05-14 - Fix VolumetricBeam horizontal seam line

**Changes:**
- Fixed `src/components/VolumetricBeam.tsx` landing pool `fillRect` from partial-canvas (`0, H * 0.55, W, H * 0.6`) to full-canvas (`0, 0, W, H`)
- The hard clip edge at ~55% viewport height was a rendering artifact where the radial gradient's rectangle top edge created an abrupt seam
- Full-canvas fill lets the radial gradient control its own falloff (already terminates at `rgba(0,0,0,0)`)

---

## 2026-05-14 - Spatial Bento front-end refresh + Wireframe pipeline GBP integration

**Phase A: Spatial Bento Front-End**
- `src/app/globals.css` — Added Spatial Bento CSS layer (surface tokens, bento-grid, bento-tile variants, mouse-light, live-tile, hairline-spark, parallax-layer, ambient-grain, keyframes, responsive rules, reduced-motion)
- `src/components/CommandCentre/command-centre.css` — Added bento wrapper classes (`__grid`, `__helix-tile`, `__helix-stage`)
- `src/app/layout.tsx` — Plus Jakarta Sans font + `MouseLightProvider` mount
- `src/components/HeroSection.tsx` — Right-side bento cluster with live tiles (plans in flight, active agents, latest wireframe)
- `src/components/PricingSection.tsx` — Asymmetric bento layout (Scope base, Deploy raised, Operate wide/floating)
- `src/components/Navigation.tsx` — Depth blur, live counter pill (`3 plans in flight`)
- `src/components/Footer.tsx` — Bento grid layout with newsletter signup form
- `src/components/MouseLightProvider.tsx`, `src/hooks/useMouseLight.ts`, `src/hooks/useScrollY.ts` — Mouse tracking + scroll rAF hooks
- `src/components/Footer.tsx` — Fixed unescaped apostrophe (`You&apos;re`)
- `src/components/PricingSection.tsx` — Fixed `useCounter` hooks violation (explicit per-tier calls)

**Phase B: Prisma + GBP**
- `prisma/schema.prisma` — Added `plan_ready` to `PlanStatus` enum; added 6 GBP fields to `GrowthPlan` (`gbpPlaceId`, `gbpName`, `gbpAddress`, `gbpCategories`, `gbpData`, `gbpVerifiedAt`)
- Applied via direct SQL (`ALTER TABLE` + `ALTER TYPE`) due to cross-schema `auth.users` reference blocking `prisma migrate`
- Regenerated Prisma client

**Phase B: Places API**
- `src/lib/places-client.ts` — Google Places API New wrapper (autocomplete, details, photo URLs)
- `src/app/api/places/search/route.ts` — GET `/api/places/search?q=` with IP rate limiting (10 req/sec)
- `src/app/api/places/details/route.ts` — GET `/api/places/details?placeId=` with IP rate limiting

**Phase B: GBP Wizard Step**
- `src/components/GrowthPlanWizard.tsx` — Inserted GBP step at step 2 (between sub-niche and stage); `GbpStep` component with debounced autocomplete (250ms), search results, details confirmation card, skip path; total steps 7→8

**Phase B: Hermes Pipeline**
- `.hermes/pipelines/cybergrowth-wireframe.yaml` — Rewritten to v2 with AI Studio + Stitch split
  - Architect: `gemini-2-5-pro`, Backend: `gemini-2-5-flash`, Validator: `gemini-2-5-pro`, Marketing: `gemini-2-5-flash`
  - Designer: `stitch/gemini-3-1-pro` via `tool_invocation` (`mcp__stitch__generate_screen_from_text`)
  - Added `gbp_data` input; added `plan_ready` status; delivery reads `screen_data`

**Phase B: Agent SOUL Files**
- `architect-agent` — AI Studio model, `gbp_data` input, `gbp_signals` in `architecture.json`
- `designer-agent` — Rewritten as Stitch tool wrapper with prompt template
- `backend-agent` — AI Studio model, `gbp_data` input
- `validator-agent` — AI Studio model, validates `screen_data` instead of JSX
- `marketing-agent` — AI Studio model, references `screen_data`
- `booking-agent` — New file

**Phase B: API Routes**
- `src/app/api/growth-plan/submit/route.ts` — Wired GBP fields through to Prisma create + webhook payload
- `src/app/api/hermes/callback/route.ts` — Added `plan_ready` status mapping for marketing success; uses `stageSuccessToPlanStatus`
- `src/app/api/wireframe/[planId]/route.ts` — New proxy route; validates plan status, redirects to signed Supabase URL
- `src/app/api/growth-plan/progress/route.ts` — Fixed Prisma JSON path syntax (`path: ["email"]`)
- `next.config.ts` — Added `/wireframe/:planId` → `/api/wireframe/:planId` rewrite

**Phase B: Email Templates**
- `src/lib/email-templates/plan-ready.ts` — Plan ready email
- `src/lib/email-templates/wireframe-ready.ts` — Wireframe ready with preview link + move-forward CTA
- `src/lib/email-templates/abandonment-followup.ts` — Abandonment recovery email

**Completed**
- `docs/stitch-get-screen-sample.json` — Populated from direct Stitch REST API call. Response includes `screenshot.downloadUrl` (PNG) and `htmlCode.downloadUrl` (HTML preferred).
- B.9 Delivery bridge implemented in `src/app/api/hermes/callback/route.ts`:
  - Parses `screen_data` from callback body
  - Prefers `htmlCode.downloadUrl` (HTML export), falls back to `screenshot.downloadUrl` (PNG)
  - Fetches asset bytes, uploads to Supabase Storage (`wireframes/{plan_id}/index.html` or `wireframe.png`)
  - Generates 90-day signed URL
  - Updates `GrowthPlan.wireframeUrl` and sets status to `wireframe_ready`
  - Triggers Resend `wireframe_ready` email

**Build**
- `npm run build` — SUCCESS (Next.js 15.5.9)

## 2026-04-19 20:38 (UTC) - Added AI customization portability guide for Claude, Copilot, and Antigravity

**Changes:**
- Added `docs/AI-CUSTOMIZATION-PORTABILITY.md` with a practical migration plan for instructions, skills, MCP servers, and plugin-style customizations
- Documented how Copilot combines multiple instruction files and how to avoid conflicting or duplicated always-on context
- Added step-by-step guidance for porting Claude skills and a customized sales plugin into Copilot and Antigravity

## 2026-04-19 05:21 (UTC) - Unified all agent instruction files to the master Claude context

**Changes:**
- Replaced `AGENT.md`, `ANTIGRAVITY.md`, `KIRO.md`, `.github/copilot-instructions.md`, and `docs/ai/CODE-STANDARDS.md` with the same master instruction body from `CLAUDE.md`
- Replaced `.cursor/rules/agent.mdc` with the same master instruction body while preserving Cursor frontmatter
- Removed the prior split adapter model so the repository now uses one mirrored instruction context across supported agent surfaces

## 2026-04-17 - Hide glass card visual panel and "No credit card required" text

**Changes:**
- Wrapped right-side glass card visual (`vf-hero__visual`) in `{false && ...}` to hide it
- Wrapped "No credit card required." span in `{false && ...}` to hide it
- Both easily re-enabled by removing the `{false && ...}` wrapper

## 2026-04-17 - Hide Request Quote button from home page hero

**Changes:**
- Wrapped Request Quote button in `{false && ...}` in `src/components/HeroSection.tsx` to hide it without deletion
- QuoteOverlay and isQuoteOpen state left intact for easy re-enable

## 2026-04-04 14:00 (UTC) - Added Framework D: Government Civic design matrix

**Changes:**
- Added Framework D (Government Civic) to `docs/SKILL.md` as the 4th reusable design matrix
- Updated frontmatter description to list 4 frameworks and add MLLC trigger phrase
- Updated section heading from "The Three Design Matrices" to "The Design Matrices"
- Updated intro text from "three" to "four" design matrices
- Updated Step 1 of the 6-step process to include Framework D as a routing option
- Added Institutional Trust row to psychological principles reference table
- Added closing note about Framework E, F+ for future company growth
- Source project: mllc-revamp (Maryland Legislative Latino Caucus government site)

**Framework D covers:**
- Brand palette: navy `#002855`, gold `#FFD200`, purple `#6a41cf`, cool mist `#F0F4F8`
- Typography: Merriweather (serif) + Inter (sans) + golden ratio scale
- Fixed centered-logo navigation with curved SVG edge
- Hero image carousel (5s auto-rotate, opacity fade)
- 4 card variants: standard, glassmorphic, dark CTA, legislator
- Search input glassmorphic pattern
- Connect dark section + navy footer
- Multi-tenant context (legislative vs foundation mode)
- 8-component shared library inventory
