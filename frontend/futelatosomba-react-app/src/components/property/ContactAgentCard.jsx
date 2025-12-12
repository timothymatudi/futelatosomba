import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials, formatPhoneNumber } from '../../utils/formatters';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './ContactAgentCard.css';

const ContactAgentCard = ({ property }) => {
  const { user, isAuthenticated } = useAuth();
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    message: `I'm interested in ${property.title}`
  });
  const [loading, setLoading] = useState(false);

  const agent = property.owner;

  if (!agent) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Please login to contact the agent');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/properties/${property._id}/contact-agent`, formData);
      toast.success('Message sent successfully!');
      setShowContactForm(false);
      setFormData({
        ...formData,
        phone: '',
        message: `I'm interested in ${property.title}`
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-agent-card">
      <div className="agent-header">
        <div className="agent-avatar">
          {agent.agencyLogo ? (
            <img src={agent.agencyLogo} alt={agent.agencyName || agent.fullName} />
          ) : (
            <div className="agent-initials">
              {getInitials(agent.agencyName || agent.fullName)}
            </div>
          )}
        </div>
        <div className="agent-details">
          <h3>{agent.agencyName || agent.fullName}</h3>
          {agent.role === 'agent' && <p className="agent-role">Licensed Agent</p>}
        </div>
      </div>

      {agent.agencyAddress && (
        <div className="agent-info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{agent.agencyAddress}</span>
        </div>
      )}

      {agent.email && (
        <div className="agent-info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
        </div>
      )}

      {agent.phone && (
        <div className="agent-info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <a href={`tel:${agent.phone}`}>{formatPhoneNumber(agent.phone)}</a>
        </div>
      )}

      {agent.licenseNumber && (
        <div className="agent-license">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>License: {agent.licenseNumber}</span>
        </div>
      )}

      <button
        className="contact-agent-btn"
        onClick={() => setShowContactForm(!showContactForm)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        {showContactForm ? 'Hide Contact Form' : 'Contact Agent'}
      </button>

      {showContactForm && (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Your Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+243 XX XXX XXXX"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactAgentCard;
