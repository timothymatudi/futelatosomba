// Backend server for futelatosomba with Stripe integration
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const connectDB = require('./config/database');

// Import models
const Donation = require('./models/Donation');
const Transaction = require('./models/Transaction');

// Import routes
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static('../frontend/public'));

// API Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Create donation payment intent
app.post('/api/create-donation-payment', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({ error: 'Invalid amount. Minimum donation is $0.50' });
        }

        // Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            metadata: {
                type: 'donation',
                purpose: 'Community Kids Support'
            },
            description: 'Donation to support community kids in DRC'
        });

        // Save donation to database
        const donation = new Donation({
            amount,
            currency: 'usd',
            stripePaymentIntentId: paymentIntent.id,
            status: 'pending',
            donor: req.body.donor || {}
        });
        await donation.save();

        res.json({
            clientSecret: paymentIntent.client_secret,
            donationId: donation._id
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create premium listing checkout session
app.post('/api/create-premium-checkout', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Premium Property Listing',
                            description: 'Premium listing with featured placement and enhanced visibility',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/index.html`,
            metadata: {
                type: 'premium_listing'
            }
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for Stripe events
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent succeeded:', paymentIntent.id);

            // Update donation status in database
            await Donation.findOneAndUpdate(
                { stripePaymentIntentId: paymentIntent.id },
                { status: 'succeeded', receiptUrl: paymentIntent.charges?.data[0]?.receipt_url }
            );
            break;

        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout session completed:', session.id);

            // Update transaction status in database
            await Transaction.findOneAndUpdate(
                { stripeSessionId: session.id },
                { status: 'succeeded', completedAt: new Date() }
            );
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            // Handle failed payment
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Get payment status
app.get('/api/payment-status/:paymentIntentId', async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
        });
    } catch (error) {
        console.error('Error retrieving payment status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get checkout session status
app.get('/api/checkout-session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.json({
            status: session.payment_status,
            customer_email: session.customer_email,
            amount_total: session.amount_total
        });
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});
