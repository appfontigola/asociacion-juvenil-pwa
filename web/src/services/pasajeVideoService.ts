import {
  collection,
  addDoc,
  query,
  onSnapshot,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { getDb } from './firebase';

const COLLECTION = 'pasajeVideos';

export interface PasajeVideoEntry {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  videoName: string;
  videoUrl: string;
  dropboxPath?: string;
  date: string;
  timestamp: Date;
}

export const addPasajeVideo = async (
  entry: Omit<PasajeVideoEntry, 'id' | 'date' | 'timestamp'>
): Promise<void> => {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  await addDoc(collection(db, COLLECTION), {
    ...entry,
    date: today,
    timestamp: new Date(),
  });
};

const mapDoc = (d: { id: string; data: () => Record<string, unknown> }): PasajeVideoEntry => {
  const data = d.data();
  return {
    id: d.id,
    userId: data.userId as string,
    userName: data.userName as string,
    userPhotoURL: (data.userPhotoURL as string) || undefined,
    videoName: data.videoName as string,
    videoUrl: data.videoUrl as string,
    dropboxPath: data.dropboxPath as string | undefined,
    date: data.date as string,
    timestamp: (data.timestamp as Timestamp)?.toDate?.() || new Date(),
  };
};

export const subscribeToPasajeVideos = (
  callback: (entries: PasajeVideoEntry[]) => void
): Unsubscribe => {
  const db = getDb();
  return onSnapshot(collection(db, COLLECTION), (snapshot) => {
    const entries = snapshot.docs.map((d) =>
      mapDoc(d as unknown as { id: string; data: () => Record<string, unknown> })
    );
    entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    callback(entries);
  });
};
