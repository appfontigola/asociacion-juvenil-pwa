import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  limit,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { LocalPresence } from '../types';

const COLLECTION = 'pasajePresence';
const LOG_COLLECTION = 'pasajeLog';

export interface PasajeLogEntry {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  date: string;
  entryTime?: Date;
  exitTime?: Date;
}

const mapLogDoc = (d: { id: string; data: () => Record<string, unknown> }): PasajeLogEntry => {
  const data = d.data();
  return {
    id: d.id,
    userId: data.userId as string,
    userName: data.userName as string,
    userPhotoURL: (data.userPhotoURL as string) || undefined,
    date: data.date as string,
    entryTime: (data.entryTime as Timestamp)?.toDate?.() || undefined,
    exitTime: (data.exitTime as Timestamp)?.toDate?.() || undefined,
  };
};

export const setPasajePresence = async (
  userId: string,
  userName: string,
  active: boolean,
  userPhotoURL?: string
): Promise<void> => {
  const db = getDb();
  const presenceRef = doc(db, COLLECTION, userId);
  const today = new Date().toISOString().split('T')[0];

  if (active) {
    await setDoc(presenceRef, {
      userId,
      userName,
      userPhotoURL: userPhotoURL || null,
      entryTime: new Date(),
      active: true,
    });
    await addDoc(collection(db, LOG_COLLECTION), {
      userId,
      userName,
      userPhotoURL: userPhotoURL || null,
      date: today,
      entryTime: new Date(),
      exitTime: null,
    });
  } else {
    await deleteDoc(presenceRef);
    const open = await getDocs(
      query(
        collection(db, LOG_COLLECTION),
        where('userId', '==', userId),
        where('exitTime', '==', null),
        limit(1)
      )
    );
    if (!open.empty) {
      await updateDoc(open.docs[0].ref, { exitTime: new Date() });
    }
  }
};

export const subscribeToPasajePresence = (
  callback: (users: LocalPresence[]) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(collection(db, COLLECTION), where('active', '==', true));
  return onSnapshot(q, (snapshot) => {
    const users: LocalPresence[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        userId: d.id,
        userName: data.userName as string,
        userPhotoURL: (data.userPhotoURL as string) || undefined,
        entryTime: (data.entryTime as Timestamp)?.toDate?.() || new Date(),
        active: data.active as boolean,
      };
    });
    callback(users);
  });
};

export const getPasajeLog = async (date: string): Promise<PasajeLogEntry[]> => {
  const db = getDb();
  const snapshot = await getDocs(
    query(collection(db, LOG_COLLECTION), where('date', '==', date))
  );
  return snapshot.docs.map(mapLogDoc);
};

export const subscribeToPasajeLog = (
  date: string,
  callback: (entries: PasajeLogEntry[]) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(collection(db, LOG_COLLECTION), where('date', '==', date));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(mapLogDoc));
  });
};

export const subscribeToPasajeLogByUser = (
  userId: string,
  startDate: string,
  endDate: string,
  callback: (entries: PasajeLogEntry[]) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(
    collection(db, LOG_COLLECTION),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs
      .map(mapLogDoc)
      .filter((e) => e.date >= startDate && e.date <= endDate);
    callback(entries);
  });
};
