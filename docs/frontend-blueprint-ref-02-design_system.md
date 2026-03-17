# Universal Design System
## Patterns for Websites, Extensions, SaaS, and Apps

This reference covers reusable design patterns that apply across all frontend product types. These are the decisions that make products feel premium vs. amateur.

---

## Table of Contents
1. Color Architecture
2. Typography System
3. Spacing & Layout
4. Component Patterns
5. Animation Library
6. Dark Mode / Light Mode
7. Responsive Strategy
8. Accessibility Checklist
9. Performance Patterns
10. Icon & Illustration System

---

## 1. Color Architecture

### Token-Based Colors (Always)

Never hardcode hex values in components. Use CSS custom properties for theming:

```css
:root {
  --color-bg-primary: #080808;
  --color-bg-secondary: #0f1115;
  --color-bg-card: rgba(255, 255, 255, 0.03);
  --color-text-primary: #ffffff;
  --color-text-secondary: #7c7c7c;
  --color-border-subtle: rgba(255, 255, 255, 0.06);
  --color-border-default: rgba(255, 255, 255, 0.10);
  --color-accent: #2E75B6;
}
```

### Opacity-Based Borders (Kreos Pattern)

Use `rgba()` for borders instead of solid grays. This creates depth that adapts to any background:
- `rgba(255,255,255, 0.06)` — barely visible, separates sections
- `rgba(255,255,255, 0.10)` — default card borders
- `rgba(255,255,255, 0.15)` — strong, interactive element borders

### Accent Color Strategy

One primary accent + one per domain/category. Never more than 6 accent colors in one product.

---

## 2. Typography System

### Font Loading Best Practices

```tsx
// lib/fonts.ts (Next.js)
import { GeistSans, GeistMono } from 'geist/font';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
```

- Always `font-display: swap` — prevents invisible text during load
- Preload the primary font: `<link rel="preload" href="..." as="font">`
- Maximum 3-4 font families per product
- Weight range: 400 (body), 500 (emphasis), 600 (headings), 700 (display)

### Scale

Use a modular scale (1.25 ratio) for harmonious sizing:
```
11px  — labels, captions
14px  — body small
16px  — body default
20px  — heading small
24px  — heading medium
32px  — heading large
40px  — display medium
56px  — display large
72px  — display xl (hero only)
```

---

## 3. Spacing & Layout

### 8px Grid System

All spacing should be multiples of 8px (with 4px for micro-adjustments):
```
4px   — icon-to-text, tight internal
8px   — within component groups
16px  — between related components
24px  — section internal padding
32px  — between sections (mobile)
48px  — between sections (desktop, Kreos standard)
64px  — major section gaps
96px  — hero/section top padding
```

### Container Strategy

```css
/* Nested max-width for progressive containment */
.container-full { max-width: 2000px; margin: 0 auto; }
.container-content { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.container-narrow { max-width: 800px; margin: 0 auto; padding: 0 24px; }
```

---

## 4. Component Patterns

### Glass Card (Universal)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}
```

### Button System

Four states required for every CTA:
1. **Default**: Solid background, clear label
2. **Hover**: Lighter background, cursor pointer
3. **Active/Pressed**: `scale(0.98)` for tactile feedback
4. **Disabled**: `opacity: 0.6`, `cursor: not-allowed`

Plus two functional states:
5. **Loading**: Spinner + time estimate text
6. **Success**: Green background + checkmark

```tsx
// Primary
<button className="bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-all">

// Ghost
<button className="bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 py-3 px-6 rounded-xl transition-all">

// Icon
<button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all">
```

### Badge / Tag

```tsx
// Domain tag with accent color
<span style={{ backgroundColor: `${accent}15`, borderColor: `${accent}30`, color: accent }}
  className="text-xs font-medium px-2.5 py-1 rounded-full border">
  {label}
</span>
```

### Metric Card

```tsx
<div className="glass-card text-center">
  <Icon className="mx-auto mb-2 text-accent" size={20} />
  <p className="text-3xl font-bold text-white">{value}</p>
  <p className="text-sm text-zinc-400 mt-1">{label}</p>
  <p className="text-xs text-zinc-600 mt-0.5">{context}</p>
