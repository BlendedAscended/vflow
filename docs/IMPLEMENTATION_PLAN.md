# VerbaFlow 2.0 — Cyber Growth Funnel Implementation Plan

**Version:** 1.0
**Date:** 2026-05-11
**Owner:** San Ghotra
**Target launch:** 2026-05-18 (7 days)
**Scope:** Homepage, Virtual Office, Agency, Growth Plan wizard, Hermes orchestration, wireframe delivery, email automation.

---

## 1. Goal

One money path from cold visitor to paid customer, served by AI agents behind the scenes, observable through the Hermes webui (kanban + tasks + space).

| KPI | Target by 2026-06-15 |
|---|---|
| Wizard starts per week | 200 |
| Wizard completions | 60 (30%) |
| $19 plan conversions | 12 (20% of completions) |
| Wireframes delivered | 12 (100% of paid) |
| "I'm in" callback clicks | 4 (33% of paid) |
| Wireframe hosting cost / month | Under $5 |
| End to end wireframe SLA | Under 30 minutes |

---

## 2. Funnel Architecture

```
COLD TRAFFIC SOURCES
├── Twitter / LinkedIn ───────→ /virtual-office (WOW: live floor plan)
├── Email scrape (Google Maps) → /virtual-office or /growth-plan
└── Direct / SEO / referrals ──→ / (homepage)

ALL ROUTES CONVERGE
        ↓
   /growth-plan (wizard, 7 steps, ~3 min)
        ↓
   Wizard submit  ──────────────────────────→  Postgres (growth_plans row, status=queued)
        ↓                                              │
   Implementation plan generated (15 sec)              │
   $0 preview shown                                    ▼
        ↓                                       Hermes webhook fires
   $19 paywall: blurred wireframe preview              │
        ↓                                              ▼
   Stripe checkout                          Hermes orchestrates:
        ↓                                  Architect → Designer → Backend →
   Job promoted to status=in_progress      Validator → Marketing → Delivery
        ↓                                              │
   /plan/[id] status page (live updates)               │
        ↓                                              ▼
   Email 1: "Your plan is ready" ◀── status=plan_ready
        ↓
   Email 2: "Your wireframe is live" + signed URL ◀── status=wireframe_ready
        ↓
   User clicks "I'm in" CTA in email
        ↓
   /plan/[id]/move-forward (customization form + Calendly)
        ↓
   Calendly booking → Slack ping to San
        ↓
   Human takeover (CEO assigns engineer)
```

---

## 3. Page Allocation

### 3.1 Homepage (`/`) — The Offer

**Role:** Top of funnel for direct, SEO, and referral traffic. Convert intent into a wizard start.

Keep:
- HeroSection (primary CTA: "Get My $19 Growth Plan" → `/growth-plan`)
- ServicesSection (DNA helix, browse and estimate)
- CommandCentre (metrics theatre)
- PricingSection (Coupe / Muscle / Grand Tourer / Simple)
- TestimonialsSection
- FAQSection
- Footer

Change:
- Add three "doors" container above ServicesSection: "Get the Plan" (primary), "Tour the Virtual Office" (secondary), "See Past Work" (tertiary). Each is a card link.
- Newsletter email capture moves to footer only. It currently competes with the wizard. Footer placement keeps it passive.
- AIToolsSection becomes "DNA Filx Coming Soon" placeholder (your call out).
- ContactSection collapses to a single "Book a Call" CTA card linking to `/plan/new` or Calendly direct.

### 3.2 Virtual Office (`/virtual-office`) — The Wow

**Role:** Show how the agency operates. This is the cold traffic landing page for Twitter / LinkedIn / outreach emails.

Move in from `/agency`:
- Floor plan layout (Booking Room → Conference Room → Architect Office → Design Studio → Backend Lab → Validator Desk → Executive Board → Marketing Floor)
- Mock real time agent activity (CSS only animation: each station has a status pill that cycles "idle → drafting → done" every 20 to 40 seconds, randomized)
- Inline CTAs at each station: "Start your plan to enter this room"
- Live counter at top: "X plans in flight right now" (reads from Postgres `growth_plans` where `status IN (in_progress, drafting, designing, validating)`)

Keep:
- Existing `VirtualOffice.tsx` component as the scaffold

Add:
- Single primary CTA at top right: "Start My Growth Plan"
- Single secondary CTA at bottom: "Book a Call Instead"

### 3.3 Agency (`/agency`) — The Proof

**Role:** Bottom of funnel. Show what we shipped. Convert warm visitors to a booking.

Remove from current page:
- Any floor plan elements (those go to Virtual Office)

