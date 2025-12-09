# Stripe Integration Setup Guide

## Overview
This guide explains how to configure Stripe for donations and premium listings in futelatosomba.

---

## Step 1: Create Stripe Account

1. Go to https://stripe.com/
2. Sign up for an account
3. Complete business verification (for live payments)

---

## Step 2: Get API Keys

### Test Mode (Development)

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your keys:
   - **Publishable key**: `pk_test_...` (safe to use in frontend)
   - **Secret key**: `sk_test_...` (keep private in backend)

### Live Mode (Production)

1. Activate your Stripe account
2. Go to https://dashboard.stripe.com/apikeys
3. Copy your live keys:
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...`

---

## Step 3: Configure Backend

### 3.1 Update .env file

```env
# Test mode
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Production mode (when ready)
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 3.2 Test Backend Configuration

```bash
cd backend
npm start

# Test health endpoint
curl http://localhost:3000/api/health
```

---

## Step 4: Configure Webhooks

Webhooks allow Stripe to notify your server about payment events in real-time.

### 4.1 Local Development (Using Stripe CLI)

#### Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Windows:**
Download from https://github.com/stripe/stripe-cli/releases

#### Login to Stripe

```bash
stripe login
```

#### Forward Events to Local Server

```bash
# Start your backend server first
cd backend && npm start

# In another terminal, start webhook forwarding
stripe listen --forward-to localhost:3000/api/webhook
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

Copy this secret to your `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### Test Webhooks

```bash
# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger checkout.session.completed
stripe trigger payment_intent.payment_failed

# Check your backend logs to see events received
```

### 4.2 Production Webhooks

#### Create Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Click **+ Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhook`
4. Description: "futelatosomba payment events"
5. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `checkout.session.expired`
6. Click **Add endpoint**

#### Get Webhook Signing Secret

1. Click on your newly created endpoint
2. Copy the **Signing secret**: `whsec_...`
3. Update production `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

## Step 5: Configure Frontend

### 5.1 Update React .env

Create `frontend/futelatosomba-react-app/.env`:

```env
# Development
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51SakmHRRg6dlGiMNcW2P13bYscEXCsbUZZC8kiOiR7aYp3GPJhINRY8Z7dXOYsXqNRx9OHYsqYoHkHV1CDDOcg2C005YWoTbnv

# Production (comment out for dev)
# REACT_APP_API_URL=https://api.futelatosomba.com/api
# REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 5.2 Start Frontend

```bash
cd frontend/futelatosomba-react-app
npm start
```

---

## Step 6: Test Payment Flows

### 6.1 Test Donation Flow

1. Open http://localhost:3000
2. Click **"Donate Now"** button
3. Select amount (e.g., $10)
4. Use Stripe test card:
   - **Card number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., 12/25)
   - **CVC**: Any 3 digits (e.g., 123)
   - **ZIP**: Any 5 digits (e.g., 12345)
5. Click **"Donate"**
6. Should redirect to success page

### 6.2 Test Premium Listing Flow

1. Login as agent:
   - Email: `agent@kinshasa-realty.com`
   - Password: `Agent@123`
2. Click **"Add Property"**
3. Click **"Upgrade to Premium"** (or similar)
4. Use same test card
5. Complete payment
6. Property should be marked as premium

### 6.3 Verify in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. You should see your test payments
3. Click on a payment to see details

---

## Step 7: Test Card Numbers

Stripe provides test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined (insufficient funds) |
| `4000 0000 0000 0002` | Declined (generic) |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 0341` | Attach and charge with insufficient funds |
| `4000 0000 0000 0069` | Charge succeeds but expires immediately |

Full list: https://stripe.com/docs/testing

---

## Step 8: Payment Flow Details

### Donation Flow

```
User clicks "Donate"
  → Frontend calls POST /api/create-donation-payment
  → Backend creates Stripe PaymentIntent
  → Backend saves Donation to database (status: pending)
  → Frontend shows Stripe payment form
  → User enters card details
  → Stripe processes payment
  → Webhook: payment_intent.succeeded
  → Backend updates Donation (status: succeeded)
  → Frontend redirects to success page
```

### Premium Listing Flow

```
Agent clicks "Upgrade to Premium"
  → Frontend calls POST /api/create-premium-checkout
  → Backend creates Stripe Checkout Session
  → Frontend redirects to Stripe Checkout page
  → User enters payment details
  → Stripe processes payment
  → Webhook: checkout.session.completed
  → Backend updates Property (isPremium: true)
  → Stripe redirects to success page
```

---

## Step 9: Webhook Event Handling

### Events We Handle

```javascript
// backend/server.js

