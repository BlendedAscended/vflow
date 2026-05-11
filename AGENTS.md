# VerbaFlow 2.0 — Company Website

## Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS:** Sanity v3 (studio at `/sanity`)
- **ORM:** Prisma (schema at `prisma/`)
- **3D:** React Three Fiber + Spline
- **Animation:** GSAP
- **Deployment:** Vercel

## Key Paths
- `app/` — Next.js App Router pages
- `components/` — React components
- `sanity/` — Sanity CMS config & schemas
- `prisma/` — Database schema
- `public/` — Static assets
- `docs/` — Project documentation

## Obsidian Vault

Cross-tool knowledge base: `~/Documents/Obsidian Vault`
- Project status: [[Projects/VerbaFlow]]
- Daily notes: `Daily/YYYY-MM-DD.md`
- Export LLM outputs: `Outputs/LLM/`

## Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npx sanity dev    # Start Sanity Studio
```

## Notes
- Project name in package.json is `vflow1.0` (legacy, don't rename)
- Uses Sanity for blog/content management
- Spline for 3D hero sections
- GSAP for scroll animations