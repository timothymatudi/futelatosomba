import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
        setMessage(response.message || 'Email verified successfully!');

        toast.success('Email verified successfully! You can now log in.');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
          'Verification failed. The link may have expired or is invalid.'
        );
        toast.error('Email verification failed.');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  const handleResendVerification = async () => {
    const email = prompt('Please enter your email address to resend verification:');

    if (!email) return;

    setResending(true);
    try {
      await authService.resendVerification(email);
      toast.success('Verification email sent! Please check your inbox.');
      setMessage('A new verification email has been sent. Please check your inbox.');
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        'Failed to resend verification email.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        <div className="verify-email-card">
          {/* Icon based on status */}
          <div className={`status-icon ${status}`}>
            {status === 'verifying' && (
              <div className="spinner"></div>
            )}
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

          {/* Title */}
          <h1 className="verify-title">
            {status === 'verifying' && 'Verifying Your Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          {/* Message */}
          <p className="verify-message">{message}</p>

          {/* Actions based on status */}
          <div className="verify-actions">
            {status === 'success' && (
              <>
                <Link to="/login" className="btn btn-primary">
                  Go to Login
                </Link>
                <Link to="/" className="btn btn-secondary">
                  Back to Home
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <button
                  onClick={handleResendVerification}
                  className="btn btn-primary"
                  disabled={resending}
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
                <Link to="/login" className="btn btn-secondary">
                  Try Logging In
                </Link>
              </>
            )}

            {status === 'verifying' && (
              <p className="loading-text">Please wait while we verify your email...</p>
            )}
          </div>

          {/* Help text */}
          <div className="help-text">
            <p>Need help? <Link to="/contact">Contact Support</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
