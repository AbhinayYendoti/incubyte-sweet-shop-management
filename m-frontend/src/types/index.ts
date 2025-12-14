/**
 * Backend SweetItem model
 * Matches: com.abhi.sweetshop.model.SweetItem
 * Note: Backend now includes category and imageUrl fields
 */
export interface SweetItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
}

/**
 * Frontend Sweet type (extends backend model with UI-specific fields)
 * Note: Backend doesn't have category, quantity, image, origin
 * These are handled gracefully in the UI
 */
export interface Sweet extends SweetItem {
  // Backend fields
  id: number;
  name: string;
  description?: string;
  price: number;
  // Frontend-only fields (for UI display)
  quantity?: number;
  category?: string;
  image?: string;
  origin?: string;
}

/**
 * Backend User model
 * Matches: com.abhi.sweetshop.model.User
 */
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

/**
 * Login Response
 * Matches: com.abhi.sweetshop.dto.auth.LoginResponse
 */
export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

/**
 * Register Request
 * Matches: com.abhi.sweetshop.dto.auth.RegisterRequest
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Login Request
 * Matches: com.abhi.sweetshop.dto.auth.LoginRequest
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Purchase Request
 * Matches: SweetController.PurchaseRequest
 */
export interface PurchaseRequest {
  quantity: number;
}

/**
 * Purchase Response
 * Matches: SweetController.PurchaseResponse
 */
export interface PurchaseResponse {
  sweetId: number;
  sweetName: string;
  totalAmount: number;
  quantity: number;
}

/**
 * Order Request
 * Matches: OrderController.OrderRequest
 */
export interface OrderRequest {
  customerName: string;
  totalAmount: number;
}

/**
 * Order model
 * Matches: com.abhi.sweetshop.model.Order
 */
export interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  createdAt: string;
}

export interface CartItem {
  sweet: Sweet;
  quantity: number;
}

export type Category = 'all' | 'mithai' | 'ladoo' | 'barfi' | 'halwa' | 'namkeen';
