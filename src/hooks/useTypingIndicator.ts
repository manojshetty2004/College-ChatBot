import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Hook for real-time typing indicators
 */
export const useTypingIndicator = (conversationId: string | null) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!conversationId) return;

    let channel: RealtimeChannel;

    const setupPresence = async () => {
      channel = supabase.channel(`typing:${conversationId}`, {
        config: {
          presence: {
            key: conversationId
          }
        }
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const users = Object.values(state).flat();
          const typingUserIds = users
            .filter((user: any) => user.typing)
            .map((user: any) => user.user_id);
          setTypingUsers(typingUserIds);
        })
        .subscribe();
    };

    setupPresence();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId]);

  const setTyping = async (isTyping: boolean, userId: string) => {
    if (!conversationId) return;

    const channel = supabase.channel(`typing:${conversationId}`);
    await channel.track({
      user_id: userId,
      typing: isTyping,
      online_at: new Date().toISOString()
    });
  };

  return { typingUsers, setTyping };
};
