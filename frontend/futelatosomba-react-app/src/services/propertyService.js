// Property service
import api from './api';

const propertyService = {
  // Get all properties with filters
  getAllProperties: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Get property statistics
  getStats: async () => {
    const response = await api.get('/properties/stats/overview');
    return response.data;
  },

  // Add property to favorites
  addToFavorites: async (propertyId) => {
    const response = await api.post(`/properties/${propertyId}/favorite`);
    return response.data;
  },

  // Remove property from favorites
  removeFromFavorites: async (propertyId) => {
    const response = await api.delete(`/properties/${propertyId}/favorite`);
    return response.data;
  },

  // Get user's properties
  getUserProperties: async (userId) => {
    const response = await api.get(`/users/${userId}/properties`);
    return response.data;
  },

  // Get user's favorite properties
  getUserFavorites: async () => {
    const response = await api.get('/users/favorites');
    return response.data;
  },

  // Upload property images
  uploadImages: async (propertyId, images) => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    const response = await api.post(`/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default propertyService;
