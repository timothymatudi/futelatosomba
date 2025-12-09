# futelatosomba Setup Guide

This guide will help you set up all the necessary API keys and configurations to run futelatosomba locally and in production.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [EmailJS Setup (Contact Form)](#emailjs-setup)
5. [Stripe Setup (Payment Processing)](#stripe-setup)
6. [Authentication Setup](#authentication-setup)
7. [Optional Configurations](#optional-configurations)
8. [Running the Application](#running-the-application)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd futelatosomba
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Frontend is static HTML/JS, no installation needed
   ```

3. **Create environment file**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your actual values
   nano .env  # or use your preferred editor
   ```

4. **Start the server**
   ```bash
   cd backend
   npm start
   ```

5. **Access the application**
   - Open your browser and go to: `http://localhost:3000`

---

## Environment Configuration

The application uses environment variables for configuration. All settings are defined in the `.env` file.

### Creating Your .env File

```bash
cp .env.example .env
```

Edit the `.env` file and fill in your actual values. **Never commit the `.env` file to version control!**

---

## Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended for Production)

1. **Sign up for MongoDB Atlas**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select a cloud provider and region (closest to your users)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Give user "Read and write to any database" privileges
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with your database name (e.g., `futelatosomba`)

6. **Update .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/futelatosomba?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB (Development)

1. **Install MongoDB**
   - Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB**
   ```bash
   mongod
   ```

3. **Update .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/futelatosomba
   ```

---

## EmailJS Setup

EmailJS allows you to send emails directly from client-side JavaScript without a backend email server.

### Step-by-Step Setup

1. **Create EmailJS Account**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Click "Sign Up" (free tier available)
   - Verify your email

2. **Add Email Service**
   - Log in to your EmailJS dashboard
   - Go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the authentication steps
   - Give your service a name (e.g., "futelatosomba-contact")
   - Click "Create Service"
   - **Save the Service ID** (e.g., `service_abc123`)

3. **Create Email Template**
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use this template content:

   **Subject:**
   ```
   New Contact Form Submission - {{subject}}
   ```

   **Content:**
   ```html
   <h2>New Contact Form Submission</h2>
   <p><strong>From:</strong> {{from_name}}</p>
   <p><strong>Email:</strong> {{from_email}}</p>
   <p><strong>Phone:</strong> {{phone}}</p>
   <p><strong>Subject:</strong> {{subject}}</p>
   <p><strong>Message:</strong></p>
   <p>{{message}}</p>
   ```

   - Click "Save"
   - **Save the Template ID** (e.g., `template_xyz789`)

4. **Get Public Key**
   - Go to "Account" → "General"
   - Find your "Public Key" (e.g., `P1a2b3c4d5e6f7g8h9`)
   - Copy this key

5. **Update contact.html**
   - Open `frontend/public/contact.html`
   - Find lines 142-146
   - Replace the placeholder values:
   ```javascript
   const EMAILJS_CONFIG = {
       publicKey: 'P1a2b3c4d5e6f7g8h9',    // Your actual public key
       serviceId: 'service_abc123',         // Your actual service ID
       templateId: 'template_xyz789'        // Your actual template ID
   };
   ```

6. **Test the Contact Form**
   - Go to `http://localhost:3000/contact.html`
   - Fill out and submit the form
   - Check your email for the message
   - Check your EmailJS dashboard for sent emails

---

## Stripe Setup

Stripe is used for processing donations and payments.

### Step-by-Step Setup

1. **Create Stripe Account**
   - Go to [https://stripe.com/](https://stripe.com/)
   - Click "Start now" and create an account
   - Verify your email

2. **Get API Keys**
   - Log in to your Stripe Dashboard
   - Go to [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
   - Find your **Publishable key** (starts with `pk_test_` for test mode)
   - Click "Reveal test key" to see your **Secret key** (starts with `sk_test_`)

3. **Update Environment Variables**
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_test_51Abc123...
   STRIPE_SECRET_KEY=sk_test_51Xyz789...
   ```

4. **Update stripe-integration.js**
   - Open `frontend/public/stripe-integration.js`
   - Replace the placeholder with your publishable key:
   ```javascript
   const stripe = Stripe('pk_test_51Abc123...');
   ```

5. **Test Payments**
   - Use Stripe test card numbers: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

6. **Switch to Live Mode** (Production Only)
   - Toggle from "Test mode" to "Live mode" in Stripe dashboard
   - Get your live API keys (starts with `pk_live_` and `sk_live_`)
   - Update your production environment variables
   - **Never commit live keys to version control!**

---

## Authentication Setup

### JWT Secret Generation

Generate a secure random string for JWT token signing:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

Update your `.env`:
```env
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c
SESSION_SECRET=b9g6g278g55g5075f7d109eff938221d
```

---

## Optional Configurations

### SMTP Email (Alternative to EmailJS)

If you prefer to send emails from the backend:

1. **Gmail Setup** (requires App Password)
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Generate App Password
   - Update .env:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

2. **SendGrid Setup** (recommended for production)
   - Sign up at [https://sendgrid.com/](https://sendgrid.com/)
   - Create API key
   - Update .env:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxx
   ```

### Map Services

The app currently uses OpenStreetMap (no API key required). For advanced features:

**Google Maps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Maps JavaScript API"
4. Create credentials (API key)
5. Update .env:
   ```env
   GOOGLE_MAPS_API_KEY=AIzaSyXxxxxxxxxxxx
   ```

**Mapbox:**
1. Sign up at [https://mapbox.com/](https://mapbox.com/)
2. Get your access token
3. Update .env:
   ```env
   MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIi...
   ```

---

## Running the Application

### Development Mode

```bash
# Start the backend server
cd backend
npm start

# Server runs on http://localhost:3000
# Frontend is served from http://localhost:3000
```

### Production Mode

1. **Set NODE_ENV to production**
   ```env
   NODE_ENV=production
   ```

2. **Use a process manager** (PM2 recommended)
   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Start the application
   cd backend
   pm2 start server.js --name futelatosomba

   # Save PM2 configuration
   pm2 save

   # Set PM2 to start on system boot
   pm2 startup
   ```

3. **Use a reverse proxy** (Nginx recommended)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable HTTPS** (using Let's Encrypt)
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Troubleshooting

### MongoDB Connection Fails

**Error:** `Error connecting to MongoDB: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Check if MongoDB is running: `mongod` or `brew services start mongodb-community`
2. Verify MONGODB_URI in .env is correct
3. Check firewall settings
4. For Atlas: Verify IP whitelist includes your IP

### EmailJS Not Sending Emails

**Solutions:**
1. Verify all three IDs are correct (publicKey, serviceId, templateId)
2. Check EmailJS dashboard for error messages
3. Ensure template variable names match form field names
4. Check browser console for errors
5. Verify email service is properly authenticated

### Stripe Payment Fails

**Solutions:**
1. Ensure you're using test mode keys in development
2. Use valid test card: 4242 4242 4242 4242
3. Check Stripe dashboard logs for error details
4. Verify publishable key is in stripe-integration.js
5. Check browser console for JavaScript errors

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -ano | grep 3000

# Kill the process
kill -9 <PID>

# Or change the port in .env
PORT=3001
```

### Frontend Not Loading

**Solutions:**
1. Ensure backend server is running: `cd backend && npm start`
2. Check console for errors: Open browser DevTools (F12)
3. Verify all script files are loading (check Network tab)
4. Clear browser cache and reload
5. Check file paths in HTML files

---

## Security Best Practices

1. **Never commit .env to Git**
   - Add `.env` to `.gitignore`
   - Only commit `.env.example`

2. **Use strong secrets**
   - Generate random JWT_SECRET and SESSION_SECRET
   - Use different secrets for development and production

3. **Protect API keys**
   - Keep Stripe secret key server-side only
   - Use environment variables, never hardcode keys

4. **Enable HTTPS in production**
   - Use Let's Encrypt for free SSL certificates
   - Force HTTPS redirect

5. **Validate user input**
   - Sanitize all form inputs
   - Use rate limiting for API endpoints

6. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

---

## Getting Help

If you encounter issues:

1. Check this SETUP.md guide thoroughly
2. Review error messages in the console/terminal
3. Check service-specific documentation:
   - [MongoDB Docs](https://docs.mongodb.com/)
   - [EmailJS Docs](https://www.emailjs.com/docs/)
   - [Stripe Docs](https://stripe.com/docs)
4. Search for the error message online
5. Check the GitHub Issues page

---

## Next Steps

After completing setup:

1. ✅ Test all functionality locally
2. ✅ Configure production environment
3. ✅ Set up domain and hosting
4. ✅ Enable HTTPS
5. ✅ Set up monitoring and logging
6. ✅ Create backup strategy for database
7. ✅ Test payment processing thoroughly
8. ✅ Launch! 🚀

Good luck with your futelatosomba property platform!
