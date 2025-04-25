// src/api/authApi.js
import axios from 'axios';
import api from './api';

// Auth API calls
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const googleLogin = async (userData) => {
  const response = await api.post('/auth/google', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.get('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};