// Configuration file for futelatosomba
const CONFIG = {
    // API endpoints
    API_BASE_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : '/api',

    // Stripe configuration
    STRIPE_PUBLISHABLE_KEY: 'pk_test_51SakmHRRg6dlGiMNcW2P13bYscEXCsbUZZC8kiOiR7aYp3GPJhINRY8Z7dXOYsXqNRx9OHYsqYoHkHV1CDDOcg2C005YWoTbnv',

    // Default settings
    DEFAULT_CURRENCY: 'USD',
    DEFAULT_LANGUAGE: 'en',

    // Donation amounts (in cents)
    DONATION_AMOUNTS: [
        { label: '$5', value: 500 },
        { label: '$10', value: 1000 },
        { label: '$25', value: 2500 },
        { label: '$50', value: 5000 },
        { label: '$100', value: 10000 },
        { label: 'Custom', value: 'custom' }
    ],

    // Premium listing price (in cents)
    PREMIUM_LISTING_PRICE: 2500, // $25

    // Map settings
    DEFAULT_MAP_CENTER: {
        lat: -4.3217,  // Kinshasa latitude
        lng: 15.3125   // Kinshasa longitude
    },
    DEFAULT_MAP_ZOOM: 11
};

// Make config available globally
window.CONFIG = CONFIG;