Keep:
- AgencySplitLayout (split screen showcase)
- AgencyProjectsStrip (horizontal scroll of past work)
- Four wireframe prototypes ([proto-01](../src/components/agency-prototypes/proto-01-wireframe-main) through [proto-04](../src/components/agency-prototypes/proto-04-wireframe-v2)) as "wireframe styles we can build for you"
- DomainToggle for finance / healthcare / platform infographics

Add:
- Single bottom CTA: "Book a Call" (Calendly embed inline)
- A / B test wrapper: route 25% of visitors to each prototype as the hero example. Track click through to `/growth-plan`. Use PostHog feature flags or a simple cookie based bucketing.

---

## 4. Database Schema (Prisma)

Add to [schema.prisma](../prisma/schema.prisma):

```prisma
model GrowthPlan {
  id                String          @id @default(cuid())
  userId            String?
  email             String
  name              String?
  status            PlanStatus      @default(queued)
  wizardData        Json            // industry, stage, challenges, goals, teamSize, budget, timeline, subNiches, currentStack, legacyPain
  implementationMd  String?         // architect output, markdown
  wireframeUrl      String?         // signed Supabase URL
  paidAt            DateTime?
  stripeSessionId   String?
  hermesJobId       String?
  agentLog          Json?           // each agent's contribution and timestamps
  movedForward      Boolean         @default(false)
  customization     Json?           // post-wireframe questionnaire answers
  calendlyEventUri  String?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  user              User?           @relation(fields: [userId], references: [id])
  abandonments      Abandonment[]
  agentRuns         AgentRun[]

  @@index([email])
  @@index([status])
  @@index([createdAt])
}

enum PlanStatus {
  queued
  drafting     // architect working
  designing    // designer working
  backend      // backend agent working
  validating   // validator scoring
  marketing    // marketing agent enriching
  plan_ready   // implementation plan emailed, wireframe pending
  wireframe_ready
  moved_forward
  abandoned
  failed
}

model Abandonment {
  id           String     @id @default(cuid())
  planId       String?
  email        String
  stepReached  Int        // 0 to 6
  wizardData   Json
  followUpSent Boolean    @default(false)
  followUpAt   DateTime?
  createdAt    DateTime   @default(now())
  plan         GrowthPlan? @relation(fields: [planId], references: [id])

  @@index([email])
  @@index([followUpSent])
}

model AgentRun {
  id             String       @id @default(cuid())
  planId         String
  agent          String       // architect | designer | backend | validator | marketing | booking
  model          String       // minimax-m2-7-pro | kimi-k2-6 | qwen-3-6-plus | deepseek-v4-pro | minimax-2-7
  status         AgentStatus  @default(pending)
  inputTokens    Int?
  outputTokens   Int?
  artifactPath   String?      // Supabase Storage key
  errorMessage   String?
  startedAt      DateTime?
  finishedAt     DateTime?
  createdAt      DateTime     @default(now())
  plan           GrowthPlan   @relation(fields: [planId], references: [id])

  @@index([planId, agent])
  @@index([status])
}

enum AgentStatus {
  pending
  running
  succeeded
  failed
  skipped
}

model NewsletterSubscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  source    String?  // homepage_footer | virtual_office | agency
  tags      String[] // service_interests, plan_id refs, etc.
  createdAt DateTime @default(now())
}
```

Migration command:

```bash
npx prisma migrate dev --name growth_plan_funnel
```

---

## 5. API Layer

| Endpoint | Method | Purpose | New / Modify |
|---|---|---|---|
| `/api/growth-plan/start` | POST | Email captured at step 0. Creates `Abandonment` row. | New |
| `/api/growth-plan/progress` | POST | Each step submission updates `Abandonment.stepReached`. | New |
| `/api/growth-plan/submit` | POST | Full wizard data. Creates `GrowthPlan`, calls Gemini for instant implementation plan, fires Hermes webhook. | New (replaces `/api/generate-strategy` partially) |
| `/api/plan/[id]/status` | GET | Frontend polls every 10 seconds. Returns status + agent log. | New |
| `/api/plan/[id]/preview` | GET | Returns first wireframe section (blurred CSS at frontend) for paywall. | New |
| `/api/plan/[id]/move-forward` | POST | Captures customization answers, returns Calendly link. | New |
| `/api/hermes/callback` | POST | Hermes pings this when each agent finishes. Updates `AgentRun` and `GrowthPlan.status`. Bearer token auth. | New |
| `/api/checkout-growth-plan` | POST | Stripe session for $19. | Keep, link to plan_id |
| `/api/webhooks/stripe` | POST | On success, sets `GrowthPlan.paidAt`, triggers Hermes wireframe phase. | Modify |
| `/api/newsletter/subscribe` | POST | Footer email capture. Tags with source. | New |

