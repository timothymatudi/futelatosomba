// Input validation and sanitization middleware
const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const ip = req.ip || req.connection.remoteAddress;
        console.warn(`[SECURITY] Validation failed - IP: ${ip}, Endpoint: ${req.originalUrl}, Errors:`, errors.array());

        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// Sanitization helper - remove potential XSS attacks
const sanitizeString = (value) => {
    if (typeof value !== 'string') return value;

    return value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
};

// Custom sanitizer that prevents XSS while allowing basic formatting
const sanitizeHtml = (value) => {
    if (typeof value !== 'string') return value;

    // Remove script tags and event handlers
    return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
};

// Common validation rules

// Email validation
const validateEmail = () => [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .customSanitizer(sanitizeString)
        .isLength({ max: 255 })
        .withMessage('Email is too long')
];

// Password validation
const validatePassword = (fieldName = 'password') => [
    body(fieldName)
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
        .isLength({ max: 128 })
        .withMessage('Password is too long')
];

// Phone validation
const validatePhone = (fieldName = 'phone', optional = true) => {
    const validator = body(fieldName);

    if (optional) {
        return validator
            .optional({ checkFalsy: true })
            .matches(/^[\d\s\-\+\(\)]+$/)
            .withMessage('Please provide a valid phone number')
            .isLength({ min: 10, max: 20 })
            .withMessage('Phone number must be between 10 and 20 characters')
            .customSanitizer(sanitizeString);
    }

    return validator
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[\d\s\-\+\(\)]+$/)
        .withMessage('Please provide a valid phone number')
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters')
        .customSanitizer(sanitizeString);
};

// URL validation
const validateUrl = (fieldName, optional = true) => {
    const validator = body(fieldName);

    if (optional) {
        return validator
            .optional({ checkFalsy: true })
            .isURL({ protocols: ['http', 'https'], require_protocol: true })
            .withMessage('Please provide a valid URL')
            .isLength({ max: 2048 })
            .withMessage('URL is too long');
    }

    return validator
        .notEmpty()
        .withMessage('URL is required')
        .isURL({ protocols: ['http', 'https'], require_protocol: true })
        .withMessage('Please provide a valid URL')
        .isLength({ max: 2048 })
        .withMessage('URL is too long');
};

// MongoDB ObjectId validation
const validateObjectId = (paramName = 'id') => [
    param(paramName)
        .matches(/^[0-9a-fA-F]{24}$/)
        .withMessage('Invalid ID format')
];

// Text field validation with XSS protection
const validateTextField = (fieldName, minLength = 1, maxLength = 1000, optional = false) => {
    const validator = body(fieldName);

    if (optional) {
        return validator
            .optional({ checkFalsy: true })
            .isLength({ min: minLength, max: maxLength })
            .withMessage(`${fieldName} must be between ${minLength} and ${maxLength} characters`)
            .customSanitizer(sanitizeHtml);
    }

    return validator
        .trim()
        .notEmpty()
        .withMessage(`${fieldName} is required`)
        .isLength({ min: minLength, max: maxLength })
        .withMessage(`${fieldName} must be between ${minLength} and ${maxLength} characters`)
        .customSanitizer(sanitizeHtml);
};

// Number validation
const validateNumber = (fieldName, min = 0, max = Number.MAX_SAFE_INTEGER, optional = false) => {
    const validator = body(fieldName);

    if (optional) {
        return validator
            .optional({ checkFalsy: true })
            .isNumeric()
            .withMessage(`${fieldName} must be a number`)
            .custom(value => {
                const num = Number(value);
                if (num < min || num > max) {
                    throw new Error(`${fieldName} must be between ${min} and ${max}`);
                }
                return true;
            });
    }

    return validator
        .notEmpty()
        .withMessage(`${fieldName} is required`)
        .isNumeric()
        .withMessage(`${fieldName} must be a number`)
        .custom(value => {
            const num = Number(value);
            if (num < min || num > max) {
                throw new Error(`${fieldName} must be between ${min} and ${max}`);
            }
            return true;
        });
};

