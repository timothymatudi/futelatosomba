import api from './api';

const userService = {
  getSavedSearches: () => api.get('/users/searches'),
  createSavedSearch: (payload) => api.post('/users/searches', payload),
  deleteSavedSearch: (id) => api.delete(`/users/searches/${id}`),

  getPropertyAlerts: () => api.get('/users/alerts'),
  createPropertyAlert: (payload) => api.post('/users/alerts', payload),
  deletePropertyAlert: (id) => api.delete(`/users/alerts/${id}`),
};

export default userService;
