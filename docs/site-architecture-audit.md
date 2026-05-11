# VerbaFlow 2.0 — Site Architecture Audit

**Date:** 2025-01-10  
**Project:** vflow2.0 (VerbaFlow LLC Company Website)  
**Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Sanity CMS, Prisma, GSAP, Spline 3D

---

## 1. Route Map (Next.js App Router)

### Public Routes

| Route | File | Type | Description |
|-------|------|------|-------------|
| `/` | `page.tsx` | SSR | Home — Hero, Services, CommandCentre, BusinessInfo, AITools, Pricing, Testimonials, FAQ, Contact, Footer |
| `/about` | `about/page.tsx` | Static | About Us page (minimal content) |
| `/services` | `services/page.tsx` | Client | Service listing with Sanity fetch |
| `/services/[slug]` | `services/[slug]/page.tsx` | SSR (Dynamic) | Individual service detail — supports Sanity + static fallback |
| `/agency` | `agency/page.tsx` | Client | Prototype showcase with 4 wireframe variants |
| `/growth-plan` | `growth-plan/page.tsx` | Static | $19 Growth Plan wizard landing |
| `/virtual-office` | `virtual-office/page.tsx` | Static | Virtual Office experience page |
| `/blog` | `blog/page.tsx` | Client | Blog listing with category filters |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | SSR (Dynamic) | Individual blog post |
| `/blog/faq` | `blog/faq/page.tsx` | Static | Blog FAQ page |
| `/blog/setup` | `blog/setup/page.tsx` | Static | Blog setup guide |
| `/blog/portfolio` | `blog/portfolio/page.tsx` | Static | Portfolio showcase |
| `/blog/debug` | `blog/debug/page.tsx` | Static | Blog debugging tool |

### Admin & Tools

| Route | File | Type | Description |
|-------|------|------|-------------|
| `/studio/[[...tool]]` | `studio/[[...tool]]/page.tsx` | Static | Sanity Studio embedded |
| `/admin/invoice/[userId]` | `admin/invoice/[userId]/page.tsx` | SSR (Dynamic) | Invoice viewer by user |

### API Routes

| Route | File | Purpose |
|-------|------|---------|
| `/api/chat` | `api/chat/route.ts` | AI chat endpoint |
| `/api/generate-strategy` | `api/generate-strategy/route.ts` | Strategy generation |
| `/api/checkout` | `api/checkout/route.ts` | Stripe checkout |
| `/api/checkout-growth-plan` | `api/checkout-growth-plan/route.ts` | Growth plan checkout |
| `/api/request-quote` | `api/request-quote/route.ts` | Quote request |
| `/api/send-quote` | `api/send-quote/route.ts` | Quote delivery |
| `/api/webhooks/stripe` | `api/webhooks/stripe/route.ts` | Stripe webhooks |

### Server Actions

| Path | Purpose |
|------|---------|
| `actions/payment.ts` | Payment processing |
| `actions/submitContact.ts` | Contact form submission |
| `actions/user.ts` | User management |

---

## 2. Component Inventory

### Core Sections (Home Page)

| Component | Path | Purpose | Data Source |
|-----------|------|---------|-------------|
| `HeroSection` | `components/HeroSection.tsx` | Video background hero with CTAs | Static |
| `ServicesSection` | `components/ServicesSection.tsx` | DNA helix service visualization | Sanity + Static fallback |
| `CommandCentre` | `components/CommandCentre/CommandCentre.tsx` | DNA helix metric dashboard | Static (GSAP animated) |
| `BusinessInfoSection` | `components/BusinessInfoSection.tsx` | Company info | Static |
| `AIToolsSection` | `components/AIToolsSection.tsx` | AI capabilities showcase | Static |
| `PricingSection` | `components/PricingSection.tsx` | Pricing tiers | Static |
| `TestimonialsSection` | `components/TestimonialsSection.tsx` | Client testimonials | Sanity |
| `FAQSection` | `components/FAQSection.tsx` | FAQ accordion | Sanity |
| `ContactSection` | `components/ContactSection.tsx` | Contact form | Static |
| `Footer` | `components/Footer.tsx` | Site footer | Static |
| `Navigation` | `components/Navigation.tsx` | Site navigation | Static |

### Feature Components

| Component | Path | Purpose |
|-----------|------|---------|
| `ChatWidget` | `components/ChatWidget.tsx` | AI chat floating widget |
| `QuoteOverlay` | `components/QuoteOverlay.tsx` | Quote request modal |
| `ThemeToggle` | `components/ThemeToggle.tsx` | Dark/light mode toggle |
| `SplineHelix` | `components/SplineHelix.tsx` | 3D Spline viewer (placeholder) |
| `GrowthPlanWizard` | `components/GrowthPlanWizard.tsx` | Growth plan form wizard |
| `VirtualOffice` | `components/VirtualOffice.tsx` | Virtual office experience |
| `VapiContext` | `components/VapiContext.tsx` | VAPI voice AI provider |
| `LocationContext` | `components/LocationContext.tsx` | User location context |

