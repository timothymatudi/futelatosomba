import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate, getImageUrl } from '../../utils/formatters';
import './RecentlyViewedCard.css';

const RecentlyViewedCard = ({ property, viewedAt }) => {
  const navigate = useNavigate();

  const primaryImage = property.images && property.images.length > 0
    ? getImageUrl(property.images[0].url || property.images[0])
    : '/placeholder-property.jpg';

  return (
    <div className="recently-viewed-card" onClick={() => navigate(`/properties/${property._id}`)}>
      <div className="recently-viewed-image">
        <img src={primaryImage} alt={property.title} />
        {property.isPremium && (
          <span className="recently-viewed-premium">PREMIUM</span>
        )}
      </div>

      <div className="recently-viewed-content">
        <h4 className="recently-viewed-title">{property.title}</h4>

        <div className="recently-viewed-price">
          {formatPrice(property.price, property.listingType, property.currency)}
        </div>

        <div className="recently-viewed-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{property.commune ? `${property.commune}, ` : ''}{property.city}</span>
        </div>

        <div className="recently-viewed-specs">
          <span>{property.bedrooms || 0} beds</span>
          <span>•</span>
          <span>{property.bathrooms || 0} baths</span>
          <span>•</span>
          <span>{property.area || 0} m²</span>
        </div>

        <div className="recently-viewed-time">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Viewed {formatDate(viewedAt, 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewedCard;
