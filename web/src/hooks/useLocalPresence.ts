import { useState, useEffect, useCallback } from 'react';
import { LocalPresence } from '../types';
import * as localService from '../services/localService';

export const useLocalPresence = () => {
  const [activeUsers, setActiveUsers] = useState<LocalPresence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = localService.subscribeToPresence((users) => {
      setActiveUsers(users);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const enterLocal = useCallback(async (userId: string, userName: string) => {
    await localService.setUserPresence(userId, userName, true);
  }, []);

  const leaveLocal = useCallback(async (userId: string) => {
    await localService.setUserPresence(userId, '', false);
  }, []);

  return {
    activeUsers,
    loading,
    enterLocal,
    leaveLocal,
  };
};