### 5.1 `/api/growth-plan/submit` contract

Request:
```json
{
  "industry": "string",
  "stage": "string",
  "challenges": ["string"],
  "goals": ["string"],
  "teamSize": "string",
  "budget": "string",
  "timeline": "string",
  "email": "string",
  "name": "string",
  "subNiches": ["string"],
  "currentStack": ["string"],
  "legacyPain": "string"
}
```

Response (synchronous, under 15 seconds):
```json
{
  "plan_id": "clx123abc",
  "implementation_plan": {
    "executive_summary": "...",
    "phases": [{ "title": "...", "duration": "...", "actions": ["..."] }],
    "recommended_services": ["..."],
    "estimated_investment": "$Min to $Max",
    "tech_stack": [{ "layer": "...", "tools": ["..."] }]
  },
  "preview_unlocked_until": "2026-05-12T03:00:00Z",
  "next_step": "checkout"
}
```

Server actions in order:
1. Validate input. Reject if email is invalid.
2. Insert `GrowthPlan` row with `status=queued`.
3. Call Gemini (DeepSeek V3 fallback) with the wizard data → returns implementation plan JSON. Store in `implementationMd` as serialized markdown.
4. Fire and forget HTTP POST to Hermes webhook at `${HERMES_WEBHOOK_URL}/jobs/growth-plan` with `{ plan_id, wizard_data, callback_url }`.
5. Return implementation plan to client.

---

## 6. Hermes Orchestration (the heart of this build)

### 6.1 Architecture

```
Frontend submit → POST /api/growth-plan/submit
                      │
                      ├─ Postgres write (growth_plans row)
                      ├─ Gemini synchronous call (implementation plan, 15s)
                      └─ HTTP POST to Hermes Pipeline Daemon
                                    │
                                    ▼
                         hermes.yaml pipeline: cybergrowth-wireframe
                                    │
                ┌───────────────────┼───────────────────┐
                ▼                   ▼                   ▼
         architect-agent    designer-agent      backend-agent
        (MiniMax M2.7 Pro)  (Kimi K2.6)       (Qwen 3.6 Plus)
                │                   │                   │
                └─────────┬─────────┴─────────┬─────────┘
                          ▼                   ▼
                  validator-agent     marketing-agent
                 (DeepSeek V4 Pro)   (MiniMax 2.7)
                          │                   │
                          └────────┬──────────┘
                                   ▼
                       delivery-agent (templated)
                          │
                          ├─ Upload HTML to Supabase Storage
                          ├─ Resend email to user
                          └─ POST /api/hermes/callback
```

Every agent run:
1. Reads previous artifacts from Supabase Storage bucket `wireframes/<plan_id>/`.
2. Writes its output to the same bucket.
3. POSTs status to `/api/hermes/callback` (Hermes daemon does this on each agent transition).
4. The callback updates `AgentRun` row and bumps `GrowthPlan.status`.

### 6.2 Hermes Pipeline Config

Create [`~/.hermes/pipelines/cybergrowth-wireframe.yaml`](../.hermes/pipelines/cybergrowth-wireframe.yaml):

