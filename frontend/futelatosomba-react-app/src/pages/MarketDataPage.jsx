import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CITIES } from '../utils/constants'; // Assuming CITIES is defined here
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import './MarketDataPage.css';

const MarketDataPage = () => {
  const { t } = useLanguage();
  const [overviewStats, setOverviewStats] = useState(null);
  const [avgPriceByType, setAvgPriceByType] = useState(null);
  const [avgPriceByBedrooms, setAvgPriceByBedrooms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityFilter, setCityFilter] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const fetchMarketData = async (city = '') => {
    setLoading(true);
    setError(null);
    try {
      // Fetch overview stats
      const overviewResponse = await fetch('/api/properties/stats/overview');
      const overviewData = await overviewResponse.json();
      if (!overviewResponse.ok) {
        throw new Error(overviewData.error || 'Failed to fetch overview stats');
      }
      setOverviewStats(overviewData);

      if (city) {
        // Fetch average price by type
        const typeResponse = await fetch(`/api/properties/stats/average-price-by-type?city=${city}`);
        const typeData = await typeResponse.json();
        if (!typeResponse.ok) {
          throw new Error(typeData.error || 'Failed to fetch average price by type');
        }
        setAvgPriceByType(typeData);

        // Fetch average price by bedrooms
        const bedroomsResponse = await fetch(`/api/properties/stats/average-price-by-bedrooms?city=${city}`);
        const bedroomsData = await bedroomsResponse.json();
        if (!bedroomsResponse.ok) {
          throw new Error(bedroomsData.error || 'Failed to fetch average price by bedrooms');
        }
        setAvgPriceByBedrooms(bedroomsData);
      } else {
        setAvgPriceByType(null);
        setAvgPriceByBedrooms(null);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(selectedCity);
  }, [selectedCity]);

  const handleApplyCityFilter = () => {
    setSelectedCity(cityFilter);
  };

  if (loading && !overviewStats) {
    return <Loading fullScreen />;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="market-data-page">
      <div className="container">
        <h2 className="page-title">{t('marketDataAndAnalytics')}</h2>

        <div className="stats-section">
          <h3>{t('overview')}</h3>
          {overviewStats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{overviewStats.totalProperties}</div>
                <div className="stat-label">{t('totalProperties')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{overviewStats.forSale}</div>
                <div className="stat-label">{t('forSale')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{overviewStats.forRent}</div>
                <div className="stat-label">{t('forRent')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{overviewStats.premium}</div>
                <div className="stat-label">{t('premiumListings')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{overviewStats.avgPrice?.sale ? overviewStats.avgPrice.sale + ' USD' : t('notAvailable')}</div>
                <div className="stat-label">{t('avgSalePrice')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{overviewStats.avgPrice?.rent ? overviewStats.avgPrice.rent + ' USD' : t('notAvailable')}</div>
                <div className="stat-label">{t('avgRentPrice')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{overviewStats.cities?.length}</div>
                <div className="stat-label">{t('citiesCovered')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{overviewStats.propertyTypes?.length}</div>
                <div className="stat-label">{t('propertyTypes')}</div>
              </div>
            </div>
          ) : (
            <p>{t('noOverviewData')}</p>
          )}
        </div>

        <div className="city-filter-section">
          <h3>{t('filterByCityForDetailedStats')}</h3>
          <input
            type="text"
            placeholder={t('enterCityName')}
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
          <Button variant="primary" onClick={handleApplyCityFilter}>
            {t('applyCityFilter')}
          </Button>
          {!selectedCity && <p>{t('enterCityToSeeDetailedPrices')}</p>}
        </div>

        {selectedCity && (
          <>
            <div className="stats-section">
              <h3>{t('averagePriceByPropertyTypeIn')} {selectedCity}</h3>
              {avgPriceByType && avgPriceByType.length > 0 ? (
                <ul>
                  {avgPriceByType.map(item => (
                    <li key={item.propertyType}>
                      {item.propertyType}: {item.averagePrice} USD (Count: {item.count})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t('noDataForPropertyTypes')} {selectedCity}.</p>
              )}
            </div>

            <div className="stats-section">
              <h3>{t('averagePriceByBedroomsIn')} {selectedCity}</h3>
              {avgPriceByBedrooms && avgPriceByBedrooms.length > 0 ? (
                <ul>
                  {avgPriceByBedrooms.map(item => (
                    <li key={item.bedrooms}>
                      {item.bedrooms} Bedrooms: {item.averagePrice} USD (Count: {item.count})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t('noDataForBedrooms')} {selectedCity}.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketDataPage;
