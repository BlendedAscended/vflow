# Prompt 04 — DonPortfolio Migration to Hetzner

> ✅ Analysis complete (see `00-donportfolio-analysis.md`).
> Ready to execute.

---

**Repo**: `https://github.com/BlendedAscended/DonPortfolio.git`
**Next.js app root**: `portfolio/` subdirectory inside the repo
**Deploy target**: Hetzner Cx22 → `/var/www/portfolio` → PM2 `portfolio` → port `3001`
**Domain**: `sandeep.verbaflowllc.com` → Cloudflare Tunnel → `localhost:3001`
**Env vars required**: None (fully static site)

---

## Step 1 — Fix GitHub Actions workflow location

The workflow file at `portfolio/.github/workflows/deploy.yml` won't trigger because
GitHub Actions only reads from the **repo root** `.github/workflows/`.

**On your local machine:**

```bash
cd /path/to/DonPortfolio

# Move workflow to repo root
mkdir -p .github/workflows
cp portfolio/.github/workflows/deploy.yml .github/workflows/deploy.yml
```

Edit the new root-level `.github/workflows/deploy.yml` — change the remote deploy
script to `cd` into the `portfolio/` subdirectory:

```yaml
script: |
  set -e
  cd /var/www/portfolio        # This is where we clone portfolio/ subdirectory contents
  git fetch origin main
  git reset --hard origin/main
  npm ci --prefer-offline --omit=dev
  npm run build
  pm2 reload portfolio --update-env
  for i in $(seq 1 10); do
    if curl -sf http://localhost:3001 > /dev/null 2>&1; then
      echo "✓ Portfolio responding on :3001"
      break
    fi
    sleep 3
  done
  pm2 list
```

Then commit:
```bash
git add .github/workflows/deploy.yml
git commit -m "fix: move GitHub Actions workflow to repo root"
git push origin main
```

---

## Step 2 — Add GitHub Secrets to DonPortfolio repo

Go to: `https://github.com/BlendedAscended/DonPortfolio → Settings → Secrets → Actions`

| Secret | Value |
|---|---|
| `HETZNER_HOST` | Your Hetzner server IP |
| `HETZNER_USER` | `claw` |
| `HETZNER_SSH_KEY` | Full contents of `~/.ssh/hetzner_deploy` (private key) |
| `HETZNER_PORT` | `22` |

(Same SSH key already added to verbaflow repo — reuse it.)

---

## Step 3 — Initial server setup (run once via SSH)

```bash
ssh claw@<HETZNER_IP>

# Create deploy directory
mkdir -p /var/www/portfolio

# Clone ONLY the portfolio/ subdirectory using sparse checkout
cd /var/www
git clone --no-checkout https://github.com/BlendedAscended/DonPortfolio.git portfolio-repo
cd portfolio-repo
git sparse-checkout init --cone
git sparse-checkout set portfolio
git checkout main

# Symlink or copy contents so /var/www/portfolio is the Next.js root
cp -r /var/www/portfolio-repo/portfolio/* /var/www/portfolio/
rm -rf /var/www/portfolio-repo

# --- OR simpler alternative: clone full repo, work from subdirectory ---
# git clone https://github.com/BlendedAscended/DonPortfolio.git /var/www/portfolio-git
# ln -s /var/www/portfolio-git/portfolio /var/www/portfolio
```

**Simpler alternative (recommended):** Clone the whole repo and deploy from the subdirectory:

```bash
ssh claw@<HETZNER_IP>

git clone https://github.com/BlendedAscended/DonPortfolio.git /var/www/donportfolio-repo
ln -sfn /var/www/donportfolio-repo/portfolio /var/www/portfolio

cd /var/www/portfolio
npm ci
npm run build

pm2 start /var/www/verbaflow/ecosystem.config.js --only portfolio
pm2 save

curl http://localhost:3001   # Should return HTML
```

> **Note:** Update the GitHub Actions deploy script to `cd /var/www/donportfolio-repo && git pull && cd portfolio && npm ci && npm run build && pm2 reload portfolio` if using the symlink approach.

---

## Step 4 — Add Cloudflare DNS route

```bash
# On Hetzner server
cloudflared tunnel route dns verbaflow-main sandeep.verbaflowllc.com
```

Update `~/.cloudflared/config.yml` to add the ingress rule:

```yaml
ingress:
  - hostname: verbaflowllc.com
    service: http://localhost:3000
  - hostname: agency.verbaflowllc.com
    service: http://localhost:3000
  - hostname: sandeep.verbaflowllc.com     # ← add this
    service: http://localhost:3001
  - service: http_status:404
```

Restart tunnel:
```bash
sudo systemctl restart cloudflared
```

Verify: `curl -I https://sandeep.verbaflowllc.com` → 200 OK

---

## Step 5 — Verify end-to-end

```bash
# Local: push a change to DonPortfolio main branch
cd /path/to/DonPortfolio
git commit --allow-empty -m "test: trigger CI/CD pipeline"
git push origin main

# Watch: https://github.com/BlendedAscended/DonPortfolio/actions
# Should complete in ~3 minutes and auto-deploy to sandeep.verbaflowllc.com
```

---

## No .env.example needed

The portfolio is fully static — zero environment variable dependencies. If you add
Resend or GA later, create `.env.local` on the server with:

```bash
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# RESEND_API_KEY=re_xxxx
```
