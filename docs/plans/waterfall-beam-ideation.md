# Waterfall Beam Ideation
## VolumetricBeam → Cascade + Plume + Lava Fade

**Status:** Ideation phase. Awaiting approval before any code execution.
**Context:** Revert of the 2026-05-15 funnel patch is active. Original cone/beam with noise modulation is live at `localhost:3001`.

---

## 1. Visual Vocabulary (Reference Names)

Use these names when requesting adjustments. Every term maps to a concrete parameter in the code.

| Name | What it is |
|------|-----------|
| **Apex Bloom** | The bright radial halo at the top of the beam (origin point). |
| **Cascade Shaft** | The narrow upper half of the beam. Should feel like a focused energy column. |
| **Plume** | The zone where the beam begins to widen — the transition from narrow shaft to spread. |
| **Mega Cone** | The aggressively widened lower portion of the beam at the hero bottom. |
| **Surge Pulse** | A traveling bright energy packet that moves down the beam, carried by the noise. |
| **Turbulence** | The n1/n2/n3 sine noise that creates the volumetric "energy volume" look. |
| **Landing Pool** | The radial glow at the very bottom of the beam (already exists). |
| **Ember Trail** | The beam's extension into the next container (ServicesSection). It is dimmer, wider, diffused. |
| **Lava Fade** | The gradual alpha decay that makes the Ember Trail cool to transparent before text appears. |
| **Drift** | The slow global time-based sway that makes the beam feel alive. |

---

## 2. What the User Described (Condensed)

1. Keep the existing noise modulation (Turbulence). It is good.
2. The beam should **widen at the bottom** of the hero — like a waterfall spreading.
3. The widen should happen in **two stages**: a normal half-width increase (Plume), then a Mega Cone widening at the very bottom.
4. The Surge Pulse (existing expand effect going up and down) should stay as an **additive** layer — it rides on top of the noise.
5. The beam should **seamlessly flow into the next container** (ServicesSection) like lava, above all elements there (including Pac-Man circuit).
6. It should **diffuse and fade** (Lava Fade) gradually before the text label "Where Strategy, Technology, and Automation Converge..."
7. The fade should be **transparent and gradual**, not a hard cut.
8. At the bottom, the beam should feel like a **waterfall** — a single stream converting into spreading energy.
9. n1, n2, n3 should have **more noise amplitude**, especially wider at the bottom.
10. Every parameter should be **exposed and documented** so the user can tweak widths, noise, pulse speed, fade zones manually.

---

## 3. Current Code Anatomy (What Exists Now)

File: `src/components/VolumetricBeam.tsx`

### Render loop structure (PASS 1 — offscreen fog cone)

Line 86: `const t = y / (oh - 1);` — normalized vertical position 0..1 (top to bottom).

Line 87: `const widthFrac = Math.pow(t, 0.85);` — single smooth power curve. This is what makes the current cone.

Line 88: `const halfW = (ow * bottomSpread * widthFrac) / 2 + 1.2;` — final half-width in pixels for the gradient at this scanline.

Line 89: `const longProfile = Math.pow(t, 0.45) * (1 - 0.30 * Math.pow(t, 3));` — longitudinal brightness: rises quickly, peaks mid, tapers at bottom.

Lines 90-92: Turbulence sine waves:
- `n1 = Math.sin(t * 14.0 + time * 0.55 + drift)` — fast vertical traveling
- `n2 = Math.sin(t * 27.0 - time * 0.85)` — faster counter-traveling
- `n3 = Math.sin(t * 6.3 + time * 0.30 + drift * 0.5)` — slow wobble

Line 93: `const noise = 0.55 + 0.25 * n1 * 0.6 + 0.12 * n2 + 0.18 * n3 * 0.7;`

Line 94: `const alpha = Math.max(0, longProfile * noise) * intensity;`

### Render loop structure (PASS 2 — main canvas composites)

Line 114-121: Atmospheric haze radial gradient (full-screen glow).

