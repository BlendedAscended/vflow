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
