import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

/**
 * Authentication Service
 * Centralized service for all authentication-related operations
 */

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
  studentId?: string;
  role: UserRole;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async ({
  email,
  password,
  name,
  studentId,
  role,
}: SignUpParams) => {
  const redirectUrl = `${window.location.origin}/`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        name,
        student_id: studentId,
        role,
      },
    },
  });

  return { data, error };
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async ({ email, password }: SignInParams) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

/**
 * Sign in with magic link (passwordless authentication)
 */
export const signInWithMagicLink = async (email: string) => {
  const redirectUrl = `${window.location.origin}/`;

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  return { data, error };
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Send password reset email
 */
export const resetPasswordForEmail = async (email: string) => {
  const redirectUrl = `${window.location.origin}/`;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  return { data, error };
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { data, error };
};

/**
 * Update user email
 */
export const updateEmail = async (newEmail: string) => {
  const redirectUrl = `${window.location.origin}/`;

  const { data, error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: redirectUrl,
    }
  );

  return { data, error };
};

/**
 * Get current session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

/**
 * Refresh current session
 */
export const refreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  return { session: data.session, error };
};

/**
 * Resend email confirmation
 */
export const resendConfirmationEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  return { data, error };
};

/**
 * Get user role from the database
 */
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data.role as UserRole;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

/**
 * Check if user has a specific role
 */
export const hasRole = async (userId: string, role: UserRole): Promise<boolean> => {
  const userRole = await getUserRole(userId);
  return userRole === role;
};

/**
 * Check if user is admin
 */
export const isAdmin = async (userId: string): Promise<boolean> => {
  return hasRole(userId, 'admin');
};

/**
 * Update user profile
 */
export const updateProfile = async (
  userId: string,
  updates: {
    name?: string;
    student_id?: string;
    phone?: string;
    department?: string;
    year?: number;
    avatar_url?: string;
  }
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

/**
 * Get user profile
 */
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

/**
 * Upload avatar image
 */
export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

  return { data: data.publicUrl, error: null };
};

/**
 * Delete avatar image
 */
export const deleteAvatar = async (avatarUrl: string) => {
  const fileName = avatarUrl.split('/').pop();
  if (!fileName) return { error: new Error('Invalid avatar URL') };

  const { error } = await supabase.storage.from('avatars').remove([fileName]);

  return { error };
};