### CommandCentre Sub-components

| Component | Path | Purpose |
|-----------|------|---------|
| `CommandCentre` | `CommandCentre/CommandCentre.tsx` | Main container (GSAP) |
| `HelixBackbone` | `CommandCentre/HelixBackbone.tsx` | SVG DNA helix background |
| `MetricCard` | `CommandCentre/MetricCard.tsx` | Metric display cards |
| `ActionButton` | `CommandCentre/ActionButton.tsx` | Card action buttons |
| `types.ts` | `CommandCentre/types.ts` | TypeScript types |

### Agency Prototypes

| Component | Path | Purpose |
|-----------|------|---------|
| `ProtoFrame` | `agency-prototypes/ProtoFrame.tsx` | Prototype wrapper |
| `ProtoNav` | `agency-prototypes/ProtoNav.tsx` | Prototype navigation |
| `registry.ts` | `agency-prototypes/registry.ts` | Prototype registry |
| `proto-01-wireframe-main` | `agency-prototypes/proto-01-wireframe-main/` | Wireframe main layout |
| `proto-02-split-screen` | `agency-prototypes/proto-02-split-screen/` | Split-screen layout |
| `proto-03-wireframe-v1` | `agency-prototypes/proto-03-wireframe-v1/` | Wireframe v1 |
| `proto-04-wireframe-v2` | `agency-prototypes/proto-04-wireframe-v2/` | Wireframe v2 |

### Agency Components

| Component | Path | Purpose |
|-----------|------|---------|
| `AgencySplitLayout` | `agency/AgencySplitLayout.tsx` | Split layout container |
| `AgencyLeftPanel` | `agency/AgencyLeftPanel.tsx` | Left panel content |
| `AgencyRightPanel` | `agency/AgencyRightPanel.tsx` | Right panel content |
| `AgencyProjectsStrip` | `agency/AgencyProjectsStrip.tsx` | Projects horizontal scroll |
| `ProjectFrame` | `agency/ProjectFrame.tsx` | Project card frame |
| `DomainToggle` | `agency/DomainToggle.tsx` | Domain selector toggle |
| `ThreeAgencyBackground` | `agency/ThreeAgencyBackground.tsx` | 3D background |
| `IPadMock` | `agency/mocks/IPadMock.tsx` | iPad device mock |
| `IPhoneMock` | `agency/mocks/IPhoneMock.tsx` | iPhone device mock |
| `SaaSBrowserMock` | `agency/mocks/SaaSBrowserMock.tsx` | Browser mock |
| `FinanceCharts` | `agency/infographics/FinanceCharts.tsx` | Finance data viz |
| `HealthcareCharts` | `agency/infographics/HealthcareCharts.tsx` | Healthcare data viz |
| `PlatformCharts` | `agency/infographics/PlatformCharts.tsx` | Platform data viz |

### Payment Components

| Component | Path | Purpose |
|-----------|------|---------|
| `ComplianceModal` | `payment/ComplianceModal.tsx` | Compliance info modal |

---

## 3. Spline 3D Integration

### Status: ⚠️ PLACEHOLDER CONFIGURED

**Package:** `@splinetool/react-spline@^4.1.0` + `@splinetool/runtime@^1.12.70`

**Usage Location:** `src/components/SplineHelix.tsx`

**Current State:**
- Component accepts `sceneUrl` prop with placeholder fallback
- Placeholder URL: `https://prod.spline.design/your-unique-id/scene.splinecode`
- When placeholder detected, shows styled "3D Component Ready" message

**Action Required:**
Replace placeholder URL with actual Spline scene URL in `ServicesSection.tsx` or where `SplineHelix` is used.

```tsx
// Current (placeholder)
<SplineHelix sceneUrl="https://prod.spline.design/your-unique-id/scene.splinecode" />

// Required (actual scene)
<SplineHelix sceneUrl="https://prod.spline.design/YOUR-ACTUAL-ID/scene.splinecode" />
```

---

## 4. GSAP Animation Integration

### Status: ✅ ACTIVE

**Package:** `gsap@^3.14.2` + `@gsap/react@^2.1.2`

**Usage Locations:**

| File | GSAP Features | Purpose |
|------|---------------|---------|
| `CommandCentre/CommandCentre.tsx` | `useGSAP`, `ScrollTrigger`, `timeline` | Card slide-in animations on scroll |
| `CommandCentre/HelixBackbone.tsx` | GSAP (implied) | Helix SVG animations |

**Implementation Pattern:**
```tsx
// From CommandCentre.tsx
gsap.registerPlugin(ScrollTrigger)

useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top center',
      once: true,
    },
  })
  tl.from(leftCards, { x: -40, opacity: 0, duration: 0.5, stagger: 0.15 })
  tl.from(rightCards, { x: 40, opacity: 0, duration: 0.5, stagger: 0.15 }, 0.1)
}, { scope: containerRef })
```

