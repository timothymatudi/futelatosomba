#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Startup script for Render deployment
#
# SECURITY: Do NOT hardcode secrets in this file. Set the following as
# environment variables in the hosting dashboard (Render) or a local, git-ignored
# .env file:
#   MONGO_DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
#   SMTP_HOST, SMTP_USER, SMTP_PASSWORD, FRONTEND_URL, CLIENT_URL
#
# For local development you can create backend/.env (already git-ignored) and it
# will be loaded by dotenv in server.js.

export FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
export CLIENT_URL="${CLIENT_URL:-http://localhost:3000}"
export NODE_ENV="${NODE_ENV:-development}"
export PORT="${PORT:-3001}" # Default to port 3001 for local development

# Fail fast if required secrets are missing rather than starting insecurely.
if [ -z "$MONGO_DATABASE_URL" ] || [ -z "$JWT_SECRET" ]; then
  echo "ERROR: MONGO_DATABASE_URL and JWT_SECRET must be set (env or backend/.env)." >&2
  echo "Set them in the hosting dashboard or a git-ignored .env file." >&2
  exit 1
fi

echo "=========================================="
echo "Starting Futelatosomba Backend"
echo "Environment:"
echo "MONGO_DATABASE_URL: [SET]"
echo "JWT_SECRET: [SET]"
echo "FRONTEND_URL: $FRONTEND_URL"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "=========================================="

# Start the server
node server.js
