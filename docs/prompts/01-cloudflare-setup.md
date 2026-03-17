# Prompt 01 — Cloudflare Full Setup

> Paste this into Claude Code / any AI agent with terminal access to your Hetzner server.

---

You are deploying a Cloudflare Tunnel for the VerbaFlow production infrastructure.

**Target server**: Hetzner Cx22, Ubuntu 22.04, SSH user `claw`
**Domains to route**:
- `verbaflowllc.com` → `localhost:3000`
- `www.verbaflowllc.com` → `localhost:3000`
- `sandeep.verbaflowllc.com` → `localhost:3001`
- `agency.verbaflowllc.com` → Cloudflare Redirect Rule → `https://verbaflowllc.com/agency` (301)

**The tunnel config is already written** at `scripts/cloudflare-tunnel-config.yml` in the repo. Copy it to `/home/claw/.cloudflared/config.yml` after replacing `<TUNNEL_ID>`.

## Execute these steps in order:

### 1. SSH into Hetzner and authenticate cloudflared
```bash
ssh claw@<HETZNER_IP>
cloudflared tunnel login
# Opens browser — authorize with Cloudflare account that owns verbaflowllc.com
```

### 2. Create the tunnel
```bash
cloudflared tunnel create verbaflow-main
# Note the TUNNEL_ID printed (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
```

### 3. Deploy config
```bash
mkdir -p ~/.cloudflared
# Copy config from repo and replace TUNNEL_ID:
sed "s/<TUNNEL_ID>/YOUR_ACTUAL_TUNNEL_ID/g" \
  /var/www/verbaflow/scripts/cloudflare-tunnel-config.yml \
  > ~/.cloudflared/config.yml
```

### 4. Create DNS CNAME records (CLI)
```bash
cloudflared tunnel route dns verbaflow-main verbaflowllc.com
cloudflared tunnel route dns verbaflow-main www.verbaflowllc.com
cloudflared tunnel route dns verbaflow-main sandeep.verbaflowllc.com
```

### 5. Install tunnel as systemd service
```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

### 6. In Cloudflare Dashboard — SSL/TLS
- SSL/TLS → Mode: **Full (Strict)**
- Edge Certificates → Always Use HTTPS: **ON**
- Edge Certificates → HSTS: **ON** (6 months, includeSubDomains)
- Edge Certificates → Min TLS Version: **TLS 1.2**

### 7. In Cloudflare Dashboard — agency.verbaflowllc.com redirect
1. DNS → Add record: `CNAME agency → verbaflowllc.com` (DNS only, NOT proxied)
2. Rules → Redirect Rules → Create Rule:
   - Name: `Agency subdomain`
   - When: `Hostname equals agency.verbaflowllc.com`
   - Then: Redirect to `https://verbaflowllc.com/agency` (301 permanent)

### 8. Security hardening
- Security → Bots → Bot Fight Mode: **ON**
- Security → Settings → Security Level: **Medium**
- WAF → Managed Rules: **Enable Cloudflare Basic**

### 9. Verify
```bash
curl -I https://verbaflowllc.com         # Should return 200
curl -I https://agency.verbaflowllc.com  # Should return 301
curl -I https://sandeep.verbaflowllc.com # Should return 200 (after portfolio deploy)
cloudflared tunnel info verbaflow-main
```
