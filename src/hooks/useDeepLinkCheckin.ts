import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { setUserPresence } from '../services/localService';

const CHECKIN_URL_PREFIX = 'asociacionjuvenil://checkin';

export const useDeepLinkCheckin = (userId: string | undefined, userName: string | undefined) => {
  useEffect(() => {
    if (!userId || !userName) return;

    const handleUrl = (url: string | null) => {
      if (!url || !url.startsWith(CHECKIN_URL_PREFIX)) return;
      setUserPresence(userId, userName, true).catch(() => {});
    };

    Linking.getInitialURL().then(handleUrl);

    const subscription = Linking.addEventListener('url', (event: { url: string }) => {
      handleUrl(event.url);
    });

    return () => subscription.remove();
  }, [userId, userName]);
};
