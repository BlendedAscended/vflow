# SaaS / Web App Architecture Patterns
## Best Practices for Production Web Applications

This reference covers architectural patterns for building SaaS products, web apps, and full-stack applications. Consolidates lessons from production development across multiple product types.

---

## Table of Contents
1. Architecture Decisions
2. Authentication & Authorization
3. Database & Data Layer
4. API Design
5. State Management
6. Billing & Subscription
7. Deployment & DevOps
8. Error Handling & Monitoring
9. Security Checklist
10. Mobile App Considerations

---

## 1. Architecture Decisions

### When to Use What

| Product Type | Recommended Stack | Why |
|---|---|---|
| Portfolio / Landing | Next.js SSG + Vercel | Zero server cost, fast, SEO-optimized |
| SaaS Dashboard | Next.js App Router + Supabase | Auth, DB, real-time all-in-one |
| Chrome Extension | Vite + CRXJS + React | HMR, MV3 support, Shadow DOM ready |
| Internal Tool | Next.js + Prisma + PostgreSQL | Type-safe, full control |
| API-First Product | FastAPI (Python) or Hono (TS) | Speed, typing, documentation |
| Mobile App | React Native / Expo | Code sharing with web, OTA updates |

### Monorepo vs. Polyrepo

Use monorepo (Turborepo) when:
- Frontend + backend share types
- Multiple packages (UI library, shared utils)
- Need consistent tooling and CI

Use separate repos when:
- Teams are independent
- Different deployment cadences
- Different tech stacks (e.g., Python backend + React frontend)

### File Structure (Next.js SaaS)

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── layout.tsx          # Auth layout (centered card)
├── (dashboard)/
│   ├── layout.tsx          # Dashboard layout (sidebar + main)
│   ├── page.tsx            # Dashboard home
│   ├── settings/page.tsx
│   └── [feature]/page.tsx
├── api/
│   ├── webhooks/
│   │   └── stripe/route.ts
│   └── [...]/route.ts
├── layout.tsx              # Root layout
└── page.tsx                # Landing page
```

---

## 2. Authentication & Authorization

### Supabase Auth (Recommended for speed)

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Middleware for protected routes
export async function middleware(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### Row-Level Security (RLS)

Always enable RLS on Supabase tables. Every query automatically filtered by user:

```sql
CREATE POLICY "Users can only see own data"
ON profiles FOR SELECT
USING (auth.uid() = user_id);
```

### OAuth Providers
- Google: highest conversion, lowest friction
- GitHub: developer-focused products
- Email/password: always offer as fallback
- Magic link: modern, no password fatigue

---

## 3. Database & Data Layer

### Schema Design Principles

- Use UUIDs for primary keys (distributed-friendly)
- Always add `created_at` and `updated_at` timestamps
- Soft delete (`deleted_at`) over hard delete for auditable products
- Index foreign keys and frequently-filtered columns
- Use enums for finite state machines (status, role, tier)

### Supabase + Prisma Pattern

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}
```

### Data Fetching Strategy

| Location | Method | Cache |
|---|---|---|
| Server Component | `fetch()` with cache | Revalidate on demand |
| Client Component | `useSWR` or `@tanstack/query` | Stale-while-revalidate |
| Real-time | Supabase Realtime subscriptions | N/A (live) |
| Static | `generateStaticParams()` | Build time |

---

## 4. API Design

### REST Conventions

```
GET    /api/projects          → List (paginated)
GET    /api/projects/:id      → Single resource
POST   /api/projects          → Create
PATCH  /api/projects/:id      → Partial update
DELETE /api/projects/:id      → Delete

Query params: ?page=1&limit=20&sort=created_at&order=desc&status=active
```

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "This field is required" }
    ]
  }
}
```

### Rate Limiting

Use Upstash Redis for serverless rate limiting:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

---

## 5. State Management

### Hierarchy (Use the simplest that works)

1. **URL state** (search params) — filters, pagination, selected tabs
2. **React state** (`useState`) — local UI state
3. **Server state** (`useSWR` / `@tanstack/query`) — remote data
4. **Context** — theme, auth, feature flags
5. **Zustand** — complex client state that spans components
6. **Redux** — only for very large apps with complex state machines

### Pattern: URL-Driven State

```typescript
// Filters live in URL, not React state
const searchParams = useSearchParams();
const domain = searchParams.get('domain') || 'all';
const page = parseInt(searchParams.get('page') || '1');

// Update URL instead of setState
function setDomain(d: string) {
  const params = new URLSearchParams(searchParams);
  params.set('domain', d);
  router.push(`?${params.toString()}`);
}
```

---

## 6. Billing & Subscription

### Stripe Integration Pattern

```
User signs up → Free tier (no card)
User upgrades → Stripe Checkout session → Webhook confirms
Webhook → Update user.tier in DB
User cancels → Stripe webhook → Downgrade at period end
```

### Pricing Page Best Practices
- 3 tiers maximum (Free, Pro, Enterprise)
- Highlight the "recommended" tier
- Annual toggle with savings percentage
- Feature comparison table
- FAQ section for objection handling

---

## 7. Deployment & DevOps

### Vercel (Next.js)
- Auto-deploy on push to main
- Preview deployments for PRs
- Edge functions for API routes
- Analytics built-in

### CI/CD Checklist
- [ ] Lint (ESLint)
- [ ] Type check (TypeScript)
- [ ] Unit tests (Vitest)
- [ ] Build succeeds
- [ ] Preview deployment
- [ ] Lighthouse CI (score thresholds)

### Environment Variables
- `.env.local` — never committed
- `.env.example` — template with dummy values, committed
- Vercel/Supabase dashboard for production secrets
- Never expose server-side secrets with `NEXT_PUBLIC_` prefix

---

## 8. Error Handling & Monitoring

### Error Boundary Pattern

```tsx
'use client';

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-zinc-400 mb-4">{error.message}</p>
      <button onClick={reset} className="btn-primary">Try again</button>
    </div>
  );
}
```

### Monitoring Stack
- **Sentry**: Error tracking with source maps
- **Vercel Analytics**: Core Web Vitals
- **Posthog**: Product analytics (self-hostable)
- **Uptime**: BetterUptime or similar

---

## 9. Security Checklist

- [ ] HTTPS everywhere (Vercel handles this)
- [ ] CSRF protection on mutations
- [ ] Input validation (Zod on both client and server)
- [ ] SQL injection prevention (parameterized queries / ORM)
- [ ] XSS prevention (React handles JSX escaping, but sanitize user HTML)
- [ ] Rate limiting on auth endpoints
- [ ] Secure headers (CSP, HSTS, X-Frame-Options)
- [ ] Secrets in environment variables, never in code
- [ ] RLS enabled on all database tables
- [ ] Regular dependency audits (`npm audit`)

---

## 10. Mobile App Considerations

### React Native / Expo

When to use Expo:
- Rapid prototyping
- No native module requirements
- OTA updates needed
- Push notifications via Expo

When to eject / bare workflow:
- Custom native modules
- Specific native SDK integrations
- Performance-critical native features

### Shared Code Strategy

```
packages/
├── shared/          # Types, utils, validation (Zod schemas)
├── ui/              # Shared component primitives
apps/
├── web/             # Next.js
├── mobile/          # Expo
└── extension/       # Chrome extension
```

Share: types, validation schemas, API client, business logic.
Don't share: UI components (web and native have different primitives), routing, storage.
