# Mini Prompt — DonPortfolio Analysis

> ✅ COMPLETED — 2026-03-16
> Repo is live at https://github.com/BlendedAscended/DonPortfolio.git
> Analysis fetched directly from GitHub. Key findings summarized below.

---

## Summary of Findings

| Property | Value |
|---|---|
| Framework | Next.js 16.1.6, App Router |
| Language | TypeScript 5 |
| React version | 19.2.3 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Icons | lucide-react |
| UI primitives | @radix-ui/react-slot |
| Fonts | next/font/google — Geist, Geist Mono, Inter |
| **Environment variables** | **None** (fully static, no backend) |
| External APIs | None (Sanity/Resend/GA planned but not wired) |
| Dev port | 3000 (default) |
| Production port | 3001 (PM2 env config) |
| Build command | `npm run build` |
| Output directory | `.next/` |
| CMS | None |

## ⚠️ Critical: Subdirectory Structure

The Next.js app lives in a **`portfolio/` subdirectory**, NOT the repo root:

```
DonPortfolio/                        ← git repo root
├── portfolio/                       ← Next.js app root (cd here for all npm commands)
│   ├── package.json
│   ├── next.config.ts
│   ├── ecosystem.config.js          ← already has PM2 config for port 3001
│   ├── .github/workflows/deploy.yml ← ⚠️ WRONG LOCATION — GitHub ignores this
│   └── src/
├── aiml_knowledge_base.md
├── finance_knowledge_base.md
└── health_knowledge_base.md
```

**Problem:** GitHub Actions only reads `.github/workflows/` at the **repo root**.
The workflow at `portfolio/.github/workflows/deploy.yml` will never trigger.

**Fix:** The workflow file needs to move to the repo root (see Prompt 04 for solution).

## .env.example

No `.env.example` needed — the project has zero environment variable dependencies.
If GA / Resend are added later:

```bash
# Future (not needed yet)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# RESEND_API_KEY=re_xxxx
```

---

**See `docs/prompts/04-portfolio-migration.md` for full deployment steps.**