Line 126: `ctx.drawImage(off, 0, 0, W, H);` — blits the fog cone.

Lines 128-137: Soft inner glow column (vertical bar, width modulated by `pulseSlow`).

Lines 139-149: **Sharp core line** — a bright vertical line with vertical gradient opacity.

Lines 151-160: **Apex Bloom** — radial gradient at top center.

Lines 162-170: **Landing Pool** — radial gradient at bottom center.

Lines 73-76: Breathing/Pulse timers:
- `pulseSlow = 0.5 + 0.5 * Math.sin(time * 1.2)` — slow 1.2 Hz breathing
- `pulseFast = 0.5 + 0.5 * Math.sin(time * 2.3 + 0.7)` — fast 2.3 Hz breathing
- `drift = Math.sin(time * 0.6) * 0.7 + Math.sin(time * 1.7) * 0.4` — composite sway

### Current placement in HeroSection

`HeroSection.tsx` line 171: `<VolumetricBeam hue="mint" intensity={1.4} bottomSpread={1.4} />`

The component renders a `<canvas className="absolute inset-0 ..." style={{ zIndex: 1 }} />`. It is constrained to the hero section box. It cannot visually enter the next container.

---

## 4. Three Architectural Options

### Option A: Extended Canvas (Recommended)

**How it works:** Keep `VolumetricBeam` inside `HeroSection`, but give the canvas a taller height (e.g., `140vh` or `180vh`) so it extends below the hero bottom and overlaps the top of `ServicesSection`. Add a Lava Fade alpha gradient at the bottom portion of the canvas so the beam cools to transparent before the text.

**Pros:** Single canvas, single render loop, true continuity, no sync issues. The beam is literally the same pixels flowing down.
**Cons:** Canvas is bigger, slightly more fill cost. Requires careful z-index layering so the extension sits above services backgrounds but below services text.

**Z-index stack:**
```
HeroSection:
  z=1  VolumetricBeam (canvas, absolute, taller than section)
  z=10 Hero content (text, CTAs, bento)

ServicesSection:
  z=1  ServicesHoverReveal circuit + Pac-Man
  z=5  Service cards, helix, metric cards
  z=8  VolumetricBeam OVERLAP (same canvas, extends here)
  z=20 Services text headings, section title
```

To achieve this, the canvas must be promoted out of the hero stacking context so it can paint above services elements. We do this by moving the `<VolumetricBeam>` component to the page level (`page.tsx`) right after the hero, or by using a portal-like approach where the canvas is absolutely positioned at the page level with a negative `top` offset.

### Option B: Fixed Viewport Overlay with Scroll Mask

**How it works:** Make the canvas `position: fixed` covering the full viewport at a high z-index. Use a real-time scroll-aware shader mask: the beam renders everywhere, but alpha is multiplied by a gradient that goes from 1.0 (in hero) to 0.0 (at text label Y position). The mask updates on scroll.

**Pros:** Beam is always viewport-relative, looks consistent while scrolling.
**Cons:** When user scrolls past the hero, the beam would still be fixed at the top of the viewport (like a HUD), not flowing down the page. This breaks the "waterfall into next container" illusion. Requires continuous scroll JS computation.

### Option C: Handoff Pair — Hero Beam + Ember Trail

**How it works:** Keep `VolumetricBeam` unchanged inside hero. Create a NEW lightweight component `EmberTrail` inside `ServicesSection` top area. It renders a similar but dimmer, wider, more diffused beam that visually "receives" the energy. We sync the Surge Pulse position across both via a shared time offset or props.

**Pros:** No z-index stacking complexity. Each section owns its effect.
**Cons:** Hard to make seamless — the handoff line between hero bottom and services top will likely show a visible seam. Two render loops = more CPU.

### Recommendation: Option A

It is the only option that delivers true visual continuity. The beam is one continuous medium. The Lava Fade happens within the same canvas.

---

## 5. Design Specification (Option A)

### 5.1 Geometry: From Cone to Waterfall Profile

