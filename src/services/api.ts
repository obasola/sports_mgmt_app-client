// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Log request for debugging
        console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
        return response
      },
      (error: AxiosError) => {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`)
        
        // Handle common error status codes
        switch (error.response?.status) {
          case 401:
            // Unauthorized - redirect to login
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
            break
          case 403:
            // Forbidden
            console.error('Access forbidden')
            break
          case 404:
            // Not found
            console.error('Resource not found')
            break
          case 500:
            // Server error
            console.error('Server error')
            break
          default:
            console.error('API Error:', error.response?.data || error.message)
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Generic HTTP methods
  public get<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, { params })
  }

  public post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data)
  }

  public put<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data)
  }

  public patch<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data)
  }

  public delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url)
  }

  // Helper methods for common REST patterns
  public async getAll<T>(endpoint: string, params?: any): Promise<T[]> {
    const response = await this.get<T[]>(endpoint, params)
    return response.data
  }

  public async getById<T>(endpoint: string, id: number): Promise<T> {
    const response = await this.get<T>(`${endpoint}/${id}`)
    return response.data
  }

  public async create<T>(endpoint: string, data: Omit<T, 'id'>): Promise<T> {
    const response = await this.post<T>(endpoint, data)
    return response.data
  }

  public async update<T>(endpoint: string, id: number, data: Partial<T>): Promise<T> {
    const response = await this.put<T>(`${endpoint}/${id}`, data)
    return response.data
  }

  public async remove(endpoint: string, id: number): Promise<void> {
    await this.delete(`${endpoint}/${id}`)
  }
}

export const apiService = new ApiService()