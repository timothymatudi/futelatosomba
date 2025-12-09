import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium', fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-container">
          <div className={`loading-spinner loading-${size}`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={`loading-spinner loading-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
