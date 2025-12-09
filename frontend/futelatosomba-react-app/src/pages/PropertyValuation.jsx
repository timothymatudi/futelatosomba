import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import './PropertyValuation.css';

const PropertyValuation = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [valuation, setValuation] = useState(null);
  const [formData, setFormData] = useState({
    // Property Details
    propertyType: '',
    address: '',
    city: '',
    commune: '',

    // Property Specifications
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    condition: '',

    // Features
    hasParking: false,
    hasGarden: false,
    hasPool: false,
    hasBalcony: false,
    hasSecurity: false,

    // Contact
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredContact: 'email'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.propertyType || !formData.city) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.bedrooms || !formData.bathrooms || !formData.area) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 3:
        if (!formData.fullName || !formData.email) {
          toast.error('Please fill in your contact details');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/valuations/estimate', formData);

      if (response.data.success) {
        setValuation(response.data.data);
        setStep(5);
        toast.success('Valuation completed!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to calculate valuation');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="valuation-step">
            <h2>Property Details</h2>
            <p className="step-description">Tell us about your property</p>

            <div className="form-group">
              <label>Property Type *</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                <option value="">Select type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <select name="city" value={formData.city} onChange={handleChange} required>
                  <option value="">Select city</option>
                  <option value="Kinshasa">Kinshasa</option>
                  <option value="Lubumbashi">Lubumbashi</option>
                  <option value="Mbuji-Mayi">Mbuji-Mayi</option>
                  <option value="Kananga">Kananga</option>
                  <option value="Kisangani">Kisangani</option>
                  <option value="Bukavu">Bukavu</option>
                  <option value="Goma">Goma</option>
                </select>
              </div>

              <div className="form-group">
                <label>Commune</label>
                <input
                  type="text"
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  placeholder="Neighborhood/Commune"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="valuation-step">
            <h2>Property Specifications</h2>
            <p className="step-description">Provide details about the property size and condition</p>

            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms *</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Bathrooms *</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Floor Area (m²) *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Year Built</label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder={`e.g. ${new Date().getFullYear() - 10}`}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Property Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange}>
                <option value="">Select condition</option>
                <option value="excellent">Excellent - Recently renovated</option>
                <option value="good">Good - Well maintained</option>
                <option value="fair">Fair - Needs some work</option>
                <option value="poor">Poor - Needs renovation</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="valuation-step">
            <h2>Property Features</h2>
            <p className="step-description">Select any features your property has</p>

            <div className="features-grid">
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  name="hasParking"
                  checked={formData.hasParking}
                  onChange={handleChange}
                />
                <div className="feature-card">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>Parking</span>
                </div>
              </label>

              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  name="hasGarden"
                  checked={formData.hasGarden}
                  onChange={handleChange}
                />
                <div className="feature-card">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 12c1.657 0 3-4.03 3-9s-1.343-3-3-3-3 0-3 3 1.343 9 3 9z"></path>
                    <path d="M12 12c-1.657 0-3 4.03-3 9s1.343 3 3 3 3 0 3-3-1.343-9-3-9z"></path>
                  </svg>
                  <span>Garden</span>
                </div>
              </label>

              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  name="hasPool"
                  checked={formData.hasPool}
                  onChange={handleChange}
                />
                <div className="feature-card">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 15c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                    <path d="M2 19c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                  </svg>
                  <span>Swimming Pool</span>
                </div>
              </label>

              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  name="hasBalcony"
                  checked={formData.hasBalcony}
                  onChange={handleChange}
                />
                <div className="feature-card">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <path d="M9 3v18"></path>
                    <path d="M15 3v18"></path>
                  </svg>
                  <span>Balcony</span>
                </div>
              </label>

              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  name="hasSecurity"
                  checked={formData.hasSecurity}
                  onChange={handleChange}
                />
                <div className="feature-card">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>24/7 Security</span>
                </div>
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="valuation-step">
            <h2>Your Contact Details</h2>
            <p className="step-description">We'll send your valuation report to this address</p>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+243 xxx xxx xxx"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Contact Method</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={handleChange}
                  />
                  <span>Email</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={handleChange}
                  />
                  <span>Phone</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="whatsapp"
                    checked={formData.preferredContact === 'whatsapp'}
                    onChange={handleChange}
                  />
                  <span>WhatsApp</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="valuation-result">
            <div className="result-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>Your Property Valuation</h2>

            {valuation && (
              <>
                <div className="valuation-estimate">
                  <div className="estimate-label">Estimated Value</div>
                  <div className="estimate-value">
                    ${valuation.estimatedValue?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="estimate-range">
                    Range: ${valuation.minValue?.toLocaleString()} - ${valuation.maxValue?.toLocaleString()}
                  </div>
                </div>

                <div className="valuation-details">
                  <h3>Valuation Summary</h3>
                  <p>{valuation.summary || 'Your property has been valued based on comparable sales in the area and current market conditions.'}</p>

                  <div className="next-steps">
                    <h4>Next Steps</h4>
                    <ul>
                      <li>A detailed valuation report has been sent to {formData.email}</li>
                      <li>Our team will contact you within 24 hours</li>
                      <li>Book a professional in-person valuation for free</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            <button className="btn-new-valuation" onClick={() => { setStep(1); setValuation(null); }}>
              New Valuation
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="property-valuation-page">
      <div className="valuation-hero">
        <div className="hero-content">
          <h1>Property Valuation</h1>
          <p>Get an instant estimate of your property's market value</p>
        </div>
      </div>

      <div className="valuation-container">
        {step < 5 && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        )}

        {step < 5 && (
          <div className="step-indicator">
            Step {step} of 4
          </div>
        )}

        <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()} className="valuation-form">
          {renderStep()}

          {step < 5 && (
            <div className="form-actions">
              {step > 1 && (
                <button type="button" className="btn-prev" onClick={prevStep}>
                  Previous
                </button>
              )}
              {step < 4 ? (
                <button type="button" className="btn-next" onClick={nextStep}>
                  Next
                </button>
              ) : (
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Calculating...' : 'Get Valuation'}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PropertyValuation;
