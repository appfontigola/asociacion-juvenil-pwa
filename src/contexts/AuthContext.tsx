import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppUser } from '../types';
import {
  loginWithEmail,
  logout as logoutService,
  getSavedSession,
  clearSession,
} from '../services/authService';
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = await getSavedSession();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch {
        await clearSession();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const appUser = await loginWithEmail(email, password);
    setUser(appUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      setUser(null);
      await clearSession();
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
};
