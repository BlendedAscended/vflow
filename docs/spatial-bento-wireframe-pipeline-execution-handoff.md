# Spatial Bento + Wireframe Pipeline Execution Handoff

**Repo:** `/Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0`  
**Date:** 2026-05-14  
**Owner:** San / VerbaFlow  
**Execution target:** Coding agent implementation pass  
**Approval state:** Front-end approval buckets and back-end pipeline approval buckets are approved as of this handoff.

This document consolidates the Spatial Bento visual refresh, the Hermes + Stitch + AI Studio wireframe pipeline, the GBP enrichment step, and the future-extension architecture intent into one execution plan. It also accounts for the actual state of the repo after this chat:

- CSS changes from the first implementation attempt were reverted to the pre-turn indexed state.
- Several UI/JSX changes from that attempt remain parked in the working tree.
- A different coding agent has staged unrelated front-end/design-system work. Do not revert or overwrite that work.
- Part B is not a clean greenfield start: several API routes, Hermes files, Prisma models, and plan pages already exist and must be audited before adding duplicates.

The job of the coding agent is to complete the approved plan safely, in order, preserving existing work and proving each stage before moving on.

---

## 0. Non-Negotiable Coordination Rules

1. **Do not use `git reset --hard`, `git checkout -- .`, or broad restore commands.** The worktree contains staged and unstaged changes from another agent.
2. **Before editing a file, inspect its current content and `git diff` for that file.** If a file has user/other-agent changes, integrate with them rather than reverting them.
3. **The CSS revert already happened.** Do not assume the existing parked JSX works until the supporting bento CSS is restored intentionally.
4. **Treat this handoff as approval to implement the plan.** Do not ask again for high-level approval, but still request approval for secrets, destructive commands, network downloads, or writes outside the workspace.
5. **Keep agency prototype files isolated.** Avoid `src/components/agency-prototypes/*` unless a separate explicit task asks for those.
6. **CSS must be landed coherently with UI changes.** The current repo has UI that references classes such as `bento-grid`, `bento-tile`, `live-tile`, and `mouse-light`; those classes must exist before visual verification.
7. **Part B Phase 0 is still a hard gate for delivery bridge design.** Do not finalize Stitch → Supabase delivery parsing until `docs/stitch-get-screen-sample.json` exists and has been read.

---

## 1. Current State Snapshot To Verify First

Run:

```bash
git status --short
git diff -- src/app/globals.css src/components/CommandCentre/command-centre.css
git diff -- src/app/layout.tsx src/components/HeroSection.tsx src/components/PricingSection.tsx src/components/CommandCentre/CommandCentre.tsx src/components/Navigation.tsx src/components/Footer.tsx
find .hermes -maxdepth 4 -type f | sort
find src/app/api -maxdepth 4 -type f | sort
sed -n '1,260p' prisma/schema.prisma
```

Expected observations:

- `src/app/globals.css` may still show as staged because of another agent’s prior work, but it should have no new unstaged diff from the reverted Spatial Bento CSS attempt.
- `src/components/CommandCentre/command-centre.css` should have no Spatial Bento diff.
- Parked UI edits likely remain in:
  - `src/app/layout.tsx`
  - `src/components/HeroSection.tsx`
  - `src/components/PricingSection.tsx`
  - `src/components/CommandCentre/CommandCentre.tsx`
  - `src/components/Navigation.tsx`
  - `src/components/Footer.tsx`
  - `src/components/MouseLightProvider.tsx`
  - `src/hooks/useMouseLight.ts`
  - `src/hooks/useScrollY.ts`
- Existing Part B scaffolding likely includes:
  - `.hermes/pipelines/cybergrowth-wireframe.yaml`
  - `.hermes/agents/*/SOUL.md`
  - `src/app/api/growth-plan/*`
  - `src/app/api/hermes/*`
  - `src/app/api/plan/[id]/*`
  - `src/app/api/newsletter/subscribe/route.ts`
  - `GrowthPlan`, `Abandonment`, `AgentRun`, and `NewsletterSubscriber` in Prisma.

**Deliverable for this phase:** a short implementation note in `CHANGES.md` or `docs/CHANGES-2026-05-14.md` stating what was found and which files were already partially implemented.

---

## 2. Phase A: Reconcile And Complete The Spatial Bento Front-End

