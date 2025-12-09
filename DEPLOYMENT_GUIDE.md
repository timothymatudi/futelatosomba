# futelatosomba Production Deployment Guide

## Overview
This guide will help you deploy futelatosomba (Rightmove for DRC) to production.

---

## Prerequisites

- MongoDB Atlas account (free tier available)
- Stripe account (for payments)
- Domain name (optional but recommended)
- Email service (SendGrid, SMTP, or similar)

---

## Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (M0 Free tier is fine for MVP)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### 1.2 Configure Database Access

1. Database Access → Add New Database User
   - Username: `futelatosomba`
   - Password: Generate secure password
   - Database User Privileges: Read and write to any database

2. Network Access → Add IP Address
   - For development: Add your current IP
   - For production: Add `0.0.0.0/0` (allow from anywhere)

### 1.3 Update Environment Variables

```bash
MONGO_DATABASE_URL=mongodb+srv://futelatosomba:<password>@cluster0.xxxxx.mongodb.net/futelatosomba?retryWrites=true&w=majority
```

### 1.4 Seed Database

```bash
cd backend
npm run seed
```

---

## Step 2: Stripe Configuration

### 2.1 Get API Keys

1. Go to https://dashboard.stripe.com/
2. Developers → API Keys
3. Copy both keys:
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`

### 2.2 Configure Webhooks

1. Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://yourdomain.com/api/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
4. Copy Signing secret: `whsec_...`

### 2.3 Update Environment Variables

**Backend (.env):**
```env
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Frontend (.env):**
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### 2.4 Test Webhook Locally (Development)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook

# In another terminal, trigger test events
stripe trigger payment_intent.succeeded
```

---

## Step 3: Email Service Setup

### Option A: SendGrid (Recommended - Free 100 emails/day)

1. Sign up at https://sendgrid.com/
2. Settings → API Keys → Create API Key
3. Verify sender email address

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=noreply@futelatosomba.com
```

### Option B: SMTP (Gmail, Outlook, etc.)

For Gmail:
1. Enable 2FA on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

### Option C: Development (Console only)

```env
EMAIL_PROVIDER=console
```

---

## Step 4: Backend Deployment

### Option A: Railway.app (Recommended - Free Tier)

1. Go to https://railway.app/
2. Sign up with GitHub
3. New Project → Deploy from GitHub repo
4. Select your futelatosomba repository
5. Root Directory: `/backend`
6. Add environment variables (see section below)
7. Deploy!

**Environment Variables for Railway:**
```env
NODE_ENV=production
PORT=3000
MONGO_DATABASE_URL=mongodb+srv://...
JWT_SECRET=your-super-long-random-secret-here
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG...
CLIENT_URL=https://futelatosomba.com
```

### Option B: Render.com

1. Go to https://render.com/
2. New → Web Service
3. Connect GitHub repository
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Add environment variables
7. Deploy!

### Option C: DigitalOcean App Platform

1. Go to https://www.digitalocean.com/
2. Create → Apps → Deploy from GitHub
3. Select repository
4. Configure build settings
5. Add environment variables
6. Deploy!

---

## Step 5: Frontend Deployment

### Option A: Vercel (Recommended)

1. Go to https://vercel.com/
2. Import Git Repository
3. Framework: Create React App
4. Root Directory: `/frontend/futelatosomba-react-app`
5. Build Command: `npm run build`
6. Output Directory: `build`

**Environment Variables for Vercel:**
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

7. Deploy!

### Option B: Netlify

1. Go to https://netlify.com/
2. Add new site → Import from Git
3. Build command: `cd frontend/futelatosomba-react-app && npm run build`
4. Publish directory: `frontend/futelatosomba-react-app/build`
5. Add environment variables
6. Deploy!

### Option C: AWS S3 + CloudFront

```bash
cd frontend/futelatosomba-react-app
npm run build
aws s3 sync build/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Step 6: Domain Configuration

### 6.1 Configure DNS

If using custom domain (e.g., futelatosomba.com):

**A Records:**
```
@ → Your backend IP
www → Your frontend IP
api → Your backend IP
```

**CNAME Records (if using Vercel/Netlify):**
```
www → cname.vercel-dns.com
```

### 6.2 SSL Certificate

Both Vercel, Netlify, Railway, and Render provide automatic SSL.

For custom setup:
```bash
# Using Certbot (Let's Encrypt)
sudo certbot --nginx -d futelatosomba.com -d www.futelatosomba.com
```

---

## Step 7: Environment Variables Reference

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=3000

# Database
MONGO_DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/futelatosomba

# JWT
JWT_SECRET=generate-with-node-crypto-randomBytes-64-characters

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@futelatosomba.com

# URLs
CLIENT_URL=https://futelatosomba.com
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://api.futelatosomba.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Step 8: Post-Deployment Checklist

### 8.1 Test Critical Flows

- [ ] User registration
- [ ] User login
- [ ] Password reset
- [ ] Email verification
- [ ] Property search
- [ ] Property details page
- [ ] Add property (agent)
- [ ] Image upload
- [ ] Stripe donation
- [ ] Premium listing payment
- [ ] Admin panel access
- [ ] Mobile responsiveness

### 8.2 Security Checks

- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Helmet security headers
- [ ] Environment variables secure (not in code)
- [ ] Database password strong
- [ ] JWT secret is random and long
- [ ] No console.logs in production code

### 8.3 Performance Checks

- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] API response time < 500ms
- [ ] Database queries indexed
- [ ] CDN configured for static assets

### 8.4 Monitoring Setup

1. **Error Tracking**: Set up Sentry.io
   ```bash
   npm install @sentry/node @sentry/react
   ```

2. **Uptime Monitoring**: Configure UptimeRobot
   - Monitor: https://futelatosomba.com
   - Monitor: https://api.futelatosomba.com/api/health

3. **Analytics**: Add Google Analytics
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

---

## Step 9: Database Backups

### MongoDB Atlas Automated Backups

1. Atlas → Clusters → Your Cluster
2. Backup → Enable Cloud Backup
3. Configure backup schedule (daily recommended)
4. Test restore procedure

### Manual Backup

```bash
# Export database
mongodump --uri="mongodb+srv://..." --out=/backups/futelatosomba-$(date +%Y%m%d)

