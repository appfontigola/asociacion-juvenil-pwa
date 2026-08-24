import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const { user, loading, isAdmin, isAuthenticated, login, logout } = useAuthContext();
  return { user, loading, isAdmin, isAuthenticated, login, logout };
};
