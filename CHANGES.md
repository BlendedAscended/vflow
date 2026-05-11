## 2026-05-11 17:00 (UTC) — Cybergrowth funnel implementation plan published

**Changes:**
- Created [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md): full 16 section spec for the VerbaFlow 2.0 funnel revamp.
- Architecture decisions locked: floor plan moves from /agency to /virtual-office, /agency becomes portfolio + book a call, /homepage carries three door CTAs, wireframe delivery via Supabase Storage signed URLs.
- Hermes pipeline `cybergrowth-wireframe` defined: 6 agents (architect, designer, backend, validator, marketing, booking) with kanban + tasks + spaces reflection in webui.
- New Prisma models proposed: GrowthPlan, Abandonment, AgentRun, NewsletterSubscriber.
- 10 new API routes specced. 7 new components specced. 6 new Hermes agent SOUL.md files specced.
- Week 1 rollout schedule: 2026-05-11 through 2026-05-18.
- Breaking changes: replaces `/api/generate-strategy` with `/api/growth-plan/submit` (kept old route as legacy for week 1).
- No code shipped yet. Plan only.

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
