import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await api.get('/users/me');
          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (err) {
          console.error('Error verifying token:', err);
          localStorage.removeItem('authToken');
          setUser(null);
          setError(err.message);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;
      const userData = response.data.user;

      localStorage.setItem('authToken', token);
      setUser(userData);
      setError(null);
      return { success: true, user: userData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      let firstName = userData.name;
      let lastName = '';
      if (userData.name && userData.name.includes(' ')) {
        const nameParts = userData.name.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role,
        ...(userData.role === 'agent' && {
          agencyName: userData.agencyName,
          licenseNumber: userData.licenseNumber,
          agencyAddress: userData.agencyAddress,
          agencyLogo: userData.agencyLogo
        })
      };

      const response = await api.post('/auth/register', payload);
      const token = response.data.token;
      const registeredUser = response.data.user;

      localStorage.setItem('authToken', token);
      setUser(registeredUser);
      setError(null);
      return { success: true, user: registeredUser };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
  };
  
  const isAgent = () => {
    return user && user.role === 'agent';
  };

  // User-specific data fetchers and modifiers
  const fetchUserSavedSearches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch('/api/users/searches', {
        headers: { 'x-auth-token': token }
      });
      if (!response.ok) throw new Error('Failed to fetch saved searches');
      const data = await response.json();
      return { success: true, searches: data };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteUserSavedSearch = async (searchId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`/api/users/searches/${searchId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (!response.ok) throw new Error('Failed to delete saved search');
      toast.success('Saved search deleted!');
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPropertyAlerts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch('/api/users/alerts', {
        headers: { 'x-auth-token': token }
      });
      if (!response.ok) throw new Error('Failed to fetch property alerts');
      const data = await response.json();
      return { success: true, alerts: data };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteUserPropertyAlert = async (alertId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`/api/users/alerts/${alertId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (!response.ok) throw new Error('Failed to delete property alert');
      toast.success('Property alert deleted!');
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, logout, isAgent, register, fetchUserSavedSearches, deleteUserSavedSearch, fetchUserPropertyAlerts, deleteUserPropertyAlert }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};