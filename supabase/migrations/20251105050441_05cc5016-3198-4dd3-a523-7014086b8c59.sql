-- Fix Critical Security Issue #1: Remove overly permissive audit_logs INSERT policy
-- Audit logs should only be created via the log_admin_action() security definer function
DROP POLICY IF EXISTS "System can create audit logs" ON public.audit_logs;

-- Fix Critical Security Issue #2: Restrict profiles SELECT to own profile only
-- This prevents exposure of PII (phone numbers, student IDs, etc.) to all users
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to view all profiles for user management
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));