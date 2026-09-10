import { useState, useEffect, useCallback } from 'react';
import { LocalPresence } from '../types';
import * as localService from '../services/localService';

export const useLocalKeys = () => {
  const [keyHolders, setKeyHolders] = useState<LocalPresence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = localService.subscribeToKeys((users) => {
      setKeyHolders(users);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const takeKeys = useCallback(async (userId: string, userName: string, userPhotoURL?: string) => {
    await localService.setUserKeyStatus(userId, userName, true, userPhotoURL);
  }, []);

  const returnKeys = useCallback(async (userId: string) => {
    await localService.setUserKeyStatus(userId, '', false);
  }, []);

  return {
    keyHolders,
    loading,
    takeKeys,
    returnKeys,
  };
};
