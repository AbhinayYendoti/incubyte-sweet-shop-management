import { DEFAULT_SWEET_IMAGE } from './constants';

/**
 * API Configuration
 * Centralized configuration for backend API base URL
 * In development, Vite proxy handles /api requests
 * In production, use full URL or environment variable
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:8080/api');

/**
 * Backend base URL (without /api prefix)
 * Used for static resources like images
 */
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8080' : 'http://localhost:8080');

/**
 * Build full image URL from backend imageUrl path
 * @param imageUrl - Relative path from backend (e.g., "/images/sweets/laddu.jpg")
 * @returns Full URL to the image (e.g., "http://localhost:8080/images/sweets/laddu.jpg")
 */
export const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) {
    return DEFAULT_SWEET_IMAGE;
  }
  // If already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // If it's a relative path, prepend backend base URL
  return `${BACKEND_BASE_URL}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
};

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

