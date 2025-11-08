/**
 * Session token management for anonymous users
 */

const SESSION_TOKEN_KEY = 'dbit_session_token';

/**
 * Generate a secure session token
 */
export const generateSessionToken = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Get or create session token
 */
export const getSessionToken = (): string => {
  let token = localStorage.getItem(SESSION_TOKEN_KEY);
  
  if (!token) {
    token = generateSessionToken();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  }
  
  return token;
};

/**
 * Clear session token
 */
export const clearSessionToken = (): void => {
  localStorage.removeItem(SESSION_TOKEN_KEY);
};

/**
 * Set session token header for Supabase requests
 */
export const getSessionHeaders = (): Record<string, string> => {
  return {
    'x-session-token': getSessionToken()
  };
};
