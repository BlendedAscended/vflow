# Verbaflow UI Kit — Marketing surface

Dark-default teal + mint pill buttons. The vflow homepage in one clickable HTML file.

## What's in here

| File | What it does |
|---|---|
| `index.html` | Composes everything in a scrollable home page |
| `Nav.jsx` | Sticky floating-pill nav with services dropdown + 13g CTA |
| `Hero.jsx` | Healthie-style video hero + glass stat card |
| `StatsBand.jsx` | Three big animated counters |
| `Services.jsx` | DNA-helix viz + service cards + pricing quiz panel |
| `Marquee.jsx` | Big-text section divider with ✦ separators |
| `Pricing.jsx` | Scope / Deploy / Operate tier cards |
| `Testimonials.jsx` | Client quotes, healthcare/fintech/nursing/trades |
| `Footer.jsx` | Logo + nav + social + copyright |

## Open

```
open ui_kits/marketing/index.html
```

## Notes

- The 13g CTA (pill with dark circular arrow) is the **only** primary CTA in nav. Everywhere else use either the solid mint pill (`Get my growth plan`) or the ghost outline.
- Hero headline uses `font-weight: 500` (medium). Section H2s use `800`.
- All sections respect `prefers-reduced-motion` for the counter and helix.
- Theme defaults to **dark**. Toggle implemented but not surfaced in this kit.
