import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { formatPrice, formatArea, getImageUrl } from '../../utils/formatters';
import { PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from '../../utils/constants';
import './PropertyCard.css';

const PropertyCard = ({ property, onFavorite, isAgent, onDeleteProperty, onEditProperty }) => {
  const { getLabel } = useLanguage();
  const { user } = useAuth(); // Get logged-in user
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigating to detail page
    if (onFavorite) {
      onFavorite(property._id);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEditProperty) {
      onEditProperty(property._id);
    } else {
      navigate(`/edit-property/${property._id}`);
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteProperty) {
      onDeleteProperty(property._id);
    }
  };

  const primaryImage = property.images && property.images.length > 0
    ? getImageUrl(property.images[0])
    : '/placeholder-property.jpg';

  // Check if the logged-in user is the owner of this property
  const isOwner = user && property.owner && user._id === property.owner._id;

  // Check if property was added today or within 24 hours
  const isNew = property.createdAt &&
    (new Date() - new Date(property.createdAt)) < 24 * 60 * 60 * 1000;

  // Format timestamp for "Added today" or relative time
  const getAddedTime = () => {
    if (!property.createdAt) return '';
    const now = new Date();
    const created = new Date(property.createdAt);
    const hoursDiff = Math.floor((now - created) / (1000 * 60 * 60));

    if (hoursDiff < 24) return 'Added today';
    if (hoursDiff < 48) return 'Added yesterday';
    const daysDiff = Math.floor(hoursDiff / 24);
    return `Added ${daysDiff} days ago`;
  };

  return (
    <Link to={`/properties/${property._id}`} className="property-card">
      <div className="property-card-image">
        <img src={primaryImage} alt={property.title} />

        <div className="property-card-badges">
          {isNew && (
            <span className="property-badge badge-new">NEW</span>
          )}
          {property.isPremium && (
            <span className="property-badge badge-premium">Premium</span>
          )}
          {property.listingType && (
            <span className={`property-badge badge-${property.listingType}`}>
              {getLabel(LISTING_TYPE_LABELS[property.listingType])}
            </span>
          )}
        </div>

        {onFavorite && (
          <button
            className="property-favorite"
            onClick={handleFavoriteClick}
            aria-label="Add to favorites"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        )}
      </div>

      <div className="property-card-content">
        <div className="property-card-header">
          <p className="property-card-price">
            {formatPrice(property.price, property.listingType, property.currency)}
          </p>
          <h3 className="property-card-title">{property.title}</h3>
        </div>

        <p className="property-card-location">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {property.commune && `${property.commune}, `}
          {property.city}
        </p>

        <div className="property-card-features">
          {property.bedrooms && (
            <div className="property-feature">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 4v16"></path>
                <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                <path d="M2 17h20"></path>
                <path d="M6 8v9"></path>
              </svg>
              <span>{property.bedrooms} bed</span>
            </div>
          )}

          {property.bathrooms && (
            <div className="property-feature">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 6l-6 6l6 6"></path>
                <path d="M3 12h18"></path>
              </svg>
              <span>{property.bathrooms} bath</span>
            </div>
          )}

          {property.area && (
            <div className="property-feature">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18"></rect>
              </svg>
              <span>{formatArea(property.area)}</span>
            </div>
          )}
        </div>

        {property.propertyType && (
          <div className="property-card-type">
            {getLabel(PROPERTY_TYPE_LABELS[property.propertyType])}
          </div>
        )}

        {/* Added timestamp - Rightmove style */}
        {property.createdAt && (
          <p className="property-timestamp">{getAddedTime()}</p>
        )}

        {/* Agent actions */}
        {isAgent && user && isOwner && (
          <div className="property-agent-actions">
            <button className="agent-action-button edit-button" onClick={handleEditClick}>Edit</button>
            <button className="agent-action-button delete-button" onClick={handleDeleteClick}>Delete</button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
