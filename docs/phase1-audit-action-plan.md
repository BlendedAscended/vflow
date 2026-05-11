# vflow2.0 Phase 1 Audit — Prioritized Action Plan

Generated: 2026-05-10

---

## CRITICAL (Blocks Build/Runtime)

### 1. Create .env.local with all required environment variables
**Source:** t_b7f8dd33, t_2bf80329  
**Impact:** Build passes but runtime database connections fail

Required variables:
```bash
# Prisma/Database
DATABASE_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=2025-09-17
SANITY_API_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_GROWTH_PLAN_PRICE_ID=
NEXT_PUBLIC_STRIPE_PRICE_COUPE=
NEXT_PUBLIC_STRIPE_PRICE_MUSCLE=
NEXT_PUBLIC_STRIPE_PRICE_GRAND_TOURER=
NEXT_PUBLIC_STRIPE_PRICE_SIMPLE=

# Gemini
GEMINI_API_KEY=

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Fix Prisma schema datasource
**Source:** t_2bf80329  
**File:** `prisma/schema.prisma`  
**Issue:** Datasource lacks `url` field

Add to schema:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Initialize Prisma migrations
**Source:** t_2bf80329  
**Impact:** Database schema cannot be applied

```bash
npx prisma migrate dev --name init
```

---

## HIGH (Broken Features Without Env Vars)

These features will fail silently or throw errors without proper env vars:

| Feature | Missing Vars | Impact |
|---------|--------------|--------|
| Database queries | DATABASE_URL | All Prisma operations fail |
| Auth/Supabase | SUPABASE_* | User auth, protected routes broken |
| Stripe payments | STRIPE_* | Checkout fails, pricing unavailable |
| Sanity write ops | SANITY_API_TOKEN | Contact forms, chat logs fail |
| Gemini AI | GEMINI_API_KEY | AI features unavailable |
| Email sending | RESEND_API_KEY | Contact notifications fail |

---

## MEDIUM (Missing Config / Technical Debt)

### 4. Clean up ESLint warnings (13 total)
**Source:** t_72012843  
**Status:** Non-blocking, but noisy

- 10 unused variables across components
- 3 custom font pages without proper config

### 5. Verify Supabase connection post-fix
**Source:** t_2bf80329  
**Note:** Connection could not be verified without DATABASE_URL

---

## LOW (Improvements)

### 6. Runtime env var handling
**Source:** t_72012843  
**Status:** Already gracefully handled with console.warn

The build now uses fallback values with warnings instead of throwing. Good defensive pattern.

---

## Summary Stats

| Category | Count |
|----------|-------|
| Critical | 3 |
| High | 6 |
| Medium | 2 |
| Low | 1 |
| **Total Action Items** | **12** |

### Parent Task Coverage
- ✅ t_72012843: Build pipeline audit
- ✅ t_b7f8dd33: Environment variables check
- ✅ t_2bf80329: Prisma schema review
- ✅ t_33faaf55: Sanity CMS config review
- ✅ t_4045542e: Site architecture audit

---

## Recommended Execution Order

1. **Immediate:** Create `.env.local` with real credentials
2. **Day 1:** Fix Prisma schema + run migrations
3. **Day 2:** Verify all integrations (Supabase, Stripe, Sanity, Gemini)
4. **Week 1:** Clean ESLint warnings
