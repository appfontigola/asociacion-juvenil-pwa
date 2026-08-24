import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { Notice, Event } from '../types';

const BADGES_COLLECTION = 'userBadges';

export interface BadgeSeenTimes {
  noticesSeenAt?: Date;
  eventsSeenAt?: Date;
}

const noticeFromDoc = (id: string, data: Record<string, unknown>): Notice => ({
  id,
  title: data.title as string,
  description: data.description as string,
  authorId: data.authorId as string,
  authorName: data.authorName as string,
  authorPhotoURL: data.authorPhotoURL as string | undefined,
  createdAt: (data.createdAt as Timestamp)?.toDate?.() || new Date(),
  updatedAt: (data.updatedAt as Timestamp)?.toDate?.() || new Date(),
});

const eventFromDoc = (id: string, data: Record<string, unknown>): Event => ({
  id,
  title: data.title as string,
  description: data.description as string,
  date: (data.date as Timestamp)?.toDate?.() || new Date(),
  time: data.time as string,
  location: data.location as string | undefined,
  authorId: data.authorId as string,
  authorName: data.authorName as string,
  authorPhotoURL: data.authorPhotoURL as string | undefined,
  createdAt: (data.createdAt as Timestamp)?.toDate?.() || new Date(),
  updatedAt: (data.updatedAt as Timestamp)?.toDate?.() || new Date(),
});

export const subscribeBadgeDoc = (
  userId: string,
  onChange: (times: BadgeSeenTimes) => void
): (() => void) => {
  const db = getDb();
  const ref = doc(db, BADGES_COLLECTION, userId);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onChange({});
        return;
      }
      const data = snap.data();
      onChange({
        noticesSeenAt: (data.noticesSeenAt as Timestamp)?.toDate?.(),
        eventsSeenAt: (data.eventsSeenAt as Timestamp)?.toDate?.(),
      });
    },
    (err) => {
      console.warn('Badge doc subscription error', err);
      onChange({});
    }
  );
};

export const markNoticesSeen = async (userId: string): Promise<void> => {
  const db = getDb();
  await setDoc(
    doc(db, BADGES_COLLECTION, userId),
    { noticesSeenAt: serverTimestamp() },
    { merge: true }
  );
};

export const markEventsSeen = async (userId: string): Promise<void> => {
  const db = getDb();
  await setDoc(
    doc(db, BADGES_COLLECTION, userId),
    { eventsSeenAt: serverTimestamp() },
    { merge: true }
  );
};

export const subscribeNotices = (
  onChange: (notices: Notice[]) => void
): (() => void) => {
  const db = getDb();
  const q = query(
    collection(db, 'notices'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => noticeFromDoc(d.id, d.data() as Record<string, unknown>)));
    },
    (err) => {
      console.warn('Badge notices subscription error', err);
      onChange([]);
    }
  );
};

export const subscribeEvents = (
  onChange: (events: Event[]) => void
): (() => void) => {
  const db = getDb();
  const q = query(
    collection(db, 'events'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => eventFromDoc(d.id, d.data() as Record<string, unknown>)));
    },
    (err) => {
      console.warn('Badge events subscription error', err);
      onChange([]);
    }
  );
};