### A.1 Resolve The Current Parked UI State

The repo currently has JSX that expects bento CSS, but CSS was reverted. The agent should choose one coherent path:

1. Keep the parked JSX edits and restore the approved Spatial Bento CSS utilities.
2. If the parked JSX conflicts with newer design-system work from the other coding agent, rewrite the JSX to match the new design system while preserving the same approved surfaces and class contracts.

The preferred path is **option 1** unless inspection shows obvious conflicts.

### A.2 Global CSS Token And Utility Work

**File:** `src/app/globals.css`

Add the approved Spatial Bento layer while preserving existing tokens used elsewhere:

- Keep existing compatibility variables:
  - `--background`
  - `--foreground`
  - `--section-bg-1`
  - `--section-bg-2`
  - `--section-bg-3`
  - `--text-primary`
  - `--text-secondary`
  - `--text-accent`
  - `--card-background`
  - `--card-foreground`
  - `--muted-background`
  - `--muted-foreground`
  - `--border`
  - `--accent`
  - `--accent-foreground`
- Add new surface aliases without breaking old ones:
  - `--surface`
  - `--surface-0`
  - `--surface-1`
  - `--surface-2`
  - `--surface-3`
  - `--ghost-border`
  - `--hairline`
  - `--depth-1`
  - `--depth-2`
  - `--depth-3`
  - `--accent-mint`
  - `--accent-hot`
  - `--accent-teal`
- Add approved utility classes:
  - `.bento-grid`
  - `.bento-span-3`
  - `.bento-span-4`
  - `.bento-span-6`
  - `.bento-span-8`
  - `.bento-span-12`
  - `.bento-row-2`
  - `.bento-tile`
  - `.bento-tile--raised`
  - `.bento-tile--floating`
  - `.mouse-light`
  - `.live-tile`
  - `.live-tile__status`
  - `.live-tile__dot`
  - `.live-tile__metric`
  - `.live-tile__delta`
  - `.live-tile__list`
  - `.live-tile__chip`
  - `.hairline-spark`
  - `.parallax-layer`
  - `.ambient-grain`
- Add motion keyframes:
  - `ambient-pulse-v2`
  - `bento-rise`
  - `depth-shift`
  - `hairline-shimmer`
- Add responsive rules:
  - Below `768px`, bento grid collapses to one column.
  - Below `768px`, parallax transforms are disabled.
  - `prefers-reduced-motion: reduce` disables bento animation and parallax.

Important: do not delete or heavily rewrite existing hero/volumetric CSS from the other agent. Add the bento layer beside it.

### A.3 Font Wiring

**Files:**

- `src/app/layout.tsx`
- `src/app/globals.css`

Approved behavior:

- Use Plus Jakarta Sans for Spatial Bento typography.
- Use JetBrains Mono for live metrics.
- Preserve any existing font variables needed by current components.

Implementation guidance:

- If `layout.tsx` already has the parked change importing `Plus_Jakarta_Sans`, keep it and make sure it does not break existing `Inter`/Geist assumptions.
- If build reliability is a concern because `next/font/google` needs network access, document that build needs network access for Google font fetch. Do not replace with local fonts unless explicitly approved later.

### A.4 Cursor And Scroll Hooks

**Files:**

- `src/hooks/useMouseLight.ts`
- `src/hooks/useScrollY.ts`
- `src/components/MouseLightProvider.tsx`
- `src/app/layout.tsx`

Approved behavior:

- `useMouseLight` updates `--mouse-x` and `--mouse-y` on hovered `.mouse-light` elements.
- `useScrollY` writes `--scroll-y` to the document root through `requestAnimationFrame`.
- `MouseLightProvider` mounts both hooks once at the root and returns `null`.

Acceptance checks:

- Moving over `.mouse-light` cards updates the custom properties in DevTools.
- Scrolling changes `--scroll-y`.
- Reduced motion disables the visual motion.

### A.5 HeroSection

**File:** `src/components/HeroSection.tsx`

Approved behavior:

- Keep headline, supporting copy, location badge, and both CTAs unchanged.
- Add right-side Spatial Bento cluster:
  - Plans in flight: mock `4,820`, delta `+12% this week`
  - Active agents: mock `6`, chips for Architect, Designer, Backend, Validator, Marketing, Booking
  - Latest wireframe: placeholder thumbnail, mock timestamp
