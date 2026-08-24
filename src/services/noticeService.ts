import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { Notice } from '../types';

const COLLECTION = 'notices';

const noticeFromDoc = (id: string, data: Record<string, unknown>): Notice => ({
  id,
  title: data.title as string,
  description: data.description as string,
  authorId: data.authorId as string,
  authorName: data.authorName as string,
  createdAt: (data.createdAt as Timestamp)?.toDate?.() || new Date(),
  updatedAt: (data.updatedAt as Timestamp)?.toDate?.() || new Date(),
});

export const getAllNotices = async (): Promise<Notice[]> => {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => noticeFromDoc(d.id, d.data() as Record<string, unknown>));
};

export const getNoticeById = async (noticeId: string): Promise<Notice | null> => {
  const db = getDb();
  const docRef = await getDoc(doc(db, COLLECTION, noticeId));
  if (!docRef.exists()) return null;
  return noticeFromDoc(docRef.id, docRef.data() as Record<string, unknown>);
};

export const createNotice = async (
  notice: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Notice> => {
  const db = getDb();
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...notice,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return {
    id: docRef.id,
    ...notice,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updateNotice = async (
  noticeId: string,
  data: { title: string; description: string }
): Promise<void> => {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, noticeId), {
    ...data,
    updatedAt: new Date(),
  });
};

export const deleteNotice = async (noticeId: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTION, noticeId));
};