# Restore database
mongorestore --uri="mongodb+srv://..." /backups/futelatosomba-20241208
```

---

## Step 10: Scaling Considerations

### When to Scale (Metrics)

- **Database**: Upgrade MongoDB cluster when:
  - Storage > 400MB (M0 limit is 512MB)
  - Connections > 100 concurrent

- **Backend**: Scale horizontally when:
  - CPU usage > 70% consistently
  - Response time > 1 second
  - Traffic > 10,000 requests/day

- **Frontend**: Use CDN when:
  - Traffic > 100,000 page views/month
  - Users from multiple continents

### Scaling Strategy

1. **Database**: Upgrade to M10 cluster ($0.08/hr)
2. **Backend**: Add more instances (Railway auto-scales)
3. **CDN**: Configure Cloudflare (free tier)
4. **Images**: Move to Cloudinary or AWS S3

---

## Step 11: Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs (Sentry)
- Check uptime status
- Review new user registrations

**Weekly:**
- Review property submissions
- Check payment transactions
- Database backup verification

**Monthly:**
- Update dependencies (`npm update`)
- Security audit (`npm audit`)
- Performance review
- Cost analysis

### Update Procedure

```bash
# 1. Test locally
git pull origin main
cd backend && npm install && npm test
cd ../frontend/futelatosomba-react-app && npm install && npm test

# 2. Deploy to staging
git push staging main

# 3. Test staging thoroughly
# 4. Deploy to production
git push production main
```

---

## Troubleshooting

### Issue: Stripe webhooks not working

**Solution:**
1. Check webhook endpoint URL is correct
2. Verify webhook secret matches
3. Check server logs for errors
4. Test with Stripe CLI: `stripe trigger payment_intent.succeeded`

### Issue: Database connection timeout

**Solution:**
1. Check MongoDB Atlas IP whitelist
2. Verify connection string is correct
3. Check if cluster is paused (free tier auto-pauses after inactivity)
4. Test connection: `mongosh "mongodb+srv://..."`

### Issue: Images not uploading

**Solution:**
1. Check uploads folder permissions
2. Verify Multer middleware is configured
3. Check file size limits
4. Consider moving to CDN (Cloudinary)

### Issue: Email not sending

**Solution:**
1. Verify EMAIL_PROVIDER is set correctly
2. Check API keys/credentials
3. Review email service logs
4. Test with console provider first

---

## Cost Estimation (Monthly)

### Free Tier Setup (MVP - 0-1000 users)
- MongoDB Atlas: $0 (M0 Free)
- Railway.app Backend: $0 (Free tier)
- Vercel Frontend: $0 (Hobby plan)
- SendGrid: $0 (100 emails/day)
- Cloudflare DNS: $0
- **Total: $0/month**

### Starter Setup (1000-10000 users)
- MongoDB Atlas: $9 (M10 cluster)
- Railway.app: $5-20 (depending on usage)
- Vercel: $20 (Pro plan)
- SendGrid: $0-15 (Free or Essentials)
- Cloudinary: $0 (Free tier)
- Domain: $12/year
- **Total: ~$35-55/month**

### Growth Setup (10000-100000 users)
- MongoDB Atlas: $57 (M30 cluster)
- Railway/Render: $50-100
- Vercel: $20
- SendGrid: $15-80
- Cloudinary: $0-89
- CDN: $20
- **Total: ~$162-366/month**

---

## Support & Resources

- **Documentation**: https://github.com/yourusername/futelatosomba
- **MongoDB Docs**: https://docs.mongodb.com/
- **Stripe Docs**: https://stripe.com/docs
- **React Docs**: https://react.dev/
- **Node.js Docs**: https://nodejs.org/docs

---

## Security Best Practices

1. **Never commit .env files** - Use .gitignore
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable rate limiting** - Prevent abuse
4. **Validate all inputs** - Prevent injection attacks
5. **Use HTTPS only** - No HTTP in production
6. **Regular updates** - Keep dependencies current
7. **Monitor logs** - Detect suspicious activity
8. **Backup regularly** - Test restore procedures
9. **Use environment variables** - No secrets in code
10. **Principle of least privilege** - Minimal database permissions

---

## Launch Checklist

### Pre-Launch (1 week before)
- [ ] All features tested
- [ ] Security audit completed
- [ ] Performance optimized
- [ ] SEO configured
- [ ] Analytics installed
- [ ] Monitoring active
- [ ] Backup system tested
- [ ] Email templates reviewed
- [ ] Legal pages added (Terms, Privacy)
- [ ] Beta testers onboarded

### Launch Day
- [ ] DNS propagated (24-48 hours)
- [ ] SSL certificate active
- [ ] Database seeded with sample data
- [ ] Payment system tested with real cards
- [ ] Email notifications working
- [ ] All environments deployed
- [ ] Team briefed on support procedures
- [ ] Social media announcement ready

### Post-Launch (1 week after)
- [ ] Monitor error rates
- [ ] Review user feedback
- [ ] Fix critical bugs
- [ ] Performance tuning
- [ ] Marketing campaign started
- [ ] User onboarding improved
- [ ] Documentation updated

---

**Your platform is now ready for production! 🚀**

For ongoing support, create issues on GitHub or contact the development team.
