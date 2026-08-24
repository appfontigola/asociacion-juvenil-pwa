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
import { Event } from '../types';

const COLLECTION = 'events';

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

export const getAllEvents = async (): Promise<Event[]> => {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    orderBy('date', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => eventFromDoc(d.id, d.data() as Record<string, unknown>));
};

export const getEventById = async (eventId: string): Promise<Event | null> => {
  const db = getDb();
  const docRef = await getDoc(doc(db, COLLECTION, eventId));
  if (!docRef.exists()) return null;
  return eventFromDoc(docRef.id, docRef.data() as Record<string, unknown>);
};

export const createEvent = async (
  event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Event> => {
  const db = getDb();
  const payload: Record<string, unknown> = {
    ...event,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });
  const docRef = await addDoc(collection(db, COLLECTION), payload);
  return {
    id: docRef.id,
    ...event,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updateEvent = async (
  eventId: string,
  data: {
    title: string;
    description: string;
    date: Date;
    time: string;
    location?: string;
  }
): Promise<void> => {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, eventId), {
    ...data,
    updatedAt: new Date(),
  });
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTION, eventId));
};
