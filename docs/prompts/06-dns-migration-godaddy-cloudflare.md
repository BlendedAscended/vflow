# Prompt 06 — DNS Migration: GoDaddy → Cloudflare (Zero Downtime)

> Execute this BEFORE deploying to Hetzner. DNS migrates first; Hetzner deploy second.

---

## Overview
Migrate `verbaflowllc.com` nameservers from GoDaddy to Cloudflare while preserving:
- Email (MX records for GoDaddy Workspace)
- Existing Vercel deployment (keep until Hetzner is ready)
- Resend DKIM/SPF records

**Zero-downtime strategy**: Cloudflare takes over DNS but initially points to same Vercel IPs. Hetzner cutover happens after.

---

## Phase A — Add site to Cloudflare (before changing nameservers)

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Add a Site** → `verbaflowllc.com` → **Free plan**
3. Cloudflare auto-scans DNS. **Review each record**:

   | Must Keep | Why |
   |-----------|-----|
   | `A verbaflowllc.com → 216.198.79.1` | Current Vercel/hosting |
   | `A www → 76.76.21.21` | Vercel www |
   | `MX mailstore1.secureserver.net (10)` | GoDaddy inbox |
   | `MX smtp.secureserver.net (0)` | GoDaddy inbox |
   | `TXT "v=spf1 include:secureserver.net..."` | Email SPF |
   | `TXT "v=spf1 include:amazonses..."` (send.mail) | Resend SPF |
   | `TXT "p=MIGfMA0G..."` (resend._domainkey) | Resend DKIM |
   | `TXT "NETORGFT1958570..."` | Microsoft/Office verification |
   | `CAA letsencrypt.org` | SSL cert authority |

4. Add any missing records manually before proceeding.

---

## Phase B — Change nameservers at GoDaddy

1. GoDaddy → [My Products](https://account.godaddy.com/products)
2. Find `verbaflowllc.com` → **DNS** → **Nameservers**
3. Click **Change** → **Enter my own nameservers**
4. Enter BOTH Cloudflare nameservers (shown in Cloudflare — e.g.):
   ```
   nia.ns.cloudflare.com
   tim.ns.cloudflare.com
   ```
5. Save. GoDaddy will warn about email — acknowledge and confirm.

**Propagation time**: 15 min to 48 hours. Usually <2 hours.

---

## Phase C — Verify DNS is active

```bash
# Check nameservers have propagated
dig NS verbaflowllc.com +short
# Should return: nia.ns.cloudflare.com. tim.ns.cloudflare.com.

# Check site still resolves
curl -I https://verbaflowllc.com
# Should return 200 (still pointing to Vercel at this point)

# Check email records
dig MX verbaflowllc.com +short
# Should return: 0 smtp.secureserver.net. 10 mailstore1.secureserver.net.
```

---

## Phase D — Hetzner cutover (run AFTER Hetzner deploy is confirmed working)

Once Hetzner server is running and verified at `http://localhost:3000`:

1. In Cloudflare Dashboard → DNS → Edit the A record:
   - Change `verbaflowllc.com A → 216.198.79.1` to your Hetzner IP
   - OR delete the A record and let cloudflared tunnel CNAME take over (preferred)

2. Run tunnel DNS routes:
   ```bash
   cloudflared tunnel route dns verbaflow-main verbaflowllc.com
   cloudflared tunnel route dns verbaflow-main www.verbaflowllc.com
   ```

3. Verify:
   ```bash
   curl -I https://verbaflowllc.com  # 200 from Hetzner
   # Check PM2 logs for incoming requests
   ssh senpai@<HETZNER_IP> "pm2 logs verbaflow --lines 5"
   ```

4. Decommission Vercel project (optional — keep it for 1 week as fallback):
   - Vercel Dashboard → Project → Settings → Delete project

---

## Rollback Plan
If anything breaks after nameserver change:
1. Go to GoDaddy → change nameservers back to GoDaddy defaults
2. DNS will revert within 1-2 hours
3. Investigate issue before retrying
