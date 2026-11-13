import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';

const COLLECTION = 'buzon';

export interface BuzonMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

const mapBuzonDoc = (d: { id: string; data: () => Record<string, unknown> }): BuzonMessage => {
  const data = d.data();
  return {
    id: d.id,
    userId: data.userId as string,
    userName: data.userName as string,
    text: data.text as string,
    createdAt: (data.createdAt as Timestamp)?.toDate?.() || new Date(),
  };
};

export const sendBuzonMessage = async (
  userId: string,
  userName: string,
  text: string
): Promise<void> => {
  const db = getDb();
  await addDoc(collection(db, COLLECTION), {
    userId,
    userName,
    text,
    createdAt: new Date(),
  });
};

export const getBuzonMessages = async (): Promise<BuzonMessage[]> => {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapBuzonDoc);
};
