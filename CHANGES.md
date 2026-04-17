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