- Keep links and CTA behavior identical:
  - `Get my growth plan` still links to `/growth-plan`
  - `Start a project` still opens `QuoteOverlay`

Current-state note:

- Parked JSX already adds this cluster.
- The coding agent must verify it fits the current hero composition from the other design-system work and does not overlap with hands/volumetric beam layers.

### A.6 PricingSection

**File:** `src/components/PricingSection.tsx`

Important repo drift:

- The plan’s old names (`Coupé`, `Muscle`, `Grand Tourer`, `Simple`) do not match the live repo.
- Current live tiers appear to be `Scope`, `Deploy`, and `Operate`.

Approved behavior:

- Preserve current live tier names, prices, descriptions, bullets, CTA copy, and `QuoteOverlay` behavior.
- Convert the layout to asymmetric bento:
  - `Scope`: base tile
  - `Deploy`: raised tile
  - `Operate`: wide/floating feature tile
- Do not reintroduce stale pricing names from the old plan.

Technical warning:

- Current code calls `useCounter` inside `pricingPlans.map`, which ESLint flags as a hooks violation. If touching this file, fix that pattern by either:
  - Creating a child `PricingCard` component that calls `useCounter` once per card, or
  - Using fixed explicit `useCounter` calls for the known three tiers.

### A.7 CommandCentre

**Files:**

- `src/components/CommandCentre/CommandCentre.tsx`
- `src/components/CommandCentre/command-centre.css`
- `src/components/CommandCentre/HelixBackbone.tsx`

Approved behavior:

- Preserve existing helix SVG and GSAP animation behavior.
- Add approved live tiles around/near the helix:
  - Plans in flight
  - Wireframes shipped today
  - Agents busy
  - Average delivery time
- Keep existing metric cards unless the visual direction requires relocating them inside the helix tile.

Implementation caution:

- The CSS was reverted, so `command-centre.css` currently does not support `command-centre__grid`, `command-centre__helix-tile`, or `command-centre__helix-stage`.
- If retaining the parked JSX wrappers, add only the minimal CSS needed for the new wrappers. Do not blow away existing metric-card placement rules.

### A.8 Navigation

**File:** `src/components/Navigation.tsx`

Approved behavior:

- Add depth blur / saturation to non-agency nav.
- Add mock live counter pill: `3 plans in flight`.
- Keep all existing nav links, dropdowns, mobile menu logic, agency transparent nav logic, and `/growth-plan` CTA behavior unchanged.

Implementation caution:

- The pill currently uses bento/live-tile CSS variables/classes that must exist in `globals.css`.
- Keep the `/agency` nav visually isolated.

### A.9 Footer

**File:** `src/components/Footer.tsx`

Approved behavior:

- Convert footer to bento layout:
  - Brand + tagline
  - Quick links
  - Contact/social
  - Newsletter signup
- Preserve existing link destinations and Vapi `Call Us` behavior.
- Use existing `/api/newsletter/subscribe` route if present.

Implementation caution:

- The parked footer JSX adds a newsletter form and new layout. Verify this does not conflict with Prisma schema or route availability.
- Fix unescaped apostrophes and any lint issues introduced by new text.

### A.10 Front-End Verification

Run:

```bash
npm run lint
npm run build
npm run dev
```

Known prior verification issues:

- `npm run lint` currently reports pre-existing errors in several unrelated files. Fix only newly introduced errors unless explicitly instructed to clean all repo lint.
- `npm run build` may fail in sandbox due blocked Google font fetch. If so, rerun with approved network access or note the blocker.

Visual walkthrough:

1. `/` confirms hero bento, pricing bento, CommandCentre live tiles, nav pill, footer layout.
2. `/virtual-office` still renders and has not been accidentally restyled beyond shared nav/footer.
3. `/agency` remains isolated and not broken by global tokens.
4. `/growth-plan` wizard still functions.
5. `/blog` content still renders with shared nav/footer.

---

## 3. Phase B: Complete Wireframe Pipeline + GBP

Part B is approved, but the repo already contains partial scaffolding. The coding agent must audit before adding files.

### B.1 Prisma Schema And Migration

**File:** `prisma/schema.prisma`

Existing models already present:

- `GrowthPlan`
- `Abandonment`
- `AgentRun`
- `NewsletterSubscriber`
- `PlanStatus`
- `AgentStatus`

