import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropertyForm from '../components/property/PropertyForm';
import Loading from '../components/common/Loading';
import propertyService from '../services/propertyService';
import { toast } from 'react-toastify';
import './EditProperty.css';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAgent } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAgent()) {
      navigate('/');
      return;
    }

    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, isAgent]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getPropertyById(id);

      // Check if user owns this property
      if (data.data.owner._id !== user._id) {
        toast.error('You can only edit your own properties');
        navigate('/dashboard');
        return;
      }

      setProperty(data.data);
    } catch (error) {
      toast.error('Failed to load property');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!property) {
    return null;
  }

  return (
    <div className="edit-property-page">
      <PropertyForm initialData={property} isEdit={true} />
    </div>
  );
};

export default EditProperty;