Current: `widthFrac = Math.pow(t, 0.85)` — smooth concave curve, starts wide-ish.

New: **Piecewise Cascade → Plume → Mega Cone**

```typescript
let widthFrac: number;
const SHAFT_END   = 0.42;  // Cascade Shaft ends here
const PLUME_END   = 0.72;  // Plume ends, Mega Cone starts

if (t < SHAFT_END) {
  // Cascade Shaft: nearly constant, very slight linear taper
  widthFrac = 0.10 + (t / SHAFT_END) * 0.18;  // 0.10 → 0.28
} else if (t < PLUME_END) {
  // Plume: quadratic ease-out flare (waterfall widening)
  const plumeT = (t - SHAFT_END) / (PLUME_END - SHAFT_END);
  widthFrac = 0.28 + Math.pow(plumeT, 2) * 0.42;  // 0.28 → 0.70
} else {
  // Mega Cone: aggressive power flare (spreading energy)
  const megaT = (t - PLUME_END) / (1.0 - PLUME_END);
  widthFrac = 0.70 + Math.pow(megaT, 1.4) * 0.65;  // 0.70 → 1.35
}
```

**Manual tweak points:**
- `SHAFT_END` (0.42): where the narrow top stops. Increase = longer straight shaft.
- `PLUME_END` (0.72): where aggressive spread starts. Decrease = earlier waterfall.
- `0.10`: minimum widthFrac at top. Increase = thicker shaft.
- `0.18`: shaft growth amount. Increase = more shaft taper.
- `0.42`: plume growth amount. Increase = wider plume.
- `0.65`: mega cone max extra width. Increase = more dramatic bottom spread.
- `Math.pow(megaT, 1.4)`: mega flare curve. Higher exponent = more sudden late spread. Lower = gradual spread.

All these are at `VolumetricBeam.tsx` line 87 (current).

### 5.2 Turbulence: More Noise, Wider at Bottom

Current noise (line 93):
```typescript
const noise = 0.55 + 0.25 * n1 * 0.6 + 0.12 * n2 + 0.18 * n3 * 0.7;
```

New: boost amplitude and add bottom-biased width scaling.

```typescript
// Bottom-boosted noise: turbulence gets wilder near the bottom
const turbulenceBoost = 1.0 + t * 0.6;  // 1.0 at top, 1.6 at bottom

const noise = 0.45
  + 0.32 * n1 * turbulenceBoost
  + 0.20 * n2 * turbulenceBoost
  + 0.24 * n3 * turbulenceBoost;
```

**Manual tweak points:**
- `0.45`: noise baseline. Lower = darker gaps between pulses.
- `0.32/0.20/0.24`: relative weights of n1/n2/n3. n1 is fast traveling, n2 is faster counter, n3 is slow sway.
- `t * 0.6`: bottom boost amount. Increase = more chaos at bottom.

Also: increase the frequency of n1 and n2 slightly for finer grain:
```typescript
const n1 = Math.sin(t * 18.0 + time * 0.65 + drift);      // was 14.0 / 0.55
const n2 = Math.sin(t * 34.0 - time * 1.05);              // was 27.0 / 0.85
const n3 = Math.sin(t * 6.3  + time * 0.30 + drift * 1.5); // was drift * 0.5
```

Lines: 90-92 (current).

### 5.3 Surge Pulse: Additive Traveling Energy Packet

The user wants the existing pulseSlow/pulseFast breathing to stay, PLUS a new **traveling pulse** that moves down the beam like a packet of energy.

```typescript
// Slow vertical descent (8-second loop, top to bottom)
const pulsePos = (time * 0.125) % 1.6;  // 0..1.6, goes slightly past hero bottom

// Fast flare when pulse is in bottom half (waterfall energy intensifies)
const pulseFastBoost = pulsePos > 0.5
  ? Math.pow((pulsePos - 0.5) / 0.5, 2)  // 0 → 1 quadratic
  : 0;

// Gaussian bump centered on pulsePos
const pulseDist = t - pulsePos;
const pulseGlow = Math.exp(-(pulseDist * pulseDist) / 0.006) * (1.0 + pulseFastBoost * 1.2);
```

