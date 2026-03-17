# VerbaFlow Infrastructure — Master Deployment Plan

## Architecture Overview

```
Internet
    │
    ▼
Cloudflare (DNS + WAF + DDoS Protection)
    │
    ▼ Cloudflare Tunnel (no open ports, no public IP)
    │
Hetzner Cx22 — Germany (Ubuntu 22.04 LTS)
    ├── PM2 Process 1: verbaflowllc.com      → :3000
    ├── PM2 Process 2: sandeep.verbaflowllc  → :3001
    ├── cloudflared (Cloudflare Tunnel daemon)
    └── [Internal only] OpenClaw (Kimi model)
```

## Domain Routing

| Domain | Routes To | Port | Method |
|--------|-----------|------|--------|
| `verbaflowllc.com` | vflow Next.js app | 3000 | Cloudflare Tunnel → localhost:3000 |
| `www.verbaflowllc.com` | vflow Next.js app | 3000 | Cloudflare Tunnel → localhost:3000 |
| `agency.verbaflowllc.com` | Same vflow app, `/agency` path | 3000 | Cloudflare Redirect Rule → verbaflowllc.com/agency |
| `sandeep.verbaflowllc.com` | DonPortfolio app | 3001 | Cloudflare Tunnel → localhost:3001 |

## Server Specs

- **Provider**: Hetzner Cloud (hetzner.com)
- **Plan**: Cx22 (4 vCPU, 16 GB RAM, 160 GB SSD)
- **Location**: Falkenstein, Germany (fsn1)
- **OS**: Ubuntu 22.04 LTS
- **SSH User**: `claw`

---

## Phase 1: Cloudflare DNS Migration from Vercel

### Step 1.1 — Transfer DNS from GoDaddy to Cloudflare

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **Add a Site** → enter `verbaflowllc.com`
3. Select **Free plan**
4. Cloudflare will scan existing DNS records. Verify these are imported:
   - `A verbaflowllc.com → 216.198.79.1` (keep during migration)
   - `A www → 76.76.21.21` (Vercel — will be replaced)
   - All MX records for email
   - TXT records (SPF, DKIM for Resend/email)
5. Cloudflare gives you **two nameservers** (e.g. `nia.ns.cloudflare.com`)
6. In GoDaddy → My Domains → Manage → Nameservers → **Enter Custom Nameservers**
   - Add both Cloudflare nameservers
   - Save
7. Wait 24-48 hours for propagation (usually <1 hour)

### Step 1.2 — SSL/TLS Configuration in Cloudflare

1. Cloudflare Dashboard → SSL/TLS → **Full (Strict)**
2. SSL/TLS → Edge Certificates → **Always Use HTTPS: ON**
3. SSL/TLS → Edge Certificates → **HSTS: Enable** (max-age: 6 months, includeSubDomains: YES)
4. SSL/TLS → Edge Certificates → **Minimum TLS Version: TLS 1.2**

### Step 1.3 — Preserve Email Records

These records MUST be kept (do NOT delete during migration):

```
MX   verbaflowllc.com  → (existing mail server, import from GoDaddy scan)
TXT  verbaflowllc.com  → "v=spf1 include:secureserver.net ..."  (GoDaddy email)
TXT  send.mail         → "v=spf1 include:amazonses.com ..."     (Resend/SES)
TXT  resend._domainkey → "p=MIGfMA0G..."                       (DKIM for Resend)
```

---

## Phase 2: Hetzner Server Setup

> Complete script in `scripts/bootstrap-hetzner.sh`

### Step 2.1 — SSH Into Your Server

```bash
ssh claw@<YOUR_HETZNER_IP>
```

### Step 2.2 — Run Bootstrap Script

```bash
curl -o bootstrap.sh https://raw.githubusercontent.com/<your-repo>/main/scripts/bootstrap-hetzner.sh
chmod +x bootstrap.sh
sudo ./bootstrap.sh
```

Or copy the script manually from `scripts/bootstrap-hetzner.sh`.

### Step 2.3 — What the Script Does

