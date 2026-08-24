import {
  collection,
  addDoc,
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

const COLLECTION = 'alarmLog';

export type AlarmAction = 'activate' | 'deactivate';

export interface AlarmLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: AlarmAction;
  date: string;
  timestamp: Date;
  videoName?: string;
  videoUrl?: string;
}

export const addAlarmLogEntry = async (
  entry: Omit<AlarmLogEntry, 'id' | 'date' | 'timestamp'>
): Promise<void> => {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  await addDoc(collection(db, COLLECTION), {
    ...entry,
    date: today,
    timestamp: new Date(),
  });
};

const mapAlarmLogDoc = (d: { id: string; data: () => Record<string, unknown> }): AlarmLogEntry => {
  const data = d.data();
  return {
    id: d.id,
    userId: data.userId as string,
    userName: data.userName as string,
    action: data.action as AlarmAction,
    date: data.date as string,
    timestamp: (data.timestamp as Timestamp)?.toDate?.() || new Date(),
    videoName: data.videoName as string | undefined,
    videoUrl: data.videoUrl as string | undefined,
  };
};

export const getAlarmLog = async (date: string): Promise<AlarmLogEntry[]> => {
  const db = getDb();
  const snapshot = await getDocs(
    query(collection(db, COLLECTION), where('date', '==', date))
  );
  return snapshot.docs.map(mapAlarmLogDoc);
};

export const subscribeToAlarmLog = (
  date: string,
  callback: (entries: AlarmLogEntry[]) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(collection(db, COLLECTION), where('date', '==', date));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(mapAlarmLogDoc));
  });
};

export const subscribeToLatestAlarm = (
  callback: (entry: AlarmLogEntry | null) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    orderBy('timestamp', 'desc'),
    limit(1)
  );
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }
    callback(mapAlarmLogDoc(snapshot.docs[0] as unknown as { id: string; data: () => Record<string, unknown> }));
  });
};