// Rate limiting middleware for API endpoints
const rateLimit = require('express-rate-limit');

// Create a rate limiter store that logs security events
const createLimiterWithLogging = (options, limitType) => {
    const limiter = rateLimit({
        ...options,
        handler: (req, res) => {
            const ip = req.ip || req.connection.remoteAddress;
            const endpoint = req.originalUrl || req.url;

            console.warn(`[SECURITY] Rate limit exceeded - Type: ${limitType}, IP: ${ip}, Endpoint: ${endpoint}, Time: ${new Date().toISOString()}`);

            res.status(429).json({
                error: 'Too many requests',
                message: options.message || 'You have exceeded the rate limit. Please try again later.',
                retryAfter: Math.ceil(options.windowMs / 1000)
            });
        },
        skip: (req) => {
            // Skip rate limiting for health check endpoint
            return req.path === '/api/health';
        }
    });

    return limiter;
};

// General API rate limiter - 100 requests per 15 minutes
const apiLimiter = createLimiterWithLogging({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
}, 'General API');

// Strict rate limiter for authentication endpoints - 10/15min in production,
// 50/15min otherwise so local testing isn't throttled.
const authLimiter = createLimiterWithLogging({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 10 : 50,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    // Only count failures in production so a shared office/NAT IP with many
    // legitimate logins is not locked out; brute-force attempts still count.
    skipSuccessfulRequests: process.env.NODE_ENV === 'production',
    skipFailedRequests: false,
}, 'Authentication');

// Rate limiter for file upload endpoints - 10 requests per hour
const uploadLimiter = createLimiterWithLogging({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 upload requests per hour
    message: 'Too many file uploads from this IP, please try again after 1 hour',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
}, 'File Upload');

// Rate limiter for payment endpoints - 20 requests per hour
const paymentLimiter = createLimiterWithLogging({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 payment requests per hour
    message: 'Too many payment requests from this IP, please try again after 1 hour',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
}, 'Payment');

// Rate limiter for contact/email endpoints - 5 requests per hour
const contactLimiter = createLimiterWithLogging({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 contact requests per hour
    message: 'Too many contact requests from this IP, please try again after 1 hour',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
}, 'Contact');

// Very strict limiter for password reset flows - 3 requests per hour.
// Separate instances per route so forgot-password, reset-password and
// resend-verification each get their own bucket; a normal reset flow
// (request + a couple of attempts) must not lock users out of the others.
const passwordResetOptions = {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 requests per hour
    message: 'Too many password reset attempts from this IP, please try again after 1 hour',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
};

const passwordResetLimiter = createLimiterWithLogging(passwordResetOptions, 'Password Reset');
const resetPasswordLimiter = createLimiterWithLogging(passwordResetOptions, 'Reset Password');
const resendVerificationLimiter = createLimiterWithLogging({
    ...passwordResetOptions,
    message: 'Too many verification email requests from this IP, please try again after 1 hour',
}, 'Resend Verification');

// Moderate limiter for property creation - 30 requests per hour
const propertyCreateLimiter = createLimiterWithLogging({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // Limit each IP to 30 property creation requests per hour
    message: 'Too many property creation requests from this IP, please try again after 1 hour',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
}, 'Property Creation');

module.exports = {
    apiLimiter,
    authLimiter,
    uploadLimiter,
    paymentLimiter,
    contactLimiter,
    passwordResetLimiter,
    resetPasswordLimiter,
    resendVerificationLimiter,
    propertyCreateLimiter
};
