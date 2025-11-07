import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types';

/**
 * AI Service for intelligent chatbot responses
 */

export interface AIResponse {
  response: string;
  error?: string;
}

export const aiService = {
  /**
   * Generate AI response based on user message and conversation history
   */
  async generateResponse(
    userMessage: string,
    conversationHistory: Message[] = []
  ): Promise<AIResponse> {
    try {
      // Format conversation history for AI context
      const formattedHistory = conversationHistory.slice(-10).map(msg => ({
        role: msg.sender_type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          messages: userMessage,
          conversationHistory: formattedHistory
        }
      });

      if (error) {
        console.error('AI service error:', error);
        return {
          response: 'I apologize, but I\'m having trouble processing your request right now. Please try again.',
          error: error.message
        };
      }

      return data;
    } catch (error) {
      console.error('Error calling AI service:', error);
      return {
        response: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Search knowledge base for relevant information
   */
  async searchKnowledgeBase(query: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('answer, question')
        .or(`question.ilike.%${query}%,keywords.cs.{${query}}`)
        .limit(3);

      if (error || !data || data.length === 0) {
        return null;
      }

      // Return formatted knowledge base results
      return data.map(item => `**${item.question}**\n${item.answer}`).join('\n\n');
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return null;
    }
  },

  /**
   * Get enhanced response with knowledge base integration
   */
  async getEnhancedResponse(
    userMessage: string,
    conversationHistory: Message[] = []
  ): Promise<AIResponse> {
    try {
      // First, search knowledge base
      const kbResults = await this.searchKnowledgeBase(userMessage);

      // Add KB results to context if found
      let enhancedHistory = [...conversationHistory];
      if (kbResults) {
        enhancedHistory.push({
          id: 'kb-context',
          conversation_id: '',
          content: `Knowledge Base Information:\n${kbResults}`,
          sender_type: 'system',
          timestamp: new Date().toISOString()
        });
      }

      // Generate AI response with enhanced context
      return await this.generateResponse(userMessage, enhancedHistory);
    } catch (error) {
      console.error('Error generating enhanced response:', error);
      return await this.generateResponse(userMessage, conversationHistory);
    }
  }
};
