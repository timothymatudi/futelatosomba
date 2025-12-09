import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatPrice, formatDate } from '../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import './HousePrices.css';

const HousePrices = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [soldProperties, setSoldProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    commune: '',
    propertyType: '',
    search: ''
  });

  useEffect(() => {
    fetchSoldProperties();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSoldProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'sold');
      if (filters.city) params.append('city', filters.city);
      if (filters.commune) params.append('commune', filters.commune);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/properties?${params.toString()}`);
      setSoldProperties(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load sold properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/properties/stats/sold');
      setStats(response.data.data || null);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSoldProperties();
  };

  if (loading && !stats) {
    return <Loading />;
  }

  return (
    <div className="house-prices-page">
      <div className="prices-hero">
        <div className="hero-content">
          <h1>Sold House Prices</h1>
          <p>Explore recent property sales and market trends across DRC</p>
        </div>
      </div>

      {stats && (
        <div className="price-stats-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#007FFF' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalSold || 0}</div>
                <div className="stat-label">Properties Sold</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#28a745' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">${stats.averagePrice?.toLocaleString() || 0}</div>
                <div className="stat-label">Average Sale Price</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#ffc107' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.thisMonth || 0}</div>
                <div className="stat-label">Sold This Month</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="prices-container">
        <div className="prices-filters">
          <form onSubmit={handleSearch} className="filter-form">
            <div className="filter-group">
              <label>Search by address</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Enter street, neighborhood, or area..."
              />
            </div>

            <div className="filter-group">
              <label>City</label>
              <select name="city" value={filters.city} onChange={handleFilterChange}>
                <option value="">All Cities</option>
                <option value="Kinshasa">Kinshasa</option>
                <option value="Lubumbashi">Lubumbashi</option>
                <option value="Mbuji-Mayi">Mbuji-Mayi</option>
                <option value="Kananga">Kananga</option>
                <option value="Kisangani">Kisangani</option>
                <option value="Bukavu">Bukavu</option>
                <option value="Goma">Goma</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Property Type</label>
              <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <button type="submit" className="btn-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Search
            </button>
          </form>
        </div>

        <div className="sold-results">
          <div className="results-header">
            <h2>{soldProperties.length} Sold {soldProperties.length === 1 ? 'Property' : 'Properties'}</h2>
            <p className="results-subtitle">Showing recent sales in your selected area</p>
          </div>

          {soldProperties.length === 0 ? (
            <div className="no-results">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              <h3>No sold properties found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="sold-grid">
              {soldProperties.map(property => (
                <div key={property._id} className="sold-card" onClick={() => navigate(`/properties/${property._id}`)}>
                  <div className="sold-image">
                    <img
                      src={property.images?.[0]?.url || '/placeholder-property.jpg'}
                      alt={property.title}
                    />
                    <div className="sold-badge">SOLD</div>
                  </div>

                  <div className="sold-content">
                    <div className="sold-price">
                      {formatPrice(property.price, property.listingType, property.currency)}
                    </div>

                    <h3 className="sold-title">{property.title}</h3>

                    <div className="sold-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{property.commune ? `${property.commune}, ` : ''}{property.city}</span>
                    </div>

                    <div className="sold-specs">
                      <span>{property.bedrooms || 0} beds</span>
                      <span>•</span>
                      <span>{property.bathrooms || 0} baths</span>
                      <span>•</span>
                      <span>{property.area || 0} m²</span>
                    </div>

                    <div className="sold-date">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>Sold on {formatDate(property.soldAt || property.updatedAt, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HousePrices;
