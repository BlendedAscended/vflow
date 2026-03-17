# Prompt 02 — Hetzner Server Bootstrap & App Deploy

> Paste into Claude Code with SSH access to Hetzner.

---

You are setting up a fresh Hetzner Cx22 (Ubuntu 22.04) server for VerbaFlow production.

**Server**: `claw@<HETZNER_IP>`
**Apps**:
- VerbaFlow main site → `/var/www/verbaflow` → PM2 `verbaflow` → port `3000`
- DonPortfolio → `/var/www/portfolio` → PM2 `portfolio` → port `3001`

**All scripts are in the repo at** `scripts/bootstrap-hetzner.sh`

## Step 1 — Bootstrap server (run once)
```bash
ssh root@<HETZNER_IP>

# Create claw user if not exists
useradd -m -s /bin/bash claw
usermod -aG sudo claw
mkdir -p /home/claw/.ssh
cp ~/.ssh/authorized_keys /home/claw/.ssh/
chown -R claw:claw /home/claw/.ssh
chmod 700 /home/claw/.ssh && chmod 600 /home/claw/.ssh/authorized_keys

# Switch to claw and run bootstrap
su - claw
curl -o bootstrap.sh https://raw.githubusercontent.com/<YOUR_GH_USERNAME>/verbaflow/main/scripts/bootstrap-hetzner.sh
chmod +x bootstrap.sh
sudo ./bootstrap.sh
```

## Step 2 — Deploy VerbaFlow
```bash
ssh claw@<HETZNER_IP>
cd /var/www/verbaflow
git clone https://github.com/<YOUR_GH_USERNAME>/verbaflow.git .
cp .env.example .env
nano .env  # Fill in all values from docs/INFRASTRUCTURE.md Phase 4.2
npm ci
npm run build
pm2 start ecosystem.config.js --only verbaflow
pm2 save
```

## Step 3 — Deploy DonPortfolio
```bash
cd /var/www/portfolio
git clone https://github.com/<YOUR_GH_USERNAME>/donportfolio.git .
cp .env.example .env
nano .env  # Fill in portfolio env vars
npm ci
npm run build
# Add portfolio entry to ecosystem.config.js first (see Prompt 03)
pm2 start ecosystem.config.js --only portfolio
pm2 save
```

## Step 4 — PM2 startup on reboot
```bash
pm2 startup
# Run the command PM2 prints
pm2 save
pm2 list  # Should show verbaflow + portfolio both ONLINE
```

## Step 5 — Health check
```bash
curl http://localhost:3000  # VerbaFlow
curl http://localhost:3001  # Portfolio
pm2 logs verbaflow --lines 20
pm2 logs portfolio --lines 20
```

## Environment Variables Reference
See `docs/INFRASTRUCTURE.md` Phase 4.2 for full `.env` template.

Key vars needed:
- `NEXT_PUBLIC_SANITY_PROJECT_ID=jk81ef76`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
- `STRIPE_SECRET_KEY=sk_live_...`
- `RESEND_API_KEY=re_...`
- `GEMINI_API_KEY=...`