Required additions for GBP:

```prisma
gbpPlaceId       String?
gbpName          String?
gbpAddress       String?
gbpCategories    String[]
gbpData          Json?
gbpVerifiedAt    DateTime?
```

Also reconcile statuses:

- Existing schema includes `delivery`, `paid`, and `expired`.
- Original plan included `plan_ready`.
- Final pipeline should explicitly support:
  - `queued`
  - `drafting`
  - `designing`
  - `backend`
  - `validating`
  - `marketing`
  - `delivery`
  - `plan_ready`
  - `wireframe_ready`
  - `paid`
  - `expired`
  - `moved_forward`
  - `abandoned`
  - `failed`

Migration command:

```bash
npx prisma migrate dev --name growth_plan_funnel_with_gbp
```

If migration fails because the DB already has partial schema, inspect existing migrations and use a forward-only migration.

### B.2 GrowthPlanWizard GBP Step

**File:** `src/components/GrowthPlanWizard.tsx`

Approved behavior:

- Insert optional GBP step after industry/sub-niche step and before stage.
- User can always skip.
- Autocomplete starts after 3 characters, debounced 250ms.
- Search route: `/api/places/search?q={query}`
- Details route: `/api/places/details?placeId={id}`
- Confirmation card stores:
  - `gbpPlaceId`
  - `gbpName`
  - `gbpAddress`
  - `gbpCategories`
  - `gbpData`
  - `gbpVerifiedAt`
- Full submit includes GBP payload in `wizardData` and/or top-level GrowthPlan fields.

Acceptance checks:

- Skip path works with no GBP.
- Selecting a place advances after confirmation.
- API errors show inline fallback and do not block wizard completion.

### B.3 Places Client And API Routes

**New/verify files:**

- `src/lib/places-client.ts`
- `src/app/api/places/search/route.ts`
- `src/app/api/places/details/route.ts`

Required behavior:

- Uses Places API New: `https://places.googleapis.com/v1/places`.
- Uses `GOOGLE_PLACES_API_KEY`, distinct from Stitch and Gemini keys.
- Search returns max 5 suggestions.
- Details returns name, address, photo refs/URLs, types/categories, hours, rating, review count, phone, primary type, price level.
- Routes include simple IP rate limiting: 10 req/sec/IP for launch.

Environment:

```bash
GOOGLE_PLACES_API_KEY=
```

### B.4 Hermes Pipeline YAML With Stitch / AI Studio Split

**File:** `.hermes/pipelines/cybergrowth-wireframe.yaml`

Existing YAML currently uses `opencode-go/*` model aliases. The approved final architecture uses AI Studio for text stages and Stitch MCP for design.

Approved stage routing:

| Stage | Tool | Model alias |
|---|---|---|
| architect | AI Studio | `gemini-2-5-pro` |
| designer | Stitch MCP | `stitch/gemini-3-1-pro` |
| backend | AI Studio | `gemini-2-5-flash` |
| validator | AI Studio | `gemini-2-5-pro` |
| marketing | AI Studio | `gemini-2-5-flash` |
| delivery | deterministic | none |

Designer stage must be a tool invocation, not generic text LLM:

```yaml
- name: designer
  type: tool_invocation
  tool: mcp__stitch__generate_screen_from_text
  inputs:
    projectId: "14405041833567191224"
    designSystem: "assets/d410c1c8f34f4018985f8141eec9ef5a"
    deviceType: DESKTOP
    modelId: GEMINI_3_1_PRO
    prompt: "{templated from architecture.json + wizard_data + gbp_data}"
  poll:
    after_seconds: 30
    max_attempts: 10
    tool: mcp__stitch__get_screen
  outputs:
    - screen_name
    - screen_data
  on_success: status_update(designing -> backend)
```

Add `gbp_data` to pipeline inputs and webui card content.

### B.5 Hermes Provider Config

**External file:** `~/.hermes/config.yaml`

This is outside the repo. The coding agent must request approval before writing outside the workspace.

Approved additions:

```yaml
providers:
  ai-studio:
    api_key_env: GEMINI_API_KEY
    base_url: https://generativelanguage.googleapis.com/v1beta
    type: gemini_native

  stitch:
    type: mcp
    mcp_server: stitch

aliases:
  gemini-2-5-pro: ai-studio/gemini-2.5-pro
  gemini-2-5-flash: ai-studio/gemini-2.5-flash
  stitch/gemini-3-1-pro: stitch/GEMINI_3_1_PRO
```

