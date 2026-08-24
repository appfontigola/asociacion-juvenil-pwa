import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { LocalPresence } from '../types';

const COLLECTION = 'localPresence';

export const setUserPresence = async (
  userId: string,
  userName: string,
  active: boolean
): Promise<void> => {
  const db = getDb();
  const presenceRef = doc(db, COLLECTION, userId);
  const today = new Date().toISOString().split('T')[0];

  if (active) {
    await setDoc(presenceRef, { userId, userName, entryTime: new Date(), active: true });
    await addDoc(collection(db, 'localLog'), {
      userId,
      userName,
      date: today,
      entryTime: new Date(),
      exitTime: null,
    });
  } else {
    await deleteDoc(presenceRef);
    const open = await getDocs(
      query(
        collection(db, 'localLog'),
        where('userId', '==', userId),
        where('date', '==', today),
        where('exitTime', '==', null),
        limit(1)
      )
    );
    if (!open.empty) {
      await updateDoc(open.docs[0].ref, { exitTime: new Date() });
    }
  }
};

export const getActiveUsers = async (): Promise<LocalPresence[]> => {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    where('active', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    userId: d.id,
    ...d.data(),
    entryTime: d.data().entryTime?.toDate?.() || new Date(),
  })) as LocalPresence[];
};

export const subscribeToPresence = (
  callback: (users: LocalPresence[]) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    where('active', '==', true)
  );

  return onSnapshot(q, (snapshot) => {
    const users: LocalPresence[] = snapshot.docs.map((d) => ({
      userId: d.id,
      userName: d.data().userName as string,
      entryTime: (d.data().entryTime as Timestamp)?.toDate?.() || new Date(),
      active: d.data().active as boolean,
    }));
    callback(users);
  });
};

export interface LocalLogEntry {
  id: string;
  userId: string;
  userName: string;
  date: string;
  entryTime?: Date;
  exitTime?: Date;
}

const mapLogDoc = (d: { id: string; data: () => Record<string, unknown> }): LocalLogEntry => {
  const data = d.data();
  return {
    id: d.id,
    userId: data.userId as string,
    userName: data.userName as string,
    date: data.date as string,
    entryTime: (data.entryTime as Timestamp)?.toDate?.() || undefined,
    exitTime: (data.exitTime as Timestamp)?.toDate?.() || undefined,
  };
};

export const getLocalLog = async (date: string): Promise<LocalLogEntry[]> => {
  const db = getDb();
  const snapshot = await getDocs(
    query(collection(db, 'localLog'), where('date', '==', date))
  );
  return snapshot.docs.map(mapLogDoc);
};

export const subscribeToLocalLog = (
  date: string,
  callback: (entries: LocalLogEntry[]) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(collection(db, 'localLog'), where('date', '==', date));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(mapLogDoc));
  });
};

const KEYS_COLLECTION = 'localKeys';

export const setUserKeyStatus = async (
  userId: string,
  userName: string,
  hasKeys: boolean
): Promise<void> => {
  const db = getDb();
  const docRef = doc(db, KEYS_COLLECTION, userId);
  const today = new Date().toISOString().split('T')[0];

  if (hasKeys) {
    await setDoc(docRef, { userId, userName, entryTime: new Date(), active: true });
    await addDoc(collection(db, 'keysLog'), {
      userId,
      userName,
      date: today,
      takeTime: new Date(),
      returnTime: null,
    });
  } else {
    await deleteDoc(docRef);
    const open = await getDocs(
      query(
        collection(db, 'keysLog'),
        where('userId', '==', userId),
        where('date', '==', today),
        where('returnTime', '==', null),
        limit(1)
      )
    );
    if (!open.empty) {
      await updateDoc(open.docs[0].ref, { returnTime: new Date() });
    }
  }
};

export interface KeysLogEntry {
  id: string;
  userId: string;
  userName: string;
  date: string;
  takeTime?: Date;
  returnTime?: Date;
}

const mapKeysLogDoc = (d: { id: string; data: () => Record<string, unknown> }): KeysLogEntry => {
  const data = d.data();
  return {
    id: d.id,
    userId: data.userId as string,
    userName: data.userName as string,
    date: data.date as string,
    takeTime: (data.takeTime as Timestamp)?.toDate?.() || undefined,
    returnTime: (data.returnTime as Timestamp)?.toDate?.() || undefined,
  };
};

export const getKeysLog = async (date: string): Promise<KeysLogEntry[]> => {
  const db = getDb();
  const snapshot = await getDocs(
    query(collection(db, 'keysLog'), where('date', '==', date))
  );
  return snapshot.docs.map(mapKeysLogDoc);
};

export const subscribeToKeysLog = (
  date: string,
  callback: (entries: KeysLogEntry[]) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(collection(db, 'keysLog'), where('date', '==', date));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(mapKeysLogDoc));
  });
};

export const subscribeToKeys = (
  callback: (users: LocalPresence[]) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(
    collection(db, KEYS_COLLECTION),
    where('active', '==', true)
  );

  return onSnapshot(q, (snapshot) => {
    const users: LocalPresence[] = snapshot.docs.map((d) => ({
      userId: d.id,
      userName: d.data().userName as string,
      entryTime: (d.data().entryTime as Timestamp)?.toDate?.() || new Date(),
      active: d.data().active as boolean,
    }));
    callback(users);
  });
};
