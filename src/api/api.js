import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true //Include cookies with requests
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Audio API calls
export const uploadAndProcessAudio = async (formData) => {
  const response = await api.post('/audio/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Summary API calls
export const getAllSummaries = async () => {
  const response = await api.get('/summary');
  return response.data;
};

export const getSummaryById = async (id) => {
  const response = await api.get(`/summary/${id}`);
  return response.data;
};

export const updateSummary = async (id, summaryData) => {
  const response = await api.put(`/summary/${id}`, summaryData);
  return response.data;
};

export const deleteSummary = async (id) => {
  const response = await api.delete(`/summary/${id}`);
  return response.data;
};

export default api;