Then `alpha` becomes:
```typescript
const alpha = Math.max(0, longProfile * noise) * intensity * (1.0 + pulseGlow * 0.7);
```

**Why this works:** The pulse is a traveling bright spot. When it hits the bottom half (where the Mega Cone is wide), `pulseFastBoost` amplifies it, making the waterfall glow more intense as the energy "lands".

**Manual tweak points:**
- `time * 0.125`: pulse speed. Increase = faster descent.
- `1.6`: how far past hero bottom the pulse travels before looping. Reduce = shorter cycle.
- `0.006`: pulse tightness. Smaller = narrower, sharper energy packet. Larger = fuzzier.
- `pulseFastBoost * 1.2`: bottom amplification. Increase = more dramatic landing flare.
- `pulseGlow * 0.7`: overall pulse intensity on fog. Increase = brighter packet.

### 5.4 Longitudinal Profile: Keep Current

The existing `longProfile = Math.pow(t, 0.45) * (1 - 0.30 * Math.pow(t, 3))` is good. It makes the beam bright in the middle and fade at top/bottom edges. No change needed.

### 5.5 Lava Fade: Alpha Decay into ServicesSection

This is the key architectural addition. We extend the canvas below the hero and fade it.

**Canvas sizing:**
- Current: canvas fills hero section (`absolute inset-0`).
- New: canvas height = `heroHeight + overlap`, where `overlap` = roughly `40vh` to `60vh`.
- The render loop draws from `y = 0` to `y = extendedHeight`.
- `t` is renormalized: `t = y / heroHeight` so that `t = 1.0` is the hero bottom.
- For `y > heroHeight` (the overlap zone), we apply a Lava Fade multiplier.

```typescript
const heroH = /* hero section height in px, passed as prop or measured */;
const overlapH = heroH * 0.45;  // 45% of hero height = overlap zone
const totalH = heroH + overlapH;

// In the scanline loop:
const t = Math.min(y / heroH, 1.0);  // 0..1 for geometry (stays 1 in overlap)

// Lava Fade: 1.0 at hero bottom → 0.0 at end of overlap
let lavaFade = 1.0;
if (y > heroH) {
  const fadeT = (y - heroH) / overlapH;  // 0..1 across overlap
  lavaFade = 1.0 - Math.pow(fadeT, 1.8);  // ease-out decay (slow start, fast end)
}
```

Then multiply the final alpha:
```typescript
const alpha = Math.max(0, longProfile * noise) * intensity * (1.0 + pulseGlow * 0.7) * lavaFade;
```

**Visual result:** The beam extends past the hero bottom, gets wider (Mega Cone), but also gets dimmer and more diffused. By the time it reaches the end of the overlap, it is fully transparent. The cooling is gradual like lava — not a hard edge.

**Manual tweak points:**
- `overlapH` (0.45): how far into services the beam reaches. Increase = longer ember trail.
- `Math.pow(fadeT, 1.8)`: fade curve. Higher exponent = stays bright longer then drops fast. Lower = more linear cooling.

### 5.6 Core Line: Keep but Widen with Pulse

The sharp core line (step d) should stay — the user said they like the current beam. But it should participate in the waterfall:

```typescript
const coreW = 1.6 + pulseSlow * 1.0 + pulseFast * 0.5 + pulseGlow * 2.5;
```

When the Surge Pulse passes, the core line briefly widens, making the energy packet visible even in the center.

Also add a **vertical gradient** to the core so it fades in the overlap zone:
```typescript
// In core step (d):
const coreFade = y > heroH ? lavaFade : 1.0;
const coreOp = (0.85 + pulseFast * 0.15) * intensity * coreFade;
```

### 5.7 Apex Bloom: Sync with Pulse

The origin halo should subtly throb when the Surge Pulse is near the top (just launched):

