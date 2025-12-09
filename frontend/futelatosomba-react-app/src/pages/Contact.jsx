import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-title">{t('contactUs')}</h1>
          <p className="contact-subtitle">We'd love to hear from you</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2 className="info-title">Get in Touch</h2>
            <p className="info-text">
              Have questions about listing your property or finding your dream home?
              Our team is here to help you every step of the way.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon" style={{ backgroundColor: '#007FFF' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="contact-label">Address</h3>
                  <p className="contact-value">Kinshasa, Democratic Republic of Congo</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon" style={{ backgroundColor: '#FFD700' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="contact-label">Email</h3>
                  <p className="contact-value">info@futelatosomba.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon" style={{ backgroundColor: '#CE1126' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="contact-label">Phone</h3>
                  <p className="contact-value">+243 XX XXX XXXX</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2 className="form-title">{t('sendMessage')}</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <Input
                label={t('yourName')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                label={t('yourEmail')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                label={t('yourMessage')}
                name="message"
                type="textarea"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Button type="submit" variant="primary" size="large" fullWidth loading={loading}>
                {t('sendMessage')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
