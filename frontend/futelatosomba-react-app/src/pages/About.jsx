import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1 className="about-title">{t('aboutUs')}</h1>
          <p className="about-subtitle">{t('propertyPlatform')}</p>
        </div>
      </div>

      <div className="container">
        <div className="about-content">
          <section className="about-section">
            <h2 className="section-title">{t('ourMission')}</h2>
            <p className="section-text">
              Futelatosomba is dedicated to revolutionizing the property market in the Democratic Republic of Congo.
              We provide a modern, transparent, and efficient platform connecting property seekers with owners and agents
              across all major cities in the DRC.
            </p>
            <p className="section-text">
              Our mission is to make property search and listing simple, accessible, and reliable for everyone in the DRC,
              whether you're looking to buy, rent, or sell properties.
            </p>
          </section>

          <section className="about-section">
            <h2 className="section-title">{t('ourVision')}</h2>
            <p className="section-text">
              We envision a future where finding your dream home or perfect commercial space in the DRC is as easy
              as a few clicks. Through technology and innovation, we're building trust and transparency in the
              Congolese property market.
            </p>
          </section>

          <section className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: '#007FFF' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="feature-title">Nationwide Coverage</h3>
              <p className="feature-text">
                Properties across all major cities in the DRC including Kinshasa, Lubumbashi, Goma, and more.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: '#FFD700' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Verified Listings</h3>
              <p className="feature-text">
                All property listings are verified to ensure accuracy and authenticity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: '#CE1126' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="feature-title">Professional Agents</h3>
              <p className="feature-text">
                Connect with experienced property agents who understand the local market.
              </p>
            </div>
          </section>

          <section className="about-section team-section">
            <h2 className="section-title">Our Leadership</h2>
            <div className="team-member-card">
              <div className="team-member-image">
                <img src="/odiber-jette.jpg" alt="Odiber Jette" />
              </div>
              <div className="team-member-info">
                <h3 className="team-member-name">Odiber Jette</h3>
                <p className="team-member-role">Founder & Lead Property Specialist</p>
                <p className="team-member-bio">
                  This platform is dedicated to Odiber Jette, who brings many years of experience in the
                  Democratic Republic of Congo property market. Her expertise and dedication have shaped
                  Futelatosomba into a trusted platform for property seekers and owners across the nation.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="section-title">Multi-Language Support</h2>
            <p className="section-text">
              Futelatosomba is available in English, French, and Lingala, making it accessible to all Congolese
              citizens and international visitors. We believe language should never be a barrier to finding your perfect property.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
