#!/bin/bash
# One-time server setup for futelatosomba on Flowstas
# Run as root: bash setup.sh
set -e

DOMAIN="futelatosomba.cd"
REPO="https://github.com/timothymatudi/futelatosomba.git"
APP_DIR="/opt/futelatosomba"
EMAIL="timomatudi@gmail.com"

echo ""
echo "======================================================"
echo "  Futelatosomba — Flowstas Server Setup"
echo "======================================================"
echo ""

# --- 1. nginx + certbot ---
echo "[1/5] Installing nginx and certbot..."
apt-get update -qq
apt-get install -y -qq nginx certbot python3-certbot-nginx

# --- 2. Clone or update repo ---
echo "[2/5] Cloning repo from GitHub..."
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull --ff-only
else
  git clone "$REPO" "$APP_DIR"
fi

# --- 3. Create .env if missing ---
echo "[3/5] Checking backend environment..."
if [ ! -f "$APP_DIR/backend/.env" ]; then
  cp "$APP_DIR/backend/.env.example" "$APP_DIR/backend/.env"
  echo ""
  echo "  !! ACTION REQUIRED !!"
  echo "  Edit the backend environment file with your real values:"
  echo ""
  echo "    nano $APP_DIR/backend/.env"
  echo ""
  echo "  You need to fill in:"
  echo "    MONGO_DATABASE_URL  — your MongoDB Atlas connection string"
  echo "    JWT_SECRET          — a random 64-char string"
  echo "    SMTP_*              — your email provider credentials"
  echo ""
  echo "  After editing, re-run this script."
  exit 1
fi

# --- 4. Build and start app ---
echo "[4/5] Building Docker image and starting app..."
cd "$APP_DIR"
docker compose up -d --build

# --- 5. nginx + SSL ---
echo "[5/5] Configuring nginx and SSL..."

# Temporary HTTP-only config so certbot can verify the domain
cat > /etc/nginx/sites-available/futelatosomba.cd <<'TMPNGINX'
server {
    listen 80;
    server_name futelatosomba.cd www.futelatosomba.cd;
    location / { proxy_pass http://127.0.0.1:5000; }
}
TMPNGINX

ln -sf /etc/nginx/sites-available/futelatosomba.cd /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Get SSL certificate
certbot certonly --nginx \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos -m "$EMAIL"

# Install full nginx config with SSL
cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/futelatosomba.cd
nginx -t && systemctl reload nginx

# Auto-renew SSL
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -

echo ""
echo "======================================================"
echo "  Done! Your site is live at https://futelatosomba.cd"
echo "======================================================"
echo ""
