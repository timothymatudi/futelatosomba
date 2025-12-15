import React, { useEffect, useState } from 'react'; // Added useState
import { useNavigate } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import PropertyList from '../components/property/PropertyList';
import PropertyFilters from '../components/property/PropertyFilters';
import Button from '../components/common/Button';
import './Home.css';

const Home = () => {
  const { properties, loading, filters, fetchProperties, updateFilters, resetFilters } = useProperty();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [overviewStats, setOverviewStats] = useState(null); // State for overview stats

  const fetchOverviewStats = async () => {
    try {
      const response = await fetch('/api/properties/stats/overview');
      const data = await response.json();
      if (response.ok) {
        setOverviewStats(data);
      }
    } catch (err) {
      console.error('Error fetching overview stats:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchOverviewStats(); // Fetch overview stats on component mount
  }, [fetchProperties]); // fetchProperties is a dependency

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleApplyFilters = () => {
    fetchProperties();
  };

  const handleResetFilters = () => {
    resetFilters();
    fetchProperties({}, 1);
  };

  const heroStyle = {
    background: `
      linear-gradient(
        135deg,
        rgba(0, 127, 255, 0.45) 0%,
        rgba(0, 102, 204, 0.40) 100%
      ),
      url(${process.env.PUBLIC_URL}/kinshasa-hero.jpg) center/cover no-repeat
    `,
    backgroundAttachment: 'fixed'
  };

  return (
    <div className="home-page">
      <section className="hero-section" style={heroStyle}>
        <div className="hero-content">
          <h1 className="hero-title">{t('findYourDreamHome')}</h1>
          <p className="hero-subtitle">{t('propertyPlatform')}</p>

          <div className="hero-search">
            <input
              type="text"
              className="hero-search-input"
              placeholder={t('search') + ' properties...'}
              value={filters.search || ''}
              onChange={(e) => {
                updateFilters({ search: e.target.value });
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  fetchProperties();
                }
              }}
            />
            <Button variant="primary" size="large" onClick={() => fetchProperties()}>
              {t('search')}
            </Button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">{overviewStats ? overviewStats.totalProperties : '...'}</div>
              <div className="stat-label">Properties</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{overviewStats ? overviewStats.forSale + overviewStats.forRent : '...'}</div>
              <div className="stat-label">Listings</div> {/* Changed from Agents to Listings */}
            </div>
            <div className="stat-item">
              <div className="stat-value">{overviewStats && overviewStats.cities ? overviewStats.cities.length : '...'}</div>
              <div className="stat-label">Cities</div>
            </div>
          </div>
        </div>
      </section>

      <section className="properties-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('featured')} {t('properties')}</h2>
            <Button variant="outline" onClick={() => navigate('/properties')}>
              {t('viewMap')}
            </Button>
          </div>

          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

          <PropertyList
            properties={ (properties || []).slice(0, 12) }
            loading={loading}
          />

          {(properties || []).length > 12 && (
            <div className="view-all-container">
              <Button variant="primary" size="large" onClick={() => navigate('/properties')}>
                View All Properties
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Are you a property owner or agent?</h2>
            <p className="cta-text">
              List your properties on Futelatosomba and reach thousands of potential buyers and renters.
            </p>
            <Button variant="secondary" size="large" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
