import { useState, useEffect } from 'react';
import { isPushEnabled, requestNotificationPermission } from '../services/notificationService';
import { subscribeToPush, setExternalUserId, removeExternalUserId } from '../services/pushService';
import { useAuth } from './useAuth';

export function usePushNotifications() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const isEnabled = await isPushEnabled();
        setEnabled(isEnabled);
      } catch {
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user?.id && enabled) {
      setExternalUserId(user.id).catch(() => {});
    }
    return () => {
      if (enabled) {
        removeExternalUserId().catch(() => {});
      }
    };
  }, [user?.id, enabled]);

  const enable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await subscribeToPush();
      setEnabled(true);
      if (user?.id) {
        await setExternalUserId(user.id);
      }
    }
    return granted;
  };

  return { enabled, loading, enable };
}
