import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';
import RegisterForm from '../components/auth/RegisterForm';
import './AuthPages.css';

const Register = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSuccess = (user) => {
    const userName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'User';
    toast.success(t('welcomeUser', { name: userName }));
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/drc-flag.png" alt="DRC Flag" className="auth-flag" width="60" height="40" />
              <h1>Futelatosomba</h1>
            </div>
            <h2 className="auth-title">{t('register')}</h2>
            <p className="auth-subtitle">Create your account</p>
          </div>

          <RegisterForm onSuccess={handleSuccess} />

          <div className="auth-footer">
            <p>
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="auth-link">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