app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  // Verify webhook signature
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update donation status
      await Donation.findOneAndUpdate(
        { stripePaymentIntentId: event.data.object.id },
        { status: 'succeeded' }
      );
      break;

    case 'checkout.session.completed':
      // Mark property as premium
      await Transaction.findOneAndUpdate(
        { stripeSessionId: event.data.object.id },
        { status: 'succeeded' }
      );
      break;

    case 'payment_intent.payment_failed':
      // Handle failed payment
      console.log('Payment failed:', event.data.object.id);
      break;
  }

  res.json({ received: true });
});
```

---

## Step 10: Monitoring & Logs

### View Payments

**Test Mode:**
https://dashboard.stripe.com/test/payments

**Live Mode:**
https://dashboard.stripe.com/payments

### View Webhook Events

**Test Mode:**
https://dashboard.stripe.com/test/webhooks

**Live Mode:**
https://dashboard.stripe.com/webhooks

### Check Logs

```bash
# Backend logs
cd backend
npm start
# Watch for webhook events in console

# Stripe CLI logs
stripe listen --forward-to localhost:3000/api/webhook
# Shows all events in real-time
```

---

## Step 11: Going Live

### Checklist

- [ ] Stripe account verified
- [ ] Live API keys obtained
- [ ] Production webhook endpoint created
- [ ] Webhook signing secret updated
- [ ] Frontend updated with live publishable key
- [ ] Test real payment with small amount
- [ ] Verify webhook events work
- [ ] Set up email receipts
- [ ] Configure payout schedule
- [ ] Add company logo to Stripe checkout
- [ ] Set statement descriptor

### Update Environment Variables

**Backend:**
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (from production webhook)
```

**Frontend:**
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Activate Account

1. Go to https://dashboard.stripe.com/settings/account
2. Complete business details
3. Add bank account for payouts
4. Submit for review
5. Wait for approval (usually 1-2 days)

---

## Step 12: Pricing Configuration

### Current Pricing

- **Donations**: Any amount (minimum $0.50)
- **Premium Listings**: $25.00 USD

### Modify Pricing

**Premium Listing Price:**
Edit `backend/server.js`:
```javascript
const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Premium Property Listing',
      },
      unit_amount: 2500, // $25.00 in cents (change this)
    },
    quantity: 1,
  }],
  // ...
});
```

**Donation Amounts:**
Edit frontend donation modal to change preset amounts.

---

## Troubleshooting

### Issue: "No such payment intent"

**Cause:** PaymentIntent ID mismatch between frontend and backend

**Solution:**
1. Check network tab in browser
2. Verify payment intent ID is being passed correctly
3. Check backend logs for the ID received

### Issue: "Invalid API key"

**Cause:** Wrong API key or test/live mode mismatch

**Solution:**
1. Verify you're using the correct key (test vs live)
2. Check `.env` file is loaded correctly
3. Restart backend server after changing `.env`

### Issue: "Webhook signature verification failed"

**Cause:** Wrong webhook secret or request tampering

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches your endpoint
2. For local dev, use Stripe CLI secret
3. For production, use webhook endpoint secret from dashboard
4. Don't modify webhook payload in middleware

### Issue: Payments succeed but database not updated

**Cause:** Webhook not being received or processed

**Solution:**
1. Check webhook endpoint is publicly accessible
2. Verify webhook events in Stripe dashboard
3. Check backend logs for webhook errors
4. Test webhook manually: `stripe trigger payment_intent.succeeded`

---

## Security Best Practices

1. **Never expose secret key** - Only in backend `.env`
2. **Always verify webhook signatures** - Prevents fake events
3. **Use HTTPS in production** - Required for PCI compliance
4. **Store minimal payment data** - Don't store card numbers
5. **Enable Stripe Radar** - Fraud detection (included free)
6. **Set up alerts** - Get notified of disputes
7. **Regular key rotation** - Roll keys periodically
8. **Monitor webhook failures** - Set up alerts

---

## Additional Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Payment Intents API**: https://stripe.com/docs/payments/payment-intents
- **Checkout Sessions**: https://stripe.com/docs/payments/checkout
- **Webhooks**: https://stripe.com/docs/webhooks
- **Testing**: https://stripe.com/docs/testing
- **Security**: https://stripe.com/docs/security

---

## Support

For Stripe-specific issues:
- **Stripe Support**: https://support.stripe.com/
- **Stripe Community**: https://stripe.com/community

For futelatosomba integration issues:
- Open an issue on GitHub
- Contact the development team

---

**Your Stripe integration is ready! 💳**
