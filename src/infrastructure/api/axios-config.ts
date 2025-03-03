// src/infrastructure/api/axios-config.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle specific error codes
    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        // Handle token refresh or redirect to login
      }

      if (error.response.status === 404) {
        console.error('Resource not found');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