// Boolean validation
const validateBoolean = (fieldName, optional = true) => {
    const validator = body(fieldName);

    if (optional) {
        return validator
            .optional({ checkFalsy: true })
            .isBoolean()
            .withMessage(`${fieldName} must be a boolean value`);
    }

    return validator
        .notEmpty()
        .withMessage(`${fieldName} is required`)
        .isBoolean()
        .withMessage(`${fieldName} must be a boolean value`);
};

// Array validation
const validateArray = (fieldName, minLength = 0, maxLength = 100, optional = true) => {
    const validator = body(fieldName);

    if (optional) {
        return validator
            .optional({ checkFalsy: true })
            .isArray({ min: minLength, max: maxLength })
            .withMessage(`${fieldName} must be an array with ${minLength} to ${maxLength} items`);
    }

    return validator
        .notEmpty()
        .withMessage(`${fieldName} is required`)
        .isArray({ min: minLength, max: maxLength })
        .withMessage(`${fieldName} must be an array with ${minLength} to ${maxLength} items`);
};

// Enum validation
const validateEnum = (fieldName, allowedValues, optional = false) => {
    const validator = body(fieldName);

    if (optional) {
        return validator
            .optional({ checkFalsy: true })
            .isIn(allowedValues)
            .withMessage(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }

    return validator
        .notEmpty()
        .withMessage(`${fieldName} is required`)
        .isIn(allowedValues)
        .withMessage(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
};

// Date validation
const validateDate = (fieldName, optional = true) => {
    const validator = body(fieldName);

    if (optional) {
        return validator
            .optional({ checkFalsy: true })
            .isISO8601()
            .withMessage(`${fieldName} must be a valid date`);
    }

    return validator
        .notEmpty()
        .withMessage(`${fieldName} is required`)
        .isISO8601()
        .withMessage(`${fieldName} must be a valid date`);
};

// Validation chains for common use cases

// User registration validation
const validateRegistration = [
    ...validateEmail(),
    ...validatePassword(),
    handleValidationErrors
];

// User login validation
const validateLogin = [
    ...validateEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Password reset request validation
const validatePasswordResetRequest = [
    ...validateEmail(),
    handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
    param('token')
        .notEmpty()
        .withMessage('Reset token is required')
        .isLength({ min: 64, max: 64 })
        .withMessage('Invalid reset token'),
    ...validatePassword(),
    handleValidationErrors
];

// Property creation basic validation
const validatePropertyCreation = [
    validateTextField('title', 5, 200),
    validateTextField('description', 20, 5000),
    validateNumber('price', 0, 1000000000),
    validateEnum('listingType', ['sale', 'rent']),
    validateTextField('propertyType', 2, 50),
    body('location.address')
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ max: 500 })
        .withMessage('Address is too long')
        .customSanitizer(sanitizeString),
    body('location.city')
        .trim()
        .notEmpty()
        .withMessage('City is required')
        .isLength({ max: 100 })
        .withMessage('City name is too long')
        .customSanitizer(sanitizeString),
    handleValidationErrors
];

// Contact form validation
const validateContactForm = [
    validateTextField('name', 2, 100),
    ...validateEmail(),
    validateTextField('message', 10, 2000),
    validatePhone('phone', true),
    handleValidationErrors
];

// Payment amount validation
const validatePaymentAmount = [
    validateNumber('amount', 50, 100000000), // Min $0.50, Max $1,000,000
    handleValidationErrors
];

// Query parameter sanitization middleware
const sanitizeQueryParams = (req, res, next) => {
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeString(req.query[key]);
            }
        });
    }
    next();
};

// Prevent NoSQL injection
const sanitizeMongoQuery = (req, res, next) => {
    const sanitize = (obj) => {
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                // Remove $ operators from user input
                if (key.startsWith('$')) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object') {
                    sanitize(obj[key]);
                }
            });
        }
        return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);

    next();
};

module.exports = {
    handleValidationErrors,
    sanitizeString,
    sanitizeHtml,
    validateEmail,
    validatePassword,
    validatePhone,
    validateUrl,
    validateObjectId,
    validateTextField,
    validateNumber,
    validateBoolean,
    validateArray,
    validateEnum,
    validateDate,
    validateRegistration,
    validateLogin,
    validatePasswordResetRequest,
    validatePasswordReset,
    validatePropertyCreation,
    validateContactForm,
    validatePaymentAmount,
    sanitizeQueryParams,
    sanitizeMongoQuery
};
