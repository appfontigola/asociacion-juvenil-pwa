import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const { user, loading, isAdmin, isAuthenticated, login, logout, updateUserInContext } = useAuthContext();
  return { user, loading, isAdmin, isAuthenticated, login, logout, updateUserInContext };
};
