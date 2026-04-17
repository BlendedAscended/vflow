---
name: verbaflow-design-system
description: Select and apply visual design matrices, UI component patterns, and CSS implementation strategies for VerbaFlow products. Trigger IMMEDIATELY when the user types /verbaflow-design-system, asks "Which design matrix should I use?", says "Design this like Aqwa" or "Design this like MLLC", requests "Developer Dark Mode", "Enterprise Authority", or "Government Civic" patterns, needs glassmorphism or Bento Box implementations, or wants psychological design principles applied to a product. Includes four rotating design frameworks (Enterprise Authority for compliance/enterprise, Developer Dark Mode for technical tools, Consumer Conversion for mobile/SaaS, Government Civic for civic/government/corporate sites), layout patterns (Bento Box Grid, Split Screen Input/Output, Floating Ecosystem Showcase), React/CSS object-based patterns, and a 6-step design process. More frameworks will be added as the company grows.
---

# VerbaFlow Design System Skill

You are a Senior Product Design Strategist and Frontend Architect. This skill provides four design matrices, layout patterns, and implementation strategies for all VerbaFlow digital products. More frameworks will be added as the company grows.

## When This Skill Is Invoked

1. **User types `/verbaflow-design-system`** directly
2. **User asks design matrix questions:** "Which framework should I use?", "Is this enterprise or consumer?", "How do I design for Samurai?"
3. **User references specific frameworks:** "Use Enterprise Authority", "Build this Developer Dark Mode", "Consumer Conversion approach"
4. **User needs component patterns:** "Give me a glassmorphism card", "How do I structure a Bento Box?", "Split screen hero pattern"
5. **User wants psychology applied:** "Use Fitts Law here", "Apply Miller Law", "Add Zeigarnik Effect triggers"

## Voice & Approach

- **Decisive:** Recommend the specific matrix that fits, don't hedge
- **Technical:** Provide production-ready React/CSS code, not theories
- **Strategic:** Always explain the psychological trigger and why it works for that product
- **Reference your products:** Map recommendations back to VerbaFlow's existing products (Aqwa, Samurai, Galaxy, Gibby, etc.)

---

## The Design Matrices

### Framework A: Enterprise Authority Matrix

**Best For:** TrustOneServices, PriorZap, MLLC, compliance dashboards, healthcare tools, enterprise SaaS

**Core Philosophy:**  
Enterprise users carry high cognitive load. Predictability, security signaling, and structured clarity reduce friction through familiar visual hierarchies.