1. Updates Ubuntu packages
2. Installs Node.js 22 LTS (via NodeSource)
3. Installs PM2 globally
4. Installs `cloudflared` (Cloudflare Tunnel daemon)
5. Creates app directories: `/var/www/verbaflow` and `/var/www/portfolio`
6. Sets `claw` user as owner
7. Configures UFW firewall (blocks ALL inbound except SSH on 2222)
8. Hardens SSH config
9. Installs `fail2ban`

---

## Phase 3: Cloudflare Tunnel Setup

### Step 3.1 — Authenticate cloudflared

```bash
cloudflared tunnel login
# Opens browser → authorize with your Cloudflare account
```

### Step 3.2 — Create the Tunnel

```bash
cloudflared tunnel create verbaflow-main
# Returns: Tunnel ID like a1b2c3d4-...
# Creates credentials file at ~/.cloudflared/<TUNNEL_ID>.json
```

### Step 3.3 — Create Tunnel Config

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste this (replace `<TUNNEL_ID>` with your actual ID):

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /home/claw/.cloudflared/<TUNNEL_ID>.json

ingress:
  # Main verbaflow site
  - hostname: verbaflowllc.com
    service: http://localhost:3000
    originRequest:
      noTLSVerify: true
      connectTimeout: 30s

  # www redirect (Next.js handles www → non-www)
  - hostname: www.verbaflowllc.com
    service: http://localhost:3000
    originRequest:
      noTLSVerify: true

  # Portfolio site
  - hostname: sandeep.verbaflowllc.com
    service: http://localhost:3001
    originRequest:
      noTLSVerify: true

  # Catch-all
  - service: http_status:404
```

### Step 3.4 — Create DNS Records in Cloudflare (via CLI)

```bash
# Point each domain to the tunnel (creates CNAME records automatically)
cloudflared tunnel route dns verbaflow-main verbaflowllc.com
cloudflared tunnel route dns verbaflow-main www.verbaflowllc.com
cloudflared tunnel route dns verbaflow-main sandeep.verbaflowllc.com
```

> This creates `CNAME` records pointing to `<TUNNEL_ID>.cfargotunnel.com`

### Step 3.5 — Set Up agency.verbaflowllc.com as a Redirect

Do NOT route through tunnel — use Cloudflare Redirect Rules instead:

1. Cloudflare Dashboard → Your Zone → Rules → **Redirect Rules**
2. Click **Create Rule**
3. **Rule name**: Agency subdomain redirect
4. **When**: `Hostname equals agency.verbaflowllc.com`
5. **Then**: Redirect to `https://verbaflowllc.com/agency`
6. **Type**: 301 (permanent)
7. Save

Also add a DNS record so the subdomain resolves (required for redirect rule to fire):
```
CNAME  agency  →  verbaflowllc.com  (DNS only, NOT proxied tunnel)
```

### Step 3.6 — Run Tunnel as System Service

```bash
# Install tunnel as systemd service
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

---

## Phase 4: Deploy Applications

### 4.1 — Clone Repositories on Hetzner

```bash
# verbaflow (main site)
cd /var/www
git clone https://github.com/<your-gh-username>/verbaflow.git verbaflow
cd verbaflow && cp .env.example .env
# Edit .env with production values (see ENV VARS section below)
npm install
npm run build
pm2 start ecosystem.config.js --only verbaflow

# portfolio
git clone https://github.com/<your-gh-username>/donportfolio.git portfolio
cd portfolio && npm install && npm run build
pm2 start ecosystem.config.js --only portfolio

# Save PM2 process list across reboots
pm2 save
pm2 startup
```

### 4.2 — Environment Variables (verbaflow .env)

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=jk81ef76
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=<YOUR_SANITY_TOKEN>

# Stripe (use TEST keys first!)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PK>
STRIPE_SECRET_KEY=<YOUR_STRIPE_SK>
NEXT_PUBLIC_STRIPE_PRICE_COUPE=<PRICE_ID>
NEXT_PUBLIC_STRIPE_PRICE_MUSCLE=<PRICE_ID>
NEXT_PUBLIC_STRIPE_PRICE_GRAND_TOURER=<PRICE_ID>
NEXT_PUBLIC_STRIPE_PRICE_SIMPLE=<PRICE_ID>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY>

# AI / APIs
GEMINI_API_KEY=<YOUR_GEMINI_KEY>

# Email
RESEND_API_KEY=<YOUR_RESEND_KEY>
```

