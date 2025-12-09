// CSRF protection middleware using double submit cookie pattern
const crypto = require('crypto');

/**
 * CSRF Protection Middleware
 *
 * This middleware implements the Double Submit Cookie pattern for CSRF protection.
 * It's a stateless approach that doesn't require server-side session storage.
 *
 * How it works:
 * 1. Server generates a random token and sends it in a cookie
 * 2. Client must include this token in a custom header for state-changing requests
 * 3. Server validates that the cookie value matches the header value
 *
 * This protects against CSRF because:
 * - Cookies are automatically sent by the browser
 * - Custom headers can only be set by JavaScript on the same origin
 * - An attacker on a different origin cannot read the cookie or set the header
 */

// Configuration
const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const TOKEN_LENGTH = 32; // 32 bytes = 256 bits
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Generate a cryptographically secure random token
const generateToken = () => {
    return crypto.randomBytes(TOKEN_LENGTH).toString('hex');
};

// Middleware to generate and set CSRF token
const generateCsrfToken = (req, res, next) => {
    // Check if token already exists in cookie
    let token = req.cookies && req.cookies[CSRF_COOKIE_NAME];

    // If no token exists, generate a new one
    if (!token) {
        token = generateToken();

        // Set the token in a cookie
        res.cookie(CSRF_COOKIE_NAME, token, {
            httpOnly: false, // Must be readable by client JavaScript
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict', // Prevent CSRF by not sending cookie on cross-site requests
            maxAge: COOKIE_MAX_AGE,
            path: '/'
        });

        console.log(`[CSRF] Generated new CSRF token for IP: ${req.ip || req.connection.remoteAddress}`);
    }

    // Make token available to the response for API endpoints that need to return it
    req.csrfToken = token;

    next();
};

// Middleware to validate CSRF token
const validateCsrfToken = (req, res, next) => {
    // Skip CSRF validation for:
    // 1. GET, HEAD, OPTIONS requests (safe methods)
    // 2. Webhook endpoints (verified by other means)
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    const webhookPaths = ['/api/webhook', '/api/stripe-webhook'];

    if (safeMethods.includes(req.method)) {
        return next();
    }

    if (webhookPaths.some(path => req.path.startsWith(path))) {
        return next();
    }

    // Get token from cookie and header
    const cookieToken = req.cookies && req.cookies[CSRF_COOKIE_NAME];
    const headerToken = req.headers[CSRF_HEADER_NAME] || req.body?._csrf;

    // Check if tokens exist
    if (!cookieToken) {
        const ip = req.ip || req.connection.remoteAddress;
        console.warn(`[SECURITY] CSRF validation failed - No cookie token - IP: ${ip}, Endpoint: ${req.originalUrl}`);

        return res.status(403).json({
            error: 'CSRF token missing',
            message: 'CSRF token not found in cookies. Please refresh the page.'
        });
    }

    if (!headerToken) {
        const ip = req.ip || req.connection.remoteAddress;
        console.warn(`[SECURITY] CSRF validation failed - No header token - IP: ${ip}, Endpoint: ${req.originalUrl}`);

        return res.status(403).json({
            error: 'CSRF token missing',
            message: 'CSRF token not found in request header. Please include it in the X-CSRF-Token header.'
        });
    }

    // Validate that cookie token matches header token
    // Use timing-safe comparison to prevent timing attacks
    const cookieBuffer = Buffer.from(cookieToken, 'utf-8');
    const headerBuffer = Buffer.from(headerToken, 'utf-8');

    // Ensure buffers are same length (prevents timing attacks)
    if (cookieBuffer.length !== headerBuffer.length) {
        const ip = req.ip || req.connection.remoteAddress;
        console.warn(`[SECURITY] CSRF validation failed - Token length mismatch - IP: ${ip}, Endpoint: ${req.originalUrl}`);

        return res.status(403).json({
            error: 'Invalid CSRF token',
            message: 'CSRF token validation failed. Please refresh the page.'
        });
    }

    // Timing-safe comparison
    if (!crypto.timingSafeEqual(cookieBuffer, headerBuffer)) {
        const ip = req.ip || req.connection.remoteAddress;
        console.warn(`[SECURITY] CSRF validation failed - Token mismatch - IP: ${ip}, Endpoint: ${req.originalUrl}`);

        return res.status(403).json({
            error: 'Invalid CSRF token',
            message: 'CSRF token validation failed. Please refresh the page.'
        });
    }

    // Token is valid, proceed to next middleware
    next();
};

// Middleware to get CSRF token (for API endpoint to return token to client)
const getCsrfToken = (req, res) => {
    res.json({
        csrfToken: req.csrfToken
    });
};

// Combined middleware for easy use
const csrfProtection = [generateCsrfToken, validateCsrfToken];

module.exports = {
    generateCsrfToken,
    validateCsrfToken,
    getCsrfToken,
    csrfProtection,
    CSRF_HEADER_NAME,
    CSRF_COOKIE_NAME
};
