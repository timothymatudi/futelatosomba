# futelatosomba - Property Search Platform

A modern property search and listing platform for the Democratic Republic of Congo, featuring Stripe payment integration for donations and premium listings.

## Features

- 🏠 Property Search & Listings (Sale & Rent)
- 💳 Stripe Payment Integration for Donations
- 🌍 Multi-language Support (English, French, Lingala)
- 📱 Responsive Design (Mobile & Desktop)
- 🗺️ Map View for Properties
- 👤 User Authentication
- 💰 Premium Property Listings
- 🎁 Community Donation System

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla JS)
- Stripe.js for payment processing
- OpenStreetMap for maps
- Responsive grid layout

### Backend
- Node.js with Express.js
- Stripe API for payments
- CORS & Helmet for security
- RESTful API design

## Project Structure

```
futelatosomba/
├── frontend/
│   └── public/
│       ├── index.html          # Main page
│       ├── about.html          # About page
│       ├── contact.html        # Contact page
│       ├── payment-success.html # Payment confirmation
│       ├── style.css           # Global styles
│       ├── script.js           # Main JavaScript
│       ├── stripe-integration.js # Stripe payment logic
│       ├── static_i18n.js      # Internationalization
│       └── config.js           # Configuration
├── backend/
│   ├── server.js               # Express server
│   ├── package.json            # Dependencies
│   └── .env.example            # Environment template
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/futelatosomba.git
cd futelatosomba
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Stripe keys:
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PORT=3000
CLIENT_URL=http://localhost:3000
```

4. Update frontend configuration:
Edit `frontend/public/config.js` and add your Stripe publishable key.

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

For development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Stripe Integration

### Donation Flow
1. User clicks "Donate Now" button
2. Modal appears with preset donation amounts
3. User selects amount or enters custom amount
4. Payment is processed through Stripe
5. User is redirected to success page

### Premium Listing Flow
1. User logs in and clicks "Add New Property"
2. User is redirected to Stripe Checkout
3. Payment of $25 is processed
4. User can create premium listing with enhanced visibility

### Webhook Setup
To receive real-time payment notifications:

1. Install Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

2. Copy the webhook signing secret to your `.env` file

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/create-donation-payment` | POST | Create donation payment intent |
| `/api/create-premium-checkout` | POST | Create premium listing checkout |
| `/api/webhook` | POST | Stripe webhook handler |
| `/api/payment-status/:id` | GET | Get payment intent status |
| `/api/checkout-session/:id` | GET | Get checkout session status |

## Features in Detail

### Multi-language Support
- English (en)
- French (fr)
- Lingala (ln)

Language persists in localStorage and updates all UI elements dynamically.

### Property Search
Filter properties by:
- Location
- Property Type (House, Apartment, Villa, Commercial, Land)
- Number of Bedrooms
- Price Range
- Listing Type (Sale or Rent)

### Authentication
Simple client-side authentication with localStorage (can be enhanced with backend integration).

## Security

- Helmet.js for HTTP headers security
- CORS enabled for API access
- Environment variables for sensitive data
- Stripe webhook signature verification
- Input validation on all forms

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For support, email info@futelatosomba.com or open an issue in the GitHub repository.

## Acknowledgments

- Stripe for payment processing
- OpenStreetMap for mapping services
- Unsplash for property images
- The DRC community for inspiration

---

**Made with ❤️ for the Democratic Republic of Congo**
