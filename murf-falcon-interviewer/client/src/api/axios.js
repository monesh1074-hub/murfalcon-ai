import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('murf_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Token error:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('murf_token');
        localStorage.removeItem('murf_user');
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default API;