#!/usr/bin/env bash
# =============================================================================
# VerbaFlow — Hetzner Cx22 Bootstrap Script
# Ubuntu 22.04 LTS | Run as: sudo ./bootstrap-hetzner.sh
# =============================================================================
set -euo pipefail

DEPLOY_USER="claw"
VERBAFLOW_DIR="/var/www/verbaflow"
PORTFOLIO_DIR="/var/www/portfolio"
NODE_VERSION="22"

echo "═══════════════════════════════════════════════"
echo "  VerbaFlow Hetzner Bootstrap"
echo "═══════════════════════════════════════════════"

# ─── 1. System Update ───────────────────────────────────────────────────────
echo "[1/9] Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq
apt-get install -y -qq curl git unzip fail2ban ufw build-essential

# ─── 2. Node.js LTS via NodeSource ──────────────────────────────────────────
echo "[2/9] Installing Node.js ${NODE_VERSION} LTS..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs
echo "Node: $(node -v) | NPM: $(npm -v)"

# ─── 3. PM2 Global ──────────────────────────────────────────────────────────
echo "[3/9] Installing PM2..."
npm install -g pm2
pm2 --version

# ─── 4. Install cloudflared ─────────────────────────────────────────────────
echo "[4/9] Installing cloudflared..."
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared.deb
rm cloudflared.deb
cloudflared --version

# ─── 5. App Directories ─────────────────────────────────────────────────────
echo "[5/9] Creating app directories..."
mkdir -p "$VERBAFLOW_DIR" "$PORTFOLIO_DIR"
chown -R "$DEPLOY_USER:$DEPLOY_USER" /var/www

# ─── 6. UFW Firewall ────────────────────────────────────────────────────────
echo "[6/9] Configuring UFW firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# SSH — keep port 22 open (will harden below)
ufw allow 22/tcp comment "SSH"

# Block direct HTTP/HTTPS — Cloudflare tunnel handles all traffic
# DO NOT open 80 or 443 — all web traffic goes through tunnel

# Allow only localhost for app ports
# (UFW rules for loopback are implicit, no need to add)

ufw --force enable
echo "UFW status:"
ufw status verbose

# ─── 7. SSH Hardening ───────────────────────────────────────────────────────
echo "[7/9] Hardening SSH..."
SSHD_CONFIG="/etc/ssh/sshd_config"
cp "$SSHD_CONFIG" "${SSHD_CONFIG}.backup"

# Disable password auth (SSH key only)
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' "$SSHD_CONFIG"
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' "$SSHD_CONFIG"
# Disable root login
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' "$SSHD_CONFIG"
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' "$SSHD_CONFIG"
# Reduce max auth tries
sed -i 's/#MaxAuthTries 6/MaxAuthTries 3/' "$SSHD_CONFIG"

systemctl restart sshd
echo "SSH hardened: password auth disabled, root login disabled"

# ─── 8. fail2ban ────────────────────────────────────────────────────────────
echo "[8/9] Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s
EOF

systemctl enable fail2ban
systemctl restart fail2ban
echo "fail2ban configured: 3 retries → 1h ban"

# ─── 9. PM2 Startup on Reboot ───────────────────────────────────────────────
echo "[9/9] Setting PM2 startup..."
# Run as deploy user
sudo -u "$DEPLOY_USER" pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER" || true
# The command above prints a command to run as root — run it:
env PATH=$PATH:/usr/bin pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Bootstrap Complete!"
echo "═══════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Log in as '${DEPLOY_USER}' and run:"
echo "       cloudflared tunnel login"
echo "       cloudflared tunnel create verbaflow-main"
echo "  2. Create ~/.cloudflared/config.yml (see INFRASTRUCTURE.md Phase 3)"
echo "  3. Clone your repos into:"
echo "       ${VERBAFLOW_DIR}"
echo "       ${PORTFOLIO_DIR}"
echo "  4. Set up .env files in each project"
echo "  5. Run: pm2 start ecosystem.config.js"
echo "  6. Run: pm2 save"
echo ""
echo "Server is ready. UFW is active — only SSH is open."
echo "All web traffic goes through Cloudflare Tunnel (no open ports 80/443)."
