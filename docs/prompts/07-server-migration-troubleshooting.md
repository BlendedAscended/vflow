# Prompt 07 — Server Migration & Deployment Troubleshooting

> Reusable playbook for Hetzner + Cloudflare Tunnel + Next.js + PM2 deployments.
> Covers end-to-end: server setup, tunnel config, snapshot migration, and common errors.
> Derived from the vflow1.0 production deployment (March 2026).

---

## Prerequisites

| Tool | Purpose |
|------|---------|
| Hetzner Cloud | VPS hosting |
| Cloudflare | DNS, Tunnel, SSL |
| PM2 | Process manager for Node.js |
| cloudflared | Tunnel daemon |
| GitHub | Source repo |

---

## Phase 1 — Fresh Server Setup

### 1.1 SSH into server
```bash
# Use your SSH alias or key directly
ssh -i ~/.ssh/<YOUR_KEY> <USER>@<SERVER_IP>
```

### 1.2 Install cloudflared
```bash
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb
cloudflared --version
```

### 1.3 Create tunnel
```bash
cloudflared tunnel login
# Opens browser for Cloudflare auth

cloudflared tunnel create <TUNNEL_NAME>
# Outputs: Created tunnel <TUNNEL_NAME> with id <TUNNEL_ID>

# Save this UUID — you need it for config and DNS
```

### 1.4 Configure tunnel
```bash
mkdir -p ~/.cloudflared

# If using a template config from repo:
sed "s/<TUNNEL_ID>/<YOUR_TUNNEL_ID>/g" \
  /var/www/<PROJECT>/scripts/cloudflare-tunnel-config.yml \
  > ~/.cloudflared/config.yml

# Verify:
cat ~/.cloudflared/config.yml
```

### 1.5 Route DNS
```bash
cloudflared tunnel route dns <TUNNEL_NAME> yourdomain.com
cloudflared tunnel route dns <TUNNEL_NAME> www.yourdomain.com
cloudflared tunnel route dns <TUNNEL_NAME> subdomain.yourdomain.com
```

> **If DNS record already exists:**
> Go to Cloudflare Dashboard → DNS → Records → delete the conflicting A/CNAME record, then re-run the command.

### 1.6 Install as system service
```bash
# Must point to the config explicitly (sudo runs as root, can't find ~/.cloudflared/)
sudo cloudflared --config /home/<USER>/.cloudflared/config.yml service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

### 1.7 Clone repo & build
```bash
cd /var/www/<PROJECT>
git clone https://github.com/<ORG>/<REPO>.git .

# Copy .env from local machine:
# (from your Mac)
scp -i ~/.ssh/<YOUR_KEY> .env <USER>@<SERVER_IP>:/var/www/<PROJECT>/.env

# Install & build
npm ci --omit=dev
npm run build

# Start with PM2
pm2 start ecosystem.config.js --only <APP_NAME>
pm2 save
pm2 startup  # auto-start on reboot
```

---

## Phase 2 — Snapshot Migration (Hetzner)

### 2.1 Take snapshot of old server
1. Hetzner Dashboard → old server → **Snapshots** → Take Snapshot
2. Optionally `sudo poweroff` first for a clean snapshot

### 2.2 Rebuild new server from snapshot
1. New server → **Rebuild** tab → **Snapshots** tab → select snapshot
2. Click Rebuild

### 2.3 Post-migration checklist

| Task | Command |
|------|---------|
| Check cloudflared running | `sudo systemctl status cloudflared` |
| Check PM2 apps | `pm2 list` |
| Test apps locally | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` |
| Check tunnel config | `cat /etc/cloudflared/config.yml` |
| Check credentials exist | `ls -la ~/.cloudflared/*.json` |
| View cloudflared errors | `sudo journalctl -u cloudflared --since "10 min ago" --no-pager` |
| View PM2 logs | `pm2 logs <APP_NAME> --lines 20` |

### ⚠️ 2.4 CRITICAL — Stop cloudflared on old server

If the old server is still running with the **same tunnel ID**, Cloudflare splits traffic between both servers. The old server (without a working build) returns 502.

**This is the #1 cause of mysterious 502 errors after migration.**

```bash
# On the OLD server:
sudo systemctl stop cloudflared
sudo systemctl disable cloudflared

# Or just delete/power off the old server in Hetzner Dashboard
```

---

## Phase 3 — Common Errors & Fixes

### Error: 502 Bad Gateway (Host Error)

**Symptoms:** Cloudflare shows "Working", Host shows "Error"

**Diagnosis checklist:**
```bash
# 1. Is the app running?
pm2 list
curl http://localhost:3000

# 2. Is cloudflared running?
sudo systemctl status cloudflared

# 3. Is another server competing for the same tunnel?
# Check if old server's cloudflared is still running (see 2.4 above)

# 4. Does the config point to the right port?
cat /etc/cloudflared/config.yml | grep service
```

