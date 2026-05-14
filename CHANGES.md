## 2026-05-14 - Fix VolumetricBeam horizontal seam line

**Changes:**
- Fixed `src/components/VolumetricBeam.tsx` landing pool `fillRect` from partial-canvas (`0, H * 0.55, W, H * 0.6`) to full-canvas (`0, 0, W, H`)
- The hard clip edge at ~55% viewport height was a rendering artifact where the radial gradient's rectangle top edge created an abrupt seam
- Full-canvas fill lets the radial gradient control its own falloff (already terminates at `rgba(0,0,0,0)`)

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
