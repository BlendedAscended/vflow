# Website Revamp — Plan & Progress

Branch: `claude/website-revamp-plan-gOmFj`
Commits: `d576c34` → `fb31df2` → `b39a8c3`

This document records what shipped in the website revamp, why each change was made, and the follow-ups that are still open.

---

## 1. Goals

Reposition Verbaflow LLC from a generic digital-services site into a 2027-style agentic-AI consulting agency with:

- A clear funnel for funded companies (the **$19 Growth Plan** that produces a wireframe + tech-stack on demand).
- A clear funnel for à-la-carte buyers (the **Services** pages, from $195).
- A live face for the agency itself (the new **Virtual Office** page).
- An agency portfolio that shows past and current work.
- Single-source-of-truth data for industries, services and projects so the CMS, the wizard, the listing page and the detail pages stay in sync.

---

## 2. What shipped

### 2.1 Growth-Plan page (commit `d576c34`)

`/growth-plan` is the site's primary funnel. The wizard now covers every vertical we actually serve and is wired for a paid unlock.

- **`src/data/industries.ts`** (new) — 12 verticals with tagline + sub-niches:
  Finance, Healthcare, Trucking & Logistics, Insurance, Government, Architecture & Real Estate (AEC), Construction, Retail & E-commerce, Technology & SaaS, Manufacturing & Supply Chain, Marketing & Hiring (HR-tech), Service Business, plus a free-text "Something Else".
- **`src/components/GrowthPlanWizard.tsx`** rewired:
  - Industry tiles driven by the data file.
  - **Universal sub-niche step** (was construction-only).
  - **New "Current Stack & Gaps" step** — drives the wireframe + tech-stack output.
  - Final step splits into two CTAs: **Unlock Full Plan — $19** (calls `/api/checkout-growth-plan`) and **Get the Free Preview First**.
  - Results page renders Wireframe (Gemini) + Tech-Stack (OpenClaw) sections when `isPaid`, with dual CTAs to Growth Club and Book a Call, and a link to à-la-carte `/services`.
- **`src/app/growth-plan/page.tsx`** — fixed the empty hero gradient, added agentic-AI copy and a `Free preview · $19 unlocks…` trust line.
- **`src/app/api/checkout-growth-plan/route.ts`** (new) — scaffolded Stripe checkout endpoint that returns `501` until `STRIPE_SECRET_KEY` and `STRIPE_GROWTH_PLAN_PRICE_ID` are set; the wizard falls back gracefully to the free preview.

### 2.2 Services pages (commit `fb31df2`)

- **`src/data/services.ts`** (new) — single source of truth for all 11 offerings with `category`, `shortLabel`, `longDescription`, `benefits`, `process`, `faq` and `price`.
  Services covered: AI Agents & Agentic Automation, Custom Software & SaaS Development, iOS & Mobile App Development, Compliance Training & Automation, Insurance Claims/Appeals/Underwriting, Marketing & Lead-Gen Agents, Hiring & Recruiting Automation, E-commerce & Supply-Chain Platforms, AI Architecture (Blueprints & 3D), Websites & Web Apps, Cloud / IT / Cybersecurity.
- **`src/app/services/[slug]/page.tsx`** rewritten:
  - **Static fallback** — when Sanity has no entry, falls back to `services.ts`. Every new slug renders a real page today instead of `404`.
  - Re-themed to CSS variables (matches the dark theme everywhere else on the site).
  - Hero shows category chip, a placeholder visual when no Sanity image exists, and dual CTA (Growth Plan / All Services).
  - New cross-sell section funnels back to `/growth-plan`.
- **`src/app/services/page.tsx`** — agentic-tone hero, clarifies à-la-carte vs Growth Plan up top, fetches `category` and `shortLabel` from Sanity.
- **`src/components/ServicesSection.tsx`** — category filter chips (`All · AI Agents · Software · Mobile · Compliance · Marketing · E-commerce · Cloud`); the protein-node helix labels and pricing-quiz pre-fill now work for all 11 service slugs.
- **`src/sanity/schemaTypes/serviceType.ts`** — added `category` (enum) and `shortLabel` fields, expanded the icon enum with `mobile`, `compliance`, `architecture`.
- À-la-carte vs Growth Plan banner added so visitors don't conflate the two pricing tracks.

### 2.3 Virtual Office, home and agency (commit `b39a8c3`)

#### Virtual Office (new)

- **`src/components/VirtualOffice.tsx`** + **`src/app/virtual-office/page.tsx`** — full floor-plan visualization with four agent rooms (Client Suite, Command Center, Design Studio, Engine Room), pulse glows, structural walls, floor-zone labels, a Live Operations panel, an Agent Activity Feed and a Book-a-Session card linking to `cal.com`.
- Light blueprint theme is scoped to this page only (inline styles; does not touch global CSS).
- Site `Navigation` sits on top of the canvas; the embedded nav from the original snippet was stripped.
- Type-safe (`hoveredRoom: string | null`, `currentTime: Date | null` for SSR safety).

#### Navigation

- Added **Virtual Office** as the first nav link on desktop and mobile menus.

#### Home (`src/app/page.tsx` + `src/components/HeroSection.tsx`)

- Hero rewritten: *"An agentic agency, built for your 2027 business"* with OpenClaw / Telegram HITL / $19 plan messaging. Second CTA goes to the Virtual Office.
- Trust bar updated to the eight verticals we actually serve.
- Sanity services query extended with `category`, `shortLabel`, `"slug": slug.current` so the new ServicesSection filter chips and pricing quiz work for CMS-managed services.

