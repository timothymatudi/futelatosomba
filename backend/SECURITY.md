# Security Documentation - Futelatosomba Backend

## Overview

This document describes the comprehensive security measures implemented in the Futelatosomba backend API to protect against common web vulnerabilities and attacks.

## Security Features Implemented

### 1. Rate Limiting

Rate limiting is implemented to prevent abuse and DoS attacks. Different endpoints have different rate limits based on their sensitivity and usage patterns.

#### Rate Limit Configuration

| Endpoint Type | Requests | Time Window | File |
|--------------|----------|-------------|------|
| General API | 100 | 15 minutes | `/middleware/rateLimiter.js` |
| Authentication | 5 | 15 minutes | `/middleware/rateLimiter.js` |
| File Upload | 10 | 1 hour | `/middleware/rateLimiter.js` |
| Payment | 20 | 1 hour | `/middleware/rateLimiter.js` |
| Contact Form | 5 | 1 hour | `/middleware/rateLimiter.js` |
| Password Reset | 3 | 1 hour | `/middleware/rateLimiter.js` |
| Property Creation | 30 | 1 hour | `/middleware/rateLimiter.js` |

#### How it Works

- Each IP address is tracked independently
- When limit is exceeded, a 429 (Too Many Requests) status is returned
- Rate limit info is included in response headers
- All rate limit violations are logged with IP, endpoint, and timestamp

#### Response on Rate Limit Exceeded

```json
{
  "error": "Too many requests",
  "message": "You have exceeded the rate limit. Please try again later.",
  "retryAfter": 900
}
```

### 2. CSRF Protection

Cross-Site Request Forgery (CSRF) protection is implemented using the Double Submit Cookie pattern.

#### Implementation Details

- **File**: `/middleware/csrf.js`
- **Pattern**: Double Submit Cookie (stateless)
- **Cookie Name**: `csrf-token`
- **Header Name**: `x-csrf-token`

#### How it Works

1. Server generates a random 256-bit token on first request
2. Token is sent to client in a cookie (not httpOnly, so client can read it)
3. Client must include the same token in the `X-CSRF-Token` header for state-changing requests
4. Server validates that cookie value matches header value using timing-safe comparison

#### Protected Requests

- All POST, PUT, DELETE, PATCH requests
- Webhooks are excluded (they use their own signature verification)

#### Getting CSRF Token

```bash
GET /api/csrf-token
```

Response:
```json
{
  "csrfToken": "abc123..."
}
```

#### Making Protected Requests

```javascript
// Include CSRF token in request header
fetch('/api/properties', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken // From cookie or /api/csrf-token endpoint
  },
  credentials: 'include', // Important: include cookies
  body: JSON.stringify(data)
});
```

### 3. Input Validation & Sanitization

Comprehensive input validation and sanitization to prevent XSS and injection attacks.

#### Features

- **File**: `/middleware/validation.js`
- Email validation and normalization
- Password strength requirements
- Phone number validation
- URL validation
- XSS prevention through HTML sanitization
- MongoDB operator injection prevention
- Query parameter sanitization

#### Validation Rules

##### Email
- Valid email format
- Normalized (lowercase, trimmed)
- Max length: 255 characters

##### Password
- Minimum length: 8 characters
- Must contain: uppercase, lowercase, and number
- Max length: 128 characters

##### Phone
- Valid phone number format
- 10-20 characters
- Allows: digits, spaces, +, -, (, )

##### URLs
- Valid HTTP/HTTPS URLs
- Max length: 2048 characters

#### XSS Prevention

All user inputs are sanitized to prevent XSS attacks:

```javascript
// Basic sanitization - escapes HTML
sanitizeString(input);

// HTML sanitization - removes scripts and event handlers
sanitizeHtml(input);
```

#### NoSQL Injection Prevention

MongoDB operator injection is prevented by removing `$` operators from user input:

```javascript
// This middleware runs on all requests
app.use(sanitizeMongoQuery);

// Blocks malicious queries like:
// { $where: "malicious code" }
// { $gt: "", $lt: "" }
```

### 4. Helmet Security Headers

Helmet is configured to set secure HTTP headers that protect against common vulnerabilities.

#### Configuration

- **File**: `/server.js`
- **Headers Set**:
  - Content Security Policy (CSP)
  - Strict Transport Security (HSTS)
  - X-Frame-Options
  - X-Content-Type-Options
  - X-XSS-Protection
  - Referrer-Policy

#### Content Security Policy (CSP)

Restricts resources that can be loaded:

```javascript
{
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "https://js.stripe.com", "https://cdn.jsdelivr.net"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:", "https:", "blob:"],
  connectSrc: ["'self'", "https://api.stripe.com"],
  frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
  objectSrc: ["'none'"]
}
```

