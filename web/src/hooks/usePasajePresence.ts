import { useState, useEffect, useCallback } from 'react';
import { LocalPresence } from '../types';
import * as pasajeService from '../services/pasajeService';

export const usePasajePresence = () => {
  const [activeUsers, setActiveUsers] = useState<LocalPresence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = pasajeService.subscribeToPasajePresence((users) => {
      setActiveUsers(users);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const enterPasaje = useCallback(
    async (userId: string, userName: string, userPhotoURL?: string) => {
      await pasajeService.setPasajePresence(userId, userName, true, userPhotoURL);
    },
    []
  );

  const leavePasaje = useCallback(async (userId: string) => {
    await pasajeService.setPasajePresence(userId, '', false);
  }, []);

  return { activeUsers, loading, enterPasaje, leavePasaje };
};
