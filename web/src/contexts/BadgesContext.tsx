import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useAuthContext } from './AuthContext';
import { Notice, Event } from '../types';
import {
  subscribeBadgeDoc,
  subscribeNotices,
  subscribeEvents,
  markNoticesSeen as markNoticesSeenService,
  markEventsSeen as markEventsSeenService,
  BadgeSeenTimes,
} from '../services/badgeService';

interface BadgesContextType {
  unreadNotices: number;
  unreadEvents: number;
  markNoticesSeen: () => void;
  markEventsSeen: () => void;
}

const BadgesContext = createContext<BadgesContextType | undefined>(undefined);

const countUnread = <T extends { createdAt: Date }>(
  items: T[],
  seenAt: Date | undefined
): number => {
  if (seenAt === undefined) return 0;
  return items.filter((item) => item.createdAt.getTime() > seenAt.getTime()).length;
};

export const BadgesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const userId = user?.id || null;

  const [seen, setSeen] = useState<BadgeSeenTimes>({});
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!userId) {
      setSeen({});
      setNotices([]);
      setEvents([]);
      return;
    }
    const unsubBadge = subscribeBadgeDoc(userId, setSeen);
    const unsubNotices = subscribeNotices(setNotices);
    const unsubEvents = subscribeEvents(setEvents);
    return () => {
      unsubBadge();
      unsubNotices();
      unsubEvents();
    };
  }, [userId]);

  const markNoticesSeen = useCallback(() => {
    if (!userId) return;
    setSeen((prev) => ({ ...prev, noticesSeenAt: new Date() }));
    markNoticesSeenService(userId).catch(() => {});
  }, [userId]);

  const markEventsSeen = useCallback(() => {
    if (!userId) return;
    setSeen((prev) => ({ ...prev, eventsSeenAt: new Date() }));
    markEventsSeenService(userId).catch(() => {});
  }, [userId]);

  const unreadNotices = countUnread(notices, seen.noticesSeenAt);
  const unreadEvents = countUnread(events, seen.eventsSeenAt);

  return (
    <BadgesContext.Provider
      value={{ unreadNotices, unreadEvents, markNoticesSeen, markEventsSeen }}
    >
      {children}
    </BadgesContext.Provider>
  );
};

export const useBadgesContext = (): BadgesContextType => {
  const context = useContext(BadgesContext);
  if (!context) {
    throw new Error('useBadgesContext debe usarse dentro de BadgesProvider');
  }
  return context;
};