```yaml
name: cybergrowth-wireframe
description: Generates implementation plan + wireframe for a VerbaFlow Growth Plan customer
trigger:
  type: webhook
  endpoint: /jobs/growth-plan
  auth: bearer
  secret_env: VFLOW_HERMES_TOKEN

inputs:
  plan_id: string
  wizard_data: object
  callback_url: string

context_budget: 8000
compression_threshold: 0.4
compression_target: 0.2

stages:
  - name: architect
    agent: architect-agent
    model: minimax-m2-7-pro
    fallback: opencode-go/kimi-k2-5
    timeout: 180
    inputs: [wizard_data]
    outputs: [implementation_plan.md, architecture.json]
    on_success: status_update(drafting → designing)

  - name: designer
    agent: designer-agent
    model: kimi-k2-6
    fallback: deepseek-v3
    timeout: 240
    inputs: [implementation_plan.md, architecture.json]
    outputs: [wireframe_components.jsx, design_tokens.json]
    on_success: status_update(designing → backend)

  - name: backend
    agent: backend-agent
    model: qwen-3-6-plus
    fallback: deepseek-v3
    timeout: 180
    inputs: [architecture.json]
    outputs: [integration_notes.md]
    on_success: status_update(backend → validating)

  - name: validator
    agent: validator-agent
    model: deepseek-v4-pro
    fallback: claude-sonnet-4-6
    timeout: 90
    inputs: [implementation_plan.md, wireframe_components.jsx, integration_notes.md]
    outputs: [validation_report.json]
    gate:
      score_min: 0.7
      on_fail: retry_designer
    on_success: status_update(validating → marketing)

  - name: marketing
    agent: marketing-agent
    model: minimax-2-7
    fallback: deepseek-v3
    timeout: 120
    inputs: [implementation_plan.md, wireframe_components.jsx, validation_report.json]
    outputs: [upsell_pamphlet.md, email_body.html]
    on_success: status_update(marketing → delivery)

  - name: delivery
    agent: delivery-agent
    type: deterministic
    inputs: [wireframe_components.jsx, design_tokens.json, email_body.html]
    actions:
      - render_jsx_to_static_html
      - upload_to_supabase: bucket=wireframes, key=<plan_id>/index.html
      - generate_signed_url: expiry=90d
      - send_email_via_resend: template=wireframe_ready
      - callback: POST <callback_url>
    on_success: status_update(delivery → wireframe_ready)

webui:
  kanban:
    board: "Growth Plans"
    columns:
      - Queued
      - Drafting (Architect)
      - Designing
      - Backend
      - Validating
      - Marketing
      - Delivery
      - Delivered
      - Failed
    card_template:
      title: "Plan {plan_id} — {wizard_data.industry}"
      labels:
        - "{wizard_data.stage}"
        - "{wizard_data.budget}"
      body: |
        **Email:** {email}
        **Challenges:** {wizard_data.challenges | join(', ')}
        **Stack:** {wizard_data.currentStack | join(', ')}

  tasks:
    auto_create_per_stage: true
    task_template:
      title: "Plan {plan_id} — {stage_name}"
      assignee: "{agent_name}"
      due_at: "{stage_timeout_at}"

  space:
    auto_create_per_plan: true
    space_template:
      name: "plan-{plan_id}"
      files:
        - implementation_plan.md
        - architecture.json
        - wireframe_components.jsx
        - design_tokens.json
        - integration_notes.md
        - validation_report.json
        - upsell_pamphlet.md
        - email_body.html
        - index.html
```

### 6.3 Agent SOUL.md files

One file per agent in `~/.hermes/agents/<agent-name>/SOUL.md`. Template:

```markdown
---
name: architect-agent
model: minimax-m2-7-pro
fallback: opencode-go/kimi-k2-5
context_budget: 6000
---

# Architect Agent (VerbaFlow Cybergrowth)

## Role
You draft the implementation plan for a customer who completed the VerbaFlow Growth Plan wizard.

## Inputs
- wizard_data (industry, stage, challenges, goals, teamSize, budget, timeline, subNiches, currentStack, legacyPain)
- VerbaFlow service catalog (loaded from /Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0/src/data/services.ts)

## Outputs
1. implementation_plan.md (executive summary, 3 to 5 phases, recommended services, estimated investment range)
2. architecture.json (tech stack layers, integration points, data flow)

## Constraints
- Pricing display: always show ranges, never single price. Max values end in 95 ($495, $995, etc).
- No "per month" / "monthly" / "yearly" language. Use retainer or project agnostic phrasing.
- Estimated investment must reflect wizard_data.budget range plus 30% headroom.
- If wizard_data.budget == "low", recommend only the 2 highest leverage services. Skip premium tier.
- Tech stack must align with VerbaFlow's preferred stack: Next.js, FastAPI, Supabase, Docker Compose, n8n, DeepSeek, Claude. Mention exceptions explicitly.

## Output format (architecture.json)
{
  "stack": [{ "layer": "frontend", "tools": ["Next.js 15", "Tailwind v4"] }, ...],
  "integrations": ["Supabase", "Stripe", "Resend"],
  "data_flow": "wizard → postgres → hermes → supabase storage → resend",
  "estimated_hours": 80,
  "delivery_milestones": [{ "name": "MVP", "days": 14 }, ...]
}
```

Six agents to create:
1. `architect-agent` (MiniMax M2.7 Pro)
2. `designer-agent` (Kimi K2.6)
3. `backend-agent` (Qwen 3.6 Plus)
4. `validator-agent` (DeepSeek V4 Pro)
5. `marketing-agent` (MiniMax 2.7)
6. `booking-agent` (Qwen 3.6 Plus) — handles Calendly slot pulling

### 6.4 Hermes Webui Reflection

