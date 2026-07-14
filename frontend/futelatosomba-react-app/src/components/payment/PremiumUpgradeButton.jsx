import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { getStripe } from '../../utils/stripe';
import { STRIPE_CONFIG } from '../../utils/constants';
import Button from '../common/Button';

// Self-contained upgrade button: creates a Stripe Checkout session for a
// premium listing and redirects the user to Stripe's hosted checkout page.
const PremiumUpgradeButton = ({ propertyId = null, fullWidth = false }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await api.post('/create-premium-checkout', {
        amount: STRIPE_CONFIG.PREMIUM_LISTING_PRICE * 100,
        ...(propertyId ? { propertyId } : {})
      });

      // Backend returns only sessionId (no session URL), so redirect via Stripe.js
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleUpgrade} loading={loading} fullWidth={fullWidth}>
      Upgrade to Premium - ${STRIPE_CONFIG.PREMIUM_LISTING_PRICE}
    </Button>
  );
};

export default PremiumUpgradeButton;
