import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getDb } from '../services/firebase';
import { AppUser } from '../types';
import {
  loginWithEmail,
  logout as logoutService,
  getSavedSession,
  clearSession,
} from '../services/authService';
import { unsubscribeFromPush } from '../services/webPushService';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserInContext: (updatedUser: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef<AppUser | null>(null);

  const forceLogout = useCallback(async (silent = false) => {
    try {
      if (userRef.current) {
        unsubscribeFromPush(userRef.current.id).catch(() => {});
      }
    } catch {}
    await clearSession();
    setUser(null);
    if (!silent) {
      window.alert('Tu cuenta ha sido eliminada o desactivada. Se ha cerrado la sesión.');
    }
    window.location.href = '/asociacion-juvenil-pwa/login';
  }, []);

  const verifyUser = useCallback(async (savedUser: AppUser): Promise<boolean> => {
    try {
      const db = getDb();
      const docSnap = await getDoc(doc(db, 'users', savedUser.id));
      if (!docSnap.exists()) {
        return false;
      }
      const data = docSnap.data();
      if (data.active === false) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = await getSavedSession();
        if (savedUser) {
          userRef.current = savedUser;
          const isValid = await verifyUser(savedUser);
          if (!isValid) {
            await forceLogout(true);
            return;
          }
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

  useEffect(() => {
    if (!user) return;
    userRef.current = user;
    const interval = setInterval(async () => {
      const isValid = await verifyUser(user);
      if (!isValid) {
        await forceLogout(true);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, verifyUser, forceLogout]);

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

  const updateUserInContext = useCallback((updatedUser: Partial<AppUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const newUser = { ...prev, ...updatedUser };
      localStorage.setItem('@user_data', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    login,
    logout,
    updateUserInContext,
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