```typescript
const launchBoost = pulsePos < 0.15 ? (1.0 - pulsePos / 0.15) : 0;
const origR = 180 + pulseSlow * 35 + launchBoost * 60;
```

This makes the origin flare brighter as a new energy packet launches.

### 5.8 Landing Pool: Intensify on Pulse Landing

When the pulse reaches the bottom, the landing pool should brighten:

```typescript
const landingBoost = pulsePos > 0.85 ? ((pulsePos - 0.85) / 0.15) : 0;
const poolIntensity = (0.40 + landingBoost * 0.35) * intensity;
```

---

## 6. Z-Index & Layering Plan

To make the beam flow above the services circuit but below the text, we need the canvas to escape the hero stacking context.

### Current problem

`<VolumetricBeam>` is a child of `<HeroSection>`. Even if it has `z-index: 100`, it cannot paint above elements in `<ServicesSection>` because they are in a separate stacking context (sibling sections).

### Solution: Page-level portal

Move the `<VolumetricBeam>` mount to `page.tsx`, immediately after `<HeroSection>`. Use CSS to position it so it starts at the hero top and extends down into services.

```tsx
// In page.tsx
<HeroSection />

{/* Waterfall Beam — page-level overlay */}
<VolumetricBeam
  hue="mint"
  intensity={1.4}
  bottomSpread={1.4}
  lavaOverlap={0.45}      // 45% of hero height extends into services
  zIndex={12}             // above services cards (z-10) but below headings (z-20)
/>

<ServicesSection services={services} />
```

The canvas wrapper gets:
```css
position: absolute;
top: 0;               /* aligns with page top */
left: 0;
width: 100%;
height: calc(100vh + 45vh);  /* hero + overlap */
pointer-events: none;
z-index: 12;
```

Services section headings need `position: relative; z-index: 20` (or higher than 12) so they sit above the beam.

Services cards, helix, and circuit canvas stay at their current z-index. The beam at z=12 paints above them.

---

## 7. Parameter Cheat Sheet (Manual Tweak Guide)

After implementation, these are the exact numbers you can change without breaking the build.

| Parameter | Location | Default | Effect |
|-----------|----------|---------|--------|
| `SHAFT_END` | `VolumetricBeam.tsx` line ~87 | `0.42` | Where narrow shaft ends. Higher = longer straight top. |
| `PLUME_END` | line ~87 | `0.72` | Where aggressive spread starts. Lower = earlier waterfall. |
| shaft min width | line ~87 | `0.10` | Width at very top. Higher = thicker origin. |
| shaft growth | line ~87 | `0.18` | How much shaft widens before plume. |
| plume growth | line ~87 | `0.42` | How much plume widens before mega cone. |
| mega growth | line ~87 | `0.65` | Max extra width at bottom. |
| mega exponent | line ~87 | `1.4` | Curve of bottom flare. Higher = sudden late burst. |
| `bottomSpread` | props, `HeroSection.tsx` | `1.4` | Overall width multiplier for entire beam. |
| n1 freq | line ~90 | `18.0` | Fast traveling grain frequency. |
| n1 speed | line ~90 | `0.65` | How fast n1 moves down. |
| n2 freq | line ~91 | `34.0` | Finer grain frequency. |
| n2 speed | line ~91 | `1.05` | How fast n2 moves up. |
| n3 drift | line ~92 | `1.5` | Drift multiplier on slow wobble. |
| noise baseline | line ~93 | `0.45` | Minimum brightness. Lower = darker voids. |
| noise weights | line ~93 | `0.32, 0.20, 0.24` | n1/n2/n3 mix. |
| bottom boost | line ~93 | `0.6` | How much extra noise at bottom. |
| pulse speed | line ~94 (new) | `0.125` | Surge Pulse descent speed. Higher = faster loop. |
| pulse range | line ~94 (new) | `1.6` | How far past hero bottom pulse goes. |
| pulse tightness | line ~94 (new) | `0.006` | Gaussian width. Smaller = sharper packet. |
| pulse intensity | line ~94 (new) | `0.7` | How bright the pulse makes the fog. |
| bottom pulse amp | line ~94 (new) | `1.2` | Extra boost when pulse is in bottom half. |
| `lavaOverlap` | props | `0.45` | How far into services the beam extends (fraction of hero height). |
| fade exponent | line ~95 (new) | `1.8` | Lava Fade curve. Higher = holds then drops. |
| core pulse width | line ~140 | `+ pulseGlow * 2.5` | How much core widens during pulse. |
| origin launch | line ~152 | `launchBoost * 60` | How much origin flares on pulse launch. |
| pool landing | line ~163 | `landingBoost * 0.35` | How much pool glows on pulse landing. |
| `intensity` | props | `1.4` | Master brightness multiplier. |

