# Brief — Iso Floor v2 Task 4 (Seedance Video Swap)

**Target agent:** Hermes + OpenCode Go + `deepseek-v4-pro`
**Repo:** `/Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0`
**Branch:** `main`
**Already shipped:** All of v2 Tasks 1–3 plus Tier 1 polish plus Tier 2 chrome wrap. The `IsoFloor` component is now mounted at `/virtual-office` (via `src/app/virtual-office/page.tsx`) and at `/agency` (via the prototypes registry).
**Your job:** swap the static `<Image>` for the looping Seedance video, with poster fallback, viewport-pause via IntersectionObserver, and a reduced-motion guard. One atomic commit. ~30–45 minutes.

---

## Prerequisite (San must do before kicking off)

Drop the Seedance output into the repo at:

```
public/agency/iso-floor.mp4
```

Optionally also drop a Safari-friendly fallback:

```
public/agency/iso-floor.av1     (or .webm — pick one)
```

If only the `.mp4` exists, ship with only that source. If both exist, list AV1 first so capable browsers prefer it (smaller bitrate).

The brief verifies the file exists before swapping. Do NOT run if `public/agency/iso-floor.mp4` is missing — report `blocked — public/agency/iso-floor.mp4 not found` and stop.

---

## Read first (in order)

1. `src/components/agency-prototypes/proto-05-iso-floor/index.tsx` — current state, contains the `<Image src="/agency/iso-floor.png" ... />` block to replace.
2. `src/components/agency-prototypes/proto-05-iso-floor/styles.module.css` — the `.still` class. Confirm `object-fit: cover` is already present.
3. `src/app/virtual-office/page.tsx` — confirms the route this component renders at.

---

## The change

In `index.tsx`:

### 1. Update imports

Add `useRef`. Keep `useState`, `useEffect`, `useMemo`. **Remove** the `Image` import from `next/image` (we no longer need it after the swap — see step 3 for the reduced-motion fallback).

```tsx
import { useState, useEffect, useMemo, useRef } from 'react';
```

### 2. Add a video ref and an IntersectionObserver pause hook

Inside `IsoFloor()`, near the other `useState` calls:

```tsx
const videoRef = useRef<HTMLVideoElement | null>(null);
const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  if (typeof window === 'undefined') return;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  setReduceMotion(mq.matches);
  const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}, []);

useEffect(() => {
  const v = videoRef.current;
  if (!v) return;
  const obs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => {});
      else v.pause();
    },
    { threshold: 0.15 },
  );
  obs.observe(v);
  return () => obs.disconnect();
}, [reduceMotion]);
```

### 3. Swap the JSX

Find the existing `<Image>` block:

```tsx
<Image
  src="/agency/iso-floor.png"
  alt="..."
  fill
  priority
  className={styles.still}
  sizes="(max-width: 1920px) 100vw, 1920px"
/>
```

Replace with this conditional:

```tsx
{reduceMotion ? (
  // Reduced-motion: serve the static poster, no autoplay
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/agency/iso-floor.png"
    alt="Verbaflow Agency isometric floor map showing nine zones: reception, task delegation, sales, and six numbered agent rooms"
    className={styles.still}
  />
) : (
  <video
    ref={videoRef}
    className={styles.still}
    poster="/agency/iso-floor.png"
    autoPlay
    loop
    muted
    playsInline
    preload="metadata"
    aria-label="Verbaflow Agency isometric floor — animated parallax loop"
  >
    {/* If you generated an AV1/WebM, list it FIRST so capable browsers prefer it. */}
    {/* <source src="/agency/iso-floor.av1" type="video/mp4; codecs=av01.0.05M.08" /> */}
    <source src="/agency/iso-floor.mp4" type="video/mp4" />
  </video>
)}
```

If you generated an AV1 or WebM fallback, uncomment the second `<source>` line and adjust the type accordingly. If only an MP4 exists, leave it commented out.

