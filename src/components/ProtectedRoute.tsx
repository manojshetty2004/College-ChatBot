import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  // TODO: Replace with actual auth state from context/hook
  const isAuthenticated = false;
  const userRole: UserRole = 'student';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
