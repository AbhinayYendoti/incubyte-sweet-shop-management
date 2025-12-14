import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Sweet, SweetItem, PurchaseRequest, PurchaseResponse } from '@/types';
import { api } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import { DEFAULT_SWEET_IMAGE, DEFAULT_CATEGORY } from '@/lib/constants';
import { AxiosError } from 'axios';

interface SweetsContextType {
  sweets: Sweet[];
  loading: boolean;
  error: string | null;
  addSweet: (sweet: Omit<Sweet, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateSweet: (id: number, sweet: Partial<Sweet>) => Promise<{ success: boolean; error?: string }>;
  deleteSweet: (id: number) => Promise<{ success: boolean; error?: string }>;
  purchaseSweet: (id: number, quantity: number) => Promise<{ success: boolean; error?: string }>;
  refreshSweets: () => Promise<void>;
}

const SweetsContext = createContext<SweetsContextType | undefined>(undefined);

/**
 * Convert backend SweetItem to frontend Sweet
 * Backend doesn't have category, quantity, image, origin - these are set to defaults
 * Handles null/undefined backend fields safely
 */
const toSweet = (item: SweetItem): Sweet => {
  return {
    ...item,
    // Ensure description is explicitly undefined if null (not sent to backend)
    description: item.description ?? undefined,
    // Frontend-only fields with defaults
    quantity: undefined, // Backend doesn't track quantity - allow purchase unless explicitly set to 0
    category: DEFAULT_CATEGORY, // Default category
    image: DEFAULT_SWEET_IMAGE, // Default image
  };
};

export const SweetsProvider = ({ children }: { children: ReactNode }) => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<SweetItem[]>(API_ENDPOINTS.SWEETS.BASE);
      const backendSweets = response.data;
      
      // Safety check: ensure response is an array
      if (!Array.isArray(backendSweets)) {
        console.error('Invalid API response: expected array, got', typeof backendSweets, backendSweets);
        setError('Invalid response format from server');
        setSweets([]);
        return;
      }
      
      setSweets(backendSweets.map(toSweet));
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to load sweets';
      setError(errorMessage);
      console.error('Failed to fetch sweets:', errorMessage, axiosError.response?.status);
      setSweets([]); // Clear sweets on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const addSweet = async (sweet: Omit<Sweet, 'id'>): Promise<{ success: boolean; error?: string }> => {
    try {
      // Backend only accepts: name, description, price
      // Safety checks: ensure required fields are present
      if (!sweet.name || sweet.price === undefined || sweet.price === null) {
        return { success: false, error: 'Name and price are required' };
      }
      
      const sweetItem: Partial<SweetItem> = {
        name: sweet.name,
        description: sweet.description || undefined, // Convert empty string to undefined
        price: sweet.price,
      };

      const response = await api.post<SweetItem>(API_ENDPOINTS.SWEETS.BASE, sweetItem);
      const newSweet = toSweet(response.data);
      
      // Preserve frontend-only fields if provided
      if (sweet.category) newSweet.category = sweet.category;
      if (sweet.image) newSweet.image = sweet.image;
      if (sweet.origin) newSweet.origin = sweet.origin;
      if (sweet.quantity !== undefined) newSweet.quantity = sweet.quantity;

      setSweets(prev => [...prev, newSweet]);
      return { success: true };
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to add sweet';
      return { success: false, error: errorMessage };
    }
  };

  const updateSweet = async (id: number, updates: Partial<Sweet>): Promise<{ success: boolean; error?: string }> => {
    try {
      // Backend only accepts: name, description, price
      // Safety checks: ensure required fields are present if provided
      if (updates.name !== undefined && !updates.name) {
        return { success: false, error: 'Name cannot be empty' };
      }
      if (updates.price !== undefined && (updates.price === null || isNaN(updates.price))) {
        return { success: false, error: 'Price must be a valid number' };
      }
      
      const sweetItem: Partial<SweetItem> = {
        name: updates.name,
        description: updates.description || undefined, // Convert empty string to undefined
        price: updates.price,
      };

      const response = await api.put<SweetItem>(API_ENDPOINTS.SWEETS.BY_ID(id), sweetItem);
      const updatedSweet = toSweet(response.data);
      
      // Preserve frontend-only fields
      const existingSweet = sweets.find(s => s.id === id);
      if (existingSweet) {
        updatedSweet.category = updates.category ?? existingSweet.category;
        updatedSweet.image = updates.image ?? existingSweet.image;
        updatedSweet.origin = updates.origin ?? existingSweet.origin;
        updatedSweet.quantity = updates.quantity ?? existingSweet.quantity;
      }

      setSweets(prev => prev.map(s => s.id === id ? updatedSweet : s));
      return { success: true };
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to update sweet';
      return { success: false, error: errorMessage };
    }
  };

  const deleteSweet = async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.delete(API_ENDPOINTS.SWEETS.BY_ID(id));
      setSweets(prev => prev.filter(s => s.id !== id));
      return { success: true };
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to delete sweet';
      return { success: false, error: errorMessage };
    }
  };

  const purchaseSweet = async (id: number, quantity: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post<PurchaseResponse>(
        API_ENDPOINTS.SWEETS.PURCHASE(id),
        { quantity } as PurchaseRequest
      );
      
      // Refresh sweets list to get updated data
      await fetchSweets();
      
      return { success: true };
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to purchase sweet';
      return { success: false, error: errorMessage };
    }
  };

  return (
    <SweetsContext.Provider
      value={{
        sweets,
        loading,
        error,
        addSweet,
        updateSweet,
        deleteSweet,
        purchaseSweet,
        refreshSweets: fetchSweets,
      }}
    >
      {children}
    </SweetsContext.Provider>
  );
};

export const useSweets = () => {
  const context = useContext(SweetsContext);
  if (!context) {
    throw new Error('useSweets must be used within a SweetsProvider');
  }
  return context;
};