Each `growth_plans` row in Postgres maps to:
- **One Kanban card** in the "Growth Plans" board. Card moves columns as `status` transitions.
- **One Space** named `plan-<id>` containing all artifacts (markdown, JSON, JSX, HTML).
- **N Tasks**, one per pipeline stage. Each task is assigned to the corresponding agent. Task completes when `AgentRun.status == succeeded`.

The Hermes daemon reads `cybergrowth-wireframe.yaml` on startup. The `webui.kanban`, `webui.tasks`, `webui.space` sections drive UI rendering. No custom code needed if Hermes version >= v0.13.0 (current).

Verify Hermes version:
```bash
hermes --version  # must be >= 0.13.0
```

### 6.5 Environment variables to add

`.env.local`:
```bash
# Hermes
HERMES_WEBHOOK_URL=http://localhost:7878
VFLOW_HERMES_TOKEN=<generate via: openssl rand -hex 32>
HERMES_CALLBACK_BEARER=<same as VFLOW_HERMES_TOKEN>

# Agent model API keys
MINIMAX_API_KEY=
KIMI_API_KEY=
QWEN_API_KEY=
DEEPSEEK_API_KEY=  # already set if using existing pipeline

# Resend (already in plan)
RESEND_API_KEY=
RESEND_FROM=plans@verbaflowllc.com

# Calendly (booking agent)
CALENDLY_API_TOKEN=
CALENDLY_EVENT_TYPE_URI=

# Feature flags
ENABLE_WIREFRAME_PIPELINE=true
ENABLE_ABANDONMENT_FOLLOWUP=true
```

---

## 7. Wireframe Delivery Pipeline (Supabase Storage)

### 7.1 Bucket setup

