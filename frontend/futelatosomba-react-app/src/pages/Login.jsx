import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LoginForm from '../components/auth/LoginForm';
import './AuthPages.css';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSuccess = () => {
    navigate(from, { replace: true });
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
            <h2 className="auth-title">{t('login')}</h2>
            <p className="auth-subtitle">{t('welcome')}</p>
          </div>

          <LoginForm onSuccess={handleSuccess} />

          <div className="auth-footer">
            <p>
              {t('dontHaveAccount')}{' '}
              <Link to="/register" className="auth-link">
                {t('register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
