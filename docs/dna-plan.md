# DNA Triptych — three rotating 3D helices as the Services centrepiece

> Queued plan. Not active. Implement after the volumetric beam fixes ship
> and after San reviews the live page.

## Context

`src/components/ServicesSection.tsx` ships a 2D SVG `HelixVisualization`
(lines 263-364) that is **dead code** — defined but never rendered. The
right column currently shows the inline pricing quiz.
`src/components/SplineHelix.tsx` is a placeholder URL component. San wants
the helix to finally become "what it was always supposed to be": three
full-width, holographic 3D DNA helices side by side, each a distinct
visualisation, all rotating in lockstep, with hover overlays.

**Reference image (mock):** the 3-variation mock San pasted in chat on
2026-05-16 — *Biometric Ledger* (architectural precision), *Chronological
Helix Pipeline* (growth narrative), *Quantum Network Structure*
(interactive network density). Save to a stable path on disk before
kickoff (suggestion: `docs/dna-inputs/triptych-mock.png`) and update this
line with the path.

Visual language: Developer Dark Mode matrix + Avatar/alien-tech holographic
read + the existing `--accent` mint green (`#A5D6A7`). Slow cinematic
motion, glass panels, soft bloom.

## Architecture decisions

- **Stack**: vanilla Three.js + GSAP. Both already installed
  (`three@^0.183.2`, `gsap@^3.14.2`). No `@react-three/fiber` — the scene
  is hand-authored and R3F adds a dep we don't need.
- **One canvas, three Groups.** A single `WebGLRenderer` with one
  perspective camera renders all three helices as three `THREE.Group`s
  translated to the left / centre / right thirds of the canvas. One RAF
  loop, one raycaster. Three independent canvases would triple GPU + RAF
  cost for no visual gain.
- **Hover overlay = HTML, not WebGL.** A React-managed overlay div sits
  above the canvas. On hover, the raycaster picks the node, its world
  position projects to screen coords via `vec.project(camera)`, and the
  overlay moves + content swaps. Keeps text crisp; lets variation 3 use a
  real `<iframe>`.
- **Pause off-screen** via `IntersectionObserver`; respect
  `prefers-reduced-motion` (static frame, overlays open on click).

## File layout (new)

```
src/components/dna/
├── DNATriptych.tsx        # client component, owns canvas + overlay portal
├── useDNAScene.ts         # hook: renderer, scene, camera, RAF, resize, IO pause
├── buildHelix.ts          # pure: config → THREE.Group (strands + rungs + nodes)
├── variations.ts          # 3 variation configs + mock data + adaptive tier
├── HoverOverlay.tsx       # 3 overlay renderers (metric / project / iframe)
└── raycast.ts             # raycaster + hover state machine
```

## Per-variation specs

All three share the same rotation speed (`0.12 rad/s` around Y), float
amplitude (`±0.08 units, 4 s period`), and scale envelope. Differences are
geometry, node style, and overlay content.

### V1 — Biometric Ledger (left third)
- Classic double-helix backbone, **test-tube rungs** (CylinderGeometry
  capsules with translucent capped material, matching the architectural
  mock).
- 6 evenly spaced glowing pucks as nodes (Sphere r=0.35, emissive 1.2,
  accent green).
- Overlay `<MetricCard />` — **manifested 2030 stats** (e.g. `+32.4%
  YoY`, `600 employees`, `$48M ARR`). Mock values live in
  `variations.ts`.

### V2 — Chronological Helix Pipeline (centre)
- Same backbone; rungs are thin glass connectors anchoring **labelled
  flasks** (slightly larger capsule + text plane texture, e.g. `Q4 2022`).
- **Adaptive tier** function in `variations.ts`:
  ```ts
  function pickGranularity(n: number): 'quarter' | 'month' | 'day' {
    if (n <= 12) return 'quarter';
    if (n <= 40) return 'month';
    return 'day';
  }
  ```
  Currently feeds quarterly nodes from a static `projects[]` array
  (3/quarter). When the array grows, node positions rebuild automatically.
- Overlay `<ProjectCard />` — name, period, status, link to agency-page
  entry.

### V3 — Quantum Network Structure (right third)
- Faint low-opacity backbone wrapped in an **irregular orb cloud**: 18-24
  spheres of varying radii (`0.18`-`0.55`) at deterministic-pseudo-random
  offsets around the helix axis.
- Overlay `<IframePreview />` — **one shared `<iframe>`** swaps `src` on
  hover, GSAP-scales in from the projected node position. Loads
  agency-page routes (`/agency/<slug>`). Static `<img>` fallback if the
  iframe doesn't load within 1.2 s.

## Animation system

- **Entry timeline** (GSAP, fires once on IO intersect):
  - 0.0 s — fog density 0.4 → 0.04 over 1.6 s
  - 0.2 s — stagger helix scale-in `y: 0.2 → 1`, 0.8 s, `power2.out`
  - 1.0 s — start rotation + float loops
- **Idle**: continuous slow rotation + sine Y float. Speed constants live
  in `variations.ts` so all three stay in lockstep.
- **Hover slow-mo**: on pick, GSAP tweens *that helix's* `rotationSpeed`
  `0.12 → 0.04` over 0.4 s; camera nudges 0.3 units toward the hovered
  third. Overlay fades + scales in with `power3.out`.

## Integration into ServicesSection

Mount `<DNATriptych />` immediately after the section header (around
`ServicesSection.tsx:765`) as a full-width sub-row, `min-height: 80vh`.
The cards + inline quiz grid stays below, unchanged. This is
**additive** — no shipped functionality is removed. Dead
`HelixVisualization` deletion (lines 263-364) is a follow-up cleanup PR,
not coupled to this change. `ServicesHoverReveal` stays at `z-[1]`; the
triptych sits at `z-10` inside the inner container, so the circuit-board
reveal remains visible behind the helices.

## Verification

1. `npm run dev` → `/`, scroll to Services.
2. Three helices render side by side, rotating in lockstep.
3. Hover each node — overlay appears within ~120 ms, content matches
   variation (metric / project / iframe).
4. Scroll section out of view → DevTools Performance shows RAF paused.
5. Toggle `prefers-reduced-motion` → rotation halts, overlays still open
   on click.
6. Lighthouse Performance ≥ 85 on the Services page (throttled).
7. Append a `CHANGES.md` entry per project convention.
