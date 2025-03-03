// src/core/infrastructure/api/apiClient.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

// Create a base API client with default configuration
const createApiClient = (baseUrl: string = '/api'): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000 // 10 seconds
  };

  const instance = axios.create(config);

  // Request interceptor for handling auth tokens, etc.
  instance.interceptors.request.use(
    (config) => {
      // You can add auth tokens or other headers here
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling errors
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle specific error codes
      if (error.response) {
        // Handle 401 Unauthorized
        if (error.response.status === 401) {
          // Redirect to login or refresh token
          console.error('Unauthorized, please login again');
        }
        // Handle 403 Forbidden
        else if (error.response.status === 403) {
          console.error('You do not have permission to access this resource');
        }
        // Handle 404 Not Found
        else if (error.response.status === 404) {
          console.error('Resource not found');
        }
        // Handle 500 Internal Server Error
        else if (error.response.status >= 500) {
          console.error('Server error, please try again later');
        }
      } else if (error.request) {
        // Network error
        console.error('Network error, please check your connection');
      } else {
        console.error('An error occurred:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export default API client
export const apiClient = createApiClient();



