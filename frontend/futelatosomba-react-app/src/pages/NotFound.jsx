import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <div className="error-code">404</div>
          <img src="/drc-flag.png" alt="DRC Flag" className="drc-flag-mini" width="80" height="53" />
        </div>

        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-text">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="not-found-actions">
          <Button variant="primary" size="large" onClick={() => navigate('/')}>
            Go Home
          </Button>
          <Button variant="outline" size="large" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
