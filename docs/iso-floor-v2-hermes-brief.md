# Brief — Iso Floor v2 Enhancements (No Vision Required)

**Target agent:** Hermes + OpenCode Go + `deepseek-v4-pro` (fall back to `kimi-k2.6` if context overflows).
**Repo:** `/Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0`
**Branch:** `main` (push directly after each task — small focused commits).
**Already shipped (commit `6241df4`):** `proto-05-iso-floor` registered in agency prototypes with 9 click hotspots, two modals, hover label. Dev server: `npm run dev` → `http://localhost:3001/agency` (port 3001 because 3000 is occupied).
**Your job:** ship four v2 enhancements as separate atomic commits. No image recognition needed. All work stays inside the `proto-05-iso-floor/` folder plus one new API route + one new hook.

---

## Read first (in order, no edits yet)

1. `src/components/agency-prototypes/proto-05-iso-floor/index.tsx` — current state of the IsoFloor component.
2. `src/components/agency-prototypes/proto-05-iso-floor/styles.module.css` — palette tokens, hover styles, modal styles.
3. `src/components/agency-prototypes/proto-05-iso-floor/AgentZoneModal.tsx` — agent state modal contract.
4. `src/components/agency-prototypes/proto-05-iso-floor/BookCallModal.tsx` — Reception modal.
5. `src/components/agency-prototypes/registry.ts` — proto registration pattern.
6. `docs/iso-floor-inputs/floor-still-LOCKED.png` — the still you are augmenting. Do not regenerate it.

**Palette (use these exact hex codes, no others):**
- Background void: `#0a0e19`
- Surface dark: `#0f131e`, surface card: `#171b27`, surface raised: `#262a36`
- Text primary: `#dfe2f2`, text secondary: `#bbcac6`, text muted: `#859490`
- Teal primary: `#4fdbc8`, teal glow: `#71f8e4`
- Mint brand: `#A5D6A7`, peach alert: `#ffb693`

---

## Tasks (commit one at a time, in priority order)

### Task 1 — Ambient motion (CSS + small JSX, ~30 min)

Make the floor feel alive without modifying the still. Add six absolutely-positioned `<div className={styles.ambientGlow}>` elements inside the `.canvas` container in `index.tsx`, each with `pointer-events: none` and a teal `box-shadow` pulse animation.

Each glow sits over a "hot" feature in the still. Use percentage-of-canvas positioning so the glows track with the responsive image.

**Starting coordinates (calibrate in browser if visually off):**

| Glow | top | left | width | height |
|---|---|---|---|---|
| Reception screen | 22% | 6%  | 60px | 40px |
| Conference screen | 12% | 30% | 80px | 40px |
| Sales chart | 42% | 40% | 70px | 60px |
| Architect blueprint | 18% | 60% | 100px | 60px |
| Backend coffee steam | 22% | 88% | 30px | 50px |
| Designer easel | 50% | 80% | 80px | 80px |

**Animation:**
- `box-shadow: 0 0 8px rgba(113, 248, 228, 0.4)` → `0 0 20px rgba(113, 248, 228, 0.9)` → back
- Duration: 2.4s, ease-in-out, infinite
- Stagger via `animation-delay` of 0s, 0.4s, 0.8s, 1.2s, 1.6s, 2.0s so the six pulses are out of phase
- Respect `prefers-reduced-motion: reduce` — animations freeze, opacity drops to 0.5

**Verify:** `npm run dev`, scroll to proto-05. Six soft glows pulse out of phase. Compile clean.

**Commit:** `feat(iso-floor): ambient glow pulses on six hot zones`

---

### Task 2 — SSE state binding to Hermes (~2h)

Wire the AgentZoneModal's state field to real data streaming from `~/.hermes/workspace_checkpoint.json`.

**New file `src/app/api/hermes/state/route.ts`:**

```ts
import { readFile } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';

const CHECKPOINT = process.env.HERMES_CHECKPOINT_PATH
  ?? `${process.env.HOME}/.hermes/workspace_checkpoint.json`;

export const dynamic = 'force-dynamic';

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (data: object) =>
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));

      const emitCurrent = async () => {
        if (!existsSync(CHECKPOINT)) return send({ agents: {} });
        try {
          const raw = await readFile(CHECKPOINT, 'utf8');
          send(JSON.parse(raw));
        } catch {
          send({ agents: {} });
        }
      };

      await emitCurrent();
      const watcher = watch(CHECKPOINT, { persistent: false }, () => { emitCurrent(); });
      const keepAlive = setInterval(() => controller.enqueue(enc.encode(': ping\n\n')), 15000);

      // Cleanup on cancel
      return () => { watcher.close(); clearInterval(keepAlive); };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
```

