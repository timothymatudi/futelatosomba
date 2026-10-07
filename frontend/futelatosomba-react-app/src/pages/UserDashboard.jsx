import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import propertyService from '../services/propertyService';
import userService from '../services/userService';
import SavedPropertyCard from '../components/dashboard/SavedPropertyCard';
import SavedSearchCard from '../components/dashboard/SavedSearchCard';
import RecentlyViewedCard from '../components/dashboard/RecentlyViewedCard';
import ProfileSettings from '../components/dashboard/ProfileSettings';
import StatsWidget from '../components/dashboard/StatsWidget';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('saved');
  const [loading, setLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [propertyAlerts, setPropertyAlerts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch saved/favorited properties
      const favoritesResponse = await propertyService.getUserFavorites();
      setSavedProperties(favoritesResponse.data || []);

      // Fetch saved searches
      const searchesResponse = await userService.getSavedSearches();
      setSavedSearches((searchesResponse.data || []).map(s => ({ ...s.query, _id: s._id, name: s.name })));

      // Fetch property alerts
      const alertsResponse = await userService.getPropertyAlerts();
      setPropertyAlerts(alertsResponse.data || []);

      // Fetch recently viewed properties (from localStorage)
      const recentlyViewedData = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(recentlyViewedData.slice(0, 6));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await propertyService.removeFromFavorites(propertyId);
      setSavedProperties(prev => prev.filter(p => p._id !== propertyId));
      toast.success('Property removed from favorites');
    } catch (error) {
      toast.error('Failed to remove property from favorites');
    }
  };

  const handleDeleteSearch = async (searchId) => {
    try {
      await userService.deleteSavedSearch(searchId);
      setSavedSearches(prev => prev.filter(s => s._id !== searchId));
      toast.success('Saved search deleted');
    } catch (error) {
      toast.error('Failed to delete saved search');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await userService.deletePropertyAlert(alertId);
      setPropertyAlerts(prev => prev.filter(alert => alert._id !== alertId));
      toast.success('Property alert deleted');
    } catch (error) {
      toast.error('Failed to delete property alert');
    }
  };

  const handleRunAlertSearch = (alert) => {
    const params = new URLSearchParams();
    Object.entries(alert.query || {}).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined && value !== false) {
        params.append(key, value);
      }
    });
    navigate(`/properties?${params.toString()}`);
  };

  const handleEditSearch = (search) => {
    // Navigate to properties page with pre-filled filters
    const params = new URLSearchParams();
    Object.keys(search).forEach(key => {
      if (key !== '_id' && key !== 'name' && key !== 'createdAt' && search[key]) {
        params.append(key, search[key]);
      }
    });
    navigate(`/properties?${params.toString()}`);
  };

  const stats = {
    savedProperties: savedProperties.length,
    savedSearches: savedSearches.length,
    propertyAlerts: propertyAlerts.length,
    recentlyViewed: recentlyViewed.length,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="user-dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>My Dashboard</h1>
          <p>Welcome back, {user?.fullName || 'User'}!</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsWidget
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          }
          value={stats.savedProperties}
          label="Saved Properties"
          color="#dc3545"
        />

        <StatsWidget
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          }
          value={stats.savedSearches}
          label="Saved Searches"
          color="#007FFF"
        />

        <StatsWidget
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          }
          value={stats.recentlyViewed}
          label="Recently Viewed"
          color="#28a745"
        />

        <StatsWidget
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          }
          value={stats.propertyAlerts}
          label="Email Alerts"
          color="#ff9800"
        />
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Saved Properties ({stats.savedProperties})
        </button>

        <button
          className={`tab-btn ${activeTab === 'searches' ? 'active' : ''}`}
          onClick={() => setActiveTab('searches')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          Saved Searches ({stats.savedSearches})
        </button>

        <button
          className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Recently Viewed ({stats.recentlyViewed})
        </button>

        <button
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Email Alerts ({stats.propertyAlerts})
        </button>

        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m-6-6h6m6 0h-6m-3.66 7.07l4.24-4.24m-4.24 0l4.24 4.24M5.93 5.93l4.24 4.24m0 0L5.93 14.41"></path>
          </svg>
          Profile Settings
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'saved' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Saved Properties</h2>
              {savedProperties.length > 0 && (
                <button className="btn-browse" onClick={() => navigate('/properties')}>
                  Browse More
                </button>
              )}
            </div>

            {savedProperties.length === 0 ? (
              <div className="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <h3>No saved properties yet</h3>
                <p>Start exploring and save your favorite properties</p>
                <button className="btn-browse" onClick={() => navigate('/properties')}>
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {savedProperties.map(property => (
                  <SavedPropertyCard
                    key={property._id}
                    property={property}
                    onRemoveFavorite={handleRemoveFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'searches' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Saved Searches</h2>
              <button className="btn-browse" onClick={() => navigate('/properties')}>
                Create New Search
              </button>
            </div>

            {savedSearches.length === 0 ? (
              <div className="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3>No saved searches yet</h3>
                <p>Save your search criteria to quickly find properties</p>
                <button className="btn-browse" onClick={() => navigate('/properties')}>
                  Start Searching
                </button>
              </div>
            ) : (
              <div className="searches-grid">
                {savedSearches.map(search => (
                  <SavedSearchCard
                    key={search._id}
                    search={search}
                    onDelete={handleDeleteSearch}
                    onEdit={handleEditSearch}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Recently Viewed</h2>
            </div>

            {recentlyViewed.length === 0 ? (
              <div className="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <h3>No recently viewed properties</h3>
                <p>Properties you view will appear here</p>
                <button className="btn-browse" onClick={() => navigate('/properties')}>
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="recent-grid">
                {recentlyViewed.map((item, index) => (
                  <RecentlyViewedCard
                    key={item.property._id || index}
                    property={item.property}
                    viewedAt={item.viewedAt}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Email Property Alerts</h2>
              <button className="btn-browse" onClick={() => navigate('/properties')}>
                Create Alert
              </button>
            </div>

            {propertyAlerts.length === 0 ? (
              <div className="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <h3>No email alerts yet</h3>
                <p>Create an alert from the property search filters and we will email you when matching listings appear.</p>
                <button className="btn-browse" onClick={() => navigate('/properties')}>
                  Search Properties
                </button>
              </div>
            ) : (
              <div className="searches-grid">
                {propertyAlerts.map(alert => (
                  <div key={alert._id} className="saved-search-card">
                    <div className="saved-search-header">
                      <div className="saved-search-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </div>
                      <div className="saved-search-info">
                        <h3 className="saved-search-name">{alert.name}</h3>
                        <p className="saved-search-summary">Frequency: {alert.frequency || 'instant'}</p>
                      </div>
                    </div>
                    <div className="saved-search-meta">
                      {Object.entries(alert.query || {}).filter(([, value]) => value).map(([key, value]) => (
                        <span key={key} className="saved-search-matches">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                    <div className="saved-search-actions">
                      <button className="btn-search-action btn-run" onClick={() => handleRunAlertSearch(alert)}>
                        View matches
                      </button>
                      <button className="btn-search-action btn-delete" onClick={() => handleDeleteAlert(alert._id)}>
                        Delete alert
                      </button>
                    </div>
                    {alert.lastNotifiedAt && (
                      <p className="saved-search-date">Last sent: {new Date(alert.lastNotifiedAt).toLocaleString()}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <ProfileSettings />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