**Common causes:**
| Cause | Fix |
|-------|-----|
| App not built (no `.next/`) | `npm run build` then `pm2 restart <APP>` |
| Old server still running cloudflared | Stop/disable cloudflared on old server |
| Wrong port in tunnel config | Edit `/etc/cloudflared/config.yml`, restart cloudflared |
| cloudflared service not running | `sudo systemctl restart cloudflared` |

---

### Error: 1033 Cloudflare Tunnel Error

**Meaning:** Tunnel is not connected (cloudflared not running on server)

```bash
sudo systemctl restart cloudflared
sudo systemctl status cloudflared
```

---

### Error: "Could not find a production build in '.next'"

**Meaning:** `npm run build` was never run or failed

```bash
pm2 stop <APP_NAME>
cd /var/www/<PROJECT>
npm run build        # Must succeed before starting
pm2 start <APP_NAME>
```

**If build OOMs on low-RAM server (2GB):**
```bash
# Option A: Add swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Option B: Limit Node memory
NODE_OPTIONS="--max-old-space-size=1536" npm run build

# Option C: Upgrade server (recommended)
# Hetzner → Rescale to CX23 (4GB, $4.09/mo)
```

---

### Error: "ENOENT prerender-manifest.json"

**Meaning:** Same as above — `.next` directory missing or incomplete. Run `npm run build`.

---

### Error: DNS record already exists (cloudflared tunnel route)

```
Failed to add route: An A, AAAA, or CNAME record with that host already exists.
```

**Fix:** Delete the existing record in Cloudflare Dashboard → DNS → Records, then re-run:
```bash
cloudflared tunnel route dns <TUNNEL_NAME> <HOSTNAME>
```

---

### Error: "Cannot determine default configuration path" (service install)

**Cause:** `sudo` runs as root and can't find `~/.cloudflared/`

**Fix:** Pass the config path explicitly:
```bash
sudo cloudflared --config /home/<USER>/.cloudflared/config.yml service install
```

---

### Error: cert.pem already exists (tunnel login)

```bash
rm ~/.cloudflared/cert.pem
cloudflared tunnel login
```

---

### Error: Permission denied (scp/ssh)

**Cause:** SSH key not specified

```bash
# Always specify your key:
scp -i ~/.ssh/<YOUR_KEY> file.txt <USER>@<IP>:/path/
ssh -i ~/.ssh/<YOUR_KEY> <USER>@<IP>
```

---

## Phase 4 — Cloudflare Redirect Rules (Subdomain → Path)

For routing `subdomain.domain.com` → `https://domain.com/path`:

### 4.1 DNS Record
- Type: `CNAME`
- Name: `subdomain`
- Content: `domain.com`
- Proxy: **Proxied** (orange cloud ON — required for redirect rules)

### 4.2 Redirect Rule
Cloudflare Dashboard → Rules → Redirect Rules → Create Rule:
- **Mode:** Custom filter expression
- **Field:** Hostname → equals → `subdomain.domain.com`
- **Then:**
  - **Type:** Static
  - **URL:** `https://domain.com/path`
  - **Status code:** 301

> **Common mistake:** Setting Type to "Dynamic" instead of "Static" results in an empty `location:` header (redirect goes nowhere).

---

## Phase 5 — Diagnostic Commands Cheat Sheet

```bash
# ── Cloudflared ──
sudo systemctl status cloudflared          # Service status
sudo systemctl restart cloudflared         # Restart tunnel
sudo journalctl -u cloudflared -f          # Live logs
cat /etc/cloudflared/config.yml            # Active config
cloudflared tunnel list                    # All tunnels
cloudflared tunnel info <TUNNEL_NAME>      # Tunnel details

# ── PM2 ──
pm2 list                                   # All apps
pm2 logs <APP> --lines 30                  # Recent logs
pm2 restart <APP>                          # Restart app
pm2 stop <APP>                             # Stop app
pm2 save                                   # Save process list
pm2 startup                                # Enable auto-start

# ── Network ──
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000   # Test app
curl -I https://yourdomain.com             # Test via Cloudflare
ss -tlnp | grep node                       # Check listening ports
sudo ufw status                            # Firewall rules

# ── DNS ──
dig NS yourdomain.com +short               # Check nameservers
dig CNAME www.yourdomain.com +short        # Check CNAME
```

---

## Architecture Reference

```
Browser → Cloudflare Edge (DNS + SSL)
       → Cloudflare Tunnel
       → cloudflared daemon (on Hetzner)
       → localhost:3000 (Next.js via PM2)

Subdomain redirects:
  agency.domain.com → Cloudflare Redirect Rule → domain.com/agency

DNS Records (Tunnel type):
  @     → verbaflow-main tunnel
  www   → verbaflow-main tunnel
  sandeep → verbaflow-main tunnel

DNS Records (Other server):
  agent   → n8n-hetzner-agent tunnel
  windmill → n8n-hetzner-agent tunnel
```
