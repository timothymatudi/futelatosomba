import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api'; // Use configured api instance instead of raw axios
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { extractErrorMessage } from '../utils/formatters';
import { fetchCsrfToken } from '../utils/csrf';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage and fetch CSRF token
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Fetch CSRF token on app initialization
        await fetchCsrfToken();

        const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Set api default header
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Clear auth data
  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    delete api.defaults.headers.common['Authorization'];
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;

      // Save to state
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));

      // Set api default header
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await api.post('/auth/register', userData);

      const { token: newToken, user: newUser } = response.data;

      // Save to state
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(newUser));

      // Set api default header
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      toast.success('Registration successful!');
      return { success: true, user: newUser };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    clearAuth();
    toast.info('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);

      const response = await api.put('/auth/profile', updates);

      const updatedUser = response.data.user;

      setUser(updatedUser);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      toast.success('Profile updated successfully!');
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);

      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);

      await api.post('/auth/forgot-password', { email });

      toast.success('Password reset link sent to your email!');
      return { success: true };
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is agent or admin
  const isAgent = () => {
    return user?.role === 'agent' || user?.role === 'admin';
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    hasRole,
    isAgent,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