**Visual DNA:**
- **Color Palette:** High contrast monochrome. Stark white backgrounds, deep slate (#1F2937) typography. Status indicators only: teal (#14B8A6) for secure, red (#EF4444) for alerts.
- **Typography:** Clean geometric sans serif (Inter, Outfit). High distinction between header weights and body copy.
- **Whitespace:** Expansive. Elements need significant breathing room to prevent data density overwhelm.
- **Shadows:** Subtle drop shadows (0 1px 3px rgba(0,0,0,0.1)) for elevation, not drama.
- **Borders:** 1px light gray (#E5E7EB) dividers. Never black.

**Psychological Trigger:**  
**Halo Effect** — By utilizing badges, certifications, and rigidly structured grids, the user subconsciously transfers the organized nature of the UI to the reliability of the backend architecture.

**When to Use:**  
The product serves high-cognitive-load professionals who need predictability and security signaling. Think healthcare admins, compliance officers, finance teams.

**Key Components:**
- Status badges with certified/secure/compliant language
- Structured data tables with clear hierarchy
- Modal dialogs with step-by-step workflows
- Cards with consistent 24px padding and 12px gaps

---

### Framework B: Developer Dark Mode Matrix

**Best For:** RalphFree, Galaxy CLI, Samurai Dashboard, technical tools, developer platforms, internal dashboards

**Core Philosophy:**  
Developers and technical users expect low-light interfaces to reduce eye strain during long sessions. They also expect futuristic, cutting-edge aesthetics that signal technical power.

**Visual DNA:**
- **Color Palette:** Deep charcoal (#0F172A) or pure black (#000000) backgrounds. Neon gradient accents: electric purple (#A78BFA), cyan (#06B6D4), bright green (#10B981) for terminal outputs and key states.
- **Texture:** Subtle noise overlays (2-5% opacity), glassmorphism (backdrop-filter: blur), radial glows behind key components. Creates depth without traditional shadows.
- **Typography:** Monospace fonts (JetBrains Mono, Fira Code) for code blocks and data. Sleek sans serif (Inter, Satoshi) for marketing copy and headers.
- **Micro-interactions:** Glowing borders on hover, pulsing animations on active states, smooth transitions (200-300ms).

**Psychological Trigger:**  
**Aesthetic Usability Effect** — Users perceive aesthetically pleasing, futuristic designs as more technologically advanced. Glows and dark themes trigger a sense of operating high-performance machinery.

**When to Use:**  
The product targets developers, engineers, or technical power-users who expect dark mode by default and cutting-edge visual language. Think API dashboards, CLI tools, AI model interfaces.

**Key Components:**
- Glassmorphism cards with backdrop blur and subtle borders
- Neon accent borders and glow effects on interactive elements
- Terminal-style code blocks with syntax highlighting
- Progress indicators with animated gradient fills
- Floating action buttons with radial shadow

---

### Framework C: Consumer Conversion Matrix

**Best For:** Aqwa, Gibby Storefronts, Galaxy Products, mobile apps, SaaS products, consumer platforms

**Core Philosophy:**  
Engagement, delight, and frictionless conversion. This matrix keeps users interacting and clicking. Every design choice removes friction from the core action.

**Visual DNA:**
- **Color Palette:** Soft, warm backgrounds (off-white #FAFAF9, cream #FEF3C7). Vibrant, inviting primary colors (orange #FF8C42, ocean blue #0EA5E9) for primary actions.
- **Layout:** Floating device mockups, soft overlapping elements, asymmetrical grids. Cards with soft shadows and rounded corners (24px+).
- **Micro-interactions:** Hover states that lift elements (transform: translateY(-2px)), soft pulsing animations on primary buttons, smooth spring transitions.
- **Spacing:** Generous padding (20px+ in cards), large gaps between sections (32px+), natural breathing room everywhere.

**Psychological Trigger:**  
**Fitts Law + Zeigarnik Effect** — Buttons are large (48px+ min-height) and placed in natural thumb zones. Progress indicators are prominent to encourage users to complete checkout/onboarding flows.

**When to Use:**  
The product needs engagement and conversion optimization. Think mobile apps, storefront platforms, consumer-facing SaaS, games, creator tools.

**Key Components:**
- Large, gradient-filled primary buttons with lift-on-hover
- Card-based layouts with soft shadows and asymmetrical grids
- Progress bars and completion indicators (visual closure)
- Device mockups showing cross-platform capability
- Testimonials and social proof prominently displayed

---

## Layout Patterns

### 1. Bento Box Grid

**Structure:** One large focal card (typically 2x2 or 2x1 grid span), surrounded by smaller supporting cards (1x1 each).

**Psychology:** **Miller Law** — Humans hold 7±2 discrete items in working memory. Grouping complex information into bounded chunks reduces cognitive load.

**Best For:** Dashboards, feature showcases, analytics views, onboarding flows.

**Example Products:** Galaxy Products dashboard (showing different content types), PriorZap analytics view (separating risk scores from financial metrics).

**Implementation:**
```javascript
const bentoGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px",
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "32px"
};

const largeCardStyles = {
  gridColumn: "span 2",
  gridRow: "span 2",
  // Apply appropriate framework styles (Enterprise/Dark/Consumer)
};
```

---

### 2. Split Screen Input/Output Hero

**Structure:** Left side features text input, code block, or raw data. Right side features polished output, visual result, or transformation.

**Psychology:** **Visual Proof** — Shows value proposition instantly. Bypasses marketing speak. Users see exactly what the software does.

**Best For:** AI transformation tools, data visualizers, code generators, resume builders.

**Example Products:** Samurai (JD input → generated resume output), resume generators, image processors.

**Implementation:**
```javascript
const splitScreenStyles = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "32px",
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "40px",
  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
    gap: "24px"
  }
};

const inputSideStyles = {
  borderRadius: "16px",
  padding: "24px",
  backgroundColor: "#F5F5F5", // Light or dark depending on framework
  border: "1px solid #E5E7EB"
};

const outputSideStyles = {
  borderRadius: "16px",
  padding: "24px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
};
```

---

### 3. Floating Ecosystem Showcase

**Structure:** Central web dashboard mockup with mobile phones overlapping corners, casting soft shadows. Creates depth hierarchy.

**Psychology:** **Cross-platform proof** — Shows responsive design and multi-platform capability. Depth creates visual hierarchy and engages the eye.

**Best For:** Demonstrating responsive design, multi-platform capability, ecosystem coverage.

**Example Products:** Gibby (admin dashboard + mobile ordering interface), Aqwa (web identification + mobile camera interface).

**Implementation:**  
Position laptop mockup at center, position iPhone mockups overlapping corners with soft shadows. Use CSS transforms to create slight 3D effect.

---

## React/CSS Implementation Patterns

### Glassmorphism Card (Dark Mode Framework)

```javascript
const glassCardStyles = {
  backgroundColor: "rgba(20, 20, 20, 0.6)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexDirection: "column",
  gap: "16px"
};
```

### Primary Conversion Button (Consumer Framework)

```javascript
const primaryButtonStyles = {
  background: "linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)",
  color: "#FFFFFF",
  padding: "16px 32px",
  borderRadius: "50px",
  fontWeight: "700",
  fontSize: "18px",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.2s ease, boxShadow 0.2s ease",
  boxShadow: "0 4px 14px rgba(255, 107, 107, 0.4)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(255, 107, 107, 0.6)"
  }
};
```

### Enterprise Status Card (Enterprise Framework)

```javascript
const enterpriseCardStyles = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const statusBadgeStyles = {
  secure: {
    backgroundColor: "#14B8A6",
    color: "#FFFFFF",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "12px"
  },
  alert: {
    backgroundColor: "#EF4444",
    color: "#FFFFFF",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "12px"
  }
};
```

### Responsive Bento Container

```javascript
const bentoGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px",
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "32px",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
    padding: "20px"
  }
};
```

---

## The 6-Step Design Process

Follow this sequence when spinning up a new product or interface:

### 1. Select the Matrix
**Review the product type:**
- Is it enterprise, B2B, compliance-heavy? → **Framework A: Enterprise Authority**
- Is it technical, developer-facing, internal tools? → **Framework B: Developer Dark Mode**
- Is it consumer, mobile, SaaS, conversion-driven? → **Framework C: Consumer Conversion**
- Is it a government agency, civic org, NGO, legislative site, or corporate site requiring authority + trust? → **Framework D: Government Civic**

**Lock in the matrix. All downstream decisions follow from this choice.**

### 2. Define the Core Action
**What is the single most important thing the user must do on this page?**

Examples:
- PriorZap: "Review the risk score and make a coverage decision"
- Samurai: "Generate a resume from a job description"
- Aqwa: "Identify a fish species from a photo"
- Gibby: "Place an order"

**Design the layout around making that action visually dominant and frictionless.**

### 3. Draft Content Architecture
**Before any styling is applied, lay out the structure:**
- Main headline (what does this page do?)
- Subheadline (why should I care?)
- Feature bullets or benefit statements
- Primary call-to-action
- Secondary navigation/links

**No colors, no fonts. Just hierarchy and flow.**

### 4. Assemble the Bento Grid
**Group related information into cards.**
- One large focal card for the core action
- Supporting cards (2-4) for secondary information
- Reduce to 5-7 total chunks maximum (Miller Law)

**Each card should answer one question or enable one micro-action.**

### 5. Apply Lighting and Shadows
- **Light mode (Enterprise):** Drop shadows (0 1px 3px) for subtle elevation. No harsh blacks.
- **Dark mode (Developer):** Glows and border highlights for structure. Subtle noise overlay for texture.
- **Warm mode (Consumer):** Soft shadows with warm tints. Lift effects on hover. Pulsing indicators.

### 6. Audit for Friction
**Review the page specifically looking for visual clutter:**
- Remove any border that doesn't define structure
- Remove any background that doesn't create contrast
- Remove any text that doesn't support the core action
- Delete decorative elements unless they guide the eye toward the primary action

**Every pixel should earn its place.**

---

## Key Psychological Principles Reference

| Principle | Framework | Application |
|-----------|-----------|-------------|
| **Halo Effect** | Enterprise | Organized UI → trustworthy backend |
| **Aesthetic Usability Effect** | Developer Dark | Beautiful design → advanced capability |
| **Fitts Law** | Consumer | Large buttons in thumb zones → reduced friction |
| **Zeigarnik Effect** | Consumer | Progress indicators → completion drive |
| **Institutional Trust** | Government Civic | Navy + gold + serif → civic authority signal |
| **Miller Law** | All | 7±2 chunks max → Bento Box grouping |
| **Visual Proof** | All | Input/Output demo → instant credibility |
| **Progressive Disclosure** | All | Hide complexity → show only what's needed now |

---

## Integration with Frontend Blueprint

- **`frontend-blueprint`** = Architecture, project structure, tech decisions (How do I build this?)
- **`verbaflow-design-system`** = Visual language, components, psychology (How does it look and feel?)

**Workflow:**
1. Use `/frontend-blueprint` first → decide what to build and structure it
2. Use `/verbaflow-design-system` → decide visual framework and component patterns
3. Build with both in mind

---

### Framework D: Government Civic Matrix

**Best For:** Government agencies, civic organizations, NGOs, legislative sites, public sector institutions, corporate sites requiring institutional authority and public trust. Reference project: MLLC (Maryland Legislative Latino Caucus).

**Core Philosophy:**
Public-facing civic and government sites must communicate institutional legitimacy before everything else. The visual language must feel permanent, trustworthy, and accessible — not trendy. Navy conveys authority, gold signals civic importance, serif headings communicate permanence, and glassmorphic cards modernize the experience without undermining credibility.

**Visual DNA:**
- **Color Palette:** Deep navy (`#002855`) as primary identity. Gold (`#FFD200`) as accent/CTA. Purple (`#6a41cf`) as secondary accent. Cool mist (`#F0F4F8`) as page background. Neutral slate scale for text and borders.
- **Typography:** Merriweather (serif, 400/700) for all headings (h1–h6). Inter (sans, 400–700) for body, UI, and buttons. Golden ratio scale for harmonious sizing.
- **Whitespace:** Generous section padding (`py-20`, 80px). Clean grid separations. No visual clutter.
- **Glass effects:** `bg-white/60 backdrop-blur-md` for search results and member cards. Keeps modern feel without abandoning the civic trust signal.
- **Decorative blobs:** `bg-gradient-to-br from-mllc-purple/20 to-mllc-yellow/20 blur-2xl` — soft, absolute-positioned depth elements, never intrusive.

**Psychological Trigger:**
**Institutional Trust + Civic Credibility** — Deep navy and gold have centuries of association with government authority. Serif fonts communicate permanence and institutional weight. Glassmorphic cards introduce just enough modernity to avoid feeling archaic while preserving the authority signal.

**When to Use:**
The product is a public-facing site for a government body, nonprofit, civic org, legislative caucus, or any corporate client where institutional trust must be communicated before conversion. Think city agencies, advocacy organizations, foundations, law firms, healthcare institutions.

**Brand Color Palette (Tailwind tokens):**

| Name | Token | Hex |
|------|-------|-----|
| Primary Navy | `mllc-blue` | `#002855` |
| Navy Hover | `mllc-blue-light` | `#003B75` |
| Gold Accent | `mllc-gold` | `#FFD200` |
| Gold Secondary | `mllc-yellow` | `#d7a008` |
| Brand Red | `mllc-red` | `#BF0D3E` |
| Brand Purple | `mllc-purple` | `#6a41cf` |
| Page Background | `mllc-cool-mist` | `#F0F4F8` |

**Neutral Slate Scale:**
- `slate-900` `#0f172a` — darkest text
- `slate-800` `#1e293b` — dark headings
- `slate-600` `#475569` — body text
- `slate-200`/`slate-300` — borders
- `slate-100` `#f1f5f9`, `slate-50` `#f8fafc` — subtle section backgrounds

**Gradients:**
- Hero overlay: `linear-gradient(to top, rgba(0,38,77,0.95) 0%, rgba(0,38,77,0.7) 40%, rgba(0,38,77,0.2) 70%, transparent 100%)`
- Decorative blob: `bg-gradient-to-br from-mllc-purple/20 to-mllc-yellow/20 blur-2xl`
- Connect section heading glow: `text-shadow: 0 0 40px rgba(255,210,0,0.3)`

**Typography System:**

```javascript
// Tailwind fontFamily config
fontFamily: {
  serif: ['Merriweather', 'Times New Roman', 'serif'],
  sans: ['Inter', 'sans-serif'],
}

// Golden ratio scale (custom Tailwind fontSize)
fontSize: {
  'grt-xs':   ['8px',  { lineHeight: '14px' }],
  'grt-sm':   ['10px', { lineHeight: '17px' }],
  'grt-base': ['13px', { lineHeight: '21px' }],
  'grt-lg':   ['16px', { lineHeight: '25px' }],
  'grt-xl':   ['21px', { lineHeight: '33px' }],
  'grt-2xl':  ['26px', { lineHeight: '40px' }],
}

// Golden ratio spacing
spacing: {
  'grt-1': '4px',   // xs
  'grt-2': '7px',   // sm
  'grt-3': '11px',  // md
  'grt-4': '17px',  // lg
  'grt-5': '28px',  // xl
}
```

**Heading scale:**
- `h1`: `text-3xl lg:text-6xl font-serif font-bold uppercase tracking-wide drop-shadow-sm`
- `h2`: `text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-4`
- `h3`: `text-3xl font-serif font-bold mb-4`
- Body: `text-lg font-sans leading-relaxed`
- Text shadows: `.text-shadow` → `0 2px 4px rgba(0,0,0,0.3)` / `.text-shadow-lg` → `0 4px 8px rgba(0,0,0,0.4)`

**Navigation (Fixed Centered-Logo Style):**
- Container: `fixed top-0 left-0 right-0 z-50`, height `80px`
- Logo: `absolute left-1/2 transform -translate-x-1/2`, `w-[120px] h-[120px] rounded-full` (desktop) / `w-12 h-12` (mobile)
- Curved SVG bottom edge: `M0,0 L0,24 Q720,72 1440,30 L1440,0 Z`
- Desktop menu: `hidden lg:flex` — 3 sections: left nav links | center logo space | right nav links
- Dropdown: `.nav-dropdown` — `opacity-0 invisible translate-y-2 transition-all duration-200` → hover: `opacity-100 visible translate-y-0`
- CTA: `.btn-cta` — `bg-mllc-gold text-mllc-blue font-bold px-6 py-2 rounded hover:bg-yellow-400 transition-colors shadow-sm`
- Language toggle: EN/ES switcher (Foundation mode only)
- Mobile: hamburger → `fixed inset-0 top-[80px]` slide-out drawer with `animate-fadeIn`

**Hero Section (Carousel):**
- Height: `h-[70vh] min-h-[500px]`
- Carousel: `useState(currentIndex)`, auto-rotate every `5000ms`, `opacity-100 ↔ opacity-0 duration-1000` transition
- Overlay: `.hero-gradient` — navy-to-transparent bottom-up linear gradient
- Text: `absolute bottom-6` centered, white, `text-shadow`

**Card Variants:**

```javascript
// Standard card
"bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

// Glassmorphic card (search results, member cards)
"bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

// Dark CTA card (Connect section)
"bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:border-mllc-gold hover:shadow-xl hover:shadow-mllc-gold/10 transition-all duration-300"

// Board member / person card
"bg-white rounded-2xl shadow-sm p-8"
// Image: "w-32 h-32 ring-4 ring-slate-50 hover:ring-mllc-yellow/30 transition-all"

// Legislator card (FindRep)
// Glassmorphic base + decorative gradient blob + headshot "w-24 h-24 rounded-full border-4 border-white"
// Name: "font-serif font-bold text-2xl"
// Gold accent divider: "w-12 h-1 bg-mllc-yellow rounded-full"
```

**Section Backgrounds:**
- Standard: `bg-white`
- Light alternate: `bg-slate-50` or `bg-mllc-cool-mist`
- Feature: `bg-[#f8f9fa]` with decorative purple gradient overlay (top-right corner)
- Dark CTA: `bg-slate-900`
- Footer: `bg-mllc-blue` (deep navy)

**Search Input Pattern:**
```javascript
// Container
"relative max-w-lg mx-auto shadow-lg rounded-2xl group"

// Input
"block w-full pl-12 pr-4 py-4 rounded-2xl border-0 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-mllc-purple text-lg bg-white/80 backdrop-blur-sm transition-all"

// Icon
"absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mllc-purple transition-colors"
```

**Connect Section (Dark CTA):**
- Background: `bg-slate-900`
- Heading glow: `text-shadow: 0 0 40px rgba(255,210,0,0.3)`
- Icon hover: `text-mllc-gold transition-colors`
- Card button: `border-2 border-mllc-gold text-mllc-gold px-6 py-3 rounded-lg hover:bg-mllc-gold hover:text-slate-900 transition-all`

**Footer (Navy):**
- Background: `bg-mllc-blue py-12`
- Logo: `w-16 h-16 rounded-full`
- Social icons: `w-5 h-5 hover:text-mllc-gold transition-colors`
- Links: `text-slate-300 text-sm hover:text-mllc-gold`
- Copyright: `text-slate-400`

**Grid Systems:**
```
Standard responsive:    grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8
Two-column about:       md:grid-cols-2 gap-12 items-center
Find rep results:       grid-cols-1 lg:grid-cols-2 gap-8
CTA cards (Connect):    grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
```

**Container Pattern:**
`container mx-auto px-6 lg:px-8` / max-width: `max-w-6xl mx-auto` / centered: `max-w-4xl mx-auto`

**Animation & Transitions:**
- Fast (dropdowns, opacity): `duration-200`
- Standard (card hovers, colors): `duration-300`
- Blob drift (group hover): `duration-500 group-hover:translate-x-2 group-hover:translate-y-2`
- Carousel (hero images): `duration-1000`
- Card hover lifts: `hover:-translate-y-1` (standard) / `hover:-translate-y-2` (dark cards)
- Decorative blobs: `absolute rounded-2xl blur-2xl z-0 pointer-events-none`

**Responsive Breakpoints:**
- Mobile default → `md:` 768px → `lg:` 1024px → `xl:` 1280px
- Desktop nav triggers at `lg:` (1024px)
- Mobile nav: hamburger → full-screen drawer

**Multi-Tenant Context (Advanced):**
- `legislative` mode (default): About, Resources, Priorities, Events, Connect
- `foundation` mode: adds Donate CTA, board members, EN/ES language toggle
- Mode detection via URL param `?site=foundation` or domain check
- PHP passes `window.mllcSettings` with `siteContext`, `user`, REST `nonce`

**Component Library (8 shared components):**
`Navbar` (fixed centered-logo), `Hero` (image carousel), `AboutSection` (two-column + board members grid), `FindRepSection` (search + glassmorphic member cards), `ConnectSection` (dark navy CTA cards), `MissionResourcesSection`, `EventsSection`, `Footer` (navy multi-layer)

---

> **Note:** Framework E, F, and beyond will be added as VerbaFlow grows and takes on new client verticals. Each new client project that introduces a distinct design language should be captured here.

They're complementary layers, not competing approaches.