```sql
-- Run in Supabase SQL editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('wireframes', 'wireframes', false);

-- RLS: only signed URLs, no public read
CREATE POLICY "no_public_read" ON storage.objects
  FOR SELECT USING (false);

CREATE POLICY "service_role_write" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

### 7.2 HTML template

The `delivery-agent` renders Stitch generated JSX into a single self contained HTML file:
- Inline Tailwind CSS (via Tailwind CDN script for dev, build pipeline for prod)
- Inline fonts via Google Fonts CDN
- No external JS except optional Calendly widget
- Mobile responsive (320px to 1920px)
- One file: `index.html` under 200 KB total

Template location: `src/lib/wireframe-template.html` (with `{{COMPONENTS}}` and `{{TOKENS}}` placeholders).

### 7.3 Next.js rewrite

[next.config.ts](../next.config.ts) addition:

```typescript
async rewrites() {
  return [
    {
      source: '/wireframe/:planId',
      destination: '/api/wireframe/:planId',  // proxies to signed Supabase URL
    },
  ];
}
```

`/api/wireframe/[planId]/route.ts`:
1. Validate `planId` exists and `status == wireframe_ready`.
2. Get signed Supabase URL (90 day expiry).
3. Either redirect or proxy stream the HTML.

### 7.4 Cost projection

- Supabase free tier: 1 GB storage, 2 GB egress / month
- Avg wireframe HTML: 150 KB → 6,800 wireframes per 1 GB
- Egress at 1,000 wireframes / month with avg 3 views each = 450 MB. Well within free.
- Crossover to paid: at 10,000 wireframes / month, expect ~$5 / month.

---

## 8. Email Automation (Resend)

| Template | Trigger | Contents |
|---|---|---|
| `plan_ready` | `GrowthPlan.status` → `plan_ready` | Implementation plan link to `/plan/[id]`, "wireframe in progress" status. |
| `wireframe_ready` | `GrowthPlan.status` → `wireframe_ready` | Signed wireframe URL, "I'm in" CTA → `/plan/[id]/move-forward`, "Book a Call" secondary CTA. |
| `abandonment_followup` | Cron 1 hour after `Abandonment.createdAt` if `followUpSent == false` | "You started a Growth Plan, here's your partial preview". Link back to wizard pre filled. |
| `newsletter_welcome` | New `NewsletterSubscriber` row | Welcome + service overview. |
| `service_specific_followup` | Tagged subscribers with `wizard_data.subNiches` | Periodic value drops, niche specific. |

Cron for abandonment: Hermes scheduled task runs every 15 minutes, queries `Abandonment WHERE followUpSent = false AND createdAt < NOW() - INTERVAL '1 hour'`.

---

## 9. Frontend Changes

### 9.1 GrowthPlanWizard

Modify [GrowthPlanWizard.tsx](../src/components/GrowthPlanWizard.tsx):
- On email step (step ?), call `/api/growth-plan/start` immediately on blur with `{ email, stepReached }`. Creates Abandonment row.
- On each `handleNext`, call `/api/growth-plan/progress` with current `WizardData`. Updates Abandonment.
- On final submit, call new `/api/growth-plan/submit` instead of `/api/generate-strategy`.
- After plan returns, show implementation plan + blurred wireframe preview behind paywall.
- "Unlock $19 Plan" → existing Stripe checkout flow, then redirect to `/plan/[id]`.

### 9.2 New components

| Component | Path | Purpose |
|---|---|---|
| `PlanStatusPage` | `src/app/plan/[id]/page.tsx` | Live status with agent activity, polls every 10s |
| `MoveForwardForm` | `src/app/plan/[id]/move-forward/page.tsx` | Customization questionnaire + Calendly embed |
| `BlurredPreview` | `src/components/BlurredPreview.tsx` | Paywall blur effect over first wireframe section |
| `LivePlanCounter` | `src/components/LivePlanCounter.tsx` | Virtual Office: "X plans in flight" |
| `FloorPlanMockActivity` | `src/components/FloorPlanMockActivity.tsx` | CSS animation for agent station status |
| `HomepageDoorsCTA` | `src/components/HomepageDoorsCTA.tsx` | Three door cards (Plan / Tour / See Work) |

### 9.3 Component moves

- Move `FloorPlan*` from `src/components/agency/` to `src/components/virtual-office/`
- Remove floor plan from `src/app/agency/page.tsx`
- Keep `AgencySplitLayout`, `AgencyProjectsStrip`, prototypes on `/agency`

---

## 10. 10x Features (high leverage, low effort)

| Feature | Effort | Where it lives |
|---|---|---|
| Partial wizard email capture + abandonment email | 0.5 day | `Abandonment` model + Hermes cron + Resend template |
| Blurred inline wireframe preview at paywall | 0.5 day | `BlurredPreview` component + CSS filter |
| Live job status page with mock agent activity | 1 day | `PlanStatusPage` + 10s polling |
| One click "I'm in" email CTA → Calendly | 0.5 day | `MoveForwardForm` + Calendly embed |
| Wizard answers seed Hermes architect prompt | 1 day | `architect-agent` SOUL.md + prompt template |
| A / B test wireframe prototype on agency page | 0.5 day | PostHog flag or cookie based 4 way split |
| Virtual Office live plan counter | 0.5 day | Postgres query + ISR every 30s |
| Free preview = service recommendations only, paid = recommendations + wireframe | 0 (already designed) | Wizard gate logic |

Total: ~4.5 days of work for 10x impact across the funnel.

---

## 11. Week 1 Rollout Schedule (2026-05-11 to 2026-05-18)

| Day | Date | Track A: Infra & Backend | Track B: Frontend & Pages |
|---|---|---|---|
| 1 | 2026-05-11 (Mon) | Prisma migration, `/api/growth-plan/submit` + `/api/hermes/callback`, Hermes pipeline yaml | Wizard partial capture wiring |
| 2 | 2026-05-12 (Tue) | Architect agent SOUL.md + Hermes pipeline test, Resend templates | `PlanStatusPage` + polling |
| 3 | 2026-05-13 (Wed) | Designer + Backend agents, Supabase Storage bucket + signed URL flow | `BlurredPreview`, Stripe gate integration |
| 4 | 2026-05-14 (Thu) | Validator + Marketing + Delivery agents, end to end pipeline smoke test | Move floor plan to Virtual Office, mock activity component |
| 5 | 2026-05-15 (Fri) | Abandonment cron, newsletter endpoint, Hermes kanban verification | Homepage three doors CTA, agency page cleanup |
| 6 | 2026-05-16 (Sat) | A / B test setup, PostHog wiring, env vars on Vercel | `MoveForwardForm` + Calendly embed |
| 7 | 2026-05-17 (Sun) | Full dress rehearsal: 5 test wizards through full pipeline, fix anything red | Polish, mobile responsive QA |
| Launch | 2026-05-18 (Mon) | Soft launch. Scrape first 100 emails. Send first wireframes. Monitor Hermes kanban. | |

---

## 12. File Manifest

### Create

| Path | Purpose |
|---|---|
| `prisma/migrations/<timestamp>_growth_plan_funnel/` | Schema migration |
| `src/app/api/growth-plan/start/route.ts` | Partial email capture |
| `src/app/api/growth-plan/progress/route.ts` | Step progress tracking |
| `src/app/api/growth-plan/submit/route.ts` | Full submission + Hermes trigger |
| `src/app/api/plan/[id]/status/route.ts` | Status polling endpoint |
| `src/app/api/plan/[id]/preview/route.ts` | Blurred preview asset |
| `src/app/api/plan/[id]/move-forward/route.ts` | Move forward submission |
| `src/app/api/hermes/callback/route.ts` | Hermes agent status callback |
| `src/app/api/newsletter/subscribe/route.ts` | Newsletter signup |
| `src/app/api/wireframe/[planId]/route.ts` | Wireframe HTML proxy |
| `src/app/plan/[id]/page.tsx` | Plan status page |
| `src/app/plan/[id]/move-forward/page.tsx` | Move forward form |
| `src/components/BlurredPreview.tsx` | Paywall preview |
| `src/components/LivePlanCounter.tsx` | Virtual Office live counter |
| `src/components/FloorPlanMockActivity.tsx` | Floor plan animation |
| `src/components/HomepageDoorsCTA.tsx` | Three door cards |
| `src/components/virtual-office/FloorPlan.tsx` | Moved from agency |
| `src/lib/hermes-client.ts` | Hermes webhook client wrapper |
| `src/lib/wireframe-template.html` | Static HTML wrapper for delivery agent |
| `src/lib/email-templates/plan-ready.ts` | Resend template |
| `src/lib/email-templates/wireframe-ready.ts` | Resend template |
| `src/lib/email-templates/abandonment-followup.ts` | Resend template |
| `.hermes/pipelines/cybergrowth-wireframe.yaml` | Hermes pipeline config |
| `.hermes/agents/architect-agent/SOUL.md` | Architect prompt |
| `.hermes/agents/designer-agent/SOUL.md` | Designer prompt |
| `.hermes/agents/backend-agent/SOUL.md` | Backend prompt |
| `.hermes/agents/validator-agent/SOUL.md` | Validator prompt |
| `.hermes/agents/marketing-agent/SOUL.md` | Marketing prompt |
| `.hermes/agents/booking-agent/SOUL.md` | Booking prompt |

### Modify

| Path | Change |
|---|---|
| [prisma/schema.prisma](../prisma/schema.prisma) | Add GrowthPlan, Abandonment, AgentRun, NewsletterSubscriber models |
| [src/components/GrowthPlanWizard.tsx](../src/components/GrowthPlanWizard.tsx) | Partial capture wiring, paywall preview |
| [src/app/page.tsx](../src/app/page.tsx) | Add HomepageDoorsCTA, simplify CTAs |
| [src/app/agency/page.tsx](../src/app/agency/page.tsx) | Remove floor plan elements, add Book a Call CTA, A / B test wrapper |
| [src/app/virtual-office/page.tsx](../src/app/virtual-office/page.tsx) | Add floor plan, mock activity, live counter |
| [src/app/api/webhooks/stripe/route.ts](../src/app/api/webhooks/stripe/route.ts) | Set paidAt, trigger Hermes wireframe phase |
| [next.config.ts](../next.config.ts) | Add `/wireframe/:planId` rewrite |
| `.env.local` | Add Hermes, agent API keys, Calendly, feature flags |

### Delete / archive

None for week 1. Keep all existing prototypes during A / B test.

---

## 13. Hermes Setup Instructions

### 13.1 Prerequisites

```bash
# Verify Hermes is installed and version >= 0.13.0
hermes --version

