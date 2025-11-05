import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

/**
 * Hook to track session expiration and activity
 */
export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionExpiring, setIsSessionExpiring] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.expires_at) {
      setTimeUntilExpiry(null);
      setIsSessionExpiring(false);
      return;
    }

    const checkExpiry = () => {
      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();
      const minutes = Math.floor(diff / 1000 / 60);

      setTimeUntilExpiry(minutes);
      setIsSessionExpiring(minutes <= 5 && minutes > 0);
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [session?.expires_at]);

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data.session) {
      setSession(data.session);
      return { success: true };
    }
    return { success: false, error };
  };

  return {
    session,
    isSessionExpiring,
    timeUntilExpiry,
    refreshSession,
  };
};