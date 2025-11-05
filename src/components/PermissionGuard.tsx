import { ReactNode } from 'react';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/types';

interface PermissionGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on user role
 * Usage:
 * <PermissionGuard requiredRole="admin">
 *   <AdminOnlyComponent />
 * </PermissionGuard>
 * 
 * <PermissionGuard requiredRoles={['admin', 'faculty']}>
 *   <AdminOrFacultyComponent />
 * </PermissionGuard>
 */
const PermissionGuard = ({
  children,
  requiredRole,
  requiredRoles,
  fallback = null,
}: PermissionGuardProps) => {
  const { hasRole, hasAnyRole } = useRole();

  // Check single role
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  // Check multiple roles
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;