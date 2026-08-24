import { useState, useEffect, useCallback } from 'react';
import { Notice } from '../types';
import * as noticeService from '../services/noticeService';

export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await noticeService.getAllNotices();
      setNotices(data);
    } catch (err) {
      setError('Error al cargar los avisos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const getNotice = useCallback(async (id: string) => {
    try {
      return await noticeService.getNoticeById(id);
    } catch {
      return null;
    }
  }, []);

  const createNotice = useCallback(
    async (data: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newNotice = await noticeService.createNotice(data);
        setNotices((prev) => [newNotice, ...prev]);
        return newNotice;
      } catch (err) {
        throw new Error('Error al crear aviso');
      }
    },
    []
  );

  const editNotice = useCallback(
    async (id: string, data: { title: string; description: string }) => {
      try {
        await noticeService.updateNotice(id, data);
        setNotices((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, ...data, updatedAt: new Date() } : n
          )
        );
      } catch {
        throw new Error('Error al editar aviso');
      }
    },
    []
  );

  const removeNotice = useCallback(async (id: string) => {
    try {
      await noticeService.deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch {
      throw new Error('Error al eliminar aviso');
    }
  }, []);

  return {
    notices,
    loading,
    error,
    fetchNotices,
    getNotice,
    createNotice,
    editNotice,
    removeNotice,
  };
};
