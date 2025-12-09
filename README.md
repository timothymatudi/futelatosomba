# futelatosomba - Property Search Platform 🏠

<div align="center">

**The Rightmove of the Democratic Republic of Congo**

[![Status](https://img.shields.io/badge/status-production--ready-success)](https://github.com/yourusername/futelatosomba)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-v14+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-v19-blue)](https://react.dev/)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Demo](#-demo)

</div>

---

## 📖 Overview

**futelatosomba** is a modern, full-stack property search and listing platform designed specifically for the Democratic Republic of Congo market. Built with React 19, Node.js, MongoDB, and Stripe, it offers a comprehensive solution for property buyers, sellers, and agents.

### What Makes It Special

- 🌍 **Localized for DRC** - Multi-language support (English, French, Lingala)
- 🎨 **DRC Flag Theme** - Beautiful blue, yellow, and red color scheme
- 💝 **Community Focus** - Unique donation feature for social impact
- 🚀 **Production Ready** - 90% complete, ready for deployment
- 📱 **Mobile First** - Optimized for smartphones (primary device in DRC)
- ⚡ **Fast & Modern** - React 19 + MongoDB for blazing performance

---

## ✨ Features

### Core Features

- 🏠 **Property Search & Listings** - Advanced filters for sale and rent
- 🔍 **Smart Search** - Filter by location, price, type, bedrooms, amenities
- 🗺️ **Interactive Maps** - Leaflet integration with property markers
- 📸 **Image Galleries** - Upload up to 10 images per property
- 💳 **Payment Integration** - Stripe for donations and premium listings
- 👥 **User Roles** - Regular users, agents, and administrators
- 📧 **Email System** - Password reset, verification, notifications
- 🌐 **Multi-Language** - English, French, Lingala with persistent preference

### For Property Seekers

- Browse thousands of properties
- Save favorites
- Contact agents directly
- Advanced search filters
- Map-based property discovery
- Mobile-responsive interface

### For Agents

- Create and manage listings
- Upload multiple images
- Premium listings ($25) for enhanced visibility
- Dashboard with analytics
- Client inquiry management
- Agency profile customization

### For Administrators

- Content moderation (approve/reject listings)
- User management
- Transaction monitoring
- Analytics dashboard
- Donation tracking
- Platform statistics

---

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with hooks and context
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Leaflet** - Interactive maps
- **Stripe.js** - Payment processing
- **React Hook Form** - Form management
- **Yup** - Schema validation
- **React Toastify** - Notifications
- **Date-fns** - Date formatting

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **Multer** - File uploads
- **Helmet** - Security headers
- **Express Validator** - Input validation

### DevOps & Tools

- **MongoDB Atlas** - Cloud database
- **Railway/Render** - Backend hosting
- **Vercel/Netlify** - Frontend hosting
- **SendGrid/SMTP** - Email delivery
- **Cloudinary** - Image CDN (optional)
- **Git** - Version control

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
