# Deploying the futelatosomba backend to flowstas hosting

## 0. Reality check (read first)
flowstas.com as advertised is a **static-site host** (paste HTML / drop a zip; Next.js app on
Vercel). A persistent Express + MongoDB backend cannot run on static hosting. These steps assume
you deploy to the **server/VPS behind flowstas** (or another box you control). Confirm first:

- [ ] Can run a long-lived Node.js process (not just static files / serverless)
- [ ] Node.js **20 LTS** (18+ minimum; `package.json` has no `engines` field — pin one when installing)
- [ ] Process manager available (pm2 or systemd) so the server restarts on crash/reboot
- [ ] Outbound access to MongoDB Atlas: `cluster0.iuhojxz.mongodb.net`, TCP **27017** (mongodb+srv/SRV DNS)
- [ ] HTTPS in front of the app (reverse proxy: nginx/Caddy, or platform TLS) — the API must be served over TLS

## 1. Environment variables (names only — set values on the server, never commit)
Required:
- `NODE_ENV=production`
- `PORT` (whatever the proxy forwards to, e.g. 3001)
- `MONGO_DATABASE_URL` — **NEW rotated value** (old one leaked in git history AND is still hardcoded in `backend/start.sh` — rotate the Atlas password before deploying)
- `JWT_SECRET` — **NEW rotated value**, ≥32 chars (server refuses to boot otherwise; old value also leaked)
- `FRONTEND_URL` and `CLIENT_URL` — the Vercel frontend URL (used for CORS + Stripe redirect URLs)

Optional / feature-gated:
- `CORS_ALLOWED_ORIGINS` (comma-separated extra origins, if needed)
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` (payments)
- `SMTP_HOST`, `SMTP_PORT=587`, `SMTP_SECURE=false`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` (email)

## 2. Deploy steps
```bash
git clone <repo-url> futelatosomba && cd futelatosomba/backend   # or upload backend/ only
npm ci --omit=dev
# Set env vars (systemd EnvironmentFile, pm2 ecosystem file, or panel UI) — do NOT use start.sh,
# it contains the old hardcoded secrets. Start command:
node server.js            # via pm2: pm2 start server.js --name futelatosomba-api
```
Point the reverse proxy (e.g. `api.flowstas.com` or a path) at `localhost:$PORT` with TLS.

## 3. Post-deploy
1. **Atlas network access**: add the flowstas server's public IP in MongoDB Atlas → Network
   Access (remove the old Render IP ranges `74.220.49.0/24`, `74.220.57.0/24`, and any `0.0.0.0/0`).
2. **Email normalization migration** (run on the server, with prod env vars loaded):
   ```bash
   node scripts/normalize-emails.js            # dry-run, review output
   node scripts/normalize-emails.js --apply    # apply
   ```
3. **Frontend**: in Vercel project settings, set `REACT_APP_API_URL` to the new API base URL
   (e.g. `https://api.flowstas.com`) and redeploy the frontend.
4. **CORS**: confirm `FRONTEND_URL`/`CLIENT_URL` on the backend exactly match the live frontend
   origin (scheme + host, no trailing slash).
5. If using Stripe: update the webhook endpoint URL in the Stripe dashboard to the new host.

## 4. Smoke test
```bash
curl -i https://<new-api-host>/api/health        # expect HTTP 200
```
Then from the browser: load the frontend, register/login, confirm no CORS errors in the console.