**Notes:**
- Respects `prefers-reduced-motion` media query
- Cards animate from left/right based on `data-gsap` attribute
- Supports reduced motion preference for accessibility

---

## 5. Missing Pages & Recommendations

### Missing Standard Pages

| Page | Priority | Notes |
|------|----------|-------|
| `/case-studies` | Medium | Show real client work — currently only has `/blog/portfolio` |
| `/team` | Low | Team/member page — About is minimal |
| `/careers` | Low | Hiring page — currently only Hiring Agents service |
| `/privacy` | Medium | Privacy policy — needed for compliance |
| `/terms` | Medium | Terms of service — needed for compliance |
| `/sitemap.xml` | Low | Auto-generated via Next.js |
| `/robots.txt` | Low | SEO standard |

### Missing Service Detail Pages

The following slugs exist in `services.ts` but have minimal dedicated content:

| Slug | Status | Notes |
|------|--------|-------|
| `ai-automation` | ✅ | Full detail via Sanity or fallback |
| `software-development` | ✅ | Full detail via Sanity or fallback |
| `mobile-apps` | ✅ | Full detail via Sanity or fallback |
| `compliance` | ✅ | Full detail via Sanity or fallback |
| `insurance-agents` | ✅ | Full detail via Sanity or fallback |
| `digital-marketing` | ✅ | Full detail via Sanity or fallback |
| `hiring-agents` | ✅ | Full detail via Sanity or fallback |
| `ecommerce` | ✅ | Full detail via Sanity or fallback |
| `ai-architecture` | ✅ | Full detail via Sanity or fallback |
| `website-development` | ✅ | Full detail via Sanity or fallback |
| `cloud-solutions` | ✅ | Full detail via Sanity or fallback |

All services have static fallback data in `src/data/services.ts` with full descriptions, features, benefits, process steps, and FAQ.

---

## 6. Data Architecture

### Sanity CMS Schemas

| Schema | Path | Purpose |
|--------|------|---------|
| `serviceType` | `sanity/schemaTypes/serviceType.ts` | Services content |
| `blogType` | `sanity/schemaTypes/blogType.ts` | Blog posts |
| `testimonialType` | `sanity/schemaTypes/testimonialType.ts` | Testimonials |
| `faqType` | `sanity/schemaTypes/faqType.ts` | FAQ items |
| `authorType` | `sanity/schemaTypes/authorType.ts` | Blog authors |
| `categoryType` | `sanity/schemaTypes/categoryType.ts` | Blog categories |
| `contactType` | `sanity/schemaTypes/contactType.ts` | Contact submissions |
| `chatLogType` | `sanity/schemaTypes/chatLogType.ts` | Chat logs |
| `systemContextType` | `sanity/schemaTypes/systemContextType.ts` | System context |
| `postType` | `sanity/schemaTypes/postType.ts` | Posts (legacy) |
| `blockContentType` | `sanity/schemaTypes/blockContentType.ts` | Rich text |

### Static Data Files

| File | Purpose |
|------|---------|
| `src/data/services.ts` | 11 service definitions with full metadata |
| `src/data/agencyDomains.ts` | Agency domain configurations |
| `src/data/agencyProjects.ts` | Agency project data |
| `src/data/industries.ts` | Industry definitions |

---

## 7. Key Dependencies

```json
{
  "next": "15.5.9",
  "react": "19.1.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@splinetool/react-spline": "^4.1.0",
  "@splinetool/runtime": "^1.12.70",
  "gsap": "^3.14.2",
  "@gsap/react": "^2.1.2",
  "framer-motion": "^12.23.24",
  "@sanity/client": "^7.11.2",
  "next-sanity": "^11.1.1",
  "@prisma/client": "^7.0.1",
  "@stripe/react-stripe-js": "^5.4.1",
  "@supabase/supabase-js": "^2.89.0",
  "@vapi-ai/web": "^2.5.1",
  "@react-three/fiber": "^9.5.0",
  "@react-three/drei": "^10.7.7",
  "three": "^0.183.2"
}
```

---

## 8. Summary

### Strengths
- ✅ Comprehensive service catalog (11 services)
- ✅ Dual data source (Sanity CMS + static fallback)
- ✅ GSAP animations with accessibility support
- ✅ Full-featured blog with category filtering
- ✅ Stripe payment integration
- ✅ AI chat widget
- ✅ Agency prototype showcase

### Action Items
1. **HIGH:** Replace Spline placeholder URL with actual scene
2. **MEDIUM:** Create `/privacy` and `/terms` pages
3. **MEDIUM:** Consider adding `/case-studies` page
4. **LOW:** Expand `/about` page content
5. **LOW:** Add `/careers` page if hiring publicly

### File Stats
- **Routes:** 20+ pages
- **Components:** 50+ components
- **API Routes:** 7 endpoints
- **Services:** 11 defined
- **CMS Schemas:** 11 types
