import { supabase } from '@/integrations/supabase/client';
import { Chat, Message, ApiResponse } from '@/types';
import { handleApiError, createApiResponse, getCurrentUserId, PaginationParams, getPaginationRange } from './api';
import { getSessionToken } from '@/utils/sessionToken';
import { messageSchema } from '@/utils/validation';

/**
 * Chat and Message Management Service
 */

export const chatService = {
  /**
   * Create a new conversation
   */
  async createConversation(title: string = 'New Conversation'): Promise<ApiResponse<Chat>> {
    try {
      const userId = await getCurrentUserId();
      const sessionToken = getSessionToken();
      
      const { data, error } = await supabase
        .from('conversations')
        .insert({ 
          title, 
          user_id: userId,
          session_token: !userId ? sessionToken : null
        })
        .select()
        .single();

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Get all conversations for current user
   */
  async getConversations(pagination?: PaginationParams): Promise<ApiResponse<Chat[]>> {
    try {
      const userId = await getCurrentUserId();
      let query = supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

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
   * Get a specific conversation
   */
  async getConversation(conversationId: string): Promise<ApiResponse<Chat>> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Update conversation
   */
  async updateConversation(conversationId: string, updates: Partial<Chat>): Promise<ApiResponse<Chat>> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', conversationId)
        .select()
        .single();

      if (error) throw error;
      return createApiResponse(data);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      return createApiResponse();
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId: string): Promise<ApiResponse<Chat>> {
    return this.updateConversation(conversationId, { is_active: false });
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, pagination?: PaginationParams): Promise<ApiResponse<Message[]>> {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (pagination) {
        const { from, to } = getPaginationRange(pagination.page, pagination.pageSize);
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) throw error;
      return createApiResponse(data as Message[]);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Create a new message
   */
  async createMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<ApiResponse<Message>> {
    try {
      // Validate message content
      const validationResult = messageSchema.safeParse(message.content);
      if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0].message);
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({ ...message, content: validationResult.data })
        .select()
        .single();

      if (error) throw error;
      return createApiResponse(data as Message);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Update a message
   */
  async updateMessage(messageId: string, content: string): Promise<ApiResponse<Message>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ content })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return createApiResponse(data as Message);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      return createApiResponse();
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Clear all messages in a conversation
   */
  async clearMessages(conversationId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (error) throw error;
      return createApiResponse();
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Search messages
   */
  async searchMessages(searchTerm: string, conversationId?: string): Promise<ApiResponse<Message[]>> {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .ilike('content', `%${searchTerm}%`);

      if (conversationId) {
        query = query.eq('conversation_id', conversationId);
      }

      query = query.order('timestamp', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return createApiResponse(data as Message[]);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Filter messages by sender type
   */
  async getMessagesBySender(
    conversationId: string,
    senderType: 'user' | 'bot' | 'system'
  ): Promise<ApiResponse<Message[]>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('sender_type', senderType)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return createApiResponse(data as Message[]);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  },

  /**
   * Filter messages by date range
   */
  async getMessagesByDateRange(
    conversationId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Message[]>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return createApiResponse(data as Message[]);
    } catch (error) {
      return createApiResponse(undefined, handleApiError(error));
    }
  }
};
