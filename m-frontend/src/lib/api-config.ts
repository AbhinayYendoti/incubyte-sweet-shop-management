/**
 * API Configuration
 * Centralized configuration for backend API base URL
 * In development, Vite proxy handles /api requests
 * In production, use full URL or environment variable
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:8080/api');

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  SWEETS: {
    BASE: '/sweets',
    BY_ID: (id: string | number) => `/sweets/${id}`,
    PURCHASE: (id: string | number) => `/sweets/${id}/purchase`,
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string | number) => `/orders/${id}`,
  },
} as const;