---

## 8. Implementation Phases (If Approved)

**Phase 1 — Geometry & Noise (Pure Math)**
- Replace single `widthFrac` curve with piecewise Cascade → Plume → Mega Cone.
- Boost n1/n2/n3 amplitude and bottom-bias.
- Add Surge Pulse traveling Gaussian.
- Verify visually in browser. No z-index changes yet.

**Phase 2 — Lava Fade (Canvas Extension)**
- Extend canvas height to `hero + overlap`.
- Add `lavaOverlap` prop.
- Implement `lavaFade` alpha multiplier in scanline loop.
- Fade core line, inner glow, and landing pool in overlap zone.

**Phase 3 — Page-Level Z-Index (Layering)**
- Move `VolumetricBeam` mount from `HeroSection` to `page.tsx`.
- Set wrapper to `position: absolute; top: 0; height: calc(100vh + overlap)`.
- Promote services headings to `z-index: 20`.
- Verify beam paints above circuit and cards but below text.

**Phase 4 — Polish**
- Sync Apex Bloom launch flare with pulse start.
- Sync Landing Pool with pulse landing.
- Add `coreFade` in overlap zone.
- Adjust all default parameters until the waterfall feels right.
- Update `CHANGES.md`.

---

## 9. What This Will Look Like (Narrative)

1. **Top of viewport:** A narrow, focused Cascade Shaft descends from the Apex Bloom. Slight Turbulence flickers inside it — subtle energy volume.
2. **Mid-hero:** The Surge Pulse appears at the top and travels down. As it moves, it brightens the shaft and widens the Core Line. The pulse is a concentrated packet of light riding the noise.
3. **Hero bottom:** The shaft enters the Plume. It begins to widen. The Turbulence gets stronger (bottom boost). The pulse reaches the Plume and the beam flares outward.
4. **Below hero (overlap):** The Mega Cone spreads dramatically. The beam is now a wide waterfall of energy. The pulse enters the bottom half and `pulseFastBoost` kicks in — the landing zone glows intensely.
5. **Services top:** The Ember Trail continues. It is wide, diffused, dimmer. The Lava Fade begins. The beam is still above the circuit and cards, tinting them with mint light.
6. **Services mid:** The fade accelerates. The beam cools from glowing energy to transparent haze. The Surge Pulse loops back to the top.
7. **Before text:** Fully transparent. No hard edge — just a gentle absence.

---

## 10. Open Questions (Answer Before Phase 1)

1. **Hero height:** Is the hero section exactly `100vh` or does it vary? This determines `heroH` measurement logic.
2. **Services heading z-index:** Do you want me to raise the services section title/headings above the beam, or is there a specific text block you want preserved?
3. **Pulse direction:** Should the Surge Pulse loop continuously (top→bottom→restart), or should it bounce (top→bottom→top)?
4. **Bottom overlap size:** Is `45vh` overlap into services right, or do you want more/less lava trail?
5. **Color:** Keep mint hue, or should the Ember Trail shift toward amber/orange as it "cools"?

---

**End of ideation document.**

**Next step:** Read through, adjust any parameters or architectural choices in the descriptions above, then reply with approval to proceed (and answers to the 5 open questions). No code will be touched until you confirm.
