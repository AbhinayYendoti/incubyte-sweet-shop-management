import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './api-config';

/**
 * Centralized API Client
 * Handles JWT token storage and automatic header injection
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: Add JWT token to all requests
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle 401 errors (unauthorized)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear token and redirect to login
          this.clearToken();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get stored JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Store JWT token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  /**
   * Clear JWT token from localStorage
   */
  clearToken(): void {
    localStorage.removeItem('jwt_token');
  }

  /**
   * Get axios instance for making API calls
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience methods
export const api = apiClient.getClient();

