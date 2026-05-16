# Business-First Prompt Architecture — Complete Specification

> **VerbaFlow LLC — Internal Reference**
> Status: Approved Draft v2.0
> Date: 2026-05-16
> Owner: San Ghotra
> Pipeline: Growth Plan Wizard → Architect → Designer (Stitch) → Supabase → Resend
> Product: $400 Client Business Website Package

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Perspective Anchor: WHO is the website for?](#2-perspective-anchor-who-is-the-website-for)
3. [The Two-Axis Superset Model](#3-the-two-axis-superset-model)
4. [Pipeline Architecture (Stages 0-7)](#4-pipeline-architecture-stages-0-7)
5. [Stage 0: Competitor Design Mining](#5-stage-0-competitor-design-mining)
6. [Stage 0.5: Adaptive Template Selection](#6-stage-05-adaptive-template-selection)
7. [Stage 1: Enhanced Questionnaire](#7-stage-1-enhanced-questionnaire)
8. [Stage 2: Client Business Profile Extraction](#8-stage-2-client-business-profile-extraction)
9. [Stage 3: Architect Agent (AI Studio)](#9-stage-3-architect-agent-ai-studio)
10. [Stage 4: Designer Prompt Builder](#10-stage-4-designer-prompt-builder)
11. [Stage 5-7: Stitch → Human Review → Deploy](#11-stage-5-7-stitch--human-review--deploy)
12. [Adaptive DESIGN.md Spec (3-Mode)](#12-adaptive-designmd-spec-3-mode)
13. [Template-to-Niche Mapping](#13-template-to-niche-mapping)
14. [Competitor Curation Table (Seed)](#14-competitor-curation-table-seed)
15. [Service Sub-Types by Industry](#15-service-sub-types-by-industry)
16. [$400 Package Architecture](#16-400-package-architecture)
17. [Skills Integration Map](#17-skills-integration-map)
18. [Pitfalls](#18-pitfalls)
19. [Future Extensions](#19-future-extensions)

---

## 1. Problem Statement

### 1.1 The Original Problem

The current Growth Plan pipeline works, but it has a perspective leak. The designer agent prompt injects VerbaFlow service slugs (`ai-automation`, `software-development`, `lead-gen-engine`) into the client's website wireframe Services section. When the prompt says:

> "Design a professional wireframe landing page for a dental business."

Stitch correctly builds a dental site layout. But when Section 4 says:

> "Services section highlighting `{architecture.json.recommended_service_slugs}`"

It lists VerbaFlow's services, not the dental clinic's services. The result is a hybrid: dental visual style with VerbaFlow service descriptions. That is the leak.

### 1.2 The Deeper Opportunity

Every industry niche already has 3-5 websites that have been validated by real users and real designers. Their layouts, trust signals, CTAs, and animations have been A/B tested through millions of dollars in traffic. Building from scratch ignores this validation. Building a superset of the best elements from the best sites produces a design that is:

- **Validated** — each element is battle-tested
- **Original** — combining 4 sources produces a unique composition
- **Faster** — the designer agent has concrete examples instead of vague direction
- **Subtle** — animations and flourishes are reduced to 40-60% intensity, creating polish without flash

### 1.3 The Adaptive Template Gap

VerbaFlow has 5 internal design matrices (Enterprise Authority, Developer Dark Mode, Consumer Conversion, Studio White, Command Centre). These were built for VerbaFlow's own products. For client websites, we also have access to 54 real-world design systems via the `popular-web-designs` skill: Stripe, Linear, Vercel, Notion, Apple, Airbnb, and 48 more. Each is a complete visual language with tokens, typography, spacing, shadows, and component styles that have been extracted from production sites.

The internal matrices answer: "how should a VerbaFlow product look?" The popular-web-designs templates answer: "how should a dental/legal/restaurant/real-estate website look?" For client work, we need the latter.

**The architecture must answer two questions for every client project:**
- **WHAT works?** → Competitor DNA (X-axis) — validated patterns from the niche
- **HOW is it styled?** → Adaptive Template (Y-axis) — proven design systems with tokens

---

## 2. Perspective Anchor: WHO is the website for?

Three distinct modes. The pipeline must know which mode it is operating in before any prompt is constructed.

### Mode A: Client Business Website ($400 Product)

```
WHO:     The client's own customer (patient, client, buyer)
PURPOSE: Sell the CLIENT's services to the CLIENT's customers
LOOKS:   "Smith Dental — Cleanings, Implants, Book Now"
BUILDER: Stitch → AI Studio polish → Supabase deploy
PRICE:   $400 one-time
```

### Mode B: Growth Plan Wireframe (Upsell/Lead Magnet)

```
WHO:     The client (business owner considering VerbaFlow services)
PURPOSE: Show the client what VerbaFlow can build for them
LOOKS:   "Your 180-Day Growth Strategy — AI Automation, Lead Gen..."
BUILDER: Architect SOUL → Designer SOUL → Stitch
PRICE:   Free (lead magnet) or part of growth plan
```

### Mode C: Agency Vertical Landing Page (VerbaFlow Marketing)

```
WHO:     Potential clients researching VerbaFlow
PURPOSE: Sell VerbaFlow's services to a specific vertical
LOOKS:   "Professional Websites for Dental Practices — VerbaFlow"
BUILDER: verbaflow-design-system Command Centre Matrix
PRICE:   N/A (marketing asset)
```

**This document focuses on Mode A.** Mode B is already built (existing pipeline). Mode C is a marketing function and uses the internal matrices.

### Perspective Guardrails

When building a Mode A wireframe, the designer prompt must NEVER include:
- VerbaFlow service names or slugs
- References to "web design", "SEO", "marketing", "agencies"
- "We", "our", "us" language unless explicitly about the client's business
- Calendly links (unless the client uses Calendly for their own bookings)

The designer prompt MUST always include:
- The client's actual business name
- The client's actual services (from `client_business_profile`)
- The client's location, hours, phone
- Industry-appropriate trust signals (insurance badges, license numbers, certifications)
- Contact/book CTA relevant to the client's business

---

## 3. The Two-Axis Superset Model

```
                    COMPETITOR DNA (X-axis)
                    "What works in this niche"
                    Sources: 3-5 real reference sites
                              |
    ┌─────────────────────────┼─────────────────────────┐
    |                         |                         |
Layout from      Trust signals from      Hero pattern from
Zocdoc           Aspen Dental            Tend
(booking flow)   (insurance badges)      (scroll reveals)
    |                         |                         |
    └─────────────────────────┼─────────────────────────┘
                              |
                    SUPERSET COMPOSITION
                    "Unique but validated"
                    Rule: no single source > 35% influence
                    Animation intensity: 40-60%
                              |
            ┌─────────────────┼─────────────────┐
            |                                   |
    ADAPTIVE TEMPLATE (Y-axis)         CUSTOM OVERRIDES
    "How it is styled"                 Industry + client-specific
            |                                   |
    54 popular-web-designs              Color swaps, radius
    templates mapped to niche           adjustments, font borrows
            |                                   |
            └─────────────────┬─────────────────┘
                              |
                    FINAL DESIGN SYSTEM
                    70% base template
                    20% competitor overrides
                    10% second-template variance
```

### 3.1 Superset Composition Rules

| Rule | Why |
|------|-----|
| Minimum 3 reference sources per project | Prevents single-source copying |
| No single source exceeds 35% influence | Ensures original composition |
| Always borrow from 2 templates (70% + 10%) | 10% variance prevents generic output |
| Animations at 40-60% of reference intensity | Polish without flash |
| Reference only top-performing sites in the exact niche | Real user validation |
| If client provides references, they get 50% weight | Client taste matters |
| Curated references fill the remaining 50% | Our expertise fills gaps |
| At Level 3 depth (micro-niche), compose from Level 2 refs | Too specific to find pure refs |

### 3.2 Depth Levels for Competitor Discovery

| Level | Description | References Findable | Strategy |
|-------|------------|---------------------|----------|
| **L1 — Industry** | dental, legal, restaurant | 5+ strong refs | Curated table covers this |
| **L2 — Sub-Niche** | general dentistry, personal injury, fine dining | 3-5 refs | Curated table + manual search |
| **L3 — Micro-Niche** | orthodontic aligners for teens in Austin TX | 0-2 refs | Compose from L2 refs + GBP data + unique selling points from questionnaire |
| **L4 — Hyper-Local** | single-location dentist in a specific zip code | 0 refs | Compose from L1 + L2 + GBP photos + client's own answers |

**Rule for deep niches:** When Level 2 references exist, use them. When they do not (too specific), step up one level and use industry-level patterns + client-provided specifics. Never fabricate reference sites at any depth.

---

## 4. Pipeline Architecture (Stages 0-7)

```
STAGE 0: COMPETITOR DESIGN MINING
  ├── Curated table lookup: industry + sub_niche → 3-5 reference sites
  ├── Client-provided references (optional, from questionnaire)
  └── Output: competitor_inspiration block
      │     {layout_source, hero_source, trust_source, animation_source}
      │     {superset_rule, animation_intensity}
      ↓
STAGE 0.5: ADAPTIVE TEMPLATE SELECTION
  ├── Map niche → best-fit template from 54 popular-web-designs
  ├── Select secondary template for 10% variance
  ├── Compute overrides: color swaps, radius, font borrows
  └── Output: template_config block
      │     {base_template, base_influence: 0.7}
      │     {overrides: [{target, from, to, reason}]}
      │     {variance_source, variance_influence: 0.1, variance_element}
      ↓
STAGE 1: ENHANCED QUESTIONNAIRE
  ├── Universal fields: industry, stage, budget, timeline, team, challenges, goals
  ├── Industry-specific fields: services offered, insurance, years, languages, etc.
  ├── GBP autocomplete (existing, unchanged)
  └── Optional: "Name 2-3 websites whose design you admire"
      ↓
STAGE 2: CLIENT BUSINESS PROFILE EXTRACTION
  ├── Normalize questionnaire + GBP into client_business_profile
  ├── Map industry-specific answers to service descriptions
  └── Output: client_business_profile JSON
      │     {name, industry, sub_niche, location, services[], about, hours, phone}
      ↓
STAGE 3: ARCHITECT (AI Studio — gemini-2-5-pro)
  ├── Inputs: wizard_data, gbp_data, services_catalog, industries_catalog
  │           + client_business_profile
  │           + competitor_inspiration block
  │           + template_config block
  ├── Output 1: implementation_plan.md (growth plan, customer-facing)
  ├── Output 2: architecture.json (includes ALL blocks for designer)
  └── Output 3: JSON summary to Hermes
      ↓
STAGE 4: DESIGNER PROMPT BUILDER
  ├── Constructs full Stitch prompt with:
  │   - Client business profile (WHO)
  │   - Competitor inspiration block (WHAT)
  │   - Adaptive template config (HOW)
  │   - 7 required sections (unchanged structure)
  ├── Injects perspective guardrails
  └── Output: Stitch-ready design prompt
      ↓
STAGE 5: STITCH GENERATION
  ├── Tool: mcp__stitch__generate_screen_from_text
  ├── Project: 14405041833567191224
  ├── Design System: assets/d410c1c8f34f4018985f8141eec9ef5a
  ├── Device: DESKTOP
  └── Output: HTML wireframe + screenshot
      ↓
STAGE 6: HUMAN REVIEW / AI STUDIO POLISH (10-15 minutes)
  ├── Content verification: correct business name, services, phone
  ├── Photo placement: replace placeholders with client photos or stock
  ├── CTA verification: booking links work, forms route correctly
  ├── Trust signal check: badges, licenses, certifications present
  └── Optional: AI Studio polish pass for copy refinement
      ↓
STAGE 7: SUPABASE DEPLOY + STRIPE PAYMENT
  ├── Upload HTML to wireframes/{plan_id}/index.html
  ├── Generate 90-day signed URL
  ├── Stripe checkout → $400 payment
  ├── On payment: permanent URL, optional domain mapping
  └── Resend email: wireframe_ready + payment confirmation
```

---

## 5. Stage 0: Competitor Design Mining

### 5.1 Source Discovery

For each project, pull from two sources:

**Curated Table (always used):**
A living reference document mapping industry + sub_niche to 3-5 named websites with specific extracted elements. See Section 14 for the seed table.

**Client-Provided (optional):**
From the questionnaire: "Name 2-3 websites in your industry whose design you admire." If provided, these get 50% weight. If not provided, curated table covers 100%.

### 5.2 Extraction Method

For each reference site, extract exactly ONE named element. Do not audit the entire site. Be surgical:

```
Reference: Zocdoc (zocdoc.com/dentist)
Extracted element: "Insurance-filtered search + online booking flow"
Why it works: "Patients can filter by insurance and book in one view.
               This removes the #1 friction point in dental acquisition."

Reference: Tend (hellotend.com)
Extracted element: "Studio-quality photography with scroll-triggered
                    fade-in animations on service cards"
Why it works: "Non-clinical photography signals comfort. Scroll reveals
               create discovery momentum through the services grid."

Reference: Aspen Dental (aspendental.com)
Extracted element: "Insurance + financing badges in hero, persistent
                    'Find an Office' geolocation widget"
Why it works: "Cost anxiety is the #1 barrier to dental visits.
               Badges in the hero answer the question before it's asked."

Reference: Byte (byteme.com)
Extracted element: "Before/after comparison slider with real patient photos"
Why it works: "Visual proof of results outweighs any testimonial text.
               Real patient photos, not stock."
```

### 5.3 Competitor Inspiration Block Format

The architect agent outputs this block in `architecture.json`:

```json
{
  "competitor_inspiration": {
    "sources": [
      {
        "name": "Zocdoc",
        "url": "zocdoc.com/dentist",
        "extracted_element": "insurance-filtered booking flow",
        "apply_to": "appointment CTA section",
        "why": "patients filter by insurance and book in one view — removes #1 friction"
      },
      {
        "name": "Tend",
        "url": "hellotend.com",
        "extracted_element": "studio photography + scroll-triggered fade-in",
        "apply_to": "hero and services grid",
        "why": "non-clinical photography signals comfort; scroll reveals create momentum"
      },
      {
        "name": "Aspen Dental",
        "url": "aspendental.com",
        "extracted_element": "insurance + financing badges in hero",
        "apply_to": "hero trust bar",
        "why": "cost anxiety is #1 barrier; badges answer before the question is asked"
      },
      {
        "name": "Byte",
        "url": "byteme.com",
        "extracted_element": "before/after comparison slider",
        "apply_to": "testimonials section",
        "why": "visual proof outweighs testimonial text"
      }
    ],
    "superset_rule": "4 sources, no single source > 35% influence",
    "animation_intensity": 0.5,
    "client_sources": []
  }
}
```

### 5.4 Client Source Integration

If the client provides their own references, they get higher weight:

```json
{
  "client_sources": [
    {
      "name": "Provided by client",
      "url": "smiledentalcompetitor.com",
      "extracted_element": "full-width hero video of clinic tour",
      "apply_to": "hero section",
      "weight": 0.5
    }
  ],
  "curated_weight": 0.5,
  "note": "Client-provided reference gets 50% influence. Curated table fills remaining 50%."
}
```

---

## 6. Stage 0.5: Adaptive Template Selection

### 6.1 Selection Algorithm

```
1. Map wizard_data.industry + wizard_data.subNiches[0] to best-fit template
   from curated niche-to-template mapping (Section 13).

2. If the mapping produces a single match:
   → Use it as the base template (70% influence).
   → Select the closest neighbor template for variance (10% influence).

3. If the mapping produces multiple candidates:
   → Present top 2 to architect agent.
   → Architect picks based on competitor inspiration compatibility.

4. If no mapping exists (new niche):
   → Use closest 3 templates by industry vibe.
   → Architect picks one and documents the rationale.

5. Template selection is DETERMINISTIC, not generative.
   The lookup table is curated. Never ask an LLM to invent a template.
```

### 6.2 Template Config Block Format

The architect agent outputs this block in `architecture.json`:

```json
{
  "template_config": {
    "base": {
      "template": "stripe.md",
      "influence": 0.7,
      "reason": "weight-300 elegance, clean white surfaces, trust-focused — ideal for professional services"
    },
    "overrides": [
      {
        "target": "colors.primary",
        "from": "#635BFF",
        "to": "#0891B2",
        "reason": "swap Stripe purple for dental teal — industry convention validated by competitor analysis"
      },
      {
        "target": "rounded.md",
        "from": "8px",
        "to": "12px",
        "reason": "softer radius for friendly, approachable dental feel — validated by Tend"
      },
      {
        "target": "typography.body.fontFamily",
        "from": "Source Sans 3",
        "to": "Inter",
        "reason": "Inter renders cleaner at small sizes for service descriptions"
      }
    ],
    "variance": {
      "source": "notion.md",
      "influence": 0.1,
      "element": "serif headings for About section (warmth injection)",
      "reason": "prevents sterile Stripe-default feel; adds personality to the practice story"
    }
  }
}
```

### 6.3 Template Loading

When the designer agent needs a template, load it from the `popular-web-designs` skill:

```
skill_view(name="popular-web-designs", file_path="templates/stripe.md")
```

Each template provides:
- Complete color palette with exact hex values
- Typography hierarchy (font-family, weight, size, line-height, letter-spacing)
- Component styles (buttons, cards, inputs, navigation)
- Spacing system
- Shadow/elevation system
- Responsive behavior notes
- Hermes implementation notes (CDN font links, ready CSS)

The template is loaded ONCE at stage 0.5, not at generation time. The extracted tokens feed into the designer prompt so Stitch can apply them directly.

---

## 7. Stage 1: Enhanced Questionnaire

### 7.1 Universal Fields (All Industries, Unchanged from Current)

| Field | Type | Options |
|-------|------|---------|
| `name` | text | Free input |
| `email` | email | Free input |
| `industry` | select | From `industries_catalog` |
| `subNiches` | multi-select | From `industries[n].subNiches` |
| `stage` | select | idea / startup / scaling / established |
| `challenges` | multi-select | Lead Gen, Sales Conversion, Operational Efficiency, Hiring, Legacy Software, Compliance, AI Strategy, Brand Awareness |
| `goals` | multi-select | Dynamic based on industry |
| `teamSize` | select | 1 / 2-5 / 6-20 / 20+ |
| `budget` | select | low / medium / high / enterprise |
| `timeline` | select | asap / short / long |
| `currentStack` | multi-select | Spreadsheets, Salesforce, Custom, Legacy, None, Shopify, QuickBooks, Other |
| `legacyPain` | text | Free text describing what breaks |
| `gbpPlaceId` | autocomplete | Google Business Profile (optional) |

### 7.2 Industry-Specific Fields (NEW)

After industry + subNiches are selected, inject industry-specific questions. These fields feed directly into `client_business_profile` and populate the website wireframe with real content.

#### Dental

| Field | Type | Options | Feeds Into |
|-------|------|---------|------------|
| `dentalServices` | multi-select | General Dentistry, Cosmetic, Orthodontics, Implants, Emergency, Pediatric, Periodontics, Oral Surgery, Endodontics, Teeth Whitening, Veneers, Invisalign | Services section |
| `insuranceAccepted` | text | Free text: "Delta Dental, Aetna, Cigna, etc." | Trust bar / FAQ |
| `yearsInPractice` | number | 1-50+ | About section / trust signal |
| `languages` | multi-select | English, Spanish, Chinese, Korean, etc. | About / accessibility |
| `newPatientOffer` | text | "Free consultation", "$99 cleaning special", etc. | Hero CTA |
| `emergencyHours` | boolean | Yes / No | Services / contact |
| `financingAvailable` | boolean | Yes / No | Trust bar |
| `virtualConsultations` | boolean | Yes / No | Services |

#### Legal

| Field | Type | Options | Feeds Into |
|-------|------|---------|------------|
| `practiceAreas` | multi-select | Personal Injury, Family Law, Criminal Defense, Business Law, Estate Planning, Immigration, Real Estate, Employment, Bankruptcy, IP | Services section |
| `barAdmissions` | text | "WA State Bar, Federal District Court" | Trust bar |
| `freeConsultation` | boolean | Yes / No | Hero CTA |
| `contingencyBasis` | boolean | Yes / No | Trust signal / FAQ |
| `yearsInPractice` | number | 1-50+ | About / trust |
| `caseTypes` | text | "Car accidents, slip and fall, wrongful death" | Services detail |
| `languages` | multi-select | English, Spanish, etc. | About |

#### Restaurant

| Field | Type | Options | Feeds Into |
|-------|------|---------|------------|
| `cuisineType` | select | Italian, Mexican, Japanese, Indian, American, etc. | Hero / branding |
| `priceRange` | select | $ / $$ / $$$ / $$$$ | Menu section |
| `diningOptions` | multi-select | Dine-in, Takeout, Delivery, Catering | Services section |
| `reservationLink` | text | OpenTable / Resy / Tock URL | CTA |
| `capacity` | number | Seating capacity | About |
| `dietaryOptions` | multi-select | Vegan, GF, Halal, Kosher | Menu / FAQ |
| `hoursOfOperation` | structured | Mon-Sun open/close times | Header / footer |
| `privateEvents` | boolean | Yes / No | Services |
| `outdoorSeating` | boolean | Yes / No | About |

#### Salon & Beauty

| Field | Type | Options |
|-------|------|---------|
| `salonServices` | multi-select | Haircut, Color, Styling, Extensions, Nails, Facials, Waxing, Massage, Makeup, Bridal |
| `priceRange` | select | $ / $$ / $$$ |
| `walkIns` | boolean | Yes / No |
| `productLines` | text | "Oribe, Kerastase, Olaplex" |
| `stylists` | number | Team size |
| `bookingPlatform` | text | "Vagaro", "Booksy", "Square Appointments" |

#### Home Services (HVAC, Plumbing, Electrical, Roofing, Landscaping)

| Field | Type | Options |
|-------|------|---------|
| `homeServices` | multi-select | HVAC, Plumbing, Electrical, Roofing, Landscaping, Pest Control, Cleaning, Handyman, Painting, Moving |
| `serviceArea` | text | "Seattle metro, Eastside, Tacoma" |
| `licensedInsured` | boolean | Yes / No |
| `emergencyService` | boolean | Yes / No |
| `brandsServiced` | text | "Carrier, Trane, Lennox" |
| `warrantyOffered` | text | "5-year parts, 1-year labor" |

#### Healthcare & Medical Practice

| Field | Type | Options |
|-------|------|---------|
| `specialties` | multi-select | Primary Care, Cardiology, Dermatology, Orthopedics, Pediatrics, OB/GYN, Neurology, Psychiatry |
| `insuranceNetworks` | text | "Blue Cross, United, Medicare" |
| `telehealth` | boolean | Yes / No |
| `acceptingNewPatients` | boolean | Yes / No |
| `typicalWaitTime` | text | "Same-day appointments available" |
| `hospitalAffiliations` | text | "Swedish Medical Center, UW Medicine" |

#### Real Estate

| Field | Type | Options |
|-------|------|---------|
| `transactionTypes` | multi-select | Buy, Sell, Rent, Commercial, Property Management |
| `propertyTypes` | multi-select | Single Family, Condo, Multi-Family, Land, Commercial |
| `serviceArea` | text | "Seattle, Bellevue, Kirkland, Redmond" |
| `mlsId` | text | MLS identifier |
| `languages` | multi-select | English, Spanish, Mandarin |
| `teamSize` | number | Number of agents |

#### Auto Services

| Field | Type | Options |
|-------|------|---------|
| `autoServices` | multi-select | Repair, Body Work, Detailing, Oil Change, Tires, Brakes, AC, Transmission, Diagnostics |
| `makesServiced` | text | "All makes and models" or specific |
| `loanerCars` | boolean | Yes / No |
| `towingAvailable` | boolean | Yes / No |
| `warrantyOffered` | text | "12-month/12k mile on all repairs" |

### 7.3 Universal Optional Field (NEW)

Added after industry-specific questions, before the GBP step:

> **"Name 2-3 websites in your industry whose design you admire."**
>
> (Optional. Text input. If you leave this blank, we will use our curated design references for your industry.)

This feeds into competitor_inspiration as `client_sources[]` with 50% weight.

---

## 8. Stage 2: Client Business Profile Extraction

### 8.1 Normalization Logic

After the wizard completes, extract `client_business_profile` from the raw wizard data. This is a deterministic mapping, not an LLM call.

```python
def extract_client_business_profile(wizard_data: dict, gbp_data: dict | None) -> dict:
    """Extract client business profile from wizard + GBP data."""
    
    profile = {
        "name": wizard_data.get("name") or (gbp_data.get("name") if gbp_data else "Your Business"),
        "industry": wizard_data["industry"],
        "sub_niche": wizard_data.get("subNiches", [None])[0],
        "location": _resolve_location(wizard_data, gbp_data),
        "services": _resolve_services(wizard_data),
        "about": _build_about_text(wizard_data, gbp_data),
        "hours": gbp_data.get("regularOpeningHours", {}).get("weekdayDescriptions", []) if gbp_data else [],
        "phone": gbp_data.get("nationalPhoneNumber") if gbp_data else None,
        "rating": gbp_data.get("rating") if gbp_data else None,
        "photo_urls": [p.get("name") for p in gbp_data.get("photos", [])] if gbp_data else [],
        "target_customers": _infer_target_customers(wizard_data),
        "unique_selling_points": _extract_usps(wizard_data)
    }
    
    return profile
```

### 8.2 Service Resolution

Industry-specific fields map to human-readable service descriptions for the wireframe:

```python
DENTAL_SERVICE_LABELS = {
    "general_dentistry": "General Dentistry — exams, cleanings, fillings",
    "cosmetic": "Cosmetic Dentistry — whitening, veneers, smile makeovers",
    "orthodontics": "Orthodontics — braces, Invisalign, retainers",
    "implants": "Dental Implants — single tooth to full arch restoration",
    "emergency": "Emergency Care — same-day appointments for pain and trauma",
    "pediatric": "Pediatric Dentistry — gentle care for children and teens",
    "periodontics": "Periodontics — gum disease treatment and prevention",
    "oral_surgery": "Oral Surgery — extractions, wisdom teeth, implants",
    "endodontics": "Endodontics — root canals and tooth preservation",
    "teeth_whitening": "Professional Teeth Whitening — in-office and take-home",
    "veneers": "Porcelain Veneers — custom smile design",
    "invisalign": "Invisalign — clear aligner orthodontic treatment"
}
```

### 8.3 Target Customer Inference

```python
def _infer_target_customers(wizard_data: dict) -> str:
    industry = wizard_data["industry"]
    sub_niche = wizard_data.get("subNiches", [None])[0]
    
    if industry == "dental":
        if "pediatric" in sub_niche or "pediatric" in str(wizard_data.get("dentalServices", [])):
            return "parents and families seeking children's dental care"
        return "families and professionals seeking comprehensive dental care"
    elif industry == "legal":
        if "personal_injury" in sub_niche:
            return "individuals injured in accidents seeking compensation"
        return "individuals and businesses seeking legal representation"
    # ... per industry
    
    return f"customers seeking {industry} services in {wizard_data.get('location', 'their area')}"
```

---

## 9. Stage 3: Architect Agent (AI Studio)

### 9.1 Role (Enhanced)

The architect agent in Mode A has an expanded role. It receives:

| Input | Source |
|-------|--------|
| `wizard_data` | Questionnaire |
| `gbp_data` | Google Places API (optional) |
| `services_catalog` | VerbaFlow service definitions |
| `industries_catalog` | Industry definitions |
| `client_business_profile` | Stage 2 extraction (NEW) |
| `competitor_inspiration` | Stage 0 mining (NEW) |
| `template_config` | Stage 0.5 selection (NEW) |
| `mode` | Always `"client-business-website"` for $400 package |

### 9.2 Outputs (Enhanced)

Three files as before, but architecture.json now carries the full design system:

```json
{
  "plan_id": "...",
  "mode": "client-business-website",
  
  "client_business_profile": {
    "name": "Smith Dental Associates",
    "industry": "dental",
    "sub_niche": "general_dentistry",
    "location": "Seattle, WA",
    "services": [
      "General Dentistry — exams, cleanings, fillings",
      "Cosmetic Dentistry — whitening, veneers, smile makeovers",
      "Emergency Care — same-day appointments"
    ],
    "about": "Smith Dental Associates has served Seattle families since 2005...",
    "hours": ["Monday: 8AM-5PM", "Tuesday: 8AM-5PM", ...],
    "phone": "+1-206-555-0123",
    "rating": 4.7,
    "target_customers": "families and professionals in Seattle metro",
    "unique_selling_points": [
      "Same-day emergency appointments",
      "Accepts all major insurance",
      "Open Saturdays"
    ]
  },
  
  "competitor_inspiration": { /* Stage 0 output */ },
  "template_config": { /* Stage 0.5 output */ },
  
  "designer_brief": "Build a professional dental practice website for Smith Dental Associates in Seattle. Target audience is families and professionals. Use clean white surfaces with teal accents. The booking flow should follow Zocdoc's insurance-filter-first pattern. Photography should feel warm and non-clinical, like Tend. Trust badges for insurance and financing must appear in the hero, following Aspen Dental's pattern. A before/after smile gallery in the testimonials section, inspired by Byte.",
  
  "recommended_service_slugs": ["web-design", "local-seo", "booking-integration"],
  "estimated_investment_min": 400,
  "estimated_investment_max": 400,
  
  "stack": [
    { "layer": "frontend", "tools": ["HTML/CSS from Stitch", "Inter font"] },
    { "layer": "deployment", "tools": ["Supabase Storage", "Signed URL"] },
    { "layer": "booking", "tools": ["Client's existing platform or Google Calendar"] }
  ]
}
```

### 9.3 Updated Hard Constraints

New constraints for Mode A:

| Rule | Why |
|------|-----|
| `mode` must be set to `"client-business-website"` in both outputs | Perspective anchor |
| `client_business_profile` must be included in architecture.json | Designer needs real content |
| `competitor_inspiration` must have 3+ sources | Superset rule |
| `template_config` must have a `base` template from the 54 | No invented templates |
| `recommended_service_slugs` for this mode: `["web-design"]` only | The $400 package is a website, nothing else |
| `estimated_investment_max` = 400 for this mode | Fixed price point |
| No services other than web-design in the growth plan | The upsell comes after delivery |
| Designer brief must reference at least 2 competitor sources by name | Ensures competitor DNA flows through |

---

## 10. Stage 4: Designer Prompt Builder

### 10.1 Full Prompt Template (Mode A: Client Business Website)

This is the Stitch prompt. It is constructed by merging all blocks from architecture.json.

```
Build a professional business website for {client_business_profile.name},
a {client_business_profile.industry} practice in {client_business_profile.location}.

This is the business's OWN customer-facing website. The site sells
{client_business_profile.services} to {client_business_profile.target_customers}.

Do NOT build an agency, marketing firm, or technology company website.
Do NOT mention web design, SEO, marketing, agencies, or VerbaFlow.

---

BRAND CONTEXT:
- Business name: {client_business_profile.name}
- Tagline: "{client_business_profile.unique_selling_points[0]}"
- Location: {client_business_profile.location}
- Phone: {client_business_profile.phone}
- Rating: {client_business_profile.rating} / 5.0
- Hours: {client_business_profile.hours}
- About: {client_business_profile.about}

---

DESIGN INSPIRATION (Competitor-Validated Patterns):

Layout foundation:
  Take the {competitor_inspiration.sources[0].extracted_element}
  from {competitor_inspiration.sources[0].name}
  Reason: {competitor_inspiration.sources[0].why}

Hero treatment:
  Take the {competitor_inspiration.sources[1].extracted_element}
  from {competitor_inspiration.sources[1].name}
  Reason: {competitor_inspiration.sources[1].why}

Trust signals:
  Take the {competitor_inspiration.sources[2].extracted_element}
  from {competitor_inspiration.sources[2].name}
  Reason: {competitor_inspiration.sources[2].why}

Animation / motion:
  Take the {competitor_inspiration.sources[3].extracted_element}
  from {competitor_inspiration.sources[3].name}
  Apply at {competitor_inspiration.animation_intensity * 100}% intensity.
  The goal is subtle polish, not distracting motion.

CRITICAL: Compose these elements into a new design. Do not copy any single site.

---

DESIGN SYSTEM (Adaptive Template):

Base template: {template_config.base.template} — provides complete
color palette, typography, spacing, shadows, and component styles.

Template overrides:
{for each override in template_config.overrides}
  - {override.target}: changed from {override.from} to {override.to}
    Reason: {override.reason}

Variance injection:
  Borrow {template_config.variance.element}
  from {template_config.variance.source}
  Reason: {template_config.variance.reason}

Composition: 70% base template, 20% competitor overrides, 10% variance.

---

SECTIONS REQUIRED:

1. HEADER
   - Business name: {client_business_profile.name}
   - Phone: {client_business_profile.phone} (clickable tel: link)
   - Simple navigation: Home, Services, About, Testimonials, Contact
   - Optional: "Book Now" CTA button in header

2. HERO SECTION
   - Headline: benefit-driven, referencing a USP
     Example: "Your Family's Smile, Our Priority — Same-Day Appointments Available"
   - Subheadline: location + key differentiator
   - Primary CTA: "Book Appointment" or "Schedule Free Consultation"
   - Trust bar: rating stars, insurance badges, years in practice
   - Apply competitor hero treatment from Design Inspiration above

3. SERVICES SECTION
   List these EXACT services with brief descriptions:
   {for each service in client_business_profile.services}
     - {service}

   Use icon + label + one-line description format.
   Apply competitor layout pattern for this section.

4. ABOUT SECTION
   - Practice story (2-3 sentences from {client_business_profile.about})
   - Location with embedded map or address
   - Hours of operation: {client_business_profile.hours}
   - Team mention (if applicable)
   - Apply template variance (serif headings, borrowed from second template)

5. TESTIMONIALS / SOCIAL PROOF
   - If rating available: "{client_business_profile.rating} / 5.0" prominently
   - Placeholder testimonial cards (3 cards)
   - Apply competitor before/after or comparison element from inspiration

6. CONTACT / BOOKING
   - Address: {client_business_profile.location}
   - Phone: {client_business_profile.phone}
   - Contact form (name, email, phone, message)
   - If client uses online booking: booking widget or link
   - Map embed

7. FOOTER
   - Business name, address, phone
   - Hours of operation
   - Quick links: Home, Services, About, Testimonials, Contact
   - Copyright line

---

COLOR SYSTEM:
  Primary: {template_config.base.colors.primary} → overridden to {overrides.color_target}
  Secondary: {template_config.base.colors.secondary}
  Accent: {template_config.base.colors.accent}
  Surface: {template_config.base.colors.surface}
  Text: {template_config.base.colors.text}

TYPOGRAPHY:
  Headings: {template_config.base.typography.heading.fontFamily}
            at {template_config.base.typography.heading.fontWeight}
  Body: {template_config.base.typography.body.fontFamily}
  Special: {template_config.variance.source} style for {about/testimonials}

SPACING:
  Section padding: {template_config.base.spacing.section}
  Card padding: {template_config.base.spacing.card}
  Gap: {template_config.base.spacing.gap}

---

CRITICAL RULES (REPEATED):
- This is {client_business_profile.name}'s OWN website.
- It sells {client_business_profile.industry} services to customers.
- Do NOT build an agency or marketing firm site.
- Do NOT mention web design, SEO, agencies, or VerbaFlow.
- Compose competitor elements into a new superset. Do not copy.
- Animations at reduced intensity. Subtle, not flashy.
- All content must reference the CLIENT's actual business.
```

---

## 11. Stage 5-7: Stitch → Human Review → Deploy

### 11.1 Stitch Generation

Unchanged from existing pipeline. The designer agent wraps the prompt and calls:

```
mcp__stitch__generate_screen_from_text
  projectId: "14405041833567191224"
  designSystem: "assets/d410c1c8f34f4018985f8141eec9ef5a"
  deviceType: DESKTOP
  modelId: GEMINI_3_1_PRO
  prompt: "{full prompt from Stage 4}"
```

Poll parameters: 30 seconds, max 10 attempts. Output: HTML wireframe + screenshot.

### 11.2 Human Review Checklist (10-15 minutes per site)

| Check | What to Verify |
|-------|---------------|
| Business name | Correct, not "Your Business", no VerbaFlow mentions |
| Phone number | Correct, clickable tel: link |
| Services list | Matches client's actual services, not VerbaFlow's |
| Hours | Correct from GBP or questionnaire |
| Location / map | Correct address, map renders |
| Trust badges | Present if insurance/licensed/rated |
| CTAs | Booking links functional, forms route correctly |
| Photos | Client photos used if available, appropriate stock if not |
| No agency language | Search for: "web design", "SEO", "marketing", "agency", "VerbaFlow" |
| Mobile | Wireframe is DESKTOP only but check for reasonable responsive hints |

### 11.3 AI Studio Polish Pass (Optional)

After human review, run one AI Studio pass for:
- Copy refinement (tighten headlines, improve CTAs)
- Photo placement suggestions (swap stock for real)
- Meta tag injection (title, description for SEO)

This is a single Gemini call, not a full pipeline stage.

### 11.4 Supabase Deploy + Stripe Payment

Unchanged from existing delivery bridge:
1. Upload HTML to `wireframes/{plan_id}/index.html`
2. Generate 90-day signed URL
3. Present preview to client (watermarked or time-limited)
4. Stripe Checkout → $400 payment
5. On payment success: permanent URL, send Resend confirmation
6. Upsell prompt: "Want a custom domain, SEO setup, and Google Business Profile optimization? +$200"

---

## 12. Adaptive DESIGN.md Spec (3-Mode)

The DESIGN.md file now supports three modes. The mode determines which sections are required and what the token structure looks like.

### 12.1 Mode: `client-business-website`

```yaml
---
version: alpha
mode: client-business-website
name: "Smith Dental Associates"
description: "Professional dental practice website for Seattle-based family dentist. Clean, trustworthy, conversion-focused."

# === CLIENT PROFILE ===
client:
  name: "Smith Dental Associates"
  industry: dental
  sub_niche: general_dentistry
  location: "Seattle, WA 98101"
  phone: "+1-206-555-0123"
  rating: 4.7
  hours:
    - "Monday: 8AM-5PM"
    - "Tuesday: 8AM-5PM"
    - "Wednesday: 9AM-6PM"
    - "Thursday: 8AM-5PM"
    - "Friday: 8AM-3PM"
    - "Saturday: 9AM-1PM"
    - "Sunday: Closed"
  services:
    - name: "General Dentistry"
      description: "Comprehensive exams, cleanings, and preventive care for the whole family"
    - name: "Cosmetic Dentistry"
      description: "Professional whitening, porcelain veneers, and complete smile makeovers"
    - name: "Emergency Care"
      description: "Same-day appointments for dental pain, trauma, and urgent needs"
  about: "Smith Dental Associates has served Seattle families since 2005. Dr. Sarah Smith and her team combine advanced technology with gentle, personalized care. We believe every patient deserves a healthy, confident smile."
  target_customers: "families and professionals in Seattle metro area"
  insurance_accepted: "Delta Dental, Aetna, Cigna, MetLife, Premera Blue Cross"
  languages: ["English", "Spanish"]
  new_patient_offer: "Free consultation and $99 new patient cleaning special"
  emergency_hours: true
  financing_available: true

# === COMPETITOR DNA (X-axis — WHAT works) ===
competitor_inspiration:
  sources:
    - name: "Zocdoc"
      url: "zocdoc.com/dentist"
      extracted_element: "insurance-filtered booking flow"
      apply_to: "appointment CTA section"
      why: "patients filter by insurance and book in one view — removes #1 friction in dental acquisition"
    - name: "Tend"
      url: "hellotend.com"
      extracted_element: "studio-quality photography with scroll-triggered fade-in animations"
      apply_to: "hero and services grid"
      why: "non-clinical photography signals comfort; scroll reveals create discovery momentum through services"
    - name: "Aspen Dental"
      url: "aspendental.com"
      extracted_element: "insurance + financing badges in hero bar"
      apply_to: "hero trust bar"
      why: "cost anxiety is the #1 barrier to dental visits; badges answer before the question is asked"
    - name: "Byte"
      url: "byteme.com"
      extracted_element: "before/after comparison slider with real patient photos"
      apply_to: "testimonials section"
      why: "visual proof of results outweighs any testimonial text"
  client_sources: []
  superset_rule: "4 sources, no single source > 35% influence"
  animation_intensity: 0.5

# === ADAPTIVE TEMPLATE (Y-axis — HOW it is styled) ===
template:
  base:
    template: "stripe.md"
    influence: 0.7
    reason: "weight-300 elegance, clean white surfaces, trust-focused layout — ideal for professional services"
  overrides:
    - target: "colors.primary"
      from: "#635BFF"
      to: "#0891B2"
      reason: "dental industry teal — calm, clean, medical without feeling clinical"
    - target: "rounded.md"
      from: "8px"
      to: "12px"
      reason: "softer, friendlier radius validated by Tend's approachable brand feel"
    - target: "typography.body.fontFamily"
      from: "Source Sans 3"
      to: "Inter"
      reason: "cleaner rendering at body sizes for service descriptions and insurance lists"
  variance:
    source: "notion.md"
    influence: 0.1
    element: "serif headings for About and Testimonials sections"
    reason: "adds warmth and personality to what would otherwise be a sterile Stripe-default dental site"

# === VISUAL TOKENS (computed from template + overrides) ===
colors:
  primary: "#0891B2"
  primary_hover: "#0E7490"
  secondary: "#0A2540"
  accent: "#F59E0B"
  surface: "#FFFFFF"
  surface_elevated: "#F6F9FC"
  text_primary: "#0A2540"
  text_secondary: "#64748B"
  success: "#10B981"
  warning: "#F59E0B"
  error: "#EF4444"

typography:
  h1:
    fontFamily: "Source Sans 3"
    fontSize: "clamp(2.5rem, 5vw, 3.75rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Source Sans 3"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Inter"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Inter"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.02em"
    textTransform: "uppercase"

rounded:
  sm: 6px
  md: 12px
  lg: 16px
  full: 9999px

spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  section: 96px

shadows:
  card: "0 1px 3px rgba(10, 37, 64, 0.05)"
  card_hover: "0 4px 12px rgba(10, 37, 64, 0.08)"
  button: "0 2px 8px rgba(8, 145, 178, 0.25)"

components:
  button_primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "14px 28px"
    fontWeight: 600
    shadow: "{shadows.button}"
  button_primary_hover:
    backgroundColor: "{colors.primary_hover}"
    transform: "translateY(-2px)"
  card_service:
    backgroundColor: "{colors.surface_elevated}"
    rounded: "{rounded.lg}"
    padding: "32px"
    shadow: "{shadows.card}"
  card_service_hover:
    shadow: "{shadows.card_hover}"

creative:
  pinterest_terms:
    - "dental website design clean modern"
    - "dental clinic photography warm"
    - "before after smile gallery"
    - "medical trust badges web design"
  pixel_accent: null
  animation: "scroll-triggered fade-in at 50% intensity"

pages:
  - home
  - services
  - about
  - testimonials
  - contact
---

## Overview

Professional dental practice website for Smith Dental Associates, a family
dentistry practice in Seattle. The design combines Stripe's weight-300 elegance
with Zocdoc's booking flow, Tend's warm photography, and Aspen Dental's trust
badge placement. The result is a clean, trustworthy, conversion-optimized site
that feels premium but approachable.

## Colors

- **Primary (#0891B2):** Dental teal — calm, clean, medical without clinical sterility.
- **Secondary (#0A2540):** Deep navy for text and structural elements.
- **Accent (#F59E0B):** Warm gold for CTAs and highlights.

## Typography

Source Sans 3 for display headings (weight 300 for elegance). Inter for body
and labels. Serif headings in About and Testimonials (Notion borrow) for warmth.

## Competitor DNA

4 reference sources composed at 35% max influence each. Booking flow from Zocdoc,
photography and animation from Tend, trust badges from Aspen Dental, before/after
gallery from Byte. Animations at 50% intensity.

## Do's and Don'ts

**Do:**
- Use warm, non-clinical photography
- Show insurance badges in the hero
- Make the booking CTA persistent

**Don't:**
- Use sterile hospital-white
- List VerbaFlow services
- Over-animate — keep motion subtle
```

### 12.2 Mode: `growth-plan-wireframe`

This mode is the existing pipeline output. It includes VerbaFlow service slugs and the Calendly CTA. Unchanged from current architect-agent/SOUL.md output format.

### 12.3 Mode: `agency-vertical-landing`

This mode uses the internal VerbaFlow Command Centre Matrix. It sells VerbaFlow services to a specific vertical. It includes interactive proof widgets, case studies, and Calendly CTAs. Unchanged from verbaflow-design-system Framework E.

---

## 13. Template-to-Niche Mapping

### 13.1 Primary Mappings

| Niche | Best Template | Why |
|-------|--------------|-----|
| **Dental / Medical Practice** | `stripe.md` | Weight-300 elegance, clean white surfaces, trust-focused layout |
| **Legal / Law Firm** | `apple.md` | Premium white space, SF-style typography authority, cinematic imagery |
| **Restaurant / Food Service** | `airbnb.md` | Photography-driven, warm coral tones, rounded UI, social proof |
| **Salon / Beauty / Spa** | `pinterest.md` | Image-first masonry layout, warm accent, visual storytelling |
| **Home Services (HVAC, Plumbing, Electrical)** | `wise.md` | Bright accent on clean base, friendly and clear, local trust signals |
| **Real Estate / Brokerage** | `vercel.md` | Black and white precision, Geist font system, property-as-product |
| **Auto Repair / Detailing** | `bmw.md` | Dark premium surfaces, precise engineering aesthetic, technical trust |
| **Healthcare / Medical Practice** | `notion.md` | Warm minimalism, serif headings, soft surfaces, calming authority |
| **Fintech / Financial Advisor** | `coinbase.md` | Clean blue identity, institutional trust, data-dense but clear |
| **SaaS / Software** | `linear.app.md` | Ultra-minimal dark, purple accent, precise and technical |
| **Creative Agency / Design** | `framer.md` | Bold black and blue, motion-first, design-forward |
| **Education / Tutoring** | `mintlify.md` | Clean, green-accented, reading-optimized, structured |
| **Fitness / Gym / Wellness** | `spotify.md` | Vibrant green on dark, bold type, energy-driven photography |
| **E-commerce / Retail** | `figma.md` | Vibrant multi-color, product-showcase cards, playful |
| **Enterprise / B2B** | `ibm.md` | Carbon design system, structured blue, data hierarchy |
| **Insurance / Financial Services** | `wise.md` | Bright green accent, friendly and reassuring, local trust |
| **Photography / Videography** | `apple.md` | Cinematic imagery, premium white space, typography-first |
| **Consulting / Coaching** | `notion.md` | Warm minimalism, personal brand focus, serif authority |
| **Nonprofit / Community** | `webflow.md` | Blue-accented, polished marketing, mission-driven |
| **Childcare / Education** | `zapier.md` | Warm orange, friendly, illustration-driven, approachable |

### 13.2 Fallback Selection

When no direct mapping exists:

1. Find the 3 closest templates by industry category (see `popular-web-designs` catalog sections: AI & ML, Developer Tools, Infrastructure, Design & Productivity, Fintech & Crypto, Enterprise & Consumer)
2. Present all 3 to the architect agent
3. Architect picks based on:
   - Competitor inspiration compatibility (does the template's vibe match the reference sites?)
   - Client industry conventions (is it a regulated space? use conservative templates)
   - Target audience (are they consumers? use warm templates. businesses? use precise templates)
4. Document the choice and rationale in template_config

### 13.3 Variance Source Selection

The 10% variance template should come from a DIFFERENT category than the base template. For example:

- Base: fintech (`stripe.md`) → Variance: design/productivity (`notion.md`)
- Base: enterprise (`ibm.md`) → Variance: consumer (`spotify.md`)
- Base: developer tools (`linear.app.md`) → Variance: content (`apple.md`)

This ensures the variance adds genuine contrast, not minor variations on the same theme.

---

## 14. Competitor Curation Table (Seed)

### 14.1 Dental / Medical Practice

```yaml
industry: dental
sub_niches:
  general_dentistry:
    references:
      - name: Zocdoc
        url: zocdoc.com/dentist
        extracts:
          layout: "insurance-filtered search + online booking in single view"
          trust: "verified patient reviews with star ratings and written feedback"
          cta: "persistent 'Book Online' button in nav and cards"
      - name: Tend
        url: hellotend.com
        extracts:
          hero: "studio-quality photography, bright white space, non-clinical feel"
          animation: "scroll-triggered fade-in for service cards"
          brand: "friendly, approachable tone — 'dentistry that feels good'"
          services: "large icon + label grid, each with hover description"
      - name: Aspen Dental
        url: aspendental.com
        extracts:
          trust: "insurance + financing badges in hero bar"
          locations: "geolocation-powered 'Find an Office' with map"
          services: "clear procedure categories with pricing transparency"
      - name: Byte
        url: byteme.com
        extracts:
          hero: "before/after comparison slider"
          cta: "am-i-a-candidate quiz as lead capture"
          social_proof: "real patient photos and stories, not stock"
      - name: Candid
        url: candidco.com
        extracts:
          hero: "clean product photography, minimal text"
          process: "3-step treatment journey visualization"
          trust: "doctor-reviewed badge on every product"
    designer_notes: |
      Compose: Zocdoc's booking flow + Tend's warm photography + Aspen's
      trust badges + Byte's before/after gallery. All at 50% intensity.
      Primary color: teal (#0891B2). Surface: white (#FFFFFF).
      Photography: warm, natural light, real smiles. No clinical stock.

  orthodontics:
    references:
      - name: Invisalign
        url: invisalign.com
        extracts:
          hero: "product visualization with smile transformation"
          process: "digital scan → custom plan → new smile timeline"
          social_proof: "millions of smiles transformed counter"
      - name: SmileDirectClub
        url: smiledirectclub.com
        extracts:
          hero: "affordability messaging + transformation gallery"
          cta: "free smile assessment quiz"
          pricing: "transparent pricing with financing options"
      - name: OrthoFi
        url: orthofi.com
        extracts:
          trust: "insurance verification tool"
          pricing: "flexible payment plan calculator"
    designer_notes: |
      Compose: Invisalign's transformation visualization + SmileDirectClub's
      affordability messaging + OrthoFi's payment calculator.
      Conservative colors. Trust-focused. Animation at 40%.

  pediatric_dentistry:
    references:
      - name: Sprout Pediatric Dentistry
        url: sproutsmile.com
        extracts:
          hero: "playful but clean — bright colors on white base"
          trust: "parent testimonials with child photos"
          environment: "office tour photos showing kid-friendly space"
      - name: Children's Dental Fun Zone
        url: childrensdentalfunzone.com
        extracts:
          brand: "theme park aesthetic — colorful, games, characters"
          services: "cartoon icon + label for each service"
          cta: "virtual tour + 'meet the dentist' video"
    designer_notes: |
      Compose: Sprout's clean playfulness + Fun Zone's character-driven
      branding at reduced intensity (60%). Must feel professional to parents
      while being inviting to children. No clinical fear triggers.
```

### 14.2 Legal / Law Firm

```yaml
industry: legal
sub_niches:
  personal_injury:
    references:
      - name: Morgan & Morgan
        url: forthepeople.com
        extracts:
          hero: "large result counters — '$20 Billion Recovered'"
          trust: "attorney profiles with real case results"
          cta: "free case evaluation form, persistent"
          social_proof: "client count + 'America's Largest Injury Firm'"
      - name: Cellino Law
        url: cellinolaw.com
        extracts:
          brand: "strong visual identity — green + white, memorable"
          trust: "attorney spotlights with personal stories"
          cta: "24/7 availability messaging"
      - name: Jacoby & Meyers
        url: jacobymeyers.com
        extracts:
          hero: "benefit headline + contingency promise"
          services: "practice area grid with icons"
          trust: "'No Fee Unless We Win' badge prominent"
    designer_notes: |
      Compose: M&M's result counters + Cellino's strong brand + J&M's
      contingency badge. Navy + gold palette. Authoritative serif typography.
      No animations — static, serious, trustworthy.

  business_law:
    references:
      - name: Cooley
        url: cooley.com
        extracts:
          layout: "practice area mega-grid, clean and structured"
          trust: "client logo wall — Fortune 500 companies"
          typography: "serif headings, humanist body — authoritative"
      - name: Wilson Sonsini
        url: wsgr.com
        extracts:
          hero: "thought leadership content, not sales copy"
          navigation: "deep practice area drill-down"
          brand: "understated elegance — let the work speak"
    designer_notes: |
      Compose: Cooley's practice grid + WSGR's thought-leadership tone.
      Conservative. No CTA aggression. Content-first layout.
```

### 14.3 Restaurant / Food Service

```yaml
industry: restaurant
sub_niches:
  fine_dining:
    references:
      - name: Eleven Madison Park
        url: elevenmadisonpark.com
        extracts:
          hero: "full-bleed photography, no text overlay"
          menu: "tasting menu format — ingredients, not prices"
          reservation: "Tock integration, seamless"
          brand: "minimalist — the food is the design"
      - name: Per Se
        url: perserestaurant.com
        extracts:
          layout: "vertical rhythm — image, text, image, text"
          typography: "elegant serif, generous whitespace"
          gallery: "dish photography as art"
      - name: Alinea
        url: alinearestaurant.com
        extracts:
          animation: "subtle parallax on scroll"
          experience: "theatre of dining — storytelling through visuals"
    designer_notes: |
      Compose: EMP's full-bleed photography + Per Se's typographic rhythm +
      Alinea's subtle parallax. Dark base with warm accent. Minimal text.
      Reservation is the only CTA.

  fast_casual:
    references:
      - name: Sweetgreen
        url: sweetgreen.com
        extracts:
          menu: "ingredient-forward cards — 'what's in your bowl'"
          brand: "mission-driven — 'connecting people to real food'"
          ordering: "app download + online ordering prominent"
      - name: Cava
        url: cava.com
        extracts:
          hero: "build-your-own visual journey"
          menu: "dietary filters: vegan, GF, spicy"
          locations: "map + search + hours"
      - name: Chipotle
        url: chipotle.com
        extracts:
          ordering: "start order CTA above fold"
          nutrition: "interactive nutrition calculator"
          loyalty: "rewards program prominently featured"
    designer_notes: |
      Compose: Sweetgreen's ingredient cards + Cava's dietary filters +
      Chipotle's ordering flow. Warm, vibrant colors. Photography-heavy.
      Ordering CTA is the dominant action on every page.
```

### 14.4 Home Services

```yaml
industry: home_services
sub_niches:
  hvac_plumbing:
    references:
      - name: Service Champions
        url: servicechampions.com
        extracts:
          trust: "guarantee badge — '100% Satisfaction or It's Free'"
          booking: "emergency service CTA, 24/7 phone number"
          social_proof: "review count + star rating in hero"
      - name: ARS Rescue Rooter
        url: ars.com
        extracts:
          hero: "immediate problem-solution — 'AC Broken? We're On Our Way'"
          services: "service category cards with pricing ranges"
          trust: "licensed, insured, bonded badges in footer"
      - name: Roto-Rooter
        url: rotorooter.com
        extracts:
          booking: "schedule online in 3 clicks"
          pricing: "upfront cost estimator tool"
          trust: "90+ years in business, national brand trust"
      - name: One Hour Heating & Air
        url: onehourheatandair.com
        extracts:
          brand: "'Always On Time... Or You Don't Pay A Dime' guarantee"
          booking: "time-slot selector with real-time availability"
          trust: "uniformed, background-checked technicians highlighted"
    designer_notes: |
      Compose: Service Champions' guarantee + ARS' problem-solution hero +
      Roto-Rooter's cost estimator + One Hour's punctuality promise.
      Bright blue + white. Bold CTAs. Trust badges in hero, not footer.
      Phone number is the most important element on the page.
```

### 14.5 Real Estate

```yaml
industry: real_estate
sub_niches:
  residential_brokerage:
    references:
      - name: Compass
        url: compass.com
        extracts:
          search: "map-first property search with filters"
          listings: "full-bleed property photography"
          agents: "agent profile cards with production stats"
      - name: Redfin
        url: redfin.com
        extracts:
          search: "neighborhood-level data — schools, walk score, transit"
          pricing: "1% listing fee prominently compared to industry"
          technology: "AI-powered home value estimator"
      - name: Zillow
        url: zillow.com
        extracts:
          hero: "search bar is the entire hero — no fluff"
          tools: "mortgage calculator, affordability estimator"
          trust: "Zestimate accuracy claims"
      - name: The Agency
        url: theagencyre.com
        extracts:
          brand: "luxury positioning — magazine-quality photography"
          listings: "video tours, drone footage, floor plans"
          agents: "global network, celebrity clientele positioning"
    designer_notes: |
      Compose: Compass' listing photography + Redfin's data depth +
      Zillow's search-first UX + The Agency's luxury brand.
      Black + white + gold accent. Geist or Inter typography.
      Search is the hero. Listings drive everything.
```

### 14.6 Auto Services

```yaml
industry: auto_services
sub_niches:
  repair_maintenance:
    references:
      - name: Firestone
        url: firestonecompleteautocare.com
        extracts:
          booking: "appointment scheduler with service selector"
          services: "tire visualizer — see tires on your car"
          pricing: "coupons and specials prominently featured"
      - name: Mavis
        url: mavis.com
        extracts:
          trust: "price-match guarantee"
          services: "service packages at transparent prices"
          booking: "schedule by service type + vehicle"
      - name: Caliber Collision
        url: caliber.com
        extracts:
          trust: "lifetime guarantee on all repairs"
          process: "repair journey — drop off to pick up, step by step"
          brand: "clean, modern — not a dirty garage aesthetic"
    designer_notes: |
      Compose: Firestone's visual tools + Mavis' pricing transparency +
      Caliber's lifetime guarantee. Dark premium surfaces like BMW template.
      Trust is everything — guarantees, warranties, certifications.
      Booking widget with vehicle selector is the primary CTA.
```

---

## 15. Service Sub-Types by Industry

Each VerbaFlow service has industry-specific sub-types that define what gets built.

### 15.1 `web-design` (The $400 Package)

```yaml
service: web-design
short_label: "Professional Business Website"
price: 400
one_time: true

sub_types:
  dental:
    pages: [Home, Services, About, Team, Testimonials, Contact/Booking]
    features:
      - "Online appointment request form"
      - "Insurance accepted list"
      - "New patient special offer banner"
      - "Before/after smile gallery"
      - "Google Maps embed with directions"
    integrations:
      - "Google Calendar scheduling link"
    sections:
      - "Insurance + financing badges in hero"
      - "Emergency care callout (if applicable)"
      - "Virtual consultation availability (if applicable)"
    tone: "Warm, approachable, professional. Not clinical."
    color_override: "#0891B2"

  legal:
    pages: [Home, Practice Areas, Attorneys, Case Results, Contact/Consultation]
    features:
      - "Free consultation request form"
      - "Practice area grid with descriptions"
      - "Attorney profile cards"
      - "Case result highlights (verdicts/settlements)"
    integrations:
      - "Calendly for consultations"
    sections:
      - "'No Fee Unless We Win' badge (if contingency)"
      - "Bar admissions display"
      - "24/7 availability messaging"
    tone: "Authoritative, serious, trustworthy. Not salesy."
    color_override: "#1e3a5f"

  restaurant:
    pages: [Home, Menu, Gallery, About, Location/Reservations]
    features:
      - "Digital menu (text or PDF)"
      - "Photo gallery (food + interior)"
      - "Reservation widget (OpenTable/Resy/Tock)"
      - "Hours of operation"
    integrations:
      - "Google Maps embed"
      - "Third-party ordering links (DoorDash, etc.)"
    sections:
      - "Dietary option indicators (V, GF, etc.)"
      - "Private events inquiry"
      - "Outdoor seating indicator"
    tone: "Appetizing, warm, inviting."
    color_override: "#DC2626"

  home_services:
    pages: [Home, Services, Service Areas, Reviews, Contact/Quote]
    features:
      - "Emergency service CTA (24/7 phone)"
      - "Service area map with zip codes"
      - "Online quote request form"
      - "Licensed/insured/bonded badges"
    integrations:
      - "Click-to-call phone link"
      - "Google Maps service area embed"
    sections:
      - "Satisfaction guarantee badge"
      - "Brands serviced list"
      - "Warranty information"
    tone: "Urgent, trustworthy, local. Not corporate."
    color_override: "#2563EB"

  real_estate:
    pages: [Home, Listings, About, Sold, Contact]
    features:
      - "Featured listings grid"
      - "Property search (if MLS integration possible)"
      - "Agent bio card"
      - "Market report download"
    integrations:
      - "IDX/MLS embed (if available)"
      - "Zillow/Redfin profile links"
    sections:
      - "Recent sales ticker"
      - "Neighborhood guide"
      - "Free home valuation CTA"
    tone: "Confident, data-driven, local expertise."
    color_override: "#0A2540"

  health_medical:
    pages: [Home, Services, Providers, New Patients, Contact]
    features:
      - "Services directory with descriptions"
      - "Provider profiles (photo, bio, specialties)"
      - "New patient forms (PDF)"
      - "Insurance networks accepted list"
    integrations:
      - "Patient portal link"
      - "Online scheduling (if available)"
    sections:
      - "Accepting new patients badge"
      - "Telehealth availability indicator"
      - "Hospital affiliations"
    tone: "Calm, professional, reassuring. Not sterile."
    color_override: "#059669"

  salon_beauty:
    pages: [Home, Services, Stylists, Gallery, Book]
    features:
      - "Service menu with prices"
      - "Stylist bios with specialties"
      - "Photo gallery (before/after)"
      - "Online booking widget"
    integrations:
      - "Vagaro / Booksy / Square booking embed"
    sections:
      - "Product lines carried"
      - "Walk-in policy"
      - "Gift cards"
    tone: "Stylish, warm, social. Instagram-ready aesthetic."
    color_override: "#DB2777"

  fitness_wellness:
    pages: [Home, Classes, Trainers, Membership, Contact]
    features:
      - "Class schedule grid"
      - "Trainer profiles"
      - "Membership tier comparison"
      - "Free trial pass form"
    integrations:
      - "MindBody / Glofox booking embed"
    sections:
      - "Facility tour photos/video"
      - "Member transformations (with permission)"
      - "Community / events calendar"
    tone: "Energetic, motivating, inclusive. Not intimidating."
    color_override: "#16A34A"
```

### 15.2 Upsell Services (Post-$400)

These are offered AFTER the client has their website. They are not part of the $400 deliverable.

| Service | Slug | Price Range | Trigger |
|---------|------|------------|---------|
| Local SEO Setup | `local-seo` | $200 | Offered with website delivery |
| Google Business Profile Optimization | `gbp-optimization` | $150 | If GBP data was provided |
| Domain + Email Setup | `domain-email` | $100 | If client has no domain |
| Booking Integration | `booking-integration` | $150 | If client uses scheduling |
| Custom Photography Sourcing | `photo-sourcing` | $100 | If no GBP photos available |
| Monthly Maintenance | `site-maintenance` | $50/mo | Retainer after launch |
| Content Writing (3 pages) | `content-writing` | $200 | If client needs copy help |

---

## 16. $400 Package Architecture

### 16.1 What the Client Gets

```
$400 = One professional business website, delivered as:

1. HTML wireframe (Stitch-generated, AI Studio polished)
2. Hosted on Supabase Storage with 90-day signed URL
3. Mobile-responsive single-page layout
4. Up to 5 pages: Home, Services, About, Testimonials, Contact
5. Real content from their questionnaire + GBP
6. Industry-appropriate design (colors, typography, trust signals)
7. Competitor-validated layout patterns
8. Professional email template with wireframe download link
```

### 16.2 What VerbaFlow Does

```
Per client:
- 0 min: Questionnaire auto-filled or GBP auto-scraped
- 0 min: Competitor inspiration resolved from curated table
- 0 min: Adaptive template selected from 54
- ~2 min: Architect agent generates plan (AI Studio, async)
- ~2 min: Designer agent generates wireframe (Stitch, async)
- 10-15 min: Human review + AI Studio polish
- ~1 min: Supabase upload + signed URL generation
- 0 min: Stripe payment link sent

Total human time per client: 10-15 minutes
Total AI time per client: ~5 minutes (async, parallelizable)
Gross margin at $400: ~$380+ (AI costs are cents, Supabase is scalable credit)
```

### 16.3 Payment Flow

```
1. Client fills questionnaire (self-service or guided)
2. Wireframe generated in background
3. Client receives: "Your website preview is ready — view it here"
4. Preview is watermarked or time-limited (48 hours)
5. Client clicks "Publish My Website" → Stripe Checkout
6. $400 one-time payment
7. Instant delivery: permanent signed URL
8. Upsell offer: domain, SEO, photography, maintenance
```

### 16.4 Stripe Integration

```yaml
stripe:
  product: "Business Website Package"
  price_id: "price_xxxx"  # $400 one-time
  mode: payment
  success_url: "/plan/{plan_id}/published"
  cancel_url: "/plan/{plan_id}/preview"
  metadata:
    plan_id: "{plan_id}"
    industry: "{industry}"
    package: "web-design"
```

Existing Stripe infrastructure from `src/app/api/webhooks/stripe/route.ts` handles fulfillment.

---

## 17. Skills Integration Map

### 17.1 Skills Used Per Stage

| Stage | Skills | Purpose |
|-------|--------|---------|
| 0: Competitor Mining | None (curated table) | Static YAML lookup, no LLM needed |
| 0.5: Template Selection | `popular-web-designs`, `find-skills` | Load template tokens, map niche to template |
| 1: Questionnaire | `growth-plan-workflow` (existing) | Wizard component, GBP autocomplete |
| 2: Profile Extraction | None (deterministic) | JavaScript mapping function |
| 3: Architect | AI Studio (gemini-2-5-pro) | Generate plan + architecture.json |
| 4: Designer Prompt | `verbaflow-design-system`, `popular-web-designs`, `design-md` | Token loading, palette selection, spec validation |
| 5: Stitch | `stitch` (MCP tool) | Wireframe generation |
| 6: Human Review | None (manual) | 15-minute checklist |
| 7: Deploy | `stripe-payments`, `external-service-integration` | Supabase upload, Stripe checkout, Resend email |

### 17.2 Creative Skills (Optional Enhancements)

Not part of the $400 baseline. Offered as premium upsells:

| Skill | Upsell Use | Price |
|-------|-----------|-------|
| `pixel-art` | Custom 8-bit mascot for brand personality | +$50 |
| `p5js` | Interactive hero background animation | +$100 |
| `baoyu-infographic` | Service process infographic | +$75 |
| `humanizer` | AI-stripped, natural-sounding copy rewrite | +$50 |
| `manim-video` | Animated logo reveal or explainer video | +$200 |
| `comfyui` | AI-generated brand imagery | +$100 |

---

## 18. Pitfalls

### 18.1 Perspective Leak

| Symptom | Cause | Fix |
|---------|-------|-----|
| Wireframe shows "web design" as a service | VerbaFlow service slug leaked into prompt | Use `client_business_profile.services` not `recommended_service_slugs` |
| CTA says "Get my growth plan" | Designer prompt used Mode B template for Mode A | Mode flag must be set before prompt construction |
| Calendly link on client site | VerbaFlow's Calendly in prompt | Replace with client's own booking link or generic "Book Now" CTA |
| "We" references VerbaFlow | Architect agent defaults to agency voice | Hard constraint: "we" = client business, not VerbaFlow |

### 18.2 Competitor Mining

| Symptom | Cause | Fix |
|---------|-------|-----|
| All reference sites look the same | Pulled from same category | Ensure 3+ sources from different sub-niches or brands |
| Wireframe looks like a Zocdoc clone | Single source dominates | Superset rule enforcement: max 35% from any source |
| Reference sites are outdated | Table not maintained | Review competitor table quarterly |
| Client provides bad references | Client taste doesn't match niche conventions | Client gets 50% weight; curated table covers the rest |

### 18.3 Template Selection

| Symptom | Cause | Fix |
|---------|-------|-----|
| Template doesn't fit the niche | Wrong niche-to-template mapping | Update curated mapping in Section 13 |
| Template tokens don't render in Stitch | Stitch doesn't support all CSS properties | Use only CSS custom properties and standard CSS from template |
| Font fails to load | CDN font unavailable in Stitch sandbox | Use font substitution reference from `popular-web-designs` skill |
| Override produces clashing colors | Manual override broke color harmony | Validate WCAG contrast after overrides using `design-md` lint |

### 18.4 Questionnaire

| Symptom | Cause | Fix |
|---------|-------|-----|
| Client abandons wizard | Too many industry-specific questions | Keep optional — all fields can be skipped, GBP fills gaps |
| GBP produces generic content | GBP fields are sparse for this business | Fallback to questionnaire fields; GBP is an enrichment, not a requirement |
| Wrong services listed | Client selected wrong checkboxes | Human review catches this in 15-minute polish step |

### 18.5 Pipeline

| Symptom | Cause | Fix |
|---------|-------|-----|
| Architect produces generic plan | No competitor or template context passed | Ensure `competitor_inspiration` and `template_config` are in architect inputs |
| Designer prompt exceeds Stitch limits | Prompt too long with all blocks | Truncate competitor descriptions to extracted elements only; full rationale stays in architecture.json |
| Stitch returns error | Invalid prompt format or API key issue | Fallback to AI Studio for HTML generation using same prompt |

---

## 19. Future Extensions

### 19.1 Multi-Page Website Package ($800)

Same pipeline, but generates 5+ separate pages via multiple Stitch calls. Architect outputs per-page designer briefs.

### 19.2 Industry Verticals as Products

Package the entire pipeline for a specific industry as a standalone product:
- "Dental Website Pro"
- "Legal Firm Digital"
- "Restaurant Online"

Each vertical gets a pre-built questionnaire, pre-curated competitor table, and pre-selected template. Zero customization per client means zero architect cost. The designer prompt is templated with client-specific fields only.

### 19.3 Competitor Table Automation

A cron job that:
1. Scrapes the top 5 Google results for "{niche} website design inspiration"
2. Extracts named elements (layout, hero, CTA, trust)
3. Updates the curated table
4. Flags entries older than 6 months for review

### 19.4 AI Studio Full Build

Replace Stitch with AI Studio for complete HTML generation. Stage 5 becomes:
1. AI Studio prompt with full DESIGN.md injection
2. Gemini generates complete, production-ready HTML with inline CSS
3. Human review validates output
4. Deploy unchanged

This removes the Stitch dependency entirely for clients who don't need visual wireframes and want production-ready code.

### 19.5 Client Portal

After purchase, clients get:
- `/my-site/{plan_id}` portal
- Request changes (text, photos, hours)
- View analytics placeholder
- Upgrade to higher packages
- Referral discount codes

---

## Appendix A: File Locations

| File | Purpose |
|------|---------|
| `verbaflow_lake/business-first-prompt-architecture.md` | This document |
| `verbaflow_lake/adaptive-design-engine.md` | Adaptive template selection reference |
| `verbaflow_lake/tools-and-skills-reference.md` | Full skills catalog |
| `docs/spatial-bento-wireframe-pipeline-execution-handoff.md` | Existing pipeline implementation handoff |
| `.hermes/agents/architect-agent/SOUL.md` | Architect agent (needs update for Mode A) |
| `.hermes/agents/designer-agent/SOUL.md` | Designer agent (needs update for Mode A) |
| `.hermes/pipelines/cybergrowth-wireframe.yaml` | Pipeline YAML (needs mode parameter) |
| `src/components/GrowthPlanWizard.tsx` | Questionnaire component (needs industry fields) |
| `src/data/industries.ts` | Industry definitions |
| `src/data/services.ts` | Service definitions (needs sub_types) |
| `~/.hermes/skills/verbaflow-design-system/SKILL.md` | Internal design matrices |
| `~/.hermes/skills/creative/popular-web-designs/SKILL.md` | 54 external design templates |
| `~/.hermes/skills/creative/design-md/SKILL.md` | DESIGN.md spec format |
| `~/.hermes/skills/devops/growth-plan-workflow/SKILL.md` | Growth plan workflow skill |
| `docs/stitch-get-screen-sample.json` | Stitch API response reference |

## Appendix B: Glossary

| Term | Definition |
|------|-----------|
| **Mode A** | Client business website ($400 product) |
| **Mode B** | Growth plan wireframe (lead magnet) |
| **Mode C** | Agency vertical landing page (marketing) |
| **Competitor DNA** | X-axis of superset model — validated patterns from niche reference sites |
| **Adaptive Template** | Y-axis of superset model — proven design system from 54 popular-web-designs |
| **Perspective Leak** | When VerbaFlow service language appears in client's website wireframe |
| **Superset Rule** | No single reference source exceeds 35% influence on the final design |
| **Variance Injection** | 10% influence from a second template to prevent generic output |
| **Level 1-4 Depth** | Competitor discovery depth: Industry → Sub-Niche → Micro-Niche → Hyper-Local |
| **client_business_profile** | Normalized JSON of client's actual business — name, services, location, hours |
| **competitor_inspiration** | JSON block mapping 3-5 reference sites to specific extracted elements |
| **template_config** | JSON block specifying base template + overrides + variance source |
