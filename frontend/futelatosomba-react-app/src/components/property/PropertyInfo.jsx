import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatArea, formatDate } from '../../utils/formatters';
import { PROPERTY_TYPE_LABELS, AMENITIES } from '../../utils/constants';
import './PropertyInfo.css';

const PropertyInfo = ({ property }) => {
  const { getLabel } = useLanguage();

  if (!property) return null;

  const renderAmenities = () => {
    if (!property.amenities || property.amenities.length === 0) return null;

    return (
      <div className="property-info-section">
        <h3>Amenities</h3>
        <div className="amenities-grid">
          {property.amenities.map((amenity, index) => {
            const amenityDef = AMENITIES.find(a => a.value === amenity);
            const label = amenityDef ? getLabel(amenityDef.label) : amenity;

            return (
              <div key={index} className="amenity-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFeatures = () => {
    if (!property.features || property.features.length === 0) return null;

    return (
      <div className="property-info-section">
        <h3>Features</h3>
        <ul className="features-list">
          {property.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="property-info">
      {/* Overview Section */}
      <div className="property-info-section">
        <h3>Overview</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Property Type</span>
            <span className="info-value">
              {property.propertyType && getLabel(PROPERTY_TYPE_LABELS[property.propertyType])}
            </span>
          </div>

          {property.bedrooms && (
            <div className="info-item">
              <span className="info-label">Bedrooms</span>
              <span className="info-value">{property.bedrooms}</span>
            </div>
          )}

          {property.bathrooms && (
            <div className="info-item">
              <span className="info-label">Bathrooms</span>
              <span className="info-value">{property.bathrooms}</span>
            </div>
          )}

          {property.area && (
            <div className="info-item">
              <span className="info-label">Area</span>
              <span className="info-value">{formatArea(property.area, property.areaUnit)}</span>
            </div>
          )}

          {property.yearBuilt && (
            <div className="info-item">
              <span className="info-label">Year Built</span>
              <span className="info-value">{property.yearBuilt}</span>
            </div>
          )}

          {property.status && (
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className={`info-value status-${property.status}`}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </span>
            </div>
          )}

          {property.availableFrom && (
            <div className="info-item">
              <span className="info-label">Available From</span>
              <span className="info-value">{formatDate(property.availableFrom, 'PP')}</span>
            </div>
          )}

          {property.isPremium && (
            <div className="info-item">
              <span className="info-label">Listing Type</span>
              <span className="info-value premium-badge">Premium</span>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      {property.description && (
        <div className="property-info-section">
          <h3>Description</h3>
          <p className="property-description">{property.description}</p>
        </div>
      )}

      {/* Amenities */}
      {renderAmenities()}

      {/* Features */}
      {renderFeatures()}

      {/* Location Details */}
      <div className="property-info-section">
        <h3>Location</h3>
        <div className="location-details">
          {property.address && (
            <div className="location-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <strong>Address:</strong> {property.address}
              </div>
            </div>
          )}

          {property.commune && (
            <div className="location-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              </svg>
              <div>
                <strong>Commune:</strong> {property.commune}
              </div>
            </div>
          )}

          {property.city && (
            <div className="location-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <div>
                <strong>City:</strong> {property.city}
              </div>
            </div>
          )}

          {property.province && (
            <div className="location-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <div>
                <strong>Province:</strong> {property.province}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="property-info-section">
        <h3>Additional Information</h3>
        <div className="additional-info">
          <div className="info-row">
            <span className="info-label">Property ID:</span>
            <span className="info-value">{property._id?.substring(0, 8)}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Listed:</span>
            <span className="info-value">{formatDate(property.createdAt, 'PPP')}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Last Updated:</span>
            <span className="info-value">{formatDate(property.updatedAt, 'PPP')}</span>
          </div>

          {property.views !== undefined && (
            <div className="info-row">
              <span className="info-label">Views:</span>
              <span className="info-value">{property.views}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
