import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatPrice } from '../../utils/formatters';
import './SavedSearchCard.css';

const SavedSearchCard = ({ search, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    // Build query string from search criteria
    const params = new URLSearchParams();
    if (search.city) params.append('city', search.city);
    if (search.commune) params.append('commune', search.commune);
    if (search.propertyType) params.append('propertyType', search.propertyType);
    if (search.listingType) params.append('listingType', search.listingType);
    if (search.minPrice) params.append('minPrice', search.minPrice);
    if (search.maxPrice) params.append('maxPrice', search.maxPrice);
    if (search.bedrooms) params.append('bedrooms', search.bedrooms);
    if (search.bathrooms) params.append('bathrooms', search.bathrooms);

    navigate(`/properties?${params.toString()}`);
  };

  const getSearchSummary = () => {
    const parts = [];

    if (search.propertyType) {
      parts.push(search.propertyType.charAt(0).toUpperCase() + search.propertyType.slice(1));
    }

    if (search.listingType) {
      parts.push(`for ${search.listingType}`);
    }

    if (search.city) {
      parts.push(`in ${search.city}`);
    }

    if (search.minPrice || search.maxPrice) {
      const priceRange = search.minPrice && search.maxPrice
        ? `$${search.minPrice.toLocaleString()} - $${search.maxPrice.toLocaleString()}`
        : search.minPrice
        ? `From $${search.minPrice.toLocaleString()}`
        : `Up to $${search.maxPrice.toLocaleString()}`;
      parts.push(priceRange);
    }

    if (search.bedrooms) {
      parts.push(`${search.bedrooms}+ beds`);
    }

    return parts.join(' • ') || 'All properties';
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete saved search "${search.name}"?`)) {
      onDelete(search._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(search);
  };

  return (
    <div className="saved-search-card" onClick={handleSearch}>
      <div className="saved-search-header">
        <div className="saved-search-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <div className="saved-search-info">
          <h3 className="saved-search-name">{search.name}</h3>
          <p className="saved-search-summary">{getSearchSummary()}</p>
        </div>
      </div>

      <div className="saved-search-meta">
        <div className="saved-search-date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Saved {formatDate(search.createdAt, 'MMM d, yyyy')}</span>
        </div>

        {search.matchCount !== undefined && (
          <div className="saved-search-matches">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span>{search.matchCount} {search.matchCount === 1 ? 'match' : 'matches'}</span>
          </div>
        )}
      </div>

      <div className="saved-search-actions">
        <button className="btn-search-action btn-run" onClick={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          Run Search
        </button>
        <button className="btn-search-action btn-edit" onClick={handleEdit}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button className="btn-search-action btn-delete" onClick={handleDelete}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SavedSearchCard;
