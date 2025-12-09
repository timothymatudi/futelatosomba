# Backend Deployment Guide - Render.com

## Quick Deploy to Render

### Option 1: Deploy via Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Sign up or log in with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `timothymatudi/futelatosomba`
   - Select the repository

3. **Configure Service**
   - **Name:** `futelatosomba-backend`
   - **Region:** Choose closest to your users (e.g., Frankfurt for EU, Oregon for US)
   - **Branch:** `master`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free (or paid for better performance)

4. **Add Environment Variables**

   Click "Advanced" → "Add Environment Variable" and add these:

   ```
   NODE_ENV=production
   PORT=10000
   
   # MongoDB (Required)
   MONGO_DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/futelatosomba
   
   # JWT Secret (Required - generate a random 64-character string)
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long_here
   
   # Stripe (Required for payments)
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Email SMTP (Required for email features)
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASSWORD=your_sendgrid_api_key
   EMAIL_FROM=noreply@futelatosomba.com
   
   # Frontend URL (Required)
   FRONTEND_URL=https://futelatosomba-frontend-kd8syhxlh-timothy-s-projects-61ca8a51.vercel.app
   CLIENT_URL=https://futelatosomba-frontend-kd8syhxlh-timothy-s-projects-61ca8a51.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-5 minutes)
   - Your backend will be live at: `https://futelatosomba-backend.onrender.com`

---

## Step-by-Step Setup Guide

### 1. Set Up MongoDB Atlas (Free)

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free account

2. **Create Cluster**
   - Choose "Free" tier (M0)
   - Select region closest to your Render region
   - Cluster name: `futelatosomba`

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `futelatosomba_user`
   - Password: Generate strong password (save it!)
   - User Privileges: Read and write to any database

4. **Allow Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is safe because authentication is required

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://futelatosomba_user:<password>@cluster0.xxxxx.mongodb.net/futelatosomba?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Save this for Render environment variables

### 2. Set Up SendGrid (Free Email Service)

1. **Create Account**
   - Go to: https://signup.sendgrid.com/
   - Sign up for free (100 emails/day)

2. **Create API Key**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: `Futelatosomba`
   - Permissions: Full Access
   - Copy the API key (starts with `SG.`)
   - **Important:** Save it now, you won't see it again!

3. **Verify Sender**
   - Go to Settings → Sender Authentication
   - Verify your email address or domain
   - Follow verification steps

4. **SMTP Credentials**
   - Username: `apikey` (literally the word "apikey")
   - Password: Your API key from step 2
   - Host: `smtp.sendgrid.net`
   - Port: `587`

### 3. Deploy Backend to Render

Follow the "Option 1" steps above with these environment variables:

```env
NODE_ENV=production
PORT=10000

# MongoDB from Step 1
MONGO_DATABASE_URL=mongodb+srv://futelatosomba_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/futelatosomba

# JWT Secret (generate random string)
JWT_SECRET=generate_a_random_64_character_string_here_very_secure_and_random

# Stripe Keys (get from stripe.com dashboard)
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid SMTP from Step 2
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_api_key_here
EMAIL_FROM=noreply@futelatosomba.com

# Frontend URL (from Vercel)
FRONTEND_URL=https://futelatosomba-frontend-kd8syhxlh-timothy-s-projects-61ca8a51.vercel.app
CLIENT_URL=https://futelatosomba-frontend-kd8syhxlh-timothy-s-projects-61ca8a51.vercel.app
```

### 4. Update Frontend to Use Backend URL

Once backend is deployed, update frontend:

1. **Get Backend URL**
   - From Render dashboard, copy your service URL
   - Example: `https://futelatosomba-backend.onrender.com`

2. **Create Frontend Environment Variable**
   - Go to Vercel dashboard
   - Select your frontend project
   - Go to Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://futelatosomba-backend.onrender.com/api
     ```

3. **Redeploy Frontend**
   - Vercel will auto-redeploy with new env variable
   - Or manually trigger deployment

---

## Testing Your Deployment

### 1. Test Backend Health
```bash
curl https://futelatosomba-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-09T...",
  "uptime": 123.45
}
```

### 2. Test Frontend
- Open: https://futelatosomba-frontend-kd8syhxlh-timothy-s-projects-61ca8a51.vercel.app
- Should load without errors
- Try registering a user
- Check if email verification works

### 3. Monitor Logs
- **Backend Logs:** Render Dashboard → Your Service → Logs
- **Frontend Logs:** Vercel Dashboard → Your Project → Deployments → Logs

---

## Cost Breakdown (All Free to Start!)

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| **Render** | Free | 750 hours/month, sleeps after 15min inactive |
| **MongoDB Atlas** | Free | 512MB storage, shared cluster |
| **SendGrid** | Free | 100 emails/day forever |
| **Vercel** | Free | Unlimited bandwidth for personal projects |

**Total Monthly Cost:** $0 (until you need to scale)

---

## Troubleshooting

### Backend Won't Start
- Check logs in Render dashboard
- Verify all environment variables are set
- Make sure MongoDB connection string is correct

### Emails Not Sending
- Verify SendGrid API key is correct
- Check SendGrid sender is verified
- Look for email errors in Render logs

### Frontend Can't Connect to Backend
- Check REACT_APP_API_URL is correct
- Verify CORS is configured (already done)
- Check backend is running (visit /api/health)

### Database Connection Fails
- Verify MongoDB password is correct (no special characters that need encoding)
- Check IP whitelist includes 0.0.0.0/0
- Verify database user has correct permissions

---

## Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Add custom domain in Render and Vercel dashboards
   - Configure DNS records
   - Update FRONTEND_URL and CLIENT_URL

2. **Production Stripe Keys**
   - Switch from test to live keys
   - Set up real webhook endpoints

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor performance
   - Set up uptime monitoring

4. **Backups**
   - MongoDB Atlas has automatic backups
   - Consider exporting critical data regularly

---

## Support

- **Render Docs:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **SendGrid Docs:** https://docs.sendgrid.com/

---

**Your app is production-ready!** 🚀