#### Agency

- **`src/components/agency/AgencyProjectsStrip.tsx`** (new) — "Past & current projects" strip below the existing split layout, with status filter chips (All / Live / In Progress / Shipped).
- **`src/data/agencyProjects.ts`** (new) — eight sample engagements across healthcare, insurance, logistics, government, AEC, finance, compliance, AI/SaaS. Edit this file to swap in real client work.

---

## 3. File map

| Path | Purpose |
|---|---|
| `src/data/industries.ts` | Industry verticals + sub-niches for the Growth-Plan wizard |
| `src/data/services.ts` | Master service catalog (also used as fallback for `/services/[slug]`) |
| `src/data/agencyProjects.ts` | Past + current project list for the agency page |
| `src/components/GrowthPlanWizard.tsx` | Multi-step wizard with paywall hook |
| `src/components/ServicesSection.tsx` | DNA-helix services display + filter chips + pricing quiz |
| `src/components/VirtualOffice.tsx` | Floor-plan canvas |
| `src/components/agency/AgencyProjectsStrip.tsx` | Project showcase strip |
| `src/app/growth-plan/page.tsx` | Growth-Plan hero + wizard |
| `src/app/services/page.tsx` | À-la-carte services listing |
| `src/app/services/[slug]/page.tsx` | Service detail (Sanity → static fallback) |
| `src/app/virtual-office/page.tsx` | Virtual Office route |
| `src/app/agency/page.tsx` | Agency split-layout + new projects strip |
| `src/app/api/checkout-growth-plan/route.ts` | Stripe checkout scaffold (501 until configured) |
| `src/sanity/schemaTypes/serviceType.ts` | CMS schema with new `category` + `shortLabel` + icons |

Type-check (`npx tsc --noEmit`) is clean across all three commits.

---

## 4. Follow-ups — what's still open

### 4.1 Wire the paid path

- **Stripe checkout**: implement `src/app/api/checkout-growth-plan/route.ts`. Needs `STRIPE_SECRET_KEY`, `STRIPE_GROWTH_PLAN_PRICE_ID` env vars, plus a webhook to flip a `paid` flag on the lead.
- **Webhook**: add `src/app/api/webhooks/stripe/route.ts` (or extend the existing `webhooks` folder) to verify the Stripe signature and update the lead row.
- **Persistence**: confirm or add a `Lead` model in `prisma/schema.prisma` with `paid: Boolean`, `wireframeUrl`, `techStack: Json`. Save the wizard payload on every submission so the email list is reusable for marketing.

### 4.2 Wire the agentic backend

- Split `src/app/api/generate-strategy/route.ts` into:
  - `generate-preview` (free; current Claude/Anthropic call, summary only)
  - `generate-plan` (gated; calls Gemini for the wireframe image and OpenClaw agents for the tech-stack JSON)
- Route long-context reasoning through **OpenCodeGo** to keep token spend off the more expensive API.
- Add a Telegram webhook bridge so OpenClaw can request human-in-the-loop on a generated plan.
- Stand up the OpenClaw agent crew: AI architect, CEO agent, designer, compliance officer, recruiter — each as its own callable tool from the orchestrator.

### 4.3 Content & CMS

- Re-publish each service in Sanity Studio with the new `category` + `shortLabel` fields so the home + `/services` pages get filterable cards from the CMS instead of the static fallback.
- Replace the placeholder agency projects in `src/data/agencyProjects.ts` with real client engagements.
- Move agency projects to a Sanity schema (`projectType`) so non-developers can edit them.
- Marketing emails: build a SendGrid/Postmark sender that uses the captured wizard emails for nurture sequences.

### 4.4 SEO & blog

- Per-vertical landing pages (`/industries/healthcare`, `/industries/trucking`, etc.) using `industries.ts` as the source.
- Blog topic clusters tied to each service (already have `src/app/blog/`; needs a content engine and an editorial calendar).
- Add structured data (Service / FAQPage / Organization) for indexability.

### 4.5 Virtual Office

- Today the rooms and the Activity Feed are static. Wire them to:
  - Live OpenClaw events via WebSocket / Server-Sent Events.
  - Telegram approvals (show a "Waiting on human" badge when an agent is paused).
  - Real cal.com schedule for the Client Suite room.
- Make the Book-a-Session button open an embedded calendar instead of a new tab.
- Add a mobile layout — current canvas is desktop-first.

### 4.6 Pricing & funnel polish

- Add a Stripe-powered "Join the Growth Club" subscription on the results page.
- A/B-test the $19 paywall placement (before vs after preview).
- Add `prefers-reduced-motion` overrides for the pulse / fade-in animations on the Virtual Office and the wizard.
- Wireframe + tech-stack export as PDF (auto-emailed to the captured address).

### 4.7 Other pages still untouched

- **About** — needs the same agentic positioning pass.
- **Blog** — needs a real first set of posts and the SEO scaffolding above.
- **Contact** — verify the form posts to the lead pipeline (`src/app/api/request-quote/`).
- **Footer** — add the Virtual Office link and the new vertical-specific landing pages once they exist.

---

## 5. Operational notes

- All work was done on `claude/website-revamp-plan-gOmFj`; no PR has been opened.
- `npx tsc --noEmit` passes after every commit.
- No destructive migrations were run; the Sanity schema additions are backwards-compatible (new optional fields).
- The Stripe route returns `501 Not Implemented` so the wizard fails gracefully back to the free preview until env vars are set.
