# Brief — Iso Floor v2 Tier 2 (Dashboard Chrome Wrap)

**Target agent:** Hermes + OpenCode Go + `deepseek-v4-pro` (fall back to `kimi-k2.6` if 200K context needed).
**Repo:** `/Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0`
**Branch:** `main`
**Already shipped:** Tasks 1–3 of v2 plus Tier 1 polish (modal spring, glass viewport, twinkle particles). Dev: `http://localhost:3001/agency`.
**Your job:** Wrap the iso-floor canvas with a control-room dashboard chrome (status bar, headline strip, stat strip, agent roster, activity feed). All SSE-driven where applicable. 2–3 hours, four atomic commits. No vision required.
**Why this matters:** the SSE binding currently only changes modal text. After Tier 2 it drives **five** surfaces: eyebrow chip, stat strip, roster panel, activity feed, modal. The floor goes from "cool illustration" to "operator cockpit."

---

## Read first (in order)

1. `src/components/agency-prototypes/proto-01-wireframe-main/index.tsx` — source of the chrome primitives (HeroFloor, Cap, Pill, Pawn, AnnoBar, sk-box). Treat as visual reference, NOT a copy target.
2. `src/components/agency-prototypes/proto-01-wireframe-main/styles.module.css` — the visual language for chrome (status-bar, roster-panel, activity feed). Proto-01 uses a cream/paper palette — translate to the dark palette below.
3. `src/components/agency-prototypes/proto-05-iso-floor/index.tsx` — current iso-floor state after Tier 1.
4. `src/hooks/useHermesState.ts` — existing SSE hook (you will extend this).
5. `src/app/api/hermes/state/route.ts` — existing SSE endpoint (you will extend this).

**Palette (use these hex codes only):**

- Background void: `#0a0e19`. Surface dark: `#0f131e`, surface card: `#171b27`, surface raised: `#262a36`.
- Text primary: `#dfe2f2`, text secondary: `#bbcac6`, text muted: `#859490`.
- Teal primary: `#4fdbc8`, teal glow: `#71f8e4`. Mint: `#A5D6A7`. Peach alert: `#ffb693`.
- Hairline border: `rgba(191, 201, 196, 0.12)`. Strong hairline: `rgba(191, 201, 196, 0.18)`.

Where proto-01 uses cream/paper (`#fbf6e9`, `var(--paper)`, etc.) — substitute with the dark equivalents above. Where proto-01 uses Caveat / Kalam fonts — substitute with `Plus Jakarta Sans` (matches the rest of proto-05).

---

## Final architecture

After all four tasks, `index.tsx` composes around the existing canvas:

```
<section className={styles.stage}>
  <div className={styles.particleLayer}>...</div>     ← from Tier 1
  <StatusBar />                                       ← Task 2.1
  <HeadlineStrip />                                   ← Task 2.2 (replaces current <header>)
  <div className={styles.canvas}>...iso-floor...</div> ← unchanged
  <StatStrip />                                       ← Task 2.3
  <div className={styles.dashboardGrid}>              ← Task 2.4
    <RosterPanel />
    <ActivityFeed />
  </div>
  <BookCallModal .../>
  <AgentZoneModal .../>
</section>
```

Five new component files inside `proto-05-iso-floor/`:

- `StatusBar.tsx`
- `HeadlineStrip.tsx`
- `StatStrip.tsx`
- `RosterPanel.tsx`
- `ActivityFeed.tsx`

All CSS goes into the existing `styles.module.css`. Keep one stylesheet for proto-05.

---

## Task 2.1 — StatusBar (~25 min)

Top bar with LED pulse + brand mark + version + nav links + live clock.

**Create `proto-05-iso-floor/StatusBar.tsx`:**

```tsx
'use client';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

export default function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const i = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className={styles.statusBar} role="banner">
      <div className={styles.statusGroup}>
        <span className={styles.led} aria-hidden="true" />
        <span className={styles.brand}>VERBAFLOW · AGENCY FLOOR</span>
        <span className={styles.version}>v3.2</span>
      </div>
      <div className={styles.statusGroup}>
        <a className={styles.statusNav} href="#services">SERVICES</a>
        <a className={styles.statusNav} href="#agents">AGENTS</a>
        <a className={styles.statusNav} href="#pricing">PRICING</a>
        <a className={styles.statusNav} href="https://cal.com/verbaflow" target="_blank" rel="noopener noreferrer">BOOK</a>
        <span className={styles.statusTime}>
          {time}<span className={styles.tz}> EST</span>
        </span>
      </div>
    </div>
  );
}
```

