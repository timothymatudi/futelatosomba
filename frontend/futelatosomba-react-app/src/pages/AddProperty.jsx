import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropertyForm from '../components/property/PropertyForm';
import './AddProperty.css';

const AddProperty = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAgent } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAgent()) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isAgent, navigate]);

  if (!isAuthenticated || !isAgent()) {
    return null;
  }

  return (
    <div className="add-property-page">
      <PropertyForm />
    </div>
  );
};

export default AddProperty;