Environment:

```bash
GEMINI_API_KEY=
STITCH_MCP_API_KEY=
VFLOW_HERMES_TOKEN=
HERMES_CALLBACK_BEARER=
HERMES_WEBHOOK_URL=http://localhost:7878
```

Security reminder:

- Rotate `STITCH_MCP_API_KEY`, `GEMINI_API_KEY`, and `GOOGLE_PLACES_API_KEY` after launch.
- Add a 2026-06-01 calendar reminder.

### B.6 Agent SOUL.md Files

**Files:**

- `.hermes/agents/architect-agent/SOUL.md`
- `.hermes/agents/designer-agent/SOUL.md`
- `.hermes/agents/backend-agent/SOUL.md`
- `.hermes/agents/validator-agent/SOUL.md`
- `.hermes/agents/marketing-agent/SOUL.md`
- `.hermes/agents/booking-agent/SOUL.md`

Existing files must be audited and updated.

Architect requirements:

- Model: `gemini-2-5-pro`
- Inputs: `wizard_data`, `services_catalog`, `industries_catalog`, `gbp_data`
- Output includes `architecture.json` with `gbp_signals`:
  - `location`
  - `primary_type`
  - `hours_open`
  - `rating_band`
  - `photo_urls`
- Prompt rule: if GBP data is provided, business name/address/primary type dominate context; otherwise fallback to industry/sub-niche.

Designer requirements:

- Type: `stitch_tool_wrapper`
- Tool: `mcp__stitch__generate_screen_from_text`
- Project: `14405041833567191224`
- Design system: `assets/d410c1c8f34f4018985f8141eec9ef5a`
- Device: `DESKTOP`
- Must use the approved prompt template from the master plan, including Spatial Bento visual direction and GBP photo context.

Backend, validator, marketing, booking requirements:

- Update model aliases to AI Studio aliases.
- Keep output contracts deterministic and artifact-friendly.
- Validator must gate on quality score and allow one designer retry.

### B.7 API Routes Audit And Completion

Existing routes should be verified rather than duplicated:

- `src/app/api/growth-plan/start/route.ts`
- `src/app/api/growth-plan/progress/route.ts`
- `src/app/api/growth-plan/submit/route.ts`
- `src/app/api/plan/[id]/status/route.ts`
- `src/app/api/plan/[id]/preview/route.ts`
- `src/app/api/plan/[id]/move-forward/route.ts`
- `src/app/api/hermes/callback/route.ts`
- `src/app/api/hermes/state/route.ts`
- `src/app/api/newsletter/subscribe/route.ts`
- `src/app/api/checkout-growth-plan/route.ts`
- `src/app/api/webhooks/stripe/route.ts`

Add or complete:

- `src/app/api/places/search/route.ts`
- `src/app/api/places/details/route.ts`
- `src/app/api/wireframe/[planId]/route.ts`

Route contracts:

- `/api/growth-plan/submit`: validates wizard + GBP data, creates/updates `GrowthPlan`, stores implementation plan, starts Hermes.
- `/api/hermes/callback`: bearer-token protected, updates `AgentRun`, bumps `GrowthPlan.status`, handles delivery callback.
- `/api/webhooks/stripe`: on successful checkout, sets `paidAt`, links `stripeSessionId`, promotes pipeline phase if needed.
- `/api/wireframe/[planId]`: validates plan exists and status allows access, generates or reuses signed Supabase URL, redirects or streams.

### B.8 Stitch `get_screen` Verification Spike

**Required output:** `docs/stitch-get-screen-sample.json`

From an environment with Stitch MCP loaded:

1. `mcp__stitch__list_screens(projectId="14405041833567191224")`
2. Choose one screen name.
3. `mcp__stitch__get_screen(name="projects/14405041833567191224/screens/<id>")`
4. Save full JSON to `docs/stitch-get-screen-sample.json`.

Pass criteria:

- Response includes image URL, code export, or renderable design tree.

If no asset/code/tree exists:

- Pause B.9 delivery bridge implementation.
- Record the blocker in `docs/stitch-get-screen-sample.json` and `CHANGES.md`.
- Consider fallback paths:
  - parse `generate_screen_from_text` response
  - use Stitch UI export
  - generate deterministic HTML from AI Studio instead