</div>
```

### Section Label

```tsx
<p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-4">{label}</p>
```

---

## 5. Animation Library

### Principles
- Animations should feel native, not decorative
- Use spring physics for interactive elements (stiffness: 300, damping: 30)
- Use ease curves for non-interactive (scroll-triggered) elements
- Respect `prefers-reduced-motion`

### Standard Animations (Framer Motion)

```typescript
// Fade up on scroll
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
};

// Stagger children
const stagger = {
  whileInView: { transition: { staggerChildren: 0.1 } },
};

// Content swap (tab/toggle)
const swap = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.25 },
};

// Counter (metric count-up)
function useCounter(end: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  // Animate from 0 to end using requestAnimationFrame
  // Trigger on intersection observer
}

// Panel slide (for overlays/sidebars)
const slideRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};
```

### Reduced Motion

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const safeTransition = prefersReducedMotion
  ? { duration: 0 }
  : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] };
```

---

## 6. Dark Mode / Light Mode

### Strategy
- Default to dark (modern, premium feel)
- Respect `prefers-color-scheme`
- Use CSS custom properties for instant switching
- Store preference in `localStorage` (websites) or `chrome.storage` (extensions)

### Implementation
```css
:root { /* dark by default */ }

[data-theme="light"] {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f4f2;
  --color-text-primary: #080808;
  --color-text-secondary: #7c7c7c;
  --color-border-subtle: rgba(0, 0, 0, 0.06);
  --color-border-default: rgba(0, 0, 0, 0.10);
}
```

---

## 7. Responsive Strategy

### Breakpoints (Kreos-Aligned)
```
390px   — Mobile (iPhone baseline)
640px   — Mobile landscape / small tablet
810px   — Tablet (Kreos tablet breakpoint)
1024px  — Small desktop
1200px  — Desktop (Kreos desktop breakpoint)
1440px  — Large desktop (max content width)
2000px  — Ultra-wide (Kreos full-width)
```

### Mobile-First Patterns
- Stack all layouts vertically by default
- Use `min-width` media queries to add complexity
- Touch targets: minimum 44×44px
- No hover-dependent interactions (add tap alternatives)

---

## 8. Accessibility Checklist

- [ ] Color contrast 4.5:1 (body text), 3:1 (large text, icons)
- [ ] All interactive elements keyboard-focusable
- [ ] Visible focus rings (outline, not just color change)
- [ ] `aria-labels` on icon-only buttons
- [ ] `prefers-reduced-motion` respected
- [ ] Semantic HTML (`nav`, `main`, `section`, `article`, `footer`)
- [ ] Skip-to-content link
- [ ] Form inputs have associated labels
- [ ] Error states use color + icon + text (not color alone)
- [ ] Tab order follows visual order

---

## 9. Performance Patterns

### Bundle Size
- Dynamic imports for below-fold components
- Tree-shake icon libraries (import individual icons, not entire library)
- Analyze with `next build --analyze` or `vite-bundle-visualizer`

### Images
- Next.js `<Image>` with WebP format
- Lazy load below-fold images
- Explicit `width` and `height` to prevent CLS
- LQIP (Low Quality Image Placeholder) for large images

### Fonts
- `font-display: swap`
- Preload primary font
- Subset to Latin if no other scripts needed

### CSS
- Tailwind purges unused classes automatically
- Avoid `@apply` in production — inline utilities are smaller
- CSS custom properties don't add to bundle (computed at runtime)

---

## 10. Icon & Illustration System

### Lucide React (Recommended)
```tsx
import { Heart, TrendingUp, Cloud, Brain, Code, Truck } from 'lucide-react';
```

- Consistent 24×24 viewBox
- Stroke-based (scales cleanly)
- Tree-shakeable (only imported icons ship)
- Use `size` prop for sizing, `className` for color

### Icon Badge Pattern
```tsx
<div className="bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl w-9 h-9 flex items-center justify-center shadow-lg">
  <Heart size={18} className="text-white" />
</div>
```
