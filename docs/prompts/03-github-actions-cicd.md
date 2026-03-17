# Prompt 03 — GitHub Actions CI/CD Setup

> Paste into Claude Code to finalize CI/CD for both repos.

---

You are setting up GitHub Actions auto-deploy for two repos to Hetzner.

**Repos**:
- `verbaflow` → `github.com/[your-org]/verbaflow` → deploys to `/var/www/verbaflow` → PM2 `verbaflow`
- `donportfolio` → `github.com/BlendedAscended/DonPortfolio` → deploys to `/var/www/portfolio` → PM2 `portfolio`

**Notes**:
- The DonPortfolio Next.js app lives in the `portfolio/` subdirectory of the repo.
- A workflow file already exists at `portfolio/.github/workflows/deploy.yml` but is in the wrong location — GitHub only reads from the repo root. Move it to root (see Prompt 04 Step 1).
- `ecosystem.config.js` in `portfolio/` has the PM2 config — already added to verbaflow's root `ecosystem.config.js` too.

**Existing workflow**: `.github/workflows/deploy.yml` covers verbaflow only.

## Step 1 — Generate deploy SSH key (local machine)
```bash
ssh-keygen -t ed25519 -C "github-deploy@verbaflowllc" -f ~/.ssh/hetzner_deploy
# Private → goes into GitHub Secrets
# Public  → goes onto Hetzner server
ssh-copy-id -i ~/.ssh/hetzner_deploy.pub senpai@<HETZNER_IP>
ssh -i ~/.ssh/hetzner_deploy senpai@<HETZNER_IP> "echo ✓ connected"
```

## Step 2 — Add secrets to BOTH GitHub repos
Go to: `repo → Settings → Secrets and variables → Actions → New repository secret`

| Secret | Value |
|--------|-------|
| `HETZNER_HOST` | Your Hetzner IP |
| `HETZNER_USER` | `senpai` |
| `HETZNER_SSH_KEY` | Full contents of `~/.ssh/hetzner_deploy` |
| `HETZNER_PORT` | `22` |

Do this for **both** the verbaflow repo AND the donportfolio repo.

## Step 3 — Fix portfolio deploy workflow (move to repo root)
The workflow already exists at `portfolio/.github/workflows/deploy.yml` but GitHub Actions ignores it there.
Move it to repo root: create/replace `.github/workflows/deploy.yml` at the repo root of DonPortfolio:

```yaml
name: Deploy DonPortfolio to Hetzner

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-portfolio
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci --prefer-offline
      - name: Deploy to Hetzner
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HETZNER_HOST }}
          username: ${{ secrets.HETZNER_USER }}
          key: ${{ secrets.HETZNER_SSH_KEY }}
          port: ${{ secrets.HETZNER_PORT }}
          timeout: 120s
          script: |
            set -e
            cd /var/www/portfolio
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

## Step 4 — Add portfolio entry to ecosystem.config.js (verbaflow repo)
Add to the `apps` array in `/ecosystem.config.js`:

```js
{
  name: 'portfolio',
  script: 'node_modules/.bin/next',
  args: 'start',
  cwd: '/var/www/portfolio',
  env: { NODE_ENV: 'production', PORT: 3001 },
  instances: 2,
  exec_mode: 'cluster',
  autorestart: true,
  watch: false,
  max_memory_restart: '512M',
  error_file: '/var/log/pm2/portfolio-error.log',
  out_file: '/var/log/pm2/portfolio-out.log',
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  merge_logs: true,
  wait_ready: true,
  listen_timeout: 10000,
  kill_timeout: 5000,
},
```

## Step 5 — Test CI/CD
```bash
# Push a trivial change to each repo's main branch
git commit --allow-empty -m "test: trigger CI/CD"
git push origin main
# Watch GitHub → Actions tab → workflow should complete in ~3 minutes
```

See `scripts/GITHUB_SECRETS_SETUP.md` for manual deploy fallback commands.
