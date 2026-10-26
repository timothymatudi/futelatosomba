import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await requestPasswordReset(email);
      if (result.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-container">
          <div className="forgot-card">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>

            <h1>{t('checkYourEmail')}</h1>
            <p>{t('checkYourEmailSent', { email })}</p>

            <div className="email-tips">
              <p className="tip-title">{t('didntReceiveEmail')}</p>
              <ul>
                <li>{t('tipCheckSpam')}</li>
                <li>{t('tipCheckEmailAddress')}</li>
                <li>{t('tipWaitMinutes')}</li>
              </ul>
            </div>

            <div className="forgot-actions">
              <button className="btn-resend" onClick={() => setSubmitted(false)}>
                {t('tryDifferentEmail')}
              </button>
              <Link to="/login" className="btn-back">
                {t('backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-container">
        <div className="forgot-card">
          <div className="forgot-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <h1>{t('forgotPasswordTitle')}</h1>
          <p className="forgot-description">{t('forgotPasswordDesc')}</p>

          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <label htmlFor="email">{t('emailAddress')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('enterYourEmail')}
                required
                autoFocus
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? t('sending') : t('sendResetLink')}
            </button>
          </form>

          <div className="forgot-footer">
            <Link to="/login" className="link-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
