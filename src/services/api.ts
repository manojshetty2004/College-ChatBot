import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, ApiError } from '@/types';

/**
 * Base API configuration and utility functions
 */

/**
 * Standard error handler for API responses
 */
export const handleApiError = (error: any): ApiError => {
  console.error('API Error:', error);
  
  return {
    message: error.message || 'An unexpected error occurred',
    code: error.code,
    details: error.details
  };
};

/**
 * Standardize API response format
 */
export const createApiResponse = <T>(data?: T, error?: ApiError): ApiResponse<T> => {
  return {
    data,
    error,
    success: !error
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

/**
 * Get current user ID
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

/**
 * Pagination helper
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export const getPaginationRange = (page: number = 1, pageSize: number = 10) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
};

/**
 * Query builder helper for search
 */
export const buildSearchQuery = (searchTerm: string, fields: string[]) => {
  return fields.map(field => `${field}.ilike.%${searchTerm}%`).join(',');
};
