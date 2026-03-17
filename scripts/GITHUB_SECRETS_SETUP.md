# GitHub Secrets Setup — Both Projects

## Why Secrets?

GitHub Actions needs credentials to SSH into Hetzner.
These are stored as encrypted secrets — never visible in logs or code.

---

## Step 1 — Generate Deploy SSH Key (on your local machine)

```bash
# Generate a dedicated deploy key (don't use your personal key)
ssh-keygen -t ed25519 -C "github-deploy@verbaflowllc" -f ~/.ssh/hetzner_deploy

# Two files created:
#   ~/.ssh/hetzner_deploy       ← PRIVATE key (goes into GitHub Secret)
#   ~/.ssh/hetzner_deploy.pub   ← PUBLIC key (goes onto Hetzner server)
```

## Step 2 — Add Public Key to Hetzner Server

```bash
# Copy public key to Hetzner
ssh-copy-id -i ~/.ssh/hetzner_deploy.pub senpai@<YOUR_HETZNER_IP>

# Verify it works
ssh -i ~/.ssh/hetzner_deploy senpai@<YOUR_HETZNER_IP> "echo connected"
```

## Step 3 — Add Secrets to GitHub Repos

### For VerbaFlow repo:
GitHub → `verbaflow` repo → Settings → Secrets and variables → Actions

| Secret Name | Value |
|-------------|-------|
| `HETZNER_HOST` | `<YOUR_HETZNER_IP>` e.g. `65.21.45.123` |
| `HETZNER_USER` | `senpai` |
| `HETZNER_SSH_KEY` | Full content of `~/.ssh/hetzner_deploy` including `-----BEGIN...` and `-----END...` |
| `HETZNER_PORT` | `22` |

### For DonPortfolio repo:
GitHub → `donportfolio` repo → Settings → Secrets and variables → Actions
(Same 4 secrets — both repos deploy to same server)

## Step 4 — Get Private Key Content

```bash
cat ~/.ssh/hetzner_deploy
# Copy EVERYTHING including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ...base64 content...
# -----END OPENSSH PRIVATE KEY-----
```

Paste the entire output as the value of `HETZNER_SSH_KEY`.

---

## Verify CI/CD Works

1. Make a small change to either repo
2. Push to `main`
3. GitHub → Actions tab → Watch the workflow run
4. Should complete in ~3 minutes with green checkmark

---

## Manual Deploy (Emergency)

If GitHub Actions fails, deploy manually from local:

```bash
# SSH into Hetzner
ssh senpai@<HETZNER_IP>

# Deploy verbaflow
cd /var/www/verbaflow && git pull && npm ci && npm run build && pm2 reload verbaflow

# Deploy portfolio
cd /var/www/portfolio && git pull && npm ci && npm run build && pm2 reload portfolio
```

Or from local machine using deploy script:
```bash
# One-liner remote deploy
ssh senpai@<HETZNER_IP> "cd /var/www/verbaflow && git pull && npm ci && npm run build && pm2 reload verbaflow"
```
