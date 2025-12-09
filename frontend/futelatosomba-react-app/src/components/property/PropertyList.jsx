import React from 'react';
import PropertyCard from './PropertyCard';
import Loading from '../common/Loading';
import { useLanguage } from '../../context/LanguageContext';
import './PropertyList.css';

const PropertyList = ({ properties, loading, onFavorite, isAgent, onDeleteProperty, onEditProperty }) => {
  const { t } = useLanguage();

  if (loading) {
    return <Loading text={t('loading')} />;
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="property-list-empty">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <h3>{t('noResults')}</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="property-list">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          onFavorite={onFavorite}
          isAgent={isAgent}
          onDeleteProperty={onDeleteProperty}
          onEditProperty={onEditProperty}
        />
      ))}
    </div>
  );
};

export default PropertyList;
