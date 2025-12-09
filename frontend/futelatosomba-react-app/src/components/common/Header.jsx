import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGES, LANGUAGE_NAMES } from '../../utils/constants';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout, isAgent } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="header-logo" onClick={closeMobileMenu}>
            <img src="/drc-flag.png" alt="DRC Flag" className="congo-flag" width="45" height="30" />
            <span className="logo-text">Futelatosomba</span>
          </Link>

          <nav className={`header-nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'nav-active' : ''}`}
              onClick={closeMobileMenu}
            >
              {t('home')}
            </Link>

            <Link
              to="/properties"
              className={`nav-link ${isActive('/properties') ? 'nav-active' : ''}`}
              onClick={closeMobileMenu}
            >
              {t('properties')}
            </Link>

            <Link
              to="/about"
              className={`nav-link ${isActive('/about') ? 'nav-active' : ''}`}
              onClick={closeMobileMenu}
            >
              {t('about')}
            </Link>

            <Link
              to="/contact"
              className={`nav-link ${isActive('/contact') ? 'nav-active' : ''}`}
              onClick={closeMobileMenu}
            >
              {t('contact')}
            </Link>

            <Link
              to="/find-agents"
              className={`nav-link ${isActive('/find-agents') ? 'nav-active' : ''}`}
              onClick={closeMobileMenu}
            >
              Find Agents
            </Link>

            <Link
              to="/house-prices"
              className={`nav-link ${isActive('/house-prices') ? 'nav-active' : ''}`}
              onClick={closeMobileMenu}
            >
              Sold Prices
            </Link>

            <Link
              to="/valuation"
              className={`nav-link ${isActive('/valuation') ? 'nav-active' : ''}`}
              onClick={closeMobileMenu}
            >
              Valuation
            </Link>

            {isAuthenticated && isAgent() && (
              <Link
                to="/agent-dashboard"
                className={`nav-link nav-highlight ${isActive('/agent-dashboard') ? 'nav-active' : ''}`}
                onClick={closeMobileMenu}
              >
                {t('dashboard')}
              </Link>
            )}

            <div className="mobile-auth-buttons">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="nav-btn nav-btn-outline" onClick={closeMobileMenu}>
                    {t('login')}
                  </Link>
                  <Link to="/register" className="nav-btn nav-btn-primary" onClick={closeMobileMenu}>
                    {t('register')}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="nav-btn nav-btn-outline" onClick={closeMobileMenu}>
                    {t('dashboard')}
                  </Link>
                  <button className="nav-btn nav-btn-primary" onClick={handleLogout}>
                    {t('logout')}
                  </button>
                </>
              )}
            </div>
          </nav>

          <div className="header-actions">
            <div className="language-dropdown">
              <button
                className="language-toggle"
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              >
                {LANGUAGE_NAMES[language]}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {languageMenuOpen && (
                <div className="language-menu">
                  {Object.values(LANGUAGES).map((lang) => (
                    <button
                      key={lang}
                      className={`language-option ${language === lang ? 'language-active' : ''}`}
                      onClick={() => {
                        changeLanguage(lang);
                        setLanguageMenuOpen(false);
                      }}
                    >
                      {LANGUAGE_NAMES[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="user-dropdown">
                <button
                  className="user-toggle"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="user-menu">
                    <Link
                      to="/dashboard"
                      className="user-menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('dashboard')}
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className="user-menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                    <button className="user-menu-item user-menu-logout" onClick={handleLogout}>
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn auth-btn-outline">
                  {t('login')}
                </Link>
                <Link to="/register" className="auth-btn auth-btn-primary">
                  {t('register')}
                </Link>
              </div>
            )}

            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
