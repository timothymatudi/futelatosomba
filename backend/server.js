// Backend server for futelatosomba with Stripe integration
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const connectDB = require('./config/mongoose');

// Import models
const Donation = require('./models/Donation');
const Transaction = require('./models/Transaction');

// Import routes
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Import security middleware
const csurf = require('csurf');
const {
    apiLimiter,
    authLimiter,
    uploadLimiter,
    paymentLimiter,
    contactLimiter,
    passwordResetLimiter
} = require('./middleware/rateLimiter');
const {
    sanitizeQueryParams,
    sanitizeMongoQuery,
    validatePaymentAmount
} = require('./middleware/validation');

const csrfProtection = csurf({ cookie: true });

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Render deployment (fixes rate limiting warnings)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security Middleware - Applied in specific order

// 1. Enhanced Helmet configuration with proper CSP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'", // Required for React
                "https://js.stripe.com",
                "https://cdn.jsdelivr.net"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https:",
                "blob:"
            ],
            connectSrc: [
                "'self'",
                "https://api.stripe.com"
            ],
            frameSrc: [
                "https://js.stripe.com",
                "https://hooks.stripe.com"
            ],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
        }
    },
    crossOriginEmbedderPolicy: false, // Allow embedding for Stripe
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny'
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
}));

// 2. CORS configuration - Allow multiple origins including Vercel previews
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow any Vercel preview deployment
        if (origin.includes('vercel.app')) {
            return callback(null, true);
        }

        // Allow configured origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-csrf-token']
}));

// 3. Cookie parser (required for CSRF protection)
app.use(cookieParser());

// 4. Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// 5. Query parameter sanitization
app.use(sanitizeQueryParams);

// 6. NoSQL injection protection
app.use(sanitizeMongoQuery);

// Serve static files from frontend production build
app.use(express.static('../frontend/futelatosomba-react-app/build'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// API Routes with rate limiting

// Health check endpoint (no rate limiting)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Property routes - general API rate limiting
app.use('/api/properties', apiLimiter, propertyRoutes);

// User routes - general API rate limiting
app.use('/api/users', apiLimiter, csrfProtection, userRoutes);

// Admin routes - general API rate limiting
app.use('/api/admin', apiLimiter, adminRoutes);

// Payment Endpoints with rate limiting and validation

// Create donation payment intent
app.post('/api/create-donation-payment', [paymentLimiter, ...validatePaymentAmount], async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({ error: 'Invalid amount. Minimum donation is $0.50' });
        }

        // Log payment attempt for security monitoring
        const ip = req.ip || req.connection.remoteAddress;
        console.log(`[PAYMENT] Donation payment attempt - Amount: $${amount / 100}, IP: ${ip}, Time: ${new Date().toISOString()}`);

        // Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            metadata: {
                type: 'donation',
                purpose: 'Community Kids Support',
                ip: ip
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
app.post('/api/create-premium-checkout', [paymentLimiter, ...validatePaymentAmount], async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        // Log payment attempt for security monitoring
        const ip = req.ip || req.connection.remoteAddress;
        console.log(`[PAYMENT] Premium checkout attempt - Amount: $${amount / 100}, IP: ${ip}, Time: ${new Date().toISOString()}`);

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
                type: 'premium_listing',
                ip: ip
            }
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for Stripe events (no CSRF protection, uses Stripe signature verification)
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
        console.error('[SECURITY] Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Log webhook event for security monitoring
    console.log(`[WEBHOOK] Received event: ${event.type}, ID: ${event.id}, Time: ${new Date().toISOString()}`);

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('[PAYMENT] PaymentIntent succeeded:', paymentIntent.id);

            // Update donation status in database
            await Donation.findOneAndUpdate(
                { stripePaymentIntentId: paymentIntent.id },
                { status: 'succeeded', receiptUrl: paymentIntent.charges?.data[0]?.receipt_url }
            );
            break;

        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('[PAYMENT] Checkout session completed:', session.id);

            // Update transaction status in database
            await Transaction.findOneAndUpdate(
                { stripeSessionId: session.id },
                { status: 'succeeded', completedAt: new Date() }
            );
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.warn('[PAYMENT] Payment failed:', failedPayment.id, 'Reason:', failedPayment.last_payment_error?.message);
            // Handle failed payment
            break;

        default:
            console.log(`[WEBHOOK] Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Get payment status (with rate limiting)
app.get('/api/payment-status/:paymentIntentId', apiLimiter, async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        // Validate payment intent ID format
        if (!paymentIntentId || !paymentIntentId.startsWith('pi_')) {
            return res.status(400).json({ error: 'Invalid payment intent ID' });
        }

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

// Get checkout session status (with rate limiting)
app.get('/api/checkout-session/:sessionId', apiLimiter, async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Validate session ID format
        if (!sessionId || !sessionId.startsWith('cs_')) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

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
    const ip = req.ip || req.connection.remoteAddress;
    const endpoint = req.originalUrl || req.url;

    // Log error with security context
    console.error(`[ERROR] Server error - IP: ${ip}, Endpoint: ${endpoint}, Time: ${new Date().toISOString()}`);
    console.error('Error details:', err);

    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    } else {
        res.status(500).json({
            error: 'Internal server error',
            message: err.message,
            stack: err.stack
        });
    }
});

// 404 handler
app.use((req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    const endpoint = req.originalUrl || req.url;

    console.warn(`[404] Not found - IP: ${ip}, Endpoint: ${endpoint}, Method: ${req.method}, Time: ${new Date().toISOString()}`);

    res.status(404).json({
        error: 'Not found',
        message: 'The requested resource was not found on this server'
    });
});

// Start server (only in non-serverless environment)
if (process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log('='.repeat(60));
        console.log('  FUTELATOSOMBA BACKEND SERVER');
        console.log('='.repeat(60));
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Frontend available at http://localhost:${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
        console.log('');
        console.log('Security Features Enabled:');
        console.log('  - Rate Limiting (API, Auth, Upload, Payment)');
        console.log('  - CSRF Protection (Double Submit Cookie)');
        console.log('  - XSS Protection (Input Sanitization)');
        console.log('  - NoSQL Injection Prevention');
        console.log('  - Helmet Security Headers');
        console.log('  - Content Security Policy');
        console.log('  - CORS Configuration');
        console.log('='.repeat(60));
    });
}

// Export for Vercel serverless
module.exports = app;
