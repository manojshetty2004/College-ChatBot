import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

export const useProtectedRoute = (requiredRole?: UserRole[]) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (requiredRole && userRole && !requiredRole.includes(userRole)) {
        navigate('/');
      }
    }
  }, [user, userRole, isLoading, requiredRole, navigate]);

  return { user, userRole, isLoading };
};