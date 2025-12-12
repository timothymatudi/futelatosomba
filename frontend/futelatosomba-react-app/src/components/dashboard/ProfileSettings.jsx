import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import { toast } from 'react-toastify';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    whatsappNumber: user?.whatsappNumber || '',
    agencyName: user?.agencyName || '',
    notificationPreferences: {
      emailAlerts: user?.notificationPreferences?.emailAlerts !== false,
      propertyMatches: user?.notificationPreferences?.propertyMatches !== false,
      priceChanges: user?.notificationPreferences?.priceChanges !== false,
      newsletter: user?.notificationPreferences?.newsletter !== false,
    }
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name.startsWith('notification_')) {
      const notifKey = name.replace('notification_', '');
      setFormData(prev => ({
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [notifKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await updateProfile(formData);

      if (!result.success) {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings">
      <div className="settings-header">
        <h2>Profile Settings</h2>
        <p>Update your personal information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h3 className="section-title">Personal Information</h3>

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+243 xxx xxx xxx"
              />
            </div>

            <div className="form-group">
              <label htmlFor="whatsappNumber">WhatsApp Number</label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="+243 xxx xxx xxx"
              />
            </div>
          </div>

          {user?.role === 'agent' && (
            <div className="form-group">
              <label htmlFor="agencyName">Agency Name</label>
              <input
                type="text"
                id="agencyName"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                placeholder="Your real estate agency"
              />
            </div>
          )}
        </div>

        <div className="settings-section">
          <h3 className="section-title">Notification Preferences</h3>

          <div className="notification-options">
            <div className="notification-item">
              <input
                type="checkbox"
                id="emailAlerts"
                name="notification_emailAlerts"
                checked={formData.notificationPreferences.emailAlerts}
                onChange={handleChange}
              />
              <label htmlFor="emailAlerts">
                <strong>Email Alerts</strong>
                <span>Receive important updates via email</span>
              </label>
            </div>

            <div className="notification-item">
              <input
                type="checkbox"
                id="propertyMatches"
                name="notification_propertyMatches"
                checked={formData.notificationPreferences.propertyMatches}
                onChange={handleChange}
              />
              <label htmlFor="propertyMatches">
                <strong>Property Matches</strong>
                <span>Get notified when properties match your saved searches</span>
              </label>
            </div>

            <div className="notification-item">
              <input
                type="checkbox"
                id="priceChanges"
                name="notification_priceChanges"
                checked={formData.notificationPreferences.priceChanges}
                onChange={handleChange}
              />
              <label htmlFor="priceChanges">
                <strong>Price Changes</strong>
                <span>Be alerted when favorited properties change price</span>
              </label>
            </div>

            <div className="notification-item">
              <input
                type="checkbox"
                id="newsletter"
                name="notification_newsletter"
                checked={formData.notificationPreferences.newsletter}
                onChange={handleChange}
              />
              <label htmlFor="newsletter">
                <strong>Newsletter</strong>
                <span>Receive our weekly property newsletter</span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
