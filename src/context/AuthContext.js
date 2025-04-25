// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  register as apiRegister, 
  login as apiLogin, 
  googleLogin as apiGoogleLogin,
  logout as apiLogout,
  getCurrentUser
} from '../api/authApi';

// Create context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await getCurrentUser();
        setCurrentUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        // Clear invalid token
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiRegister(userData);
      
      // Save token and set user
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      
      // Load user data
      const userResponse = await getCurrentUser();
      setCurrentUser(userResponse.data);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiLogin(credentials);
      
      // Save token and set user
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      
      // Load user data
      const userResponse = await getCurrentUser();
      setCurrentUser(userResponse.data);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const googleLogin = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiGoogleLogin(userData);
      
      // Save token and set user
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      
      // Load user data
      const userResponse = await getCurrentUser();
      setCurrentUser(userResponse.data);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      
      await apiLogout();
      
      // Remove token and reset state
      localStorage.removeItem('token');
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Logout failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    googleLogin,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;