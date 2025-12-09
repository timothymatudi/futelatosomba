import React, { useEffect, useState, useCallback } from 'react'; // Added useState, useCallback
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import PropertyList from '../components/property/PropertyList';
import Button from '../components/common/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAgent, fetchUserSavedSearches, deleteUserSavedSearch, fetchUserPropertyAlerts, deleteUserPropertyAlert } = useAuth(); // Added saved searches and alerts functions
  const { properties, loading, fetchUserProperties, fetchFavorites, deleteProperty, toggleFavorite } = useProperty(); // Added fetchFavorites, toggleFavorite
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [savedSearches, setSavedSearches] = useState([]); // State for saved searches
  const [propertyAlerts, setPropertyAlerts] = useState([]); // State for property alerts
  const [favoriteProperties, setFavoriteProperties] = useState([]); // State for favorite properties

  const fetchDashboardData = useCallback(async () => {
    if (!user) return; // Don't fetch if user is not loaded yet

    if (isAgent()) {
      await fetchUserProperties(); // Agents manage their own listings
    } else {
      // Regular users see their favorites, saved searches, and alerts
      const favoritesResult = await fetchFavorites(); // Assuming fetchFavorites updates context.properties or returns them
      if (favoritesResult.success) {
        setFavoriteProperties(favoritesResult.properties || []); // Ensure this is correctly handled
      }
      const searchesResult = await fetchUserSavedSearches();
      if (searchesResult.success) {
        setSavedSearches(searchesResult.searches);
      }
      const alertsResult = await fetchUserPropertyAlerts();
      if (alertsResult.success) {
        setPropertyAlerts(alertsResult.alerts);
      }
    }
  }, [user, isAgent, fetchUserProperties, fetchFavorites, fetchUserSavedSearches, fetchUserPropertyAlerts]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); // Added fetchUserProperties to dependency array

  const handleEdit = (id) => {
    navigate(`/edit-property/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
      fetchUserProperties(); // Re-fetch properties after deletion
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              {t('welcome')}, {user?.firstName || user?.username}!
            </h1>
            <p className="dashboard-subtitle">
              {isAgent() ? t('manageListings') : t('yourActivities')}
            </p>
          </div>
          {isAgent() && (
            <Button variant="primary" onClick={() => navigate('/add-property')}>
              {t('addProperty')}
            </Button>
          )}
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#007FFF' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{isAgent() ? properties.length : favoriteProperties.length}</div>
              <div className="stat-label">{isAgent() ? t('propertiesListed') : t('favoriteProperties')}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FFD700' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {isAgent() ? properties.filter(p => p.status === 'active').length : savedSearches.length}
              </div>
              <div className="stat-label">{isAgent() ? t('activeListings') : t('savedSearches')}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#28a745' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <polyline points="17 11 19 13 23 9"></polyline>
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{isAgent() ? properties.filter(p => p.status === 'pending').length : propertyAlerts.length}</div>
              <div className="stat-label">{isAgent() ? t('pendingListings') : t('propertyAlerts')}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {isAgent() ? (
            <>
              <h2 className="section-title">{t('myProperties')}</h2>
              {properties.length === 0 ? (
                <div className="empty-state">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <h3>{t('noPropertiesYet')}</h3>
                  <p>{t('addYourFirstProperty')}</p>
                  <Button variant="primary" onClick={() => navigate('/add-property')}>
                    {t('addProperty')}
                  </Button>
                </div>
              ) : (
                <PropertyList
                    properties={properties} // Pass all properties
                    loading={loading}
                    isAgent={isAgent()} // Pass isAgent status
                    onEditProperty={handleEdit} // Pass edit handler
                    onDeleteProperty={handleDelete} // Pass delete handler
                />
              )}
            </>
          ) : (
            <>
              <div className="user-dashboard-sections">
                <div className="user-dashboard-section">
                  <h2 className="section-title">{t('favoriteProperties')}</h2>
                  {favoriteProperties.length > 0 ? (
                    <PropertyList
                      properties={favoriteProperties}
                      loading={loading}
                      onFavorite={toggleFavorite} // Allow unfavoriting from here
                    />
                  ) : (
                    <p>{t('noFavoriteProperties')}</p>
                  )}
                </div>

                <div className="user-dashboard-section">
                  <h2 className="section-title">{t('savedSearches')}</h2>
                  {savedSearches.length > 0 ? (
                    <ul>
                      {savedSearches.map(search => (
                        <li key={search._id}>
                          {search.name} - (Query: {JSON.stringify(search.query)})
                          <button onClick={() => deleteUserSavedSearch(search._id)}>{t('delete')}</button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{t('noSavedSearches')}</p>
                  )}
                  <Button variant="secondary" onClick={() => navigate('/properties')}>{t('createSavedSearch')}</Button>
                </div>

                <div className="user-dashboard-section">
                  <h2 className="section-title">{t('propertyAlerts')}</h2>
                  {propertyAlerts.length > 0 ? (
                    <ul>
                      {propertyAlerts.map(alert => (
                        <li key={alert._id}>
                          {alert.name} (Freq: {alert.frequency})
                          <button onClick={() => deleteUserPropertyAlert(alert._id)}>{t('delete')}</button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{t('noPropertyAlerts')}</p>
                  )}
                  <Button variant="secondary" onClick={() => navigate('/properties')}>{t('createPropertyAlert')}</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
