import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import propertyService from '../services/propertyService';
import { STRIPE_CONFIG } from '../utils/constants';
import PremiumUpgradeButton from '../components/payment/PremiumUpgradeButton';
import './Premium.css';

const BENEFITS = [
  'Featured placement at the top of search results',
  'Enhanced visibility across the platform',
  'Highlighted premium badge on your listing',
  'Reach more serious buyers and renters'
];

const Premium = () => {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Payment successful! Your listing is now premium.');
    } else if (searchParams.get('canceled') === 'true') {
      toast.info('Checkout canceled. You have not been charged.');
    }
  }, [searchParams]);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!isAuthenticated || !userId) return;

    const fetchProperties = async () => {
      try {
        const data = await propertyService.getUserProperties(userId);
        const list = Array.isArray(data) ? data : data.properties || [];
        setProperties(list);
        if (list.length > 0) {
          setSelectedPropertyId(list[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load your properties.');
      }
    };

    fetchProperties();
  }, [isAuthenticated, user]);

  return (
    <div className="premium-page">
      <div className="premium-hero">
        <div className="container">
          <h1 className="premium-title">Premium Listing</h1>
          <p className="premium-subtitle">
            Give your property the visibility it deserves for just $
            {STRIPE_CONFIG.PREMIUM_LISTING_PRICE}
          </p>
        </div>
      </div>

      <div className="container">
        <div className="premium-content">
          <div className="premium-benefits">
            <h2 className="premium-benefits-title">What you get</h2>
            <ul className="premium-benefits-list">
              {BENEFITS.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="premium-card">
            <div className="premium-price">
              <span className="premium-price-amount">
                ${STRIPE_CONFIG.PREMIUM_LISTING_PRICE}
              </span>
              <span className="premium-price-label">one-time payment per listing</span>
            </div>

            {isAuthenticated ? (
              <>
                {properties.length > 0 && (
                  <div className="premium-property-select">
                    <label htmlFor="premium-property" className="input-label">
                      Select your property
                    </label>
                    <select
                      id="premium-property"
                      value={selectedPropertyId}
                      onChange={(e) => setSelectedPropertyId(e.target.value)}
                    >
                      {properties.map((property) => (
                        <option key={property._id} value={property._id}>
                          {property.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <PremiumUpgradeButton propertyId={selectedPropertyId || null} fullWidth />
              </>
            ) : (
              <p className="premium-login-prompt">
                <Link to="/login">Log in</Link> to upgrade one of your listings.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
