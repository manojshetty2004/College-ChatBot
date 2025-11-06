import { supabase } from '@/integrations/supabase/client';
import { KnowledgeBase, ApiResponse } from '@/types';
import { handleApiError, createApiResponse, getCurrentUserId, PaginationParams, getPaginationRange } from './api';

/**
 * Knowledge Base Management Service
 */

export const knowledgeBaseService = {
  /**
   * Get all knowledge base entries
   */
  async getAll(pagination?: PaginationParams): Promise<ApiResponse<KnowledgeBase[]>> {
    try {
      let query = supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false });

      if (pagination) {
        const { from, to } = getPaginationRange(pagination.page, pagination.pageSize);
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get knowledge base entry by ID
   */
  async getById(id: string): Promise<ApiResponse<KnowledgeBase>> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get entries by category
   */
  async getByCategory(category: string, pagination?: PaginationParams): Promise<ApiResponse<KnowledgeBase[]>> {
    try {
      let query = supabase
        .from('knowledge_base')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (pagination) {
        const { from, to } = getPaginationRange(pagination.page, pagination.pageSize);
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Create knowledge base entry
   */
  async create(entry: Omit<KnowledgeBase, 'id' | 'created_at' | 'created_by'>): Promise<ApiResponse<KnowledgeBase>> {
    try {
      const userId = await getCurrentUserId();
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({ ...entry, created_by: userId })
        .select()
        .single();

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Update knowledge base entry
   */
  async update(id: string, updates: Partial<KnowledgeBase>): Promise<ApiResponse<KnowledgeBase>> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Delete knowledge base entry
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return createApiResponse();
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Search knowledge base
   */
  async search(searchTerm: string): Promise<ApiResponse<KnowledgeBase[]>> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .or(`question.ilike.%${searchTerm}%,answer.ilike.%${searchTerm}%,keywords.cs.{${searchTerm}}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Search by keywords
   */
  async searchByKeywords(keywords: string[]): Promise<ApiResponse<KnowledgeBase[]>> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .overlaps('keywords', keywords)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('category')
        .order('category');

      if (error) throw error;
      
      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))];
      return createApiResponse(categories);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Bulk import knowledge base entries
   */
  async bulkImport(entries: Omit<KnowledgeBase, 'id' | 'created_at' | 'created_by'>[]): Promise<ApiResponse<KnowledgeBase[]>> {
    try {
      const userId = await getCurrentUserId();
      const entriesWithUser = entries.map(entry => ({ ...entry, created_by: userId }));
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert(entriesWithUser)
        .select();

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Export all knowledge base entries
   */
  async export(): Promise<ApiResponse<KnowledgeBase[]>> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  }
};
