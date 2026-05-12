# Brief — Iso Floor v2 Tier 1 (Quick Polish)

**Target agent:** Hermes + OpenCode Go + `deepseek-v4-pro`
**Repo:** `/Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0`
**Branch:** `main`
**Already shipped:** Ambient glow, SSE binding, walking dots (commits `6578ff3`, `2dec844`, `189560d` + polish). Dev: `npm run dev` → `http://localhost:3001/agency`.
**Your job:** Three small polish wins as separate atomic commits. ~30 minutes total. No vision required.

---

## Read first (in order)

1. `src/components/agency-prototypes/proto-05-iso-floor/index.tsx` — current state with ambient glow, walking dots, SSE-driven modals.
2. `src/components/agency-prototypes/proto-05-iso-floor/styles.module.css` — existing tokens, animations, modal styles.
3. `src/hooks/useHermesState.ts` — SSE hook returning `Record<string, AgentState>` (note: this will change in Tier 2; for Tier 1 keep the existing shape).

**Palette (use these hex codes only):**

- Background void: `#0a0e19`. Surface dark: `#0f131e`, surface card: `#171b27`, surface raised: `#262a36`.
- Text primary: `#dfe2f2`, text secondary: `#bbcac6`, text muted: `#859490`.
- Teal primary: `#4fdbc8`, teal glow: `#71f8e4`. Mint: `#A5D6A7`. Peach alert: `#ffb693`.

---

## Task 1.1 — Modal spring animation from clicked zone (~10 min)

Currently both modals animate from screen center with a slideUp keyframe. Make them spring FROM the clicked polygon's center for spatial continuity.

**In `index.tsx`:**

Add origin state and a helper for capturing click coords:

```tsx
const [originPoint, setOriginPoint] = useState<{ x: number; y: number } | null>(null);

const openZone = (zoneId: string, e: React.MouseEvent<SVGPolygonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setOriginPoint({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  });
  setActiveZoneId(zoneId);
};
```

Replace the existing `onClick={() => setActiveZoneId(zone.id)}` on the polygon with `onClick={(e) => openZone(zone.id, e)}`. For keyboard activation (Enter/Space), pass the polygon ref's rect — easiest path is `const rect = (e.currentTarget as SVGPolygonElement).getBoundingClientRect()` inside the onKeyDown branch.

Pass `originPoint` into both modals as a new prop. In `BookCallModal.tsx` and `AgentZoneModal.tsx`, apply the transform-origin via inline style on the `.modal` div:

```tsx
<div
  className={styles.modal}
  onClick={(e) => e.stopPropagation()}
  style={{
    transformOrigin: originPoint
      ? `${originPoint.x}px ${originPoint.y}px`
      : '50% 50%',
  }}
>
```

**In `styles.module.css`:** Replace the existing `slideUp` keyframe to use `scale` for an "expand-from-origin" feel:

```css
@keyframes slideUp {
  from { opacity: 0; transform: scale(0.4); }
  to   { opacity: 1; transform: scale(1); }
}
```

Keep `fadeIn` for the backdrop unchanged.

**Verify:** click each zone — the modal grows out of the click position, not from screen center.

**Commit:** `feat(iso-floor): modals spring from clicked zone center`

---

## Task 1.2 — Glass viewport frame around the canvas (~5 min)

In `styles.module.css`, find `.canvas` and replace the existing `box-shadow` with a multi-layer glass treatment:

```css
.canvas {
  /* keep all existing properties — position, max-width, aspect-ratio, etc. */
  box-shadow:
    /* outer ambient glow */
    0 24px 80px rgba(79, 219, 200, 0.10),
    /* hairline edge */
    0 0 0 1px rgba(191, 201, 196, 0.18),
    /* inset top highlight */
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    /* inset bottom shadow */
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
}
```

**Verify:** the canvas now reads as a luminous "screen inside the page" with a soft teal halo and a top highlight — not a flat rounded rectangle.

**Commit:** `style(iso-floor): glass viewport frame with hairline and inset edges`

---

## Task 1.3 — Twinkle particle layer behind the canvas (~10 min)

Add 30 tiny teal dots in the `.stage` (NOT inside `.canvas`), behind the canvas via z-index, animating opacity at staggered intervals.

**In `index.tsx`:**

Import `useMemo` (already importing `useState`, `useEffect`):

```tsx
import { useState, useEffect, useMemo } from 'react';
```

Inside `IsoFloor()`, generate the particles once with `useMemo`:

```tsx
const particles = useMemo(
  () =>
    Array.from({ length: 30 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      size: 2 + Math.random() * 2,
    })),
  [],
);
```

In the JSX, render the layer **inside** `<section className={styles.stage}>`, **before** the `<header>`:

```tsx
<div className={styles.particleLayer} aria-hidden="true">
  {particles.map((p, i) => (
    <span
      key={i}
      className={styles.particle}
      style={{
        top: `${p.top}%`,
        left: `${p.left}%`,
        width: p.size,
        height: p.size,
        animationDelay: `${p.delay}s`,
      }}
    />
  ))}
</div>
```

**In `styles.module.css`:**

```css
.particleLayer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: #4fdbc8;
  opacity: 0;
  animation: twinkle 4s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0; }
  50%      { opacity: 0.4; box-shadow: 0 0 4px #4fdbc8; }
}

@media (prefers-reduced-motion: reduce) {
  .particle { animation: none; opacity: 0.2; box-shadow: none; }
}
```

Make sure `.stage` has `position: relative` (it already does) and the `.canvas` sits above the particles. Add `z-index: 1` to `.canvas` if it isn't already explicit. Headers / status content should also sit at z-index ≥ 1.

**Verify:** faint teal dots twinkle around the canvas at random phases. With `prefers-reduced-motion: reduce` enabled in DevTools, dots stay at 0.2 opacity with no animation.

**Commit:** `feat(iso-floor): twinkle particle layer behind canvas`

---

## Acceptance criteria (all three tasks)

1. `npm run build` exits 0.
2. `npm run dev` and `http://localhost:3001/agency` renders without console errors.
3. `prefers-reduced-motion: reduce` (toggle in Chrome DevTools → Rendering) halts modal scale animation, freezes twinkle particles.
4. Modal click-origin works for both mouse and keyboard (Enter / Space on a focused polygon).
5. Each task is one atomic commit with the exact message specified.
6. Push to `origin/main` after each commit.

## Don't touch

- The 9 polygon `points` coordinates.
- Ambient glow positioning (already calibrated post-task-1).
- The walking-path coordinates or random rotation logic.
- The SSE endpoint or hook (Tier 2 extends those — don't preempt).
- Other prototypes (proto-01 through proto-04).

## Reporting back

After each commit:

```
[tier1-task-N] done — <commit sha> · <verification result>
```

If blocked:

```
[tier1-task-N] blocked — <reason>
```

End of brief.