**Add to `styles.module.css`:**

```css
.statusBar {
  max-width: 1920px;
  margin: 0 auto 1rem;
  padding: 0.75rem 1.25rem;
  background: #0f131e;
  border-radius: 0.75rem;
  border: 1px solid rgba(191, 201, 196, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  color: #bbcac6;
  letter-spacing: 0.04em;
  position: relative;
  z-index: 1;
}

.statusGroup {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4fdbc8;
  box-shadow: 0 0 8px #4fdbc8;
  animation: pulse 2s ease-in-out infinite;
}

.brand {
  color: #A5D6A7;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.version, .statusNav {
  color: #859490;
  text-decoration: none;
  transition: color 0.2s ease;
}

.statusNav:hover { color: #4fdbc8; }

.statusTime {
  color: #dfe2f2;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 0.25rem;
}

.tz {
  color: #859490;
  font-weight: 400;
}

@media (max-width: 720px) {
  .statusGroup:last-child .statusNav { display: none; }
}
```

**Mount in `index.tsx`:** import `StatusBar`, render it inside `<section className={styles.stage}>` immediately after the particle layer.

**Verify:** status bar renders above canvas, LED pulses, time updates every second, nav links hidden on mobile.

**Commit:** `feat(iso-floor): status bar with brand, version, nav, live clock`

---

## Task 2.2 — HeadlineStrip (~25 min)

Two-column header: live eyebrow + headline + sub-copy on the left, two CTAs on the right. Replaces the current inline `<header>` block in `index.tsx`.

**Create `proto-05-iso-floor/HeadlineStrip.tsx`:**

```tsx
'use client';
import styles from './styles.module.css';
import { useHermesState } from '@/hooks/useHermesState';

const TOTAL_AGENTS = 6;

export default function HeadlineStrip() {
  const { agents } = useHermesState();
  const activeCount = Object.values(agents).filter((s) => s === 'busy' || s === 'blocked').length;
  const blockedCount = Object.values(agents).filter((s) => s === 'blocked').length;

  return (
    <header className={styles.headlineStrip}>
      <div className={styles.headlineLeft}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          <span>
            Live ·{' '}
            {activeCount > 0
              ? `${activeCount} of ${TOTAL_AGENTS} agents active`
              : `${TOTAL_AGENTS} agents on the floor`}
            {blockedCount > 0 && (
              <>
                {' · '}
                <span className={styles.eyebrowAlert}>{blockedCount} blocked</span>
              </>
            )}
          </span>
        </div>
        <h2 className={styles.title}>
          Step inside <span className={styles.titleAccent}>the agency.</span>
        </h2>
        <p className={styles.hint}>
          Click any zone. Book a discovery call at reception, or open an agent room to see who is
          running what right now.
        </p>
      </div>
      <div className={styles.headlineCtas}>
        <a
          className={styles.ctaPrimary}
          href="https://cal.com/verbaflow"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a session →
        </a>
        <a className={styles.ctaSecondary} href="#agents">
          Meet the agents
        </a>
      </div>
    </header>
  );
}
```

**Notice:** `useHermesState` is destructured `{ agents }`. This requires the hook signature change in Task 2.4. To unblock this task without breaking the hook contract, in **Task 2.2 only**, keep the existing `useHermesState()` signature returning `Record<string, AgentState>`:

```tsx
const agents = useHermesState();
```

When Task 2.4 lands the hook signature change, this destructure pattern will switch to `{ agents }`. Plan accordingly — do not edit the hook yet.

**Add to `styles.module.css` (extends existing eyebrow/title/hint styles):**

