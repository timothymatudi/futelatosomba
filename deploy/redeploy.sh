#!/bin/bash
# Pull latest code from GitHub and rebuild — run on server to update the live site
set -e

APP_DIR="/opt/futelatosomba"

echo "Pulling latest code..."
git -C "$APP_DIR" pull --ff-only

echo "Rebuilding and restarting..."
cd "$APP_DIR"
docker compose up -d --build

echo "Done. Site updated at https://futelatosomba.cd"
