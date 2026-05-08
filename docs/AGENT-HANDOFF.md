# Coding Agent Handoff — Verbaflow Website Revamp

**Branch:** `claude/website-revamp-plan-gOmFj`
**Repo:** `blendedascended/vflow`
**Read this first** before touching the codebase.

---

## TL;DR — what we are doing

Repositioning the Verbaflow LLC site as a **2027-style agentic-AI consulting agency**. Two funnels:

1. **Growth Plan** ($19) — for funded companies. Wizard at `/growth-plan` collects industry + sub-niche + stack/gaps, then generates a wireframe (Gemini) + tech-stack (OpenClaw multi-agent) + action plan. Free preview, paid unlock.
2. **À-la-carte services** (from $195) — at `/services` and `/services/[slug]`. 11 categorized offerings.

Plus a **Virtual Office** page (`/virtual-office`) that visualizes the agency as a live floor of agent rooms, and an **Agency** page with a past/current projects strip.

The agentic backbone is **OpenClaw** (multi-agent runtime — CEO + architect + designer + compliance officer + recruiter agents), with **Telegram** for human-in-the-loop approvals and **OpenCodeGo** routing long-context reasoning to keep token spend down.

---

## Source-of-truth data files

Edit these to change the site without touching components:

| File | Drives |
|---|---|
| `src/data/industries.ts` | Wizard industry tiles + sub-niches (12 verticals) |
| `src/data/services.ts` | Service catalog + fallback for `/services/[slug]` (11 services, 7 categories) |
| `src/data/agencyProjects.ts` | "Past & current projects" strip on `/agency` |

Service categories: `AI Agents`, `Software`, `Mobile`, `Compliance`, `Marketing`, `E-commerce`, `Cloud`.

The Sanity `serviceType` schema mirrors `services.ts` (`category`, `shortLabel`, expanded icon enum). Sanity content overrides static fallbacks at runtime; the static data is what ships when Sanity has nothing.

---

## Routing map

```
/                    home (HeroSection + ServicesSection + …)
/growth-plan         GrowthPlanWizard (the $19 funnel)
/virtual-office      VirtualOffice (light blueprint theme — scoped to this page only)
/services            listing — fetches Sanity, falls back to defaults
/services/[slug]     detail — Sanity → static fallback (services.ts)
/agency              AgencySplitLayout + AgencyProjectsStrip
/api/checkout-growth-plan   Stripe scaffold (501 until env wired)
/api/generate-strategy      single endpoint today (needs splitting — see follow-ups)
```

`Navigation.tsx` desktop + mobile both list: Virtual Office · Agency · About · Blog · Contact, plus the Services dropdown and a `/growth-plan` "Get started" CTA.

---

## Design system

- **Global theme**: dark by default, CSS variables (`--background`, `--accent`, `--card-background`, `--border`, `--text-primary`, `--muted-foreground`). Green accent.
- **Agency page** uses its own light palette via `--agency-bg`, `--agency-border`.
- **Virtual Office** is intentionally off-theme — light blue blueprint with inline styles. Don't refactor it to global vars; the brief said "use this design on that page only".
- Tailwind + custom CSS. Animations live in component files or `globals.css`.

---

## Wizard contract (GrowthPlanWizard.tsx)

7-step flow. State is `WizardData`:

```ts
{ industry, subNiches[], stage, challenges[], currentStack[], legacyPain,
  teamSize, budget, timeline, name, email }
```

Final step has two CTAs:
- **Unlock Full Plan — $19** → `POST /api/checkout-growth-plan` → on success, post-Stripe redirect should land on step 7 with `isPaid=true`.
- **Get Free Preview** → skip checkout, jump to step 7 with `isPaid=false`.

Step 7 calls `POST /api/generate-strategy` with `{...data, paid}` and renders:
- Always: `executive_summary`, `phases[]`, `recommended_services[]`, `estimated_investment`.
- If `isPaid`: also `wireframe_url` (image) and `tech_stack[{layer, tools[]}]`.

The API today returns the unpaid shape only — splitting it is a follow-up.

---

## What's done (commits, oldest → newest)

1. `d576c34` — Growth Plan: industries data file, wizard rewrite (universal sub-niches + stack/gaps step + paywall scaffold), hero gradient fix, Stripe route stub.
2. `fb31df2` — Services: `services.ts` data file, slug-page static fallback + dark-theme rewrite, category filter chips, Sanity schema additions, à-la-carte vs Growth-Plan banner.
3. `b39a8c3` — Virtual Office page + nav link, home hero + trust-bar refresh, Sanity services query extended, Agency projects strip.
4. `82e10f6` — `docs/website-revamp.md` full progress doc.

`npx tsc --noEmit` passes after every commit.

---

## Working agreements

- **Static fallback first**: every page must render with the static data files even if Sanity is empty. Don't gate UX on the CMS.
- **Type-check before committing**: `npx tsc --noEmit` must be clean.
- **Branch**: stay on `claude/website-revamp-plan-gOmFj`. Don't open a PR unless asked.
- **No destructive Sanity migrations**: new fields must be optional and backwards-compatible.
- **Don't refactor Virtual Office to global theme vars** — it is meant to look different.
- **Agentic copy stays consistent**: OpenClaw, Telegram HITL, OpenCodeGo, Gemini. Avoid generic "AI-powered" filler.
- **À-la-carte vs Growth Plan distinction must stay visible** — visitors should never confuse them.

---

## Top follow-ups (priority order)

1. **Stripe live**: implement `src/app/api/checkout-growth-plan/route.ts` (Checkout Session) + a `webhooks/stripe` route that flips `Lead.paid`. Env: `STRIPE_SECRET_KEY`, `STRIPE_GROWTH_PLAN_PRICE_ID`.
2. **Lead persistence**: confirm/add `Lead` model in `prisma/schema.prisma` (`paid`, `wireframeUrl`, `techStack Json`). Save the wizard payload on every submission.
3. **Split the strategy endpoint**: `generate-preview` (free, Anthropic summary) vs `generate-plan` (paid; Gemini wireframe + OpenClaw tech-stack via OpenCodeGo).
4. **Telegram bridge**: webhook so OpenClaw can request human approvals on generated plans.
5. **Sanity content pass**: re-publish the 11 services with `category` + `shortLabel` populated.
6. **Agency projects from CMS**: move `agencyProjects.ts` into a Sanity `projectType` so non-devs can edit.
7. **Virtual Office live data**: wire `liveFeed` and room avatars to a real OpenClaw event stream (WebSocket / SSE).
8. **Per-vertical landing pages**: `/industries/[id]` driven by `industries.ts`, for SEO.
9. **Untouched pages**: About, Blog, Contact, Footer (Footer needs the new Virtual Office link).
10. **Reduced-motion**: add `prefers-reduced-motion` overrides on the Virtual Office and wizard animations.

Full detail in `docs/website-revamp.md`.

---

## When in doubt

- The user wants the site to feel like a "2027 iAgentek Service Provider Consulting Agency IT Technological Services Business" — so when in doubt, lean **more agentic, more concrete, more confident**, not less.
- Pricing language: à-la-carte starts at $195. Growth Plan is $19. Don't quote ranges that conflict with `services.ts` `price` fields.
- The user prefers compact summaries over long narration. Match that tone in commit messages and PR descriptions.
