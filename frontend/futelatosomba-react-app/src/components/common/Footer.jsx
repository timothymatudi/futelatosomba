import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/drc-flag.png" alt="DRC Flag" className="footer-flag" width="60" height="40" />
              <h3>Futelatosomba</h3>
            </div>
            <p className="footer-description">
              {t('propertyPlatform')}
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">{t('properties')}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/properties?listingType=sale">{t('forSale')}</Link>
              </li>
              <li>
                <Link to="/properties?listingType=rent">{t('forRent')}</Link>
              </li>
              <li>
                <Link to="/properties?city=Kinshasa">Kinshasa</Link>
              </li>
              <li>
                <Link to="/properties?city=Lubumbashi">Lubumbashi</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">{t('aboutUs')}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about">{t('about')}</Link>
              </li>
              <li>
                <Link to="/contact">{t('contact')}</Link>
              </li>
              <li>
                <Link to="/register">{t('register')}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">{t('contactUs')}</h4>
            <ul className="footer-contact">
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Kinshasa, DRC</span>
              </li>
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>info@futelatosomba.com</span>
              </li>
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+243 XX XXX XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              &copy; {currentYear} Futelatosomba. {t('allRightsReserved')}.
            </p>
            <div className="footer-legal">
              <Link to="/privacy">{t('privacyPolicy')}</Link>
              <Link to="/terms">{t('termsOfService')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
