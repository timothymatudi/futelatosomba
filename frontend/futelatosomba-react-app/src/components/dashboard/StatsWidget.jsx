import React from 'react';
import './StatsWidget.css';

const StatsWidget = ({ icon, value, label, color = '#007FFF' }) => {
  return (
    <div className="stats-widget">
      <div className="stats-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stats-info">
        <div className="stats-value">{value}</div>
        <div className="stats-label">{label}</div>
      </div>
    </div>
  );
};

export default StatsWidget;
