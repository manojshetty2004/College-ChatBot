import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Hook for real-time message updates
 */
export const useRealtimeMessages = (
  conversationId: string | null,
  onNewMessage: (message: Message) => void
) => {
  useEffect(() => {
    if (!conversationId) return;

    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            console.log('New message received:', payload);
            onNewMessage(payload.new as Message);
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId, onNewMessage]);
};