```css
.headlineStrip {
  max-width: 1920px;
  margin: 0 auto 2rem;
  padding: 0 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.headlineLeft { max-width: 32rem; }

.eyebrowAlert { color: #ffb693; font-weight: 600; }

.titleAccent { color: #4fdbc8; }

.headlineCtas {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.ctaPrimary {
  background: #4fdbc8;
  color: #003731;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.ctaPrimary:hover {
  background: #71f8e4;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(79, 219, 200, 0.25);
}

.ctaSecondary {
  background: transparent;
  color: #dfe2f2;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  border: 1px solid rgba(191, 201, 196, 0.2);
  transition: background 0.2s ease, border-color 0.2s ease;
}
.ctaSecondary:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(113, 248, 228, 0.4);
}
```

**Remove from `index.tsx`:** the existing inline `<header>` block (the one with `.eyebrow`, `.title`, `.hint`). Import and render `<HeadlineStrip />` in its place.

**Verify:** headline reads with live agent count, the count updates when SSE pushes new states. Blocked count appears in peach only when at least one agent is blocked. CTAs render with hover lift.

**Commit:** `feat(iso-floor): headline strip with live agent count and dual CTA`

---

## Task 2.3 — StatStrip (~30 min)

Three live metric cards below the canvas: Active projects | Agents busy | Next available slot.

**Create `proto-05-iso-floor/StatStrip.tsx`:**

```tsx
'use client';
import styles from './styles.module.css';
import { useHermesState } from '@/hooks/useHermesState';

const TOTAL_AGENTS = 6;
const ACTIVE_PROJECTS = 7; // TODO: drive from real source in future task
const NEXT_SLOT_LABEL = 'Today · 14:00 EST';
const NEXT_SLOT_URL = 'https://cal.com/verbaflow';

export default function StatStrip() {
  const agents = useHermesState(); // keep existing signature for Task 2.3
  const busyCount = Object.values(agents).filter((s) => s === 'busy').length;
  return (
    <div className={styles.statStrip}>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Active projects</div>
        <div className={styles.statValue}>{ACTIVE_PROJECTS}</div>
        <div className={styles.statSub}>across 4 industries</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Agents busy</div>
        <div className={`${styles.statValue} ${styles.statValueAccent}`}>
          {busyCount}/{TOTAL_AGENTS}
        </div>
        <div className={styles.statSub}>real-time from Hermes</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Next available slot</div>
        <div className={styles.statValueSmall}>{NEXT_SLOT_LABEL}</div>
        <div className={styles.statSub}>
          <a className={styles.statLink} href={NEXT_SLOT_URL} target="_blank" rel="noopener noreferrer">
            Take it →
          </a>
        </div>
      </div>
    </div>
  );
}
```

**Add to `styles.module.css`:**

```css
.statStrip {
  max-width: 1920px;
  margin: 1.5rem auto 0;
  padding: 0 1.25rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.statCard {
  background: #171b27;
  border-radius: 0.75rem;
  border: 1px solid rgba(191, 201, 196, 0.12);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.statLabel {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #859490;
  font-weight: 600;
}

.statValue {
  font-size: 2.5rem;
  font-weight: 700;
  color: #dfe2f2;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  margin-top: 0.25rem;
}

.statValueAccent { color: #4fdbc8; }

.statValueSmall {
  font-size: 1.25rem;
  font-weight: 700;
  color: #dfe2f2;
  line-height: 1.2;
  margin-top: 0.25rem;
}

.statSub {
  font-size: 0.8rem;
  color: #bbcac6;
  margin-top: 0.5rem;
}

.statLink {
  color: #4fdbc8;
  text-decoration: none;
  font-weight: 600;
}
.statLink:hover { color: #71f8e4; }

@media (max-width: 720px) {
  .statStrip { grid-template-columns: 1fr; }
}
```

**Mount in `index.tsx`:** render `<StatStrip />` immediately AFTER `</div>` closing the `.canvas`.

**Verify:** three cards render, stack on mobile, "Agents busy" updates live when SSE state changes.

**Commit:** `feat(iso-floor): stat strip with live agent count and booking shortcut`

---

## Task 2.4 — RosterPanel + ActivityFeed + Hook extension (~60 min)

This is the largest task. Three things change:

1. The SSE endpoint emits a second event shape carrying `events: ActivityEvent[]`.
2. The `useHermesState` hook returns BOTH `agents` and `events`, so its signature changes from `Record<string, AgentState>` to `{ agents, events }`.
3. Two new panels render below the stat strip in a two-column grid.

