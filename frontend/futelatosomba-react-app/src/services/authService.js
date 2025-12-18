// Authentication service
import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Get user from localStorage
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Email verification
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};

export default authService;
