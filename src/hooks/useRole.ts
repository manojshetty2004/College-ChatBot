import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

/**
 * Hook to check if user has a specific role
 */
export const useRole = () => {
  const { userRole } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  const isFaculty = (): boolean => {
    return userRole === 'faculty';
  };

  const isStudent = (): boolean => {
    return userRole === 'student';
  };

  const isStaff = (): boolean => {
    return userRole === 'staff';
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return userRole ? roles.includes(userRole) : false;
  };

  return {
    userRole,
    hasRole,
    isAdmin,
    isFaculty,
    isStudent,
    isStaff,
    hasAnyRole,
  };
};