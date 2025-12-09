import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import propertyService from '../services/propertyService';
import ListingCard from '../components/dashboard/ListingCard';
import StatsWidget from '../components/dashboard/StatsWidget';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAgent } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAgent()) {
      navigate('/dashboard');
      return;
    }

    fetchAgentProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAgent]);

  const fetchAgentProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getUserProperties(user._id);
      setProperties(response.data || []);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-property/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await propertyService.deleteProperty(id);
        toast.success('Property deleted successfully');
        fetchAgentProperties();
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    pending: properties.filter(p => p.status === 'pending').length,
    sold: properties.filter(p => p.status === 'sold' || p.status === 'rented').length,
    totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
    totalFavorites: properties.reduce((sum, p) => sum + (p.favorites?.length || 0), 0)
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="agent-dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Agent Dashboard</h1>
          <p>Welcome back, {user?.agencyName || user?.fullName}!</p>
        </div>
        <button className="btn-add-property" onClick={() => navigate('/add-property')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Property
        </button>
      </div>

      <div className="stats-grid">
        <StatsWidget
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
          }
          value={stats.total}
          label="Total Listings"
          color="#007FFF"
        />

        <StatsWidget
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          }
          value={stats.active}
          label="Active Listings"
          color="#28a745"
        />

        <StatsWidget
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          }
          value={stats.pending}
          label="Pending Approval"
          color="#ffc107"
        />

        <StatsWidget
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          }
          value={stats.totalViews}
          label="Total Views"
          color="#17a2b8"
        />
      </div>

      <div className="dashboard-content">
        <div className="section-header">
          <h2>My Properties</h2>
          <div className="filter-buttons">
            <button className="filter-btn active">All ({stats.total})</button>
            <button className="filter-btn">Active ({stats.active})</button>
            <button className="filter-btn">Pending ({stats.pending})</button>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <h3>No properties yet</h3>
            <p>Start by adding your first property listing</p>
            <button className="btn-add-property" onClick={() => navigate('/add-property')}>
              Add Property
            </button>
          </div>
        ) : (
          <div className="listings-grid">
            {properties.map(property => (
              <ListingCard
                key={property._id}
                property={property}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
