# CORRECT Environment Variables for Render

## ❌ WRONG Database Connection

You provided this PostgreSQL connection string:
```
postgresql://mongodb_34g4_user:cSvf5RYLAbwHrwRnOuvZHCgIn6DUUGur@dpg-d4s81dggjchc7388o7a0-a/mongodb_34g4
```

**This is PostgreSQL - but your backend uses MongoDB!**

---

## ✅ CORRECT Database Connection

Use your **MongoDB Atlas** connection string instead:

```
mongodb+srv://timomatudi_db_user:LUBUZi1044%40%29@cluster0.iuhojxz.mongodb.net/futelatosomba?retryWrites=true&w=majority
```

**Important:** The `@` and `)` characters in your password are URL-encoded:
- `@` → `%40`
- `)` → `%29`

---

## Complete Environment Variables for Render

Go to: https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/environment

### Delete This Variable (If It Exists):
- ❌ Any PostgreSQL connection string

### Add/Update These Variables:

**1. MONGO_DATABASE_URL** (CRITICAL - Use MongoDB, NOT PostgreSQL)
```
mongodb+srv://timomatudi_db_user:LUBUZi1044%40%29@cluster0.iuhojxz.mongodb.net/futelatosomba?retryWrites=true&w=majority
```

**2. JWT_SECRET** (CRITICAL)
```
futelatosomba_super_secure_jwt_secret_key_2024_production_v1
```

**3. FRONTEND_URL** (CRITICAL)
```
https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app
```

**4. CLIENT_URL** (CRITICAL)
```
https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app
```

**5. NODE_ENV**
```
production
```

**6. PORT**
```
10000
```

### Optional (Can Add Later):

**Stripe Keys:**
```
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Email (SendGrid):**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key_here
EMAIL_FROM=noreply@futelatosomba.com
```

---

## Steps to Fix

### Step 1: Update Environment Variables
1. Go to: https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/environment
2. Find any variable with PostgreSQL connection
3. Delete it or update it to use the MongoDB connection above
4. Add the MONGO_DATABASE_URL variable with the MongoDB Atlas connection string
5. Add JWT_SECRET, FRONTEND_URL, CLIENT_URL
6. Click "Save Changes"

### Step 2: Whitelist Render IPs in MongoDB Atlas
1. Go to: https://cloud.mongodb.com/
2. Select your project
3. Click "Network Access" (left sidebar)
4. Click "Add IP Address"
5. Option A: Click "Allow Access from Anywhere" (easiest)
   - This adds `0.0.0.0/0`
6. Option B: Add both Render IP ranges:
   - `74.220.49.0/24`
   - `74.220.57.0/24`
7. Click "Confirm"

### Step 3: Redeploy Backend
1. Go back to Render dashboard
2. Click "Manual Deploy"
3. Click "Deploy latest commit"
4. Wait 2-3 minutes

### Step 4: Test
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

## Why This Matters

Your backend code (server.js) uses:
```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DATABASE_URL);
```

Mongoose is a **MongoDB** ORM, not PostgreSQL!

If you provide a PostgreSQL connection string, the backend will fail to connect to the database.

---

## Summary

**Current Issue:**
- ❌ Using PostgreSQL connection string
- ✅ Backend needs MongoDB Atlas connection string

**Fix:**
1. Update MONGO_DATABASE_URL to use MongoDB Atlas
2. Whitelist Render IPs in MongoDB Atlas
3. Redeploy backend
4. Test `/api/health` endpoint

Once this is fixed, your backend will start properly! 🚀
