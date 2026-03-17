# Chrome Extension Best Practices
## Battle-Tested from Resume Chameleon Production Development

This guide consolidates every bottleneck, fix, and pattern discovered building market-quality Chrome extensions with content script overlays.

---

## Table of Contents
1. CSS Isolation (Shadow DOM — Non-Negotiable)
2. Pointer Events Architecture
3. MV3 Service Worker Wake-Up Race
4. Icon Click Pattern
5. Visual Design System
6. Animation Patterns
7. Form Controls & Button States
8. Chrome OAuth (Google Sign-In via Supabase)
9. Build System (Vite + CRXJS)
10. Debugging Checklist
11. Quick-Start Template
12. Market Positioning

---

## 1. CSS Isolation: Always Use Shadow DOM

Any React/HTML UI injected into a third-party page MUST use Shadow DOM. No exceptions.

### Why other approaches fail

| Approach | What breaks |
|---|---|
| `all: initial` on root container | Only stops inheritance. External CSS cascades still match and override |
| CSS Modules / scoped classes | Prevents class name collisions but not external cascade |
| `@tailwind utilities` as content_scripts.css | Host page's CSS loads first; yours gets overridden |
| `!important` everywhere | LinkedIn, Google, Twitter also use `!important`. Specificity war. |

### The correct setup

```typescript
// main.tsx
import cssText from './index.css?inline'  // ?inline = string, NOT page stylesheet

function mount() {
  const host = document.createElement('div')
  host.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:0;z-index:2147483647;pointer-events:none;overflow:visible;display:block'

  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = cssText
  shadow.appendChild(style)

  const mountPoint = document.createElement('div')
  shadow.appendChild(mountPoint)

  document.body.appendChild(host)
  createRoot(mountPoint).render(<App />)
}
```

```css
/* index.css */
@import "tailwindcss";

:host {
  all: initial;
  display: block;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
```

**Verification**: After build, `cat dist/manifest.json` — content_scripts should have ONLY a `"js"` key, no `"css"` key.

---

## 2. Pointer Events Architecture

Content script overlays must be "click-through" by default (user interacts with host page) but "clickable" on interactive elements.

```
Shadow host:      pointer-events: none    (inline style — immune to cascade)
  └─ Shadow root
       └─ React tree
            ├─ Backdrop div:   pointer-events-auto  (blocks host page when panel open)
            └─ Panel div:      pointer-events-auto  (receives panel interactions)
                  └─ Buttons, inputs...             (inherit auto from panel)
```

`pointer-events` is inherited and crosses the shadow boundary. Every interactive container must explicitly set `pointer-events: auto`.

---

## 3. MV3 Service Worker Wake-Up Race

Background service workers in MV3 sleep after ~30s. Content script messages may arrive before the listener is registered.

**Symptom**: `"Receiving end does not exist"` error.

**Fix**: Retry wrapper for content script → background communication:

```typescript
function sendMsg(msg: object, retries = 4, delayMs = 250): Promise<any> {
  return new Promise((resolve) => {
    const attempt = (remaining: number) => {
      chrome.runtime.sendMessage(msg, (response) => {
        if (chrome.runtime.lastError) {
          if (remaining > 0) setTimeout(() => attempt(remaining - 1), delayMs)
          else resolve(null)
        } else resolve(response)
      })
    }
    attempt(retries)
  })
}
```

---

## 4. The Icon Click Pattern

Never auto-show overlay on page load. Show on icon click, hide on backdrop click or X.

```typescript
// background.ts
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return
  chrome.tabs.sendMessage(tab.id, { action: 'toggle' }, () => {
    void chrome.runtime.lastError
  })
})
```

**Required**: `"action": { "default_title": "YourExtension" }` in manifest.json — without it, `chrome.action.onClicked` never fires.

---

## 5. Visual Design System (Dark Glassmorphism)

```
Background:  bg-zinc-950/95 + backdrop-blur-2xl
Border:      border border-white/10
Cards:       bg-white/5 border border-white/8 rounded-2xl
Text primary: text-white
Text secondary: text-zinc-400
Accent:      bg-gradient-to-tr from-blue-600 to-indigo-500
CTA button:  bg-blue-600 hover:bg-blue-500 rounded-2xl
Success:     bg-emerald-600 hover:bg-emerald-500
Dividers:    border-white/8
```

### Panel Anatomy (Right-Side Portrait)
```
┌─────────────────┐
│ Header          │  Logo + App name + Close (X)
│─────────────────│
│ Body            │  Scrollable content (flex-1 overflow-y-auto)
│─────────────────│
│ Footer          │  Sticky CTA + utility links (flex-shrink-0)
└─────────────────┘
```

Width: 400px standard. Never wider than 480px.

---

## 6. Animation (Framer Motion)

```tsx
// Backdrop fade
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
  className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
/>

// Panel spring slide
<motion.div
  initial={{ x: '100%', opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: '100%', opacity: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
/>
```

Framer Motion `motion.div` renders inline — works perfectly inside shadow root.

---

## 7. Button States (All Four Required)

Every CTA needs: default, hover, loading, success states. Use separate elements for loading (not disabled button). Loading state should show time estimate ("Generating… ~12s") to reduce abandonment.

---

## 8. Chrome OAuth via Supabase

Flow: `chrome.identity.launchWebAuthFlow` → Supabase `/auth/v1/authorize?provider=google` → Google consent → token exchange → `chrome.storage.local.set({ session })`.

**Critical**: Do NOT add `&response_type=token` to Supabase URL. Supabase handles its own token exchange.

**Redirect URL**: `chrome.identity.getRedirectURL()` → whitelist in Supabase dashboard.

---

## 9. Build System

```
React 19 + TypeScript
Tailwind v4 (@tailwindcss/postcss)
Vite 7
@crxjs/vite-plugin 2.0.0-beta.33
```

**CRXJS gotchas**: Auto-injects CSS from bare imports (use `?inline`). Auto-generates `web_accessible_resources`. Source manifest in `public/manifest.json`, never edit `dist/manifest.json`.

---

## 10. Debugging Checklist

1. Content script running? Check background console.
2. Shadow DOM mounting? `document.getElementById('host').shadowRoot`
3. CSS in shadow root? Look for `<style>` tag inside shadow root.
4. Manifest correct? `content_scripts` should have `js` but no `css`.
5. Icon click working? Manifest needs `"action": {}`. No `default_popup`.
6. Service worker sleeping? Normal. Add retries.
7. OAuth broken? Check auth URL manually. Verify redirect URL whitelisted.

---

## 11. Quick-Start Template

```
extension/
  public/manifest.json
  src/main.tsx, App.tsx, background.ts, index.css
  vite.config.ts, tailwind.config.js, postcss.config.cjs
  package.json, tsconfig.json
```

---

## 12. Market Positioning

Premium extension traits: only appears when asked, fast first paint (<200ms), respects host page, dark theme matches OS, one clear CTA above fold, micro-animations.

Extension width: 400px standard, 320px for data-dense, never >480px.

CTA copy: Active verb + outcome ("Generate Tailored Resume", not "Submit").