Notes:
- `priority` is gone because `<video>` doesn't use Next.js Image. Next.js will still serve the poster image normally.
- The native `<img>` is used for the reduced-motion branch (not `next/image`) to avoid pulling the Image component back in for a tiny fallback path. The eslint comment silences the next-image-element rule.

### 4. Confirm `.still` CSS

In `styles.module.css`, the `.still` class should already have:

```css
.still {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}
```

If `object-fit: cover` is missing from any branch, add it. Native `<img>` and `<video>` both honor `object-fit` once `width: 100%; height: 100%` are set.

---

## Verification

1. **File check:** `ls public/agency/iso-floor.mp4` returns the file (non-zero size).
2. **Build:** `npm run build` exits 0.
3. **Dev:** `npm run dev`, open `http://localhost:3001/virtual-office`. The iso-floor canvas plays a looping video. No console errors.
4. **Loop seam:** watch one full cycle. The end frame should match the start frame (no visible cut). If it cuts, the Seedance loop isn't seamless — flag as an asset issue, not a code issue.
5. **Scroll-pause:** scroll the page until the iso-floor is fully out of viewport. Open DevTools → Performance Monitor. Frame rate on the iso-floor should drop to zero (paused). Scroll back, frames resume.
6. **Reduced motion:** in Chrome DevTools → ⋮ → More tools → Rendering → set "Emulate CSS prefers-reduced-motion" to "reduce." Reload. The canvas should show the static `iso-floor.png` instead of the video. No autoplay.
7. **Mobile:** open DevTools device emulation, iPhone 14 Pro. The `playsInline` + `muted` + `autoPlay` combination should still play. If iOS blocks autoplay, the poster image takes over visually — acceptable.
8. **Lighthouse:** run a Performance audit on `/virtual-office`. The video should not push LCP above 2.5s. If it does, add `preload="none"` and a manual play trigger on first scroll.

Also verify the second mount point at `/agency#proto-05-iso-floor` still works — it's the same component, so it should behave identically.

---

## Acceptance criteria

- One atomic commit.
- `npm run build` exits 0.
- Video plays at `/virtual-office` and `/agency` (proto-05).
- IntersectionObserver pauses when scrolled out, resumes when back.
- Reduced-motion path shows the static poster, no video element rendered.
- Push to `origin/main` after the commit.

## Commit message

```
feat(virtual-office): swap iso-floor still for Seedance parallax loop
```

## Don't touch

- The `<svg className={styles.hitmap}>` block (the 9 click polygons + walking paths).
- Ambient glow divs, twinkle particle layer, status bar, headline strip, stat strip, roster, activity feed — all from prior tasks, none of them depend on the still being an `<Image>` vs `<video>`.
- The modals (BookCallModal, AgentZoneModal).
- The SSE endpoint or hook.
- `iso-floor.png` — it stays in `public/agency/` as the poster + reduced-motion fallback.

## If you get stuck

- **Video doesn't autoplay:** confirm `muted` and `playsInline` are both present. Without `muted`, browsers block autoplay.
- **TypeScript error on `useRef<HTMLVideoElement | null>`:** the initial value `null` is correct; if TS complains about ref assignment, use `useRef<HTMLVideoElement>(null!)` only as a last resort.
- **IntersectionObserver fires on mount before video is ready:** the `v.play().catch(() => {})` swallows the AbortError that fires when play() is interrupted by pause(). Don't replace with a try/catch — the promise-catch is correct here.
- **Reduced motion not detected:** confirm `window.matchMedia('(prefers-reduced-motion: reduce)')` returns a MediaQueryList. The state setter runs in a `useEffect` so SSR doesn't crash on `window`.
- **`Image` import is now unused:** delete the import line at the top of `index.tsx`. The linter will catch this.

## Reporting back

```
[task4-video-swap] done — <commit sha> · video plays at /virtual-office, IntersectionObserver pauses on scroll, reduced-motion shows poster
```

If blocked:

```
[task4-video-swap] blocked — <reason>
```

End of brief.
