import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL, PAGINATION } from '../utils/constants';
import { extractErrorMessage } from '../utils/formatters';

const PropertyContext = createContext(null);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    pages: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    listingType: '',
    city: '',
    commune: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    features: [], // Added
    minYearBuilt: '', // Added
    maxYearBuilt: '', // Added
    status: '', // Added
    isPremium: false, // Added, boolean type
    owner: '', // Added
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Fetch properties with filters
  const fetchProperties = useCallback(async (customFilters = {}, page = 1) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: pagination.limit,
        ...filters,
        ...customFilters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await axios.get(`${API_BASE_URL}/properties`, { params });

      setProperties(response.data.properties || response.data.data || []);
      setPagination({
        page: response.data.page || page,
        limit: response.data.limit || pagination.limit,
        total: response.data.total || 0,
        pages: response.data.pages || Math.ceil((response.data.total || 0) / pagination.limit)
      });

      return { success: true };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  // Fetch single property
  const fetchProperty = async (id) => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/properties/${id}`);

      setCurrentProperty(response.data.property || response.data.data);
      return { success: true, property: response.data.property || response.data.data };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Create property
  const createProperty = async (propertyData) => {
    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Property created successfully!');
      return { success: true, property: response.data.property || response.data.data };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update property
  const updateProperty = async (id, propertyData) => {
    try {
      setLoading(true);

      const response = await axios.put(`${API_BASE_URL}/properties/${id}`, propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Property updated successfully!');
      return { success: true, property: response.data.property || response.data.data };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Delete property
  const deleteProperty = async (id) => {
    try {
      setLoading(true);

      await axios.delete(`${API_BASE_URL}/properties/${id}`);

      // Remove from local state
      setProperties(prev => prev.filter(p => p._id !== id));

      toast.success('Property deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's properties
  const fetchUserProperties = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/properties/user/my-properties`);

      setProperties(response.data.properties || response.data.data || []);
      return { success: true, properties: response.data.properties || response.data.data };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update property status
  const updatePropertyStatus = async (id, status) => {
    try {
      setLoading(true);

      const response = await axios.patch(`${API_BASE_URL}/properties/${id}/status`, { status });

      // Update in local state
      setProperties(prev =>
        prev.map(p => (p._id === id ? { ...p, status } : p))
      );

      toast.success('Property status updated!');
      return { success: true, property: response.data.property || response.data.data };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (id) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/properties/${id}/favorite`);

      toast.success(data.message || 'Favorite updated!');
      return { success: true };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get favorites
  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/properties/favorites`);

      const fetchedProperties = response.data.properties || response.data.data || [];
      setProperties(fetchedProperties); // Update context state
      return { success: true, properties: fetchedProperties }; // Return properties
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Contact property owner
  const contactOwner = async (propertyId, name, email, phone, message) => { // Updated parameters
    try {
      const response = await axios.post(`${API_BASE_URL}/properties/${propertyId}/contact-agent`, { // Updated endpoint
        name,
        email,
        phone,
        message
      });

      toast.success('Inquiry sent successfully!'); // Updated message
      return { success: true };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Search properties
  const searchProperties = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    fetchProperties({ search: searchTerm }, 1);
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      propertyType: '',
      listingType: '',
      city: '',
      commune: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      features: [], // Added
      minYearBuilt: '', // Added
      maxYearBuilt: '', // Added
      status: '', // Added
      isPremium: false, // Added, boolean type
      owner: '', // Added
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  // Change page
  const changePage = (newPage) => {
    fetchProperties({}, newPage);
  };

  const value = {
    properties,
    currentProperty,
    loading,
    pagination,
    filters,
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchUserProperties,
    updatePropertyStatus,
    toggleFavorite,
    fetchFavorites,
    contactOwner,
    searchProperties,
    updateFilters,
    resetFilters,
    changePage,
    setCurrentProperty
  };

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};

export default PropertyContext;