# Verify Ollama is running for local fallback models
ollama list  # should include qwen2.5-coder:7b, nomic-embed-text

# Verify Supabase project credentials
cat ~/.secrets/supabase-verbaflow-registry.env
```

### 13.2 Start Hermes daemon

```bash
cd ~/.hermes
hermes daemon start --pipeline-dir ./pipelines --agent-dir ./agents
hermes webui start --port 7879  # kanban / tasks / spaces UI

# Webui at http://localhost:7879
# API at http://localhost:7878 (default)
```

### 13.3 Register the pipeline

```bash
cp /Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0/.hermes/pipelines/cybergrowth-wireframe.yaml \
   ~/.hermes/pipelines/

hermes pipeline reload cybergrowth-wireframe
hermes pipeline list  # confirm registered
```

### 13.4 Register agents

```bash
for agent in architect designer backend validator marketing booking; do
  cp -r /Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0/.hermes/agents/${agent}-agent \
        ~/.hermes/agents/
done

hermes agent reload --all
hermes agent list  # confirm all 6 registered
```

### 13.5 Set agent API keys

Add to `~/.hermes/config.yaml`:

```yaml
providers:
  minimax:
    api_key_env: MINIMAX_API_KEY
    base_url: https://api.minimaxi.chat/v1
  kimi:
    api_key_env: KIMI_API_KEY
    base_url: https://api.moonshot.cn/v1
  qwen:
    api_key_env: QWEN_API_KEY
    base_url: https://dashscope.aliyuncs.com/compatible-mode/v1
  deepseek:
    api_key_env: DEEPSEEK_API_KEY
    base_url: https://api.deepseek.com/v1

