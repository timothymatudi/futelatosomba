import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './UserProfilePage.css'; // Will create this later

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedSearches, setSavedSearches] = useState([]);
  const [propertyAlerts, setPropertyAlerts] = useState([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch user profile
      const userResponse = await fetch('/api/users/me', {
        headers: {
          'x-auth-token': token
        }
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error || 'Failed to fetch user profile');
      }
      setUser(userData.user);

      // Fetch saved searches
      const searchesResponse = await fetch('/api/users/searches', {
        headers: {
          'x-auth-token': token
        }
      });
      const searchesData = await searchesResponse.json();
      if (searchesResponse.ok) {
        setSavedSearches(searchesData);
      }

      // Fetch property alerts
      const alertsResponse = await fetch('/api/users/alerts', {
        headers: {
          'x-auth-token': token
        }
      });
      const alertsData = await alertsResponse.json();
      if (alertsResponse.ok) {
        setPropertyAlerts(alertsData);
      }

      // Fetch favorite properties
      const favoritesResponse = await fetch('/api/properties/favorites', { // This endpoint does not exist yet
        headers: {
          'x-auth-token': token
        }
      });
      const favoritesData = await favoritesResponse.json();
      if (favoritesResponse.ok) {
        setFavoriteProperties(favoritesData);
      }


    } catch (err) {
      setError(err.message);
      localStorage.removeItem('token'); // Clear token if fetching user data fails
      navigate('/login'); // Redirect on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  const handleDeleteSavedSearch = async (searchId) => {
    if (window.confirm('Are you sure you want to delete this saved search?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/users/searches/${searchId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete saved search');
        }
        fetchUserData(); // Refresh data
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeletePropertyAlert = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this property alert?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/users/alerts/${alertId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete property alert');
        }
        fetchUserData(); // Refresh data
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUnfavoriteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to unfavorite this property?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/properties/${propertyId}/favorite`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token
          }
        });
        if (!response.ok) {
          throw new Error('Failed to unfavorite property');
        }
        fetchUserData(); // Refresh data
      } catch (err) {
        setError(err.message);
      }
    }
  };


  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="user-profile-page">
      <h2>My Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.isPremium && <p><strong>Premium User</strong></p>}
        {user.role === 'agent' && (
          <>
            <h3>Agent Information</h3>
            <p><strong>Agency:</strong> {user.agencyName}</p>
            <p><strong>License:</strong> {user.licenseNumber}</p>
            <p><strong>Address:</strong> {user.agencyAddress}</p>
            {user.agencyLogo && <p><img src={user.agencyLogo} alt="Agency Logo" style={{ maxWidth: '150px' }} /></p>}
          </>
        )}
      </div>

      <div className="saved-searches-section">
        <h3>Saved Searches</h3>
        {savedSearches.length > 0 ? (
          <ul>
            {savedSearches.map(search => (
              <li key={search._id}>
                {search.name} - (Query: {search.query})
                <button onClick={() => handleDeleteSavedSearch(search._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved searches.</p>
        )}
      </div>

      <div className="property-alerts-section">
        <h3>Property Alerts</h3>
        {propertyAlerts.length > 0 ? (
          <ul>
            {propertyAlerts.map(alert => (
              <li key={alert._id}>
                {alert.name} - (Frequency: {alert.frequency})
                <button onClick={() => handleDeletePropertyAlert(alert._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No property alerts.</p>
        )}
      </div>

      <div className="favorite-properties-section">
        <h3>Favorite Properties</h3>
        {favoriteProperties.length > 0 ? (
          <div className="favorite-property-list">
            {favoriteProperties.map(property => (
                <div key={property._id} className="favorite-property-card">
                    {/* Reusing a simplified property display */}
                    <h4>{property.title}</h4>
                    <p>{property.location.city}</p>
                    <button onClick={() => handleUnfavoriteProperty(property._id)}>Unfavorite</button>
                    <button onClick={() => navigate(`/properties/${property._id}`)}>View Details</button>
                </div>
            ))}
          </div>
        ) : (
          <p>No favorite properties.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;
