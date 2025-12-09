import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate, getImageUrl } from '../../utils/formatters';
import './SavedPropertyCard.css';

const SavedPropertyCard = ({ property, onRemoveFavorite }) => {
  const navigate = useNavigate();

  const primaryImage = property.images && property.images.length > 0
    ? getImageUrl(property.images[0].url || property.images[0])
    : '/placeholder-property.jpg';

  const handleRemoveFavorite = async (e) => {
    e.stopPropagation();
    if (window.confirm('Remove this property from your favorites?')) {
      onRemoveFavorite(property._id);
    }
  };

  return (
    <div className="saved-property-card">
      <div className="saved-property-image" onClick={() => navigate(`/properties/${property._id}`)}>
        <img src={primaryImage} alt={property.title} />
        {property.isPremium && (
          <span className="saved-property-premium">PREMIUM</span>
        )}
        <button className="btn-remove-favorite" onClick={handleRemoveFavorite} title="Remove from favorites">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="saved-property-content">
        <h3 className="saved-property-title" onClick={() => navigate(`/properties/${property._id}`)}>
          {property.title}
        </h3>

        <div className="saved-property-price">
          {formatPrice(property.price, property.listingType, property.currency)}
        </div>

        <div className="saved-property-details">
          <div className="saved-property-detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{property.commune ? `${property.commune}, ` : ''}{property.city}</span>
          </div>

          <div className="saved-property-detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>{property.bedrooms || 0} beds • {property.bathrooms || 0} baths • {property.area || 0} m²</span>
          </div>
        </div>

        <div className="saved-property-footer">
          <div className="saved-date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Saved {formatDate(property.savedAt || property.createdAt, 'MMM d, yyyy')}</span>
          </div>
          <button className="btn-view-property" onClick={() => navigate(`/properties/${property._id}`)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedPropertyCard;