aliases:
  minimax-m2-7-pro: minimax/abab7-chat-preview
  minimax-2-7: minimax/abab6.5-chat
  kimi-k2-6: kimi/moonshot-v1-128k
  qwen-3-6-plus: qwen/qwen-plus
  deepseek-v4-pro: deepseek/deepseek-chat
```

### 13.6 Webhook security

```bash
# Generate token
TOKEN=$(openssl rand -hex 32)
echo "VFLOW_HERMES_TOKEN=${TOKEN}" >> /Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0/.env.local
echo "VFLOW_HERMES_TOKEN=${TOKEN}" >> ~/.hermes/config.env

# Restart Hermes to pick up new env
hermes daemon restart
```

### 13.7 Test the pipeline

```bash
# Manually trigger with a fake wizard payload
curl -X POST http://localhost:7878/jobs/growth-plan \
  -H "Authorization: Bearer ${VFLOW_HERMES_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "test-001",
    "wizard_data": {
      "industry": "real-estate",
      "stage": "scaling",
      "challenges": ["Lead Generation", "AI / Automation Strategy"],
      "goals": ["Build a referral pipeline"],
      "teamSize": "2-5",
      "budget": "medium",
      "timeline": "short",
      "email": "test@verbaflowllc.com",
      "name": "Test User",
      "subNiches": ["Commercial Real Estate"],
      "currentStack": ["Spreadsheets / Manual"],
      "legacyPain": "Excel breaking down at scale"
    },
    "callback_url": "http://localhost:3000/api/hermes/callback"
  }'

# Open webui, confirm card appears in "Queued" column
open http://localhost:7879

# Watch the kanban card progress through columns
# Watch the space at /plan-test-001 populate with artifacts
```

### 13.8 Production hosting

Hermes daemon runs on the Hetzner VPS (`ssh agent`) for production:

```bash
# On VPS
ssh agent
cd ~/titan-outreach/hermes
docker compose up -d hermes-daemon hermes-webui

# Webhook URL becomes
# https://hermes.verbaflowllc.com/jobs/growth-plan (via Cloudflare Tunnel)
```

Update Vercel env:
```
HERMES_WEBHOOK_URL=https://hermes.verbaflowllc.com
```

---

## 14. Open Questions to Resolve Before Day 1

| Question | Default | Decide by |
|---|---|---|
| Stripe price ID for $19 plan exists? | Verify `STRIPE_GROWTH_PLAN_PRICE_ID` in [.env.example](../.env.example) | 2026-05-11 EOD |
| Calendly event type set up? | Create one if absent: 30 min "Growth Plan Discovery" | 2026-05-11 EOD |
| Resend domain verified for `plans@verbaflowllc.com`? | Verify in Resend dashboard | 2026-05-12 |
| Hermes daemon already running locally? | Run `hermes daemon status` to check | 2026-05-11 EOD |
| Stitch API key obtained? | Used by designer agent for JSX generation | 2026-05-13 |
| MiniMax, Kimi, Qwen API keys obtained? | Required for agent models | 2026-05-12 |
| PostHog account for A / B tests? | Sign up at posthog.com (free tier) | 2026-05-15 |

---

## 15. Success Criteria for Launch (2026-05-18)

- One wizard end to end completion from cold link to wireframe delivery, under 30 min total.
- Hermes kanban shows the card move through all columns.
- The space `plan-<id>` contains all 9 artifacts.
- The wireframe loads on mobile (test on iPhone Safari).
- The "I'm in" email CTA opens Calendly and books a slot.
- Stripe charges $19 and the customer sees the wireframe within 30 min.
- The abandonment email fires for a test bailout at step 4.

---

## 16. Out of Scope for Week 1

These ship in week 2 or later:
- DNA Filx full launch (placeholder only on homepage)
- Generative UI per visitor for floor plan
- Per geo A / B testing analytics dashboard
- iOS / SaaS wireframe variants (HTML site wireframe only at launch)
- Bilingual support
- Per service deep landing pages beyond what exists
- Affiliate / referral tracking
- Multi user wireframe collaboration

---

**End of plan.** Ready to execute when San gives the word.