---

## Phase 5: Cloudflare Security Hardening

### WAF Rules

1. Cloudflare Dashboard → Security → WAF
2. Enable **Managed Rules** (Free plan: OWASP + Cloudflare Basic)
3. Add Custom Rule:
   - **Block bad bots**: User-Agent contains `python-requests` or `curl` → Block
4. **Rate Limiting** (paid feature — skip on free):
   - Alternative: use Cloudflare's built-in "Bot Fight Mode"

### Bot Fight Mode

Security → Bots → **Bot Fight Mode: ON**

### Security Level

Security → Settings → **Security Level: Medium**

### OpenClaw Hardening (Internal Service)

Since OpenClaw is internal only (no Cloudflare tunnel routing to it):
```bash
# UFW rule — block ALL external access to OpenClaw port
sudo ufw deny 8080/tcp  # (or whatever port OpenClaw uses)
sudo ufw allow from 127.0.0.1 to any port 8080
```
Only Next.js running on the same server can call it via `http://localhost:8080`.

---

## Phase 6: Email Setup (Resend)

Resend DKIM/SPF records should already be in Cloudflare DNS after migration.
Verify at [resend.com/domains](https://resend.com/domains):
- `send.mail.verbaflowllc.com` TXT should show ✅ Verified

Update `RESEND_API_KEY` in `.env` with production key.

### MX Records (keep existing GoDaddy email)

After DNS migration to Cloudflare, verify these are present:
```
MX  verbaflowllc.com  →  mailstore1.secureserver.net  (priority 10)
MX  verbaflowllc.com  →  smtp.secureserver.net         (priority 0)
```

---

## Phase 7: CI/CD via GitHub Actions

> Full workflow files in `.github/workflows/`

### Summary

On every push to `main`:
1. GitHub Action SSHes into Hetzner via SSH key stored in GitHub Secrets
2. `git pull` latest code
3. `npm install && npm run build`
4. `pm2 restart <app-name>`
5. Zero-downtime: PM2 uses cluster mode

### Required GitHub Secrets

```
HETZNER_HOST       = <your Hetzner IP>
HETZNER_USER       = claw
HETZNER_SSH_KEY    = <private key content (Ed25519 recommended)>
HETZNER_PORT       = 22 (or 2222 if hardened)
```

---

## Sanity as MCP Server (Mass Marketing via Content)

Sanity's API can act as a data source for targeted messaging. Concept:

```
Sanity CMS (blog posts, services, testimonials)
    │
    ▼ Sanity GROQ API
    │
OpenClaw / n8n workflow
    │
    ├── Pull content → generate personalized emails via Gemini
    └── Push to Resend → bulk campaign
```

Setup notes:
- Sanity GROQ endpoint: `https://jk81ef76.api.sanity.io/v2023-05-03/data/query/production`
- Auth: `SANITY_API_TOKEN` as Bearer header
- GROQ query example for blog posts:
  ```groq
  *[_type == "post"] { title, body, publishedAt, "author": author->name }
  ```
- Pipe results into n8n HTTP Request node → Gemini → Resend bulk send

---

## Maintenance Checklist

```bash
# Check running processes
pm2 list
pm2 logs verbaflow --lines 50
pm2 logs portfolio --lines 50

# Check tunnel status
sudo systemctl status cloudflared

# Check Cloudflare tunnel health
cloudflared tunnel info verbaflow-main

# Server health
htop
df -h
free -m

# Update apps manually
cd /var/www/verbaflow && git pull && npm run build && pm2 restart verbaflow
cd /var/www/portfolio && git pull && npm run build && pm2 restart portfolio
```
