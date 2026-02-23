// API configuration and axios instance
import axios from 'axios';
import { getCsrfToken, invalidateCsrfToken, CSRF_HEADER_NAME } from '../utils/csrf';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Include cookies in requests for CSRF
});

// Request interceptor to add auth token and CSRF token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers['x-auth-token'] = token;
    }

    // Add CSRF token using the utility function
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      config.headers[CSRF_HEADER_NAME] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
        window.location.href = '/login';
      }

      // Handle 403 CSRF errors - invalidate cache and retry once
      if (error.response.status === 403 &&
          (error.response.data?.error === 'CSRF token missing' ||
           error.response.data?.error === 'Invalid CSRF token')) {
        // Only retry once to avoid infinite loops
        if (!error.config._csrfRetry) {
          error.config._csrfRetry = true;
          invalidateCsrfToken();
          const newToken = await getCsrfToken();
          if (newToken) {
            error.config.headers[CSRF_HEADER_NAME] = newToken;
            return api(error.config);
          }
        }
        return Promise.reject(new Error('Security token error. Please refresh the page and try again.'));
      }

      // Handle other errors
      const message = error.response.data?.error || error.response.data?.message || error.response.data?.msg || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Failed to connect to server. Please check your internet connection.'));
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
