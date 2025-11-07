import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Message, Chat } from '@/types';
import { toast } from '@/hooks/use-toast';

interface ChatContextType {
  conversations: Chat[];
  currentConversation: Chat | null;
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  createConversation: () => Promise<Chat | null>;
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, attachments?: string[]) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  clearMessages: () => Promise<void>;
  addFeedback: (messageId: string, rating: number) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Load conversations
  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      // Load guest conversation from localStorage
      const guestConvId = localStorage.getItem('guest_conversation_id');
      if (guestConvId) {
        loadGuestConversation(guestConvId);
      }
    }
  }, [user]);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!currentConversation) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${currentConversation.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          setIsTyping(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversation]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadGuestConversation = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      setCurrentConversation(data);
      await loadMessages(conversationId);
    } catch (error) {
      console.error('Error loading guest conversation:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createConversation = async (): Promise<Chat | null> => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user?.id || null,
          title: 'New Conversation',
        })
        .select()
        .single();

      if (error) throw error;

      if (!user) {
        // Store guest conversation ID
        localStorage.setItem('guest_conversation_id', data.id);
      }

      setCurrentConversation(data);
      setMessages([]);
      await loadConversations();
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive',
      });
      return null;
    }
  };

  const selectConversation = async (conversationId: string) => {
    setIsLoading(true);
    try {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
        await loadMessages(conversationId);
      }
    } catch (error) {
      console.error('Error selecting conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, attachments?: string[]) => {
    if (!currentConversation) {
      const newConv = await createConversation();
      if (!newConv) return;
    }

    try {
      // Add user message
      const { error: userMsgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversation!.id,
          content,
          sender_type: 'user',
          attachments: attachments || null,
        });

      if (userMsgError) throw userMsgError;

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversation!.id);

      // Show typing indicator
      setIsTyping(true);

      // Get AI response with knowledge base integration
      const { aiService } = await import('@/services/aiService');
      const aiResponse = await aiService.getEnhancedResponse(content, messages);

      if (aiResponse.error) {
        console.error('AI service error:', aiResponse.error);
      }

      // Add bot response
      const { error: botMsgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversation!.id,
          content: aiResponse.response,
          sender_type: 'bot',
        });

      if (botMsgError) throw botMsgError;

      setIsTyping(false);
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      setIsTyping(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      await loadConversations();
      toast({
        title: 'Success',
        description: 'Conversation deleted',
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete conversation',
        variant: 'destructive',
      });
    }
  };

  const clearMessages = async () => {
    if (!currentConversation) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', currentConversation.id);

      if (error) throw error;

      setMessages([]);
      toast({
        title: 'Success',
        description: 'Chat cleared',
      });
    } catch (error) {
      console.error('Error clearing messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear chat',
        variant: 'destructive',
      });
    }
  };

  const addFeedback = async (messageId: string, rating: number) => {
    try {
      const { error } = await supabase.from('feedback').insert({
        message_id: messageId,
        rating,
        user_id: user?.id || null,
      });

      if (error) throw error;

      toast({
        title: 'Thank you!',
        description: 'Your feedback has been recorded',
      });
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        isLoading,
        isTyping,
        createConversation,
        selectConversation,
        sendMessage,
        deleteConversation,
        clearMessages,
        addFeedback,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