#### HSTS Configuration

Forces HTTPS connections:

```javascript
{
  maxAge: 31536000, // 1 year
  includeSubDomains: true,
  preload: true
}
```

### 5. CORS Configuration

Properly configured CORS to prevent unauthorized cross-origin requests.

#### Configuration

```javascript
cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-csrf-token']
})
```

### 6. Webhook Signature Verification

Stripe webhooks are verified using signature verification to ensure authenticity.

#### Implementation

```javascript
// Verifies webhook signature
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

- Webhooks without valid signatures are rejected
- Failed verification attempts are logged as security events

### 7. Security Logging

All security events are logged with detailed context for monitoring and incident response.

#### Logged Events

- Rate limit violations
- CSRF validation failures
- Input validation failures
- Authentication failures
- Payment attempts
- Webhook events
- Server errors
- 404 errors

#### Log Format

```
[CATEGORY] Event description - IP: x.x.x.x, Endpoint: /api/..., Time: ISO-8601
```

#### Example Logs

```
[SECURITY] Rate limit exceeded - Type: Authentication, IP: 192.168.1.1, Endpoint: /api/auth/login
[SECURITY] CSRF validation failed - No cookie token - IP: 192.168.1.1, Endpoint: /api/properties
[PAYMENT] Donation payment attempt - Amount: $50.00, IP: 192.168.1.1
[WEBHOOK] Received event: payment_intent.succeeded, ID: evt_abc123
```

## Security Best Practices

### Environment Variables

Store sensitive data in environment variables (`.env` file):

```bash
# Required for security features
JWT_SECRET=<strong-random-secret>
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

### Production Deployment

When deploying to production:

1. Set `NODE_ENV=production`
2. Use HTTPS (Helmet enforces this via HSTS)
3. Set strong, random values for all secrets
4. Configure proper CORS origin
5. Review and adjust rate limits if needed
6. Set up log monitoring and alerting
7. Regularly update dependencies

### Password Requirements

Users must create passwords that:
- Are at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number

### File Upload Security

File uploads are secured through:
- File type validation (images only)
- File size limits (10MB max)
- Rate limiting (10 uploads per hour)
- Filename sanitization
- Storage in dedicated upload directory

## Testing Security Features

### Testing Rate Limiting

```bash
# Test auth rate limiting (should block after 5 requests)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}'
done
```

### Testing CSRF Protection

```bash
# This should fail with 403
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'

# This should succeed (with valid token)
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <token>" \
  -b "csrf-token=<token>" \
  -d '{"title":"Test"}'
```

### Testing Input Validation

```bash
# Test XSS prevention
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"<script>alert(1)</script>","password":"Test123"}'

# Should sanitize the input
```

## Security Headers

### Response Headers

The following security headers are automatically added to all responses:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: <policy>
```

## Incident Response

### If Rate Limit is Exceeded

- Review logs to identify the IP address
- Determine if it's legitimate traffic or attack
- Consider adjusting rate limits if legitimate
- Consider IP blocking if malicious

### If CSRF Attack is Detected

- Review logs for patterns
- Check if tokens are being properly sent by legitimate clients
- Verify CORS configuration
- Check for cookie issues

### If XSS Attempt is Detected

- Input validation will prevent execution
- Review logs to identify attacker
- Consider IP blocking if repeated attempts

## Compliance

These security measures help meet compliance requirements for:

- **PCI DSS**: Payment handling security (Stripe handles card data)
- **GDPR**: Data protection and privacy
- **OWASP Top 10**: Protection against common vulnerabilities

## Maintenance

### Regular Security Tasks

1. **Weekly**: Review security logs for anomalies
2. **Monthly**: Update dependencies (`npm audit` and `npm update`)
3. **Quarterly**: Review and update rate limits based on usage
4. **Annually**: Security audit and penetration testing

### Dependency Security

Run regularly:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## Additional Security Measures

### Recommended Additions

For enhanced security, consider implementing:

1. **IP Whitelisting**: For admin endpoints
2. **2FA**: Two-factor authentication for user accounts
3. **Session Management**: Redis-based session store
4. **WAF**: Web Application Firewall (e.g., Cloudflare)
5. **DDoS Protection**: Cloud-based DDoS mitigation
6. **Encryption**: Database encryption at rest
7. **Audit Logging**: Comprehensive audit trail
8. **Intrusion Detection**: IDS/IPS system

## Support

For security issues or questions:
- Review this documentation
- Check logs for error details
- Contact development team
- For security vulnerabilities, report privately

---

**Last Updated**: 2025-12-08
**Version**: 1.0.0
