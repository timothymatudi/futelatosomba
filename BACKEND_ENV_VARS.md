# Backend Environment Variables for Render

## MongoDB Connection String

Your MongoDB credentials:
- **Username:** `timomatudi_db_user`
- **Password:** `LUBUZi1044@)`
- **Cluster:** `cluster0.iuhojxz.mongodb.net`
- **Database Name:** `futelatosomba`

**Complete Connection String:**
```
mongodb+srv://timomatudi_db_user:LUBUZi1044%40%29@cluster0.iuhojxz.mongodb.net/futelatosomba?retryWrites=true&w=majority
```

**Important:** The password contains special characters `@` and `)` which need to be URL-encoded:
- `@` becomes `%40`
- `)` becomes `%29`

So the encoded password is: `LUBUZi1044%40%29`

---

## Complete Environment Variables for Render

Go to your Render service settings and add/update these environment variables:

**Link:** https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/environment

### Required Variables:

```env
NODE_ENV=production
PORT=10000

# MongoDB (REQUIRED)
MONGO_DATABASE_URL=mongodb+srv://timomatudi_db_user:LUBUZi1044%40%29@cluster0.iuhojxz.mongodb.net/futelatosomba?retryWrites=true&w=majority

# JWT Secret (REQUIRED - generate random string)
JWT_SECRET=futelatosomba_super_secure_jwt_secret_key_2024_production

# Frontend URLs (REQUIRED)
FRONTEND_URL=https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app
CLIENT_URL=https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app

# Stripe Keys (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email SMTP (SendGrid - Get from https://app.sendgrid.com/settings/api_keys)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key_here
EMAIL_FROM=noreply@futelatosomba.com
```

---

## How to Add These to Render

### Step 1: Go to Environment Variables
- Visit: https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/environment

### Step 2: Add Each Variable
For each variable above:
1. Click "Add Environment Variable"
2. Enter the **Key** (e.g., `MONGO_DATABASE_URL`)
3. Enter the **Value** (e.g., the MongoDB connection string)
4. Click "Save Changes"

### Step 3: Critical Variables (Must Have)
At minimum, you MUST have these three:
- `MONGO_DATABASE_URL` - Your database connection
- `JWT_SECRET` - For authentication tokens
- `FRONTEND_URL` and `CLIENT_URL` - For CORS

### Step 4: Optional Variables (For Later)
These can be added later when you're ready:
- Stripe keys - For payment features
- SendGrid/SMTP - For email features

---

## MongoDB Atlas Network Access

Don't forget to whitelist the Render IPs in MongoDB Atlas:

**Go to:** https://cloud.mongodb.com/
1. Select your project
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Add these IPs:
   - `74.220.49.0/24` (Render Server 1)
   - `74.220.57.0/24` (Render Server 2)

**OR** simply click "Allow Access from Anywhere" (adds `0.0.0.0/0`)

---

## Complete Deployment Checklist

- [ ] **Render: Set Root Directory to `backend`**
      https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/settings

- [ ] **Render: Add Environment Variables**
      https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/environment
      (At minimum: MONGO_DATABASE_URL, JWT_SECRET, FRONTEND_URL, CLIENT_URL)

- [ ] **MongoDB: Whitelist Render IPs**
      https://cloud.mongodb.com/
      (Add 74.220.49.0/24 and 74.220.57.0/24 OR 0.0.0.0/0)

- [ ] **Render: Trigger Manual Deploy**
      Click "Manual Deploy" → "Deploy latest commit"

- [ ] **Test Backend**
      ```bash
      curl https://futelatosomba.onrender.com/api/health
      ```

---

## After Setup

Once all three fixes are done:
1. Wait 2-3 minutes for deployment
2. Backend should start successfully
3. You can test with the health endpoint
4. Frontend should be able to connect to backend

Your app will be fully live! 🚀
