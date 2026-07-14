import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getStripe } from '../utils/stripe';
import { STRIPE_CONFIG } from '../utils/constants';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './Donate.css';

const Donate = () => {
  const [searchParams] = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState(STRIPE_CONFIG.DONATION_AMOUNTS[1]);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [donationComplete, setDonationComplete] = useState(false);

  const stripeRef = useRef(null);
  const cardElementRef = useRef(null);
  const cardContainerRef = useRef(null);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Thank you for your donation!');
    } else if (searchParams.get('canceled') === 'true') {
      toast.info('Donation canceled. You have not been charged.');
    }
  }, [searchParams]);

  // Mount the Stripe card element once a payment intent has been created
  useEffect(() => {
    if (!clientSecret || !cardContainerRef.current) return;

    let mounted = true;
    getStripe()
      .then((stripe) => {
        if (!mounted) return;
        stripeRef.current = stripe;
        const elements = stripe.elements();
        const card = elements.create('card');
        card.mount(cardContainerRef.current);
        cardElementRef.current = card;
      })
      .catch((err) => toast.error(err.message));

    return () => {
      mounted = false;
      if (cardElementRef.current) {
        cardElementRef.current.destroy();
        cardElementRef.current = null;
      }
    };
  }, [clientSecret]);

  const donationAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleSelectAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();

    if (!donationAmount || donationAmount < 0.5) {
      toast.error('Please enter a valid amount (minimum $0.50)');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/create-donation-payment', {
        amount: Math.round(donationAmount * 100),
        donor: {
          name: donorName,
          message: donorMessage
        }
      });
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      toast.error(error.message || 'Failed to start donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();

    if (!stripeRef.current || !cardElementRef.current) {
      toast.error('Payment form is still loading. Please wait a moment.');
      return;
    }

    setLoading(true);
    try {
      const { error, paymentIntent } = await stripeRef.current.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElementRef.current,
          billing_details: donorName ? { name: donorName } : {}
        }
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Thank you for your donation!');
        setDonationComplete(true);
        setClientSecret(null);
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-page">
      <div className="donate-hero">
        <div className="container">
          <h1 className="donate-title">Support Community Kids</h1>
          <p className="donate-subtitle">
            Your donation helps support community kids in the DRC
          </p>
        </div>
      </div>

      <div className="container">
        <div className="donate-content">
          {donationComplete ? (
            <div className="donate-success">
              <h2>Thank You!</h2>
              <p>Your donation was successful. We truly appreciate your support.</p>
              <Button onClick={() => setDonationComplete(false)}>Donate Again</Button>
            </div>
          ) : (
            <form
              className="donate-form"
              onSubmit={clientSecret ? handleConfirmPayment : handleCreateDonation}
            >
              <h2 className="donate-form-title">Make a Donation</h2>

              <div className="donate-amounts">
                {STRIPE_CONFIG.DONATION_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`donate-amount-btn ${
                      !customAmount && selectedAmount === amount ? 'active' : ''
                    }`}
                    onClick={() => handleSelectAmount(amount)}
                    disabled={!!clientSecret}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <Input
                label="Custom Amount ($)"
                name="customAmount"
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter a custom amount"
                min="0.5"
                step="0.01"
                disabled={!!clientSecret}
              />

              <Input
                label="Your Name (optional)"
                name="donorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Anonymous"
                disabled={!!clientSecret}
              />

              <Input
                label="Message (optional)"
                name="donorMessage"
                type="textarea"
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder="Leave a message of support"
                rows={3}
                disabled={!!clientSecret}
              />

              {clientSecret && (
                <div className="donate-card-section">
                  <label className="input-label">Card Details</label>
                  <div className="donate-card-element" ref={cardContainerRef}></div>
                </div>
              )}

              <Button type="submit" fullWidth loading={loading}>
                {clientSecret
                  ? `Complete $${donationAmount} Donation`
                  : `Donate $${donationAmount || 0}`}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;
