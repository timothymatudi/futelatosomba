import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Correct single instance of error state

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/users/me', {
            headers: {
              'x-auth-token': token
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (err) {
          console.error('Error verifying token:', err);
          localStorage.removeItem('token');
          setUser(null);
          setError(err.message); // Set error here
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: emailOrUsername, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setError(null);
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => { // Added register function
    setLoading(true);
    try {
      let firstName = userData.name;
      let lastName = '';
      if (userData.name && userData.name.includes(' ')) {
        const nameParts = userData.name.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      const username = userData.email.split('@')[0] + Math.floor(Math.random() * 10000);

      const payload = {
        username: username,
        email: userData.email,
        password: userData.password,
        firstName,
        lastName,
        phone: userData.phone,
        role: userData.role,
        ...(userData.role === 'agent' && {
          agencyName: userData.agencyName,
          licenseNumber: userData.licenseNumber,
          agencyAddress: userData.agencyAddress,
          agencyLogo: userData.agencyLogo
        })
      };

      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setError(null);
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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