**New file `src/hooks/useHermesState.ts`:**

```ts
'use client';
import { useEffect, useState } from 'react';

export type AgentState = 'idle' | 'busy' | 'blocked' | 'away';

export function useHermesState(): Record<string, AgentState> {
  const [state, setState] = useState<Record<string, AgentState>>({});
  useEffect(() => {
    const es = new EventSource('/api/hermes/state');
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed?.agents) setState(parsed.agents);
      } catch {}
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);
  return state;
}
```

**Modify `proto-05-iso-floor/index.tsx`:**
- Import `useHermesState` from `@/hooks/useHermesState`
- Call it at the top of `IsoFloor()` to get `const agents = useHermesState();`
- When constructing `activeAgent`, replace the hardcoded `state: 'idle' as const` with `state: (agents[activeZone.id] ?? 'idle') as AgentState`
- Import `AgentState` type from the hook

**Modify `AgentZoneModal.tsx`:**
- No content changes needed (STATE_LABEL is already complete)
- Add a CSS class to the `.statusRow` based on the state: `styles[`statusRow--${agent.state}`]`
- In `styles.module.css`, add four variants:
  - `.statusRow--idle` → existing teal (no change)
  - `.statusRow--busy` → background `rgba(79, 219, 200, 0.18)`, dot stays teal
  - `.statusRow--blocked` → background `rgba(255, 182, 147, 0.18)`, dot becomes peach `#ffb693`
  - `.statusRow--away` → background `rgba(133, 148, 144, 0.18)`, dot becomes muted grey `#859490`, no pulse

**Telemetry contract** (San or Hermes will write this on every state change):

```json
{
  "updated_at": "2026-05-11T22:45:00Z",
  "agents": {
    "architect": "busy",
    "backend":   "idle",
    "designer":  "idle",
    "delivery":  "idle",
    "marketing": "idle",
    "validator": "idle"
  }
}
```

If the file doesn't exist, the modal falls back to all-idle. Never throw.

**Verify:**
1. `npm run dev`, open `/agency`, click any agent zone — modal shows "Idle. Ready for the next task."
2. In a second terminal: `echo '{"updated_at":"now","agents":{"architect":"busy"}}' > ~/.hermes/workspace_checkpoint.json`
3. Refresh the agency page, open the Architect modal — it now reads "Currently building." with the busy styling
4. No console errors. SSE connection visible in Network tab as `state` with `eventsource` type.

**Commit:** `feat(iso-floor): SSE binding to Hermes workspace checkpoint`

---

### Task 3 — Walking-along-paths animation (~3-4h)

Add small teal dots that travel along the dashed walking paths visible in the still. No image inspection needed — path coordinates are pre-computed below in viewBox 2752×1536 space.

**Hardcode these path definitions inside `index.tsx`:**

```ts
const WALKING_PATHS: Array<{ id: string; from: string; to: string; d: string }> = [
  { id: 'p-conference-architect', from: 'conference', to: 'architect',  d: 'M 1180 350 Q 1400 300 1700 350' },
  { id: 'p-architect-designer',   from: 'architect',  to: 'designer',   d: 'M 1810 600 Q 1900 700 2400 900' },
  { id: 'p-backend-designer',     from: 'backend',    to: 'designer',   d: 'M 2440 700 Q 2400 800 2400 900' },
  { id: 'p-sales-delivery',       from: 'sales',      to: 'delivery',   d: 'M 1240 980 Q 1400 1100 1620 1200' },
  { id: 'p-marketing-validator',  from: 'marketing',  to: 'validator',  d: 'M 350 1200 Q 500 1300 900 1300' },
  { id: 'p-validator-delivery',   from: 'validator',  to: 'delivery',   d: 'M 940 1300 Q 1100 1300 1620 1300' },
];
```

**Rendering inside the existing hitmap SVG (before the polygons block):**

```tsx
<defs>
  {WALKING_PATHS.map((p) => (
    <path key={p.id} id={p.id} d={p.d} fill="none" />
  ))}
</defs>
{/* Always-visible faint dashed path tracks */}
{WALKING_PATHS.map((p) => (
  <path
    key={`track-${p.id}`}
    d={p.d}
    fill="none"
    stroke="rgba(79, 219, 200, 0.15)"
    strokeWidth="3"
    strokeDasharray="10 8"
  />
))}
{/* Walking dots — one per active animation */}
{activeWalks.map((walkId) => (
  <circle key={walkId} r="9" fill="#71f8e4" opacity="0.95">
    <animateMotion
      dur="2.5s"
      repeatCount="1"
      onEnd={() => removeWalk(walkId)}
    >
      <mpath href={`#${walkId.split('::')[0]}`} />
    </animateMotion>
    <animate
      attributeName="opacity"
      values="0;0.95;0.95;0"
      keyTimes="0;0.15;0.85;1"
      dur="2.5s"
      repeatCount="1"
    />
  </circle>
))}
```

**Trigger logic — random rotation every 8-12 seconds:**

```ts
const [activeWalks, setActiveWalks] = useState<string[]>([]);

useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let alive = true;
  const tick = () => {
    if (!alive) return;
    const path = WALKING_PATHS[Math.floor(Math.random() * WALKING_PATHS.length)];
    const walkId = `${path.id}::${Date.now()}`;
    setActiveWalks((w) => [...w, walkId]);
    setTimeout(() => setActiveWalks((w) => w.filter((id) => id !== walkId)), 2600);
    const next = 8000 + Math.random() * 4000;
    setTimeout(tick, next);
  };
  const initial = setTimeout(tick, 3000);
  return () => { alive = false; clearTimeout(initial); };
}, []);

const removeWalk = (id: string) => setActiveWalks((w) => w.filter((x) => x !== id));
```

**Reduced motion:** the useEffect already short-circuits. The dashed path tracks remain visible (no animation, just static lines).

**Verify:** open `/agency`, scroll to proto-05. Every 8-12 seconds a teal dot traverses a different path over 2.5s with a soft fade-in/out. Tracks are always visible as faint dashed teal lines. Test in DevTools with `prefers-reduced-motion: reduce` — tracks stay visible, dots never appear.

**Commit:** `feat(iso-floor): walking dot animations along zone paths`

---

### Task 4 — Seedance loop swap (~1h, BLOCKED on video file)

This task is blocked until San generates a 10-second Seedance parallax video from the locked still. He will save it as `public/agency/iso-floor.mp4`. Until then, **skip this task** and proceed.

When the file exists:

In `index.tsx`, swap the `<Image>` element for a `<video>`:

```tsx
<video
  ref={videoRef}
  className={styles.still}
  poster="/agency/iso-floor.png"
  autoPlay loop muted playsInline
  preload="metadata"
>
  <source src="/agency/iso-floor.av1" type="video/mp4; codecs=av01.0.05M.08" />
  <source src="/agency/iso-floor.mp4" type="video/mp4" />
</video>
```

Add IntersectionObserver to pause when out of viewport:

```ts
useEffect(() => {
  if (!videoRef.current) return;
  const v = videoRef.current;
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) v.play().catch(() => {});
    else v.pause();
  }, { threshold: 0.1 });
  obs.observe(v);
  return () => obs.disconnect();
}, []);
```

Keep the existing `.still` CSS — `object-fit: cover` already applies. Add `pointer-events: none` if not already.

**Verify:** video autoplays, loops seamlessly, pauses when scrolled out of view, falls back to poster PNG if video fails.

**Commit:** `feat(iso-floor): replace static still with Seedance parallax loop`

---

## Don't touch

- Other prototypes (`proto-01` through `proto-04`)
- The 9 polygon `points` strings in `index.tsx`'s `ZONES` array (San calibrates manually)
- The `AGENT_DETAILS` content (role/stack copy is locked)
- Any route, API, page, or component outside `proto-05` and the new `/api/hermes/state` + `useHermesState` files
- The locked still image (`public/agency/iso-floor.png`)

## Acceptance criteria (per commit)

1. `npm run build` exits 0
2. `npm run dev` and `http://localhost:3001/agency` renders without console errors
3. `prefers-reduced-motion: reduce` halts ambient pulses, walking dots, and video autoplay
4. Each task is one atomic commit with the conventional commit message specified
5. After each commit, push to `origin/main`
6. No changes outside the scope listed above

## If you get stuck

- TypeScript errors: read the existing component for patterns. `AgentDetail` type lives in `AgentZoneModal.tsx`. Re-export `AgentState` from the hook if needed.
- SSE not streaming: confirm `dynamic = 'force-dynamic'` and that the route compiles. Test with `curl -N http://localhost:3001/api/hermes/state`.
- `fs.watch` not firing: use the file path directly, not the parent directory. On macOS, `fs.watch` is `kqueue`-based and works for single files.
- Walking dots not appearing: verify the `<animateMotion>` is inside the `<circle>`, not a sibling. Check that the `<mpath>` href matches the `<path id>` exactly.
- Build fails on Next.js Image type: the swap to `<video>` removes the `Image` import — clean up the unused import.

## Reporting back to San

After each commit, post a one-line status to standard output:
```
[v2-task-N] done — <commit sha> · <verification result>
```

If blocked, post:
```
[v2-task-N] blocked — <reason> · <what San needs to provide>
```

End of brief.