### 2.4.A — Extend the SSE endpoint

In `src/app/api/hermes/state/route.ts`, add a second checkpoint path for activity:

```ts
const CHECKPOINT = process.env.HERMES_CHECKPOINT_PATH
  ?? `${process.env.HOME}/.hermes/workspace_checkpoint.json`;
const ACTIVITY = process.env.HERMES_ACTIVITY_PATH
  ?? `${process.env.HOME}/.hermes/activity_log.json`;
```

Add an `emitActivity` function alongside the existing `emitCurrent`:

```ts
const emitActivity = async () => {
  if (!existsSync(ACTIVITY)) return send(controller, { events: [] });
  try {
    const raw = await readFile(ACTIVITY, 'utf8');
    const parsed = JSON.parse(raw);
    send(controller, { events: Array.isArray(parsed.events) ? parsed.events : [] });
  } catch {
    send(controller, { events: [] });
  }
};
```

Call it once at start AND wire a second watcher:

```ts
await emitCurrent();
await emitActivity();
if (existsSync(CHECKPOINT)) {
  watcher = watch(CHECKPOINT, { persistent: false }, () => { emitCurrent(); });
}
if (existsSync(ACTIVITY)) {
  activityWatcher = watch(ACTIVITY, { persistent: false }, () => { emitActivity(); });
}
```

Declare `let activityWatcher: ReturnType<typeof watch> | null = null;` at the top of the GET handler scope (next to the existing `watcher`).

Update `cancel()` to close both:

```ts
cancel() {
  closed = true;
  watcher?.close();
  activityWatcher?.close();
  if (keepAlive) clearInterval(keepAlive);
}
```

### 2.4.B — Extend the hook

Update `src/hooks/useHermesState.ts`:

```ts
'use client';
import { useEffect, useState } from 'react';

export type AgentState = 'idle' | 'busy' | 'blocked' | 'away';

export interface ActivityEvent {
  ts: string;
  agent: string;
  message: string;
  level: 'info' | 'warn' | 'success';
}

export interface HermesState {
  agents: Record<string, AgentState>;
  events: ActivityEvent[];
}

export function useHermesState(): HermesState {
  const [state, setState] = useState<HermesState>({ agents: {}, events: [] });
  useEffect(() => {
    const es = new EventSource('/api/hermes/state');
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setState((prev) => ({
          agents: parsed.agents ?? prev.agents,
          events: parsed.events ?? prev.events,
        }));
      } catch {}
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);
  return state;
}
```

### 2.4.C — Update existing callsites

Grep for all `useHermesState` callers and update the destructure pattern:

```bash
grep -rn "useHermesState" src/
```

Expected callers (after Tasks 2.2 and 2.3):

- `index.tsx` — change `const agents = useHermesState();` → `const { agents } = useHermesState();`
- `HeadlineStrip.tsx` — same change
- `StatStrip.tsx` — same change

### 2.4.D — Build RosterPanel and ActivityFeed

**Create `proto-05-iso-floor/RosterPanel.tsx`:**

```tsx
'use client';
import styles from './styles.module.css';
import { useHermesState, type AgentState } from '@/hooks/useHermesState';

const AGENTS = [
  { id: 'architect', label: 'Architect',         role: 'Plans & specs' },
  { id: 'backend',   label: 'Backend Engineer',  role: 'APIs & data' },
  { id: 'designer',  label: 'Designer',          role: 'Wireframes & tokens' },
  { id: 'delivery',  label: 'Delivery',          role: 'Pull requests & merges' },
  { id: 'validator', label: 'Validator',         role: 'Tests & reviews' },
  { id: 'marketing', label: 'Marketing',         role: 'Outreach & copy' },
] as const;

const STATE_LABEL: Record<AgentState, string> = {
  idle: 'Idle',
  busy: 'Building',
  blocked: 'Blocked',
  away: 'Away',
};

export default function RosterPanel() {
  const { agents } = useHermesState();
  return (
    <div className={styles.rosterPanel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Roster</h3>
        <span className={styles.panelMeta}>6 agents</span>
      </div>
      <div className={styles.rosterList}>
        {AGENTS.map((a) => {
          const state: AgentState = agents[a.id] ?? 'idle';
          return (
            <div key={a.id} className={styles.rosterRow}>
              <span className={`${styles.rosterDot} ${styles[`rosterDot--${state}`]}`} aria-hidden="true" />
              <div className={styles.rosterMain}>
                <div className={styles.rosterName}>{a.label}</div>
                <div className={styles.rosterRole}>{a.role}</div>
              </div>
              <span className={styles.rosterState}>{STATE_LABEL[state]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Create `proto-05-iso-floor/ActivityFeed.tsx`:**

```tsx
'use client';
import styles from './styles.module.css';
import { useHermesState, type ActivityEvent } from '@/hooks/useHermesState';

