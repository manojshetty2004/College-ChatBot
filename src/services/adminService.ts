import { supabase } from '@/integrations/supabase/client';
import { Event, Announcement, Feedback, UserRole, ApiResponse } from '@/types';
import { handleApiError, createApiResponse, getCurrentUserId, PaginationParams, getPaginationRange } from './api';

/**
 * Administrative Service
 */

interface AnalyticsData {
  totalUsers: number;
  totalMessages: number;
  totalConversations: number;
  activeUsers: number;
  totalFeedback: number;
  averageRating: number;
}

export const adminService = {
  /**
   * Get analytics dashboard data
   */
  async getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
    try {
      const [usersResult, messagesResult, conversationsResult, feedbackResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('conversations').select('id', { count: 'exact', head: true }),
        supabase.from('feedback').select('rating')
      ]);

      const analytics: AnalyticsData = {
        totalUsers: usersResult.count || 0,
        totalMessages: messagesResult.count || 0,
        totalConversations: conversationsResult.count || 0,
        activeUsers: 0, // Would need to calculate based on recent activity
        totalFeedback: feedbackResult.data?.length || 0,
        averageRating: feedbackResult.data?.reduce((sum, f) => sum + (f.rating || 0), 0) / (feedbackResult.data?.length || 1)
      };

      return createApiResponse(analytics);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: UserRole): Promise<ApiResponse<void>> {
    try {
      // Delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_admin_action', {
        p_action: 'UPDATE',
        p_resource_type: 'user_role',
        p_resource_id: userId,
        p_details: { new_role: role }
      });

      return createApiResponse();
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get audit logs
   */
  async getAuditLogs(pagination?: PaginationParams): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase
        .from('audit_logs')
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
   * Event Management
   */
  events: {
    async getAll(pagination?: PaginationParams): Promise<ApiResponse<Event[]>> {
      try {
        let query = supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false });

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

    async create(event: Omit<Event, 'id' | 'created_at' | 'created_by'>): Promise<ApiResponse<Event>> {
      try {
        const userId = await getCurrentUserId();
        
        const { data, error } = await supabase
          .from('events')
          .insert({ ...event, created_by: userId })
          .select()
          .single();

        if (error) throw error;
        return createApiResponse(data);
      } catch (error) {
        return createApiResponse(undefined, handleApiError(error));
      }
    },

    async update(id: string, updates: Partial<Event>): Promise<ApiResponse<Event>> {
      try {
        const { data, error } = await supabase
          .from('events')
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

    async delete(id: string): Promise<ApiResponse<void>> {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return createApiResponse();
      } catch (error) {
        return createApiResponse(undefined, handleApiError(error));
      }
    }
  },

  /**
   * Announcement Management
   */
  announcements: {
    async getAll(pagination?: PaginationParams): Promise<ApiResponse<Announcement[]>> {
      try {
        let query = supabase
          .from('announcements')
          .select('*')
          .order('publish_date', { ascending: false });

        if (pagination) {
          const { from, to } = getPaginationRange(pagination.page, pagination.pageSize);
          query = query.range(from, to);
        }

        const { data, error } = await query;

        if (error) throw error;
        return createApiResponse(data as Announcement[]);
      } catch (error) {
        return createApiResponse(undefined, handleApiError(error));
      }
    },

    async create(announcement: Omit<Announcement, 'id'>): Promise<ApiResponse<Announcement>> {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .insert(announcement)
          .select()
          .single();

        if (error) throw error;
        return createApiResponse(data as Announcement);
      } catch (error) {
        return createApiResponse(undefined, handleApiError(error));
      }
    },

    async update(id: string, updates: Partial<Announcement>): Promise<ApiResponse<Announcement>> {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return createApiResponse(data as Announcement);
      } catch (error) {
        return createApiResponse(undefined, handleApiError(error));
      }
    },

    async delete(id: string): Promise<ApiResponse<void>> {
      try {
        const { error } = await supabase
          .from('announcements')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return createApiResponse();
      } catch (error) {
        return createApiResponse(undefined, handleApiError(error));
      }
    }
  },

  /**
   * Feedback Management
   */
  feedback: {
    async getAll(pagination?: PaginationParams): Promise<ApiResponse<Feedback[]>> {
      try {
        let query = supabase
          .from('feedback')
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

    async getByRating(rating: number): Promise<ApiResponse<Feedback[]>> {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('rating', rating)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return createApiResponse(data);
      } catch (error) {
        return createApiResponse(undefined, handleApiError(error));
      }
    },

    async create(feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<ApiResponse<Feedback>> {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .insert(feedback)
          .select()
          .single();

        if (error) throw error;
        return createApiResponse(data);
      } catch (error) {
        return createApiResponse(undefined, handleApiError(error));
      }
    }
  },

  /**
   * Export data for reporting
   */
  async exportUserData(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  async exportConversationData(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, messages(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  }
};
