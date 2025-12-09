import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate, getImageUrl } from '../../utils/formatters';
import './ListingCard.css';

const ListingCard = ({ property, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const primaryImage = property.images && property.images.length > 0
    ? getImageUrl(property.images[0].url || property.images[0])
    : '/placeholder-property.jpg';

  const getStatusBadge = () => {
    const statusColors = {
      active: '#28a745',
      pending: '#ffc107',
      sold: '#dc3545',
      rented: '#007FFF',
      inactive: '#6c757d'
    };

    return (
      <span className="listing-status" style={{ backgroundColor: statusColors[property.status] || '#6c757d' }}>
        {property.status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="listing-card">
      <div className="listing-image" onClick={() => navigate(`/properties/${property._id}`)}>
        <img src={primaryImage} alt={property.title} />
        {getStatusBadge()}
        {property.isPremium && (
          <span className="listing-premium">PREMIUM</span>
        )}
      </div>

      <div className="listing-content">
        <h3 className="listing-title" onClick={() => navigate(`/properties/${property._id}`)}>
          {property.title}
        </h3>

        <div className="listing-price">
          {formatPrice(property.price, property.listingType, property.currency)}
        </div>

        <div className="listing-details">
          <div className="listing-detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{property.commune ? `${property.commune}, ` : ''}{property.city}</span>
          </div>

          <div className="listing-detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>{property.bedrooms || 0} beds • {property.bathrooms || 0} baths</span>
          </div>
        </div>

        <div className="listing-stats">
          <div className="listing-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>{property.views || 0} views</span>
          </div>

          <div className="listing-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{property.favorites?.length || 0} favorites</span>
          </div>

          <div className="listing-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Listed {formatDate(property.createdAt, 'MMM d, yyyy')}</span>
          </div>
        </div>

        <div className="listing-actions">
          <button className="btn-view" onClick={() => navigate(`/properties/${property._id}`)}>
            View
          </button>
          <button className="btn-edit" onClick={() => onEdit(property._id)}>
            Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(property._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
