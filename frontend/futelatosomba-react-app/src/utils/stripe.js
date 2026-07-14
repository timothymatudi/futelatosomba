// Stripe.js loader - loads from Stripe's CDN (no npm dependency)
import { STRIPE_CONFIG } from './constants';

let stripePromise = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = new Promise((resolve, reject) => {
      if (!STRIPE_CONFIG.PUBLISHABLE_KEY) {
        reject(new Error('Payments are not configured. Please try again later.'));
        return;
      }
      if (window.Stripe) {
        resolve(window.Stripe(STRIPE_CONFIG.PUBLISHABLE_KEY));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve(window.Stripe(STRIPE_CONFIG.PUBLISHABLE_KEY));
      script.onerror = () => {
        stripePromise = null;
        reject(new Error('Failed to load payment library. Please check your connection.'));
      };
      document.head.appendChild(script);
    });
  }
  return stripePromise;
};
