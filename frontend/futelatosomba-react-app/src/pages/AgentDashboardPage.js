import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard'; // Reusing PropertyCard for display
import AgentPropertyForm from '../components/AgentPropertyForm'; // Import AgentPropertyForm

function AgentDashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agentProperties, setAgentProperties] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle add form
  const navigate = useNavigate();

  const fetchAgentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const userResponse = await fetch('/api/users/me', {
        headers: {
          'x-auth-token': token
        }
      });
      const userData = await userResponse.json();

      if (!userResponse.ok || userData.user.role !== 'agent') {
          navigate('/login'); // Redirect if not authenticated or not an agent
          return;
      }
      setUser(userData.user);

      // Fetch properties owned by this agent
      const propertiesResponse = await fetch(`/api/users/${userData.user.id}/properties`, {
          headers: {
              'x-auth-token': token
          }
      });
      const propertiesData = await propertiesResponse.json();
      if (!propertiesResponse.ok) {
          throw new Error(propertiesData.error || 'Failed to fetch agent properties');
      }
      setAgentProperties(propertiesData);

    } catch (err) {
      setError(err.message);
      navigate('/login'); // Redirect on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentData();
  }, [navigate]);

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to delete property`);
        }
        // Refresh properties after deletion
        fetchAgentData();
      } catch (err) {
        setError(err.message);
      }
    }
  };


  if (loading) {
    return <p>Loading agent dashboard...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  if (!user) {
    return <p>Access Denied.</p>;
  }

  return (
    <div className="agent-dashboard-page">
      <h2>Welcome, {user.firstName} {user.lastName} ({user.agencyName})</h2>
      <p>Manage your property listings.</p>

      <button onClick={() => setShowAddForm(!showAddForm)} className="add-property-button">
        {showAddForm ? 'Cancel Add Property' : 'Add New Property'}
      </button>

      {showAddForm && <AgentPropertyForm />}

      <h3>Your Listings</h3>
      <div className="agent-property-list">
        {agentProperties.length > 0 ? (
          agentProperties.map(property => (
            <div key={property._id} className="property-card">
                {/* Reusing PropertyCard structure for display */}
                <h3>{property.title}</h3>
                <p>{property.location.address}, {property.location.city}</p>
                <p>{property.price} {property.currency}</p>
                <p>Status: {property.status}</p>
                <button onClick={() => navigate(`/agent/properties/edit/${property._id}`)}>Edit</button>
                <button onClick={() => handleDeleteProperty(property._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>You have no properties listed yet.</p>
        )}
      </div>
    </div>
  );
}

export default AgentDashboardPage;
