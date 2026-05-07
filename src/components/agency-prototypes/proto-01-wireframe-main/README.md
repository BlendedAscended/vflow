# Proto 01 — Wireframe Main

**Source:** `Agency Wireframes.html` from `Agency (1).zip` (Apr 26, 2026)
**Direction:** B + D — top-down blueprint floor with animated task-flow lines

## Contents

- **Main component** (`index.tsx`): Full agency wireframe including header strip, section nav, hero floor, live ops, services, agents roster with profile drawer, how-it-works steps, pricing tiers, and CTA section — all inside a mock browser frame
- **VerbaFlow Hologram Floor** (`VerbaFloor.tsx`): Animated SVG floor plan with 7 zones, compute streams, ticket-flow animation, context cache node, CEO approval gate, and Daemon dispatch feed terminal
- **CSS Module** (`styles.module.css`): All styles extracted from the original inline `<style>` block, kept as CSS module classes

## Notes

- Tweaks panel (`tweaks-panel.jsx`) excluded per architecture plan — world/timeOfDay/occupancy hardcoded to `hologram/morning/crowded`
- CDN React (unpkg) replaced with Next.js built-in React 19
- `window.VerbaFlowHologramFloor` replaced with proper TypeScript module export
- Google Fonts (Caveat, Kalam, Architects Daughter, DM Sans, DM Mono) loaded via `next/head`
- All `class` attributes converted to `className={styles['class-name']}` for CSS modules
- Inline styles converted to React `style={{...}}` objects
- Void elements closed (`<img />`, `<br />`, `<hr />`, `<input />`)
