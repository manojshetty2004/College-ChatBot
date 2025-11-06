import { supabase } from '@/integrations/supabase/client';
import { User, Profile, UserRole, ApiResponse } from '@/types';
import { handleApiError, createApiResponse, getCurrentUserId, PaginationParams, getPaginationRange } from './api';

/**
 * User Management Service
 */

export const userService = {
  /**
   * Get current user profile
   */
  async getCurrentProfile(): Promise<ApiResponse<Profile>> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return createApiResponse(data as unknown as Profile);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Update current user profile
   */
  async updateProfile(updates: Partial<Profile>): Promise<ApiResponse<Profile>> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return createApiResponse(data as unknown as Profile);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get user role
   */
  async getUserRole(userId?: string): Promise<ApiResponse<UserRole>> {
    try {
      const targetUserId = userId || await getCurrentUserId();
      if (!targetUserId) throw new Error('User ID required');

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', targetUserId)
        .single();

      if (error) throw error;
      return createApiResponse(data.role);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<string>> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await this.updateProfile({ avatar_url: publicUrl });

      return createApiResponse(publicUrl);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Delete avatar
   */
  async deleteAvatar(): Promise<ApiResponse<void>> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      const { data: profile } = await this.getCurrentProfile();
      
      if (profile?.avatar_url) {
        const filePath = profile.avatar_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${filePath}`]);
        }
      }

      // Remove avatar URL from profile
      await this.updateProfile({ avatar_url: null });

      return createApiResponse();
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<Profile['preferences']>): Promise<ApiResponse<Profile>> {
    try {
      const { data: profile } = await this.getCurrentProfile();
      if (!profile) throw new Error('Profile not found');

      const updatedPreferences = {
        ...profile.preferences,
        ...preferences
      };

      return await this.updateProfile({ preferences: updatedPreferences });
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers(pagination?: PaginationParams): Promise<ApiResponse<Profile[]>> {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (pagination) {
        const { from, to } = getPaginationRange(pagination.page, pagination.pageSize);
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) throw error;
      return createApiResponse(data as unknown as Profile[]);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get user by ID (admin only)
   */
  async getUserById(userId: string): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return createApiResponse(data as unknown as Profile);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Search users (admin only)
   */
  async searchUsers(searchTerm: string): Promise<ApiResponse<Profile[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,student_id.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%`)
        .order('name', { ascending: true });

      if (error) throw error;
      return createApiResponse(data as unknown as Profile[]);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get users by department
   */
  async getUsersByDepartment(department: string, pagination?: PaginationParams): Promise<ApiResponse<Profile[]>> {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('department', department)
        .order('name', { ascending: true });

      if (pagination) {
        const { from, to } = getPaginationRange(pagination.page, pagination.pageSize);
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) throw error;
      return createApiResponse(data as unknown as Profile[]);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  }
};