### B.9 Stitch → Supabase Delivery Bridge

**File:** `src/app/api/hermes/callback/route.ts` plus helper utilities as needed.

Only implement after B.8.

Delivery behavior:

1. Accept callback payload: `{ plan_id, screen_name, screen_data }`.
2. Parse actual asset/code field based on `docs/stitch-get-screen-sample.json`.
3. Prefer HTML/JSX export when available.
4. Otherwise fetch image asset bytes.
5. Upload to Supabase Storage:
   - HTML: `wireframes/{plan_id}/index.html`
   - Image: `wireframes/{plan_id}/wireframe.png`
6. Generate 90-day signed URL.
7. Update `GrowthPlan.wireframeUrl`.
8. Set status to `wireframe_ready`.
9. Trigger Resend `wireframe_ready`.

Supabase bucket SQL:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('wireframes', 'wireframes', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "service_role_write" ON storage.objects
  FOR ALL USING (auth.role() = 'service_role');
```

### B.10 Email Automation

**Files:**

- `src/lib/email-templates/plan-ready.ts`
- `src/lib/email-templates/wireframe-ready.ts`
- `src/lib/email-templates/abandonment-followup.ts`
- Existing `src/lib/email.ts` if present

Approved templates:

- `plan_ready`: implementation plan summary + `/plan/[id]`
- `wireframe_ready`: signed wireframe URL + `/plan/[id]/move-forward`
- `abandonment_followup`: one hour after abandonment if not sent, restore wizard context

Also verify:

- `RESEND_API_KEY`
- `RESEND_FROM=plans@verbaflowllc.com`
- Domain `mail.verbaflowllc.com` remains verified.

### B.11 Plan Pages And Move-Forward Flow

Existing pages should be audited:

- `src/app/plan/[id]/page.tsx`
- `src/app/plan/[id]/preview/page.tsx`
- `src/app/plan/[id]/move-forward/page.tsx` if present

Required behavior:

- Status page polls `/api/plan/[id]/status`.
- Preview page handles blurred/unpaid preview.
- Move-forward page captures customization and links to Calendly or sends booking request.

### B.12 Next Config Rewrite

**File:** `next.config.ts`

Add only if missing:

```ts
async rewrites() {
  return [
    {
      source: '/wireframe/:planId',
      destination: '/api/wireframe/:planId',
    },
  ];
}
```

If `next.config.ts` already has rewrites, merge rather than replace.

---

## 4. B.9 Future Extensions: Architecture Intent

The Hermes pipeline infrastructure is intentionally the full backbone, not a minimal wireframe-only flow. The $19 deliverable now is:

1. Implementation plan
2. Wireframe
3. Upsell pamphlet / move-forward path

Future pipelines should reuse the same Hermes + Supabase + Resend infrastructure without changing the API boundary, database core, or storage layer.

| Future pipeline | Trigger | What it adds | Heavy tool |
|---|---|---|---|
| `member-app-build` | Customer converts to a member and wants a full app | Multi-week build orchestration: frontend, backend, deployment, QA, release notes | AI Studio Gemini for code generation |
| `wireframe-revision` | Customer requests changes to their wireframe | Re-run designer stage with revision notes, version output under same plan | Stitch `edit_screens` |
| `mobile-app-wireframe` | Customer wants iOS / Android instead of web | Designer stage with `deviceType: MOBILE`, separate mobile prompt | Stitch |
| `content-pack` | Customer wants copy + brand assets alongside wireframe | New `copywriter` and `brand` agent stages | AI Studio |

Architecture rules for these future extensions:

- Each future pipeline gets a new YAML file in `.hermes/pipelines/`.
- Each new role gets a new `.hermes/agents/<agent>/SOUL.md`.
- Existing `GrowthPlan`, `AgentRun`, storage bucket, and Resend layer should support the future flows with additive metadata rather than a schema rewrite.
- Artifact storage should stay under namespaced prefixes:
  - `wireframes/{plan_id}/...`
  - `revisions/{plan_id}/{revision_id}/...`
  - `member-builds/{plan_id}/{milestone_id}/...`
  - `content-packs/{plan_id}/...`
- The `AgentRun` table should remain the canonical per-stage audit log.
- Future customer-visible URLs should be short stable routes that proxy or regenerate signed Supabase URLs.

Do not build these future pipelines in this execution pass. Document the extension seams in the completed Part B docs so future work does not reinterpret the current infrastructure as over-engineering.

---

## 5. End-To-End Verification Plan

### 5.1 Static Checks

Run:

```bash
npm run lint
npm run build
npx prisma validate
npx prisma generate
```

If lint fails from unrelated pre-existing files:

- Record existing failures separately.
- Fix failures introduced by this implementation.
- Do not expand scope into unrelated prototype cleanup unless San approves.

### 5.2 Front-End Smoke Test

Run:

```bash
npm run dev
```

Open:

- `/`
- `/virtual-office`
- `/agency`
- `/growth-plan`
- `/blog`
- `/plan/<test-id>` when test data exists

Verify:

- No console errors from missing bento classes.
- No layout overlap on desktop and mobile.
- Agency page remains isolated.
- Growth-plan wizard accepts GBP skip path.

### 5.3 GBP Test

With `GOOGLE_PLACES_API_KEY` set:

1. Search `Verbaflow`; zero results is acceptable but route must not error.
2. Search `Starbucks Springfield IL`; expect up to 5 results with names/addresses/photos when available.
3. Select one result; details card loads.
4. Confirm selection; wizard advances.
5. Skip path; wizard advances without GBP.

### 5.4 Hermes Pipeline Test

With Hermes running:

```bash
hermes --version
hermes daemon status
```

Submit mock wizard data:

- Industry: real estate
- Sub-niche: local brokerage
- Stage: growth
- Budget: medium
- GBP: real local business if possible

Verify:

- `GrowthPlan` row created.
- `AgentRun` rows created per stage.
- Hermes card moves through columns.
- Artifacts attach in plan space.
- Status page updates.

### 5.5 Stitch Delivery Test

After `docs/stitch-get-screen-sample.json` exists:

- Run one designer stage.
- Confirm `screen_name` and `screen_data` are persisted.
- Confirm asset/code is uploaded to Supabase.
- Confirm signed URL opens.
- Confirm 90-day regeneration path works if URL expires.

### 5.6 Stripe + Email Test

Use Stripe test mode:

1. Submit wizard.
2. Start checkout.
3. Complete test payment.
4. Confirm `paidAt` and `stripeSessionId`.
5. Confirm Hermes wireframe stage triggers or continues.
6. Confirm `plan_ready` email.
7. Confirm `wireframe_ready` email.
8. Confirm `/plan/[id]/move-forward` works.

---

## 6. Final Documentation And Change Log

Update:

- `CHANGES.md`
- `docs/IMPLEMENTATION_PLAN.md` if it remains the master architecture reference
- This handoff file if implementation deviates from it

Required change log entries:

1. **Part A visual refresh entry**
   - Spatial Bento tokens/utilities
   - Hero/Pricing/CommandCentre/Nav/Footer changes
   - No route/data/schema changes

2. **Part B pipeline entry**
   - Prisma GBP fields
   - Places routes
   - Hermes Stitch/AI Studio split
   - Stitch get_screen findings
   - Supabase delivery bridge
   - Resend templates

3. **Future extension note**
   - `member-app-build`
   - `wireframe-revision`
   - `mobile-app-wireframe`
   - `content-pack`
   - Explicitly not built in this pass

---

## 7. Practical Execution Order

Use this exact order to reduce breakage:

1. Snapshot repo state and identify other-agent staged changes.
2. Restore/finish approved bento CSS utilities so current parked UI stops referencing missing classes.
3. Resolve front-end lint errors introduced by parked edits.
4. Verify home page visual shell.
5. Add GBP fields to Prisma and migrate.
6. Build Places client and routes.
7. Add GBP wizard step and verify skip path.
8. Audit existing growth-plan API routes and wire GBP through them.
9. Update Hermes YAML to AI Studio + Stitch split.
10. Update all agent SOUL files.
11. Run Stitch `get_screen` verification and save sample JSON.
12. Implement delivery bridge based on actual Stitch response shape.
13. Complete email templates.
14. Complete wireframe proxy route and rewrite.
15. Run full smoke test.
16. Update docs and change log.

This sequence intentionally lands front-end coherence before back-end expansion, because the current working tree already has JSX that needs the CSS layer restored.

