# Fix Render Backend Deployment

## Problem
Your Render service is looking for `package.json` in the wrong directory.

Error: `error Couldn't find a package.json file in "/opt/render/project/src"`

## Solution

### Option 1: Fix via Render Dashboard (Recommended)

1. **Go to your Render service:**
   - Visit: https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog

2. **Update Root Directory:**
   - Click on your service
   - Go to "Settings" tab
   - Scroll to "Build & Deploy" section
   - Find "Root Directory" field
   - Change it to: `backend`
   - Click "Save Changes"

3. **Trigger Manual Deploy:**
   - Go to "Manual Deploy" section
   - Click "Deploy latest commit"
   - Wait 2-3 minutes for deployment

4. **Verify:**
   ```bash
   curl https://futelatosomba.onrender.com/api/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-12-09T...",
     "uptime": 123
   }
   ```

---

### Option 2: Deploy Fresh Service

If Option 1 doesn't work, create a new service:

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com/

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect repository: `timothymatudi/futelatosomba`

3. **Configure:**
   - **Name:** `futelatosomba-backend`
   - **Region:** Choose closest (Frankfurt for EU)
   - **Branch:** `master`
   - **Root Directory:** `backend` ⚠️ **IMPORTANT**
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. **Add Environment Variables:**
   Copy these from your current service or use these values:

   ```
   NODE_ENV=production
   PORT=10000
   MONGO_DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/futelatosomba
   JWT_SECRET=your_jwt_secret_here
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASSWORD=your_sendgrid_api_key
   EMAIL_FROM=noreply@futelatosomba.com
   FRONTEND_URL=https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app
   CLIENT_URL=https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment

6. **Update Frontend:**
   If you get a new backend URL, update frontend `.env.production`:
   ```
   REACT_APP_API_URL=https://your-new-backend-url.onrender.com/api
   ```

---

## What Went Wrong?

Your repository structure is:
```
futelatosomba/
├── backend/          ← Backend code is here
│   ├── package.json
│   ├── server.js
│   └── ...
├── frontend/
└── ...
```

But Render was looking in the root directory (`/opt/render/project/src`) instead of the `backend` subdirectory.

By setting **Root Directory** to `backend`, Render will correctly find:
- `backend/package.json`
- `backend/server.js`
- All backend dependencies

---

## After Fixing

Once your backend is running, verify the connection:

1. **Test Backend Health:**
   ```bash
   curl https://futelatosomba.onrender.com/api/health
   ```

2. **Test Frontend:**
   - Visit: https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app
   - Try registering a user
   - Check if frontend can communicate with backend

3. **Check Logs:**
   - Render logs: https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/logs
   - Look for "Server running on port 10000"

---

## Need Help?

If you're still having issues:
1. Check Render logs for specific errors
2. Verify MongoDB Atlas has Render IPs whitelisted (74.220.49.0/24, 74.220.57.0/24)
3. Verify all environment variables are set correctly
