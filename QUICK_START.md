# ⚡ Quick Start Guide

Get futelatosomba running in 5 minutes!

---

## Prerequisites

```bash
✅ Node.js v14+ installed
✅ MongoDB installed (or MongoDB Atlas account)
✅ Git installed
```

---

## 🚀 Installation (5 Steps)

### Step 1: Clone & Navigate

```bash
cd /data/data/com.termux/files/home/futelatosomba
```

### Step 2: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add:
```env
MONGO_DATABASE_URL=mongodb://localhost:27017/futelatosomba
JWT_SECRET=your-super-secret-key-here
```

### Step 3: Seed Database

```bash
npm run seed
```

You'll see:
```
✅ Created admin: admin@futelatosomba.com
✅ Created agent: agent@kinshasa-realty.com
✅ Created agent: contact@lubumbashi-homes.com
✅ Created 8 properties
```

### Step 4: Start Backend

```bash
npm start
```

Server running on http://localhost:3000

### Step 5: Start Frontend

**New terminal:**
```bash
cd frontend/futelatosomba-react-app
npm install
npm start
```

App running on http://localhost:3001

---

## 🎉 You're Done!

Visit **http://localhost:3001** in your browser.

---

## 🔑 Test Credentials

### Admin
- Email: `admin@futelatosomba.com`
- Password: `Admin@123`

### Agent (Kinshasa)
- Email: `agent@kinshasa-realty.com`
- Password: `Agent@123`

### Agent (Lubumbashi)
- Email: `contact@lubumbashi-homes.com`
- Password: `Agent@123`

### Regular User
- Email: `john@example.com`
- Password: `User@123`

---

## 💳 Test Stripe Payments

Use these test cards:

**Success:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`

**Decline:**
- Card: `4000 0000 0000 9995`

---

## 🧪 Test Features

### 1. Browse Properties
- Go to homepage
- Use search filters
- Click on a property

### 2. User Registration
- Click "Register"
- Fill form
- Select role (User or Agent)

### 3. Add Property (Agent Only)
- Login as agent
- Click "Add Property"
- Fill form and upload images
- Submit

### 4. Make Donation
- Click "Donate Now"
- Enter amount
- Use test card
- Complete payment

### 5. Premium Listing
- Login as agent
- Add property
- Upgrade to premium
- Pay $25 with test card

### 6. Admin Panel (Admin Only)
- Login as admin
- Go to `/dashboard`
- View statistics
- Approve/reject properties

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem:** `MongooseError: connect ECONNREFUSED`

**Solution:**
```bash
# Start MongoDB locally
mongod --dbpath ~/data/db

# Or use MongoDB Atlas (cloud)
# Update MONGO_DATABASE_URL in .env
```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE :::3000`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change PORT in backend/.env
PORT=3001
```

### Frontend Can't Connect to API

**Problem:** Network errors in browser console

**Solution:**
```bash
# Check backend is running
curl http://localhost:3000/api/health

# Update frontend .env
REACT_APP_API_URL=http://localhost:3000/api
```

### Images Not Loading

**Problem:** 404 errors for images

**Solution:**
```bash
# Create uploads directory
mkdir backend/uploads

# Check permissions
chmod 755 backend/uploads
```

---

## 📚 Next Steps

1. **Customize branding** - Update logo, colors in frontend
2. **Configure Stripe** - See `STRIPE_SETUP.md`
3. **Set up email** - Configure SendGrid or SMTP
4. **Deploy to production** - See `DEPLOYMENT_GUIDE.md`
5. **Add custom domain** - Configure DNS

---

## 📖 Documentation

- `README.md` - Project overview
- `DEPLOYMENT_GUIDE.md` - Production deployment (detailed)
- `STRIPE_SETUP.md` - Stripe configuration (detailed)
- `PRODUCTION_READY_SUMMARY.md` - Feature list & comparison
- `PRODUCTION_PLAN.md` - Development roadmap

---

## 🆘 Get Help

1. Check documentation files
2. Read error messages carefully
3. Review backend logs
4. Check browser console

---

## ⚙️ Environment Variables Reference

### Backend (.env)

```env
# Required
NODE_ENV=development
PORT=3000
MONGO_DATABASE_URL=mongodb://localhost:27017/futelatosomba
JWT_SECRET=your_secret_here

# Stripe (optional for basic testing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (optional - defaults to console)
EMAIL_PROVIDER=console
# EMAIL_PROVIDER=sendgrid
# SENDGRID_API_KEY=SG...

# URLs
CLIENT_URL=http://localhost:3001
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🎯 Features to Test

- [ ] User registration & login
- [ ] Browse properties
- [ ] Search with filters
- [ ] View property details
- [ ] Add property (agent)
- [ ] Upload images
- [ ] Edit property
- [ ] Delete property
- [ ] Favorite properties
- [ ] Make donation
- [ ] Premium listing payment
- [ ] Admin dashboard
- [ ] Approve/reject properties
- [ ] Multi-language switching
- [ ] Password reset
- [ ] Mobile responsive design

---

## 📊 Expected Performance

### Local Development

- Backend startup: 2-3 seconds
- Frontend startup: 10-15 seconds
- Page load time: < 1 second
- API response time: < 100ms

### Database

- Seeded data: 4 users, 8 properties
- Database size: ~5MB
- Queries: Indexed for fast search

---

## 🚀 Ready to Deploy?

See **DEPLOYMENT_GUIDE.md** for complete production deployment instructions.

**Free tier deployment available** (MongoDB Atlas + Railway + Vercel = $0/month)

---

**Happy coding! 🎉**

*futelatosomba - Where Dreams Find Their Address*
