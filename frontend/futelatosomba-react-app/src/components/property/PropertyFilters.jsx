import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PROPERTY_TYPES, LISTING_TYPES, CITIES, KINSHASA_COMMUNES, PRICE_RANGES } from '../../utils/constants';
import Button from '../common/Button';
import './PropertyFilters.css';

const PropertyFilters = ({ filters, onFilterChange, onApply, onReset }) => {
  const { t, getLabel } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (name, value) => {
    onFilterChange({ [name]: value });
  };

  const handleApply = () => {
    onApply();
    setIsExpanded(false);
  };

  const handleReset = () => {
    onReset();
    setIsExpanded(false);
  };

  return (
    <div className="property-filters">
      <div className="filters-header">
        <h3 className="filters-title">{t('filter')}</h3>
        <button
          className="filters-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <span>{t('showLess')}</span>
          ) : (
            <span>{t('showMore')}</span>
          )}
        </button>
      </div>

      <div className={`filters-content ${isExpanded ? 'filters-expanded' : ''}`}>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">{t('search')}</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search properties..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('propertyType')}</label>
            <select
              className="filter-input"
              value={filters.propertyType || ''}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
            >
              <option value="">{t('allTypes')}</option>
              {Object.values(PROPERTY_TYPES).map((type) => (
                <option key={type} value={type}>
                  {getLabel({ en: type, fr: type, ln: type })}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('listingType')}</label>
            <select
              className="filter-input"
              value={filters.listingType || ''}
              onChange={(e) => handleInputChange('listingType', e.target.value)}
            >
              <option value="">All</option>
              <option value={LISTING_TYPES.SALE}>{t('forSale')}</option>
              <option value={LISTING_TYPES.RENT}>{t('forRent')}</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('city')}</label>
            <select
              className="filter-input"
              value={filters.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
            >
              <option value="">All Cities</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {filters.city === 'Kinshasa' && (
            <div className="filter-group">
              <label className="filter-label">{t('commune')}</label>
              <select
                className="filter-input"
                value={filters.commune || ''}
                onChange={(e) => handleInputChange('commune', e.target.value)}
              >
                <option value="">All Communes</option>
                {KINSHASA_COMMUNES.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-group">
            <label className="filter-label">{t('minPrice')}</label>
            <input
              type="number"
              className="filter-input"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('maxPrice')}</label>
            <input
              type="number"
              className="filter-input"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('bedrooms')}</label>
            <select
              className="filter-input"
              value={filters.bedrooms || ''}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('bathrooms')}</label>
            <select
              className="filter-input"
              value={filters.bathrooms || ''}
              onChange={(e) => handleInputChange('bathrooms', e.target.value)}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* New Advanced Filters */}
          <div className="filter-group">
            <label className="filter-label">{t('features')}</label>
            <input
              type="text"
              className="filter-input"
              placeholder={t('featuresPlaceholder')}
              value={filters.features || ''}
              onChange={(e) => handleInputChange('features', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('amenities')}</label>
            <input
              type="text"
              className="filter-input"
              placeholder={t('amenitiesPlaceholder')}
              value={filters.amenities || ''}
              onChange={(e) => handleInputChange('amenities', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('minYearBuilt')}</label>
            <input
              type="number"
              className="filter-input"
              placeholder={t('minYear')}
              value={filters.minYearBuilt || ''}
              onChange={(e) => handleInputChange('minYearBuilt', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('maxYearBuilt')}</label>
            <input
              type="number"
              className="filter-input"
              placeholder={t('maxYear')}
              value={filters.maxYearBuilt || ''}
              onChange={(e) => handleInputChange('maxYearBuilt', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('status')}</label>
            <select
              className="filter-input"
              value={filters.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">{t('allStatuses')}</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="filter-group filter-checkbox">
            <input
              type="checkbox"
              id="isPremium"
              checked={filters.isPremium || false}
              onChange={(e) => handleInputChange('isPremium', e.target.checked)}
            />
            <label htmlFor="isPremium">{t('premiumListings')}</label>
          </div>
        </div>

        <div className="filters-actions">
          <Button variant="outline" onClick={handleReset}>
            {t('resetFilters')}
          </Button>
          <Button variant="primary" onClick={handleApply}>
            {t('applyFilters')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
