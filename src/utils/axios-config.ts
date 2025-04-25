// src/utils/axios-config.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // You can add authentication headers here if needed
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // No response received
      console.error('No response received:', error.request)
    } else {
      // Request setup error
      console.error('Request error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
