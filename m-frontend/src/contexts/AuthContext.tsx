import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginResponse, RegisterRequest, LoginRequest } from '@/types';
import { api, apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      // Decode JWT to get user info (basic implementation)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || payload.authorities?.[0]?.authority || 'USER';
        setUser({
          id: payload.sub ? parseInt(payload.sub) : 0,
          email: payload.sub || payload.email || '',
          name: payload.name || payload.username || '',
          role: role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
        });
      } catch (error) {
        // Invalid token, clear it
        apiClient.clearToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      } as LoginRequest);

      const { token, username, role } = response.data;

      // Store token
      apiClient.setToken(token);

      // Set user
      setUser({
        id: 0, // Backend doesn't return user ID in login response
        email,
        name: username,
        role: role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
      });

      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Login failed. Please check your credentials.';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.post<User>(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
      } as RegisterRequest);

      // Registration successful - user needs to login
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAdmin: user?.role === 'ADMIN',
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
