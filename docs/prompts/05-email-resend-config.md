# Prompt 05 — Email Configuration (Resend + MX Records)

> Paste into Claude Code after DNS has migrated to Cloudflare.

---

You are configuring transactional email for VerbaFlow using Resend, preserving GoDaddy inbox email, and verifying all DNS records.

## Step 1 — Preserve GoDaddy MX records in Cloudflare
After DNS migration, verify these MX records exist in Cloudflare DNS:

```
Type  Name              Content                          Priority
MX    verbaflowllc.com  mailstore1.secureserver.net      10
MX    verbaflowllc.com  smtp.secureserver.net            0
```

If missing, add them manually in Cloudflare Dashboard → DNS → Add record.

⚠️ MX records must be **DNS only** (NOT proxied through Cloudflare).

## Step 2 — Verify Resend DKIM records exist
These should have migrated from GoDaddy scan. Check in Cloudflare:

```
Type  Name                         Content
TXT   resend._domainkey            "p=MIGfMA0GCS..."
TXT   send.mail.verbaflowllc.com  "v=spf1 include:amazonses.com ~all"
```

If missing, get values from [resend.com/domains](https://resend.com/domains).

## Step 3 — Verify in Resend dashboard
1. Go to [resend.com/domains](https://resend.com/domains)
2. Find `verbaflowllc.com`
3. All records should show ✅ Verified
4. If not: click "Verify" and wait 5-10 minutes for DNS propagation

## Step 4 — Update RESEND_API_KEY in production .env
```bash
ssh claw@<HETZNER_IP>
cd /var/www/verbaflow
# Edit .env — update to production Resend API key
nano .env
# RESEND_API_KEY=re_live_xxxxxxxxxxxx

pm2 reload verbaflow --update-env
```

## Step 5 — Test transactional email
```bash
# From local machine or Hetzner, test the contact form
curl -X POST https://verbaflowllc.com/api/request-quote \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test email"}'
# Should return 200 and deliver email
```

## Step 6 — SPF record for verbaflowllc.com
Ensure this TXT record exists (merges GoDaddy + Resend/SES):
```
TXT  verbaflowllc.com  "v=spf1 include:secureserver.net include:amazonses.com ~all"
```

## Resend Sending Domain Options
- **From address**: `hello@verbaflowllc.com` or `noreply@verbaflowllc.com`
- **Reply-to**: `sandeep@verbaflowllc.com` (GoDaddy inbox)
- Resend sends FROM your domain; GoDaddy handles INBOUND email

## Sanity MCP → Resend Mass Marketing (Future)
See `docs/INFRASTRUCTURE.md` Phase "Sanity as MCP Server" for the
n8n → Gemini → Resend bulk campaign architecture.