function formatRelative(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  if (Number.isNaN(diff)) return '';
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleString();
}

export default function ActivityFeed() {
  const { events } = useHermesState();
  const recent = events.slice(0, 8);
  return (
    <div className={styles.activityFeed}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Activity</h3>
        <span className={styles.panelMeta}>last 24h · live</span>
      </div>
      {recent.length === 0 ? (
        <div className={styles.activityEmpty}>
          No activity yet. Agents are warming up.
        </div>
      ) : (
        <div className={styles.activityList}>
          {recent.map((e: ActivityEvent, i: number) => (
            <div key={`${e.ts}-${i}`} className={`${styles.activityRow} ${styles[`activity--${e.level}`]}`}>
              <span className={styles.activityDot} aria-hidden="true" />
              <div className={styles.activityMain}>
                <div className={styles.activityMessage}>
                  <span className={styles.activityAgent}>{e.agent}</span> {e.message}
                </div>
                <div className={styles.activityTime}>{formatRelative(e.ts)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Add to `styles.module.css`:**

```css
.dashboardGrid {
  max-width: 1920px;
  margin: 1rem auto 0;
  padding: 0 1.25rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.rosterPanel, .activityFeed {
  background: #171b27;
  border-radius: 0.75rem;
  border: 1px solid rgba(191, 201, 196, 0.12);
  padding: 1.25rem;
}

.panelHeader {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(191, 201, 196, 0.08);
}

.panelTitle {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #dfe2f2;
  letter-spacing: -0.01em;
}

.panelMeta {
  font-size: 0.72rem;
  color: #859490;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
}

/* Roster */
.rosterList {
  display: flex;
  flex-direction: column;
}

.rosterRow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(191, 201, 196, 0.06);
}
.rosterRow:last-child { border-bottom: none; }

.rosterDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #859490;
}
.rosterDot--idle    { background: #859490; }
.rosterDot--busy    { background: #4fdbc8; box-shadow: 0 0 6px #4fdbc8; animation: pulse 2s ease-in-out infinite; }
.rosterDot--blocked { background: #ffb693; box-shadow: 0 0 6px #ffb693; animation: pulse 1.5s ease-in-out infinite; }
.rosterDot--away    { background: #3c4947; }

.rosterMain { flex: 1; min-width: 0; }
.rosterName { font-size: 0.9rem; font-weight: 600; color: #dfe2f2; }
.rosterRole { font-size: 0.72rem; color: #859490; margin-top: 0.1rem; }

.rosterState {
  font-size: 0.72rem;
  color: #bbcac6;
  font-weight: 600;
  letter-spacing: 0.04em;
}

/* Activity */
.activityEmpty {
  color: #859490;
  font-size: 0.9rem;
  padding: 1rem 0;
}

.activityList {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 24rem;
  overflow-y: auto;
}

.activityRow {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.4rem 0;
}

.activityDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4fdbc8;
  margin-top: 0.5rem;
  flex-shrink: 0;
}
.activity--success .activityDot { background: #A5D6A7; }
.activity--warn .activityDot    { background: #ffb693; }
.activity--info .activityDot    { background: #4fdbc8; }

.activityMain { flex: 1; min-width: 0; }
.activityMessage { font-size: 0.85rem; color: #dfe2f2; line-height: 1.4; }
.activityAgent { color: #4fdbc8; font-weight: 600; }
.activityTime {
  font-size: 0.7rem;
  color: #859490;
  margin-top: 0.15rem;
  letter-spacing: 0.03em;
}

@media (prefers-reduced-motion: reduce) {
  .rosterDot--busy, .rosterDot--blocked { animation: none; }
}

@media (max-width: 900px) {
  .dashboardGrid { grid-template-columns: 1fr; }
  .activityList  { max-height: 16rem; }
}
```

**Mount in `index.tsx`:**

```tsx
import RosterPanel from './RosterPanel';
import ActivityFeed from './ActivityFeed';

// ...inside the return, after <StatStrip />:
<div className={styles.dashboardGrid}>
  <RosterPanel />
  <ActivityFeed />
</div>
```

**Activity log contract** — Hermes writes `~/.hermes/activity_log.json` whenever an agent does something noteworthy:

```json
{
  "events": [
    { "ts": "2026-05-12T14:32:00Z", "agent": "Architect", "message": "committed plan v4", "level": "success" },
    { "ts": "2026-05-12T14:28:00Z", "agent": "Designer",  "message": "pinned new wireframe", "level": "info" },
    { "ts": "2026-05-12T14:15:00Z", "agent": "Validator", "message": "flagged PR #4221", "level": "warn" }
  ]
}
```

Most-recent event at index 0. The feed renders the first 8. If the file doesn't exist, show the empty state.

**Live-update test:**

```bash
cat > ~/.hermes/activity_log.json <<EOF
{"events":[{"ts":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","agent":"Architect","message":"committed plan v4","level":"success"}]}
EOF
```

The feed should reflect the new event within ~1 second of saving the file.

**Verify (all of 2.4):**

1. All 6 agents render in roster with state-colored dots.
2. Roster dots pulse only for busy/blocked.
3. Activity feed renders most-recent event at top.
4. Both panels stack on viewports under 900px.
5. Activity feed scrolls internally when more than ~8 events.
6. `prefers-reduced-motion: reduce` freezes the dot pulses.

**Commit:** `feat(iso-floor): dashboard with roster panel and live activity feed`

---

## Acceptance criteria (all four tasks)

1. `npm run build` exits 0.
2. `npm run dev` and `http://localhost:3001/agency` renders with all five new sections wrapping the canvas (StatusBar, HeadlineStrip, canvas, StatStrip, dashboardGrid).
3. SSE binding drives at minimum: eyebrow count, stat strip "Agents busy", roster dots, activity feed.
4. Mobile (≤720px): stat strip stacks, status bar nav hides, dashboard grid stacks at ≤900px.
5. `prefers-reduced-motion: reduce`: pulses on LED, roster dots, eyebrow dot, status dot all freeze.
6. Four atomic commits with the exact messages specified.
7. Push to `origin/main` after each commit.

## Execution order

**Strict order: 2.1 → 2.2 → 2.3 → 2.4.** Each builds on the layout from the previous. Don't skip ahead. Don't combine commits.

In 2.2 and 2.3, the hook still has the old signature `Record<string, AgentState>`. Callers use `const agents = useHermesState()`. Only Task 2.4 changes the hook signature, and only Task 2.4 fixes the callsites.

## Don't touch

- The 9 polygon `points` coordinates.
- Ambient glow positioning.
- Walking-path coordinates or random rotation.
- The static still PNG.
- Other prototypes (proto-01 through proto-04). You may read proto-01 for visual reference but do NOT extract / import / depend on its styles.

## If you get stuck

- TS errors after hook signature change: grep for `useHermesState` and update each callsite. Should be exactly three callers after Task 2.3.
- Activity log JSON malformed: the route catches parse errors and emits `events: []`. Don't propagate.
- File watch not triggering on macOS: confirm the file path (not directory). On macOS, `fs.watch` uses kqueue; works for single files.
- Status bar text overflowing on narrow viewports: nav links already hide below 720px via media query.
- Two SSE event types arriving interleaved: the hook merges them with `setState((prev) => ({ agents: parsed.agents ?? prev.agents, events: parsed.events ?? prev.events }))`. If you see flicker, double-check that both `parsed.agents` and `parsed.events` are guarded with `??`.

## Reporting back

After each commit:

```
[tier2-task-N] done — <commit sha> · <verification result>
```

If blocked:

```
[tier2-task-N] blocked — <reason>
```

End of brief.
