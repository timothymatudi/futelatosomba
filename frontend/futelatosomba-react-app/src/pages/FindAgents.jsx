import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import './FindAgents.css';

const FindAgents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    search: ''
  });

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/users/agents?${params.toString()}`);
      setAgents(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  }, [filters]); // filters is a dependency of fetchAgents

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]); // fetchAgents is now a stable dependency

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAgents();
  };

  const handleContactAgent = (agentId) => {
    navigate(`/contact?agentId=${agentId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="find-agents-page">
      <div className="agents-hero">
        <div className="hero-content">
          <h1>Find Estate Agents</h1>
          <p>Connect with verified property agents across DRC</p>
        </div>
      </div>

      <div className="agents-container">
        <div className="agents-filters">
          <form onSubmit={handleSearch} className="filter-form">
            <div className="filter-group">
              <label>Search by name or agency</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Agent or agency name..."
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

            <button type="submit" className="btn-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Search
            </button>
          </form>
        </div>

        <div className="agents-results">
          <div className="results-header">
            <h2>{agents.length} {agents.length === 1 ? 'Agent' : 'Agents'} Found</h2>
          </div>

          {agents.length === 0 ? (
            <div className="no-results">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h3>No agents found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="agents-grid">
              {agents.map(agent => (
                <div key={agent._id} className="agent-card">
                  <div className="agent-header">
                    <div className="agent-avatar">
                      {agent.profileImage ? (
                        <img src={agent.profileImage} alt={agent.fullName} />
                      ) : (
                        <div className="avatar-placeholder">
                          {agent.fullName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="agent-info">
                      <h3>{agent.fullName}</h3>
                      {agent.agencyName && (
                        <p className="agency-name">{agent.agencyName}</p>
                      )}
                    </div>
                  </div>

                  <div className="agent-details">
                    {agent.city && (
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{agent.city}</span>
                      </div>
                    )}

                    {agent.phoneNumber && (
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>{agent.phoneNumber}</span>
                      </div>
                    )}

                    {agent.email && (
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>{agent.email}</span>
                      </div>
                    )}

                    {agent.propertyCount > 0 && (
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        </svg>
                        <span>{agent.propertyCount} {agent.propertyCount === 1 ? 'property' : 'properties'}</span>
                      </div>
                    )}
                  </div>

                  <div className="agent-actions">
                    <button
                      className="btn-view-properties"
                      onClick={() => navigate(`/properties?agentId=${agent._id}`)}
                    >
                      View Properties
                    </button>
                    <button
                      className="btn-contact-agent"
                      onClick={() => handleContactAgent(agent._id)}
                    >
                      Contact
                    </button>
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

export default FindAgents;
