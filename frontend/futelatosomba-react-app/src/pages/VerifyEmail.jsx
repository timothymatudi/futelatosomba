import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || t('emailVerifiedTitle'));
        toast.success(t('emailVerifiedTitle'));
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
          'Verification failed. The link may have expired or is invalid.'
        );
        toast.error(t('verificationFailedTitle'));
      }
    };

    verifyEmail();
  }, [location, navigate, t]);

  const handleResendVerification = async () => {
    const email = prompt(t('yourEmail') + ':');
    if (!email) return;

    setResending(true);
    try {
      await authService.resendVerification(email);
      toast.success('Verification email sent! Please check your inbox.');
      setMessage('A new verification email has been sent. Please check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  const titles = {
    verifying: t('verifyingEmail'),
    success: t('emailVerifiedTitle'),
    error: t('verificationFailedTitle'),
  };

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className={`status-icon ${status}`}>
            {status === 'verifying' && <div className="spinner"></div>}
            {status === 'success' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h1 className="verify-title">{titles[status]}</h1>
          <p className="verify-message">{message}</p>

          <div className="verify-actions">
            {status === 'success' && (
              <>
                <Link to="/login" className="btn btn-primary">{t('goToLogin')}</Link>
                <Link to="/" className="btn btn-secondary">{t('backToHome')}</Link>
              </>
            )}
            {status === 'error' && (
              <>
                <button onClick={handleResendVerification} className="btn btn-primary" disabled={resending}>
                  {resending ? t('sending') : t('resendVerificationEmail')}
                </button>
                <Link to="/login" className="btn btn-secondary">{t('tryLoggingIn')}</Link>
              </>
            )}
            {status === 'verifying' && (
              <p className="loading-text">{t('pleaseWaitVerify')}</p>
            )}
          </div>

          <div className="help-text">
            <p>{t('needHelp')} <Link to="/contact">{t('contactSupport')}</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
