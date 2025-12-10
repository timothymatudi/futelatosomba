#!/bin/bash

# Startup script for Render deployment
# Sets environment variables and starts the server

export MONGO_DATABASE_URL="mongodb+srv://timomatudi_db_user:LUBUZi1044%40%29@cluster0.iuhojxz.mongodb.net/futelatosomba"
export JWT_SECRET="futelatosomba_super_secure_jwt_secret_key_2024_production_v1"
export FRONTEND_URL="https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app"
export CLIENT_URL="https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app"
export NODE_ENV="production"
export PORT="${PORT:-10000}"

echo "=========================================="
echo "Starting Futelatosomba Backend"
echo "Environment variables set:"
echo "MONGO_DATABASE_URL: ${MONGO_DATABASE_URL:0:50}..."
echo "JWT_SECRET: [HIDDEN]"
echo "FRONTEND_URL: $FRONTEND_URL"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "=========================================="

# Start the server
node server.js
