import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { EventAttendance, AttendanceStatus } from '../types';

const COLLECTION = 'attendance';

const attendanceFromDoc = (
  id: string,
  data: Record<string, unknown>
): EventAttendance => ({
  id,
  eventId: data.eventId as string,
  userId: data.userId as string,
  userName: data.userName as string,
  status: data.status as AttendanceStatus,
  updatedAt: (data.updatedAt as Timestamp)?.toDate?.() || new Date(),
});

export const getAttendanceByEvent = async (
  eventId: string
): Promise<EventAttendance[]> => {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    where('eventId', '==', eventId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) =>
    attendanceFromDoc(d.id, d.data() as Record<string, unknown>)
  );
};

export const getUserAttendance = async (
  eventId: string,
  userId: string
): Promise<EventAttendance | null> => {
  const db = getDb();
  const docId = `${eventId}_${userId}`;
  const docRef = await getDoc(doc(db, COLLECTION, docId));
  if (!docRef.exists()) return null;
  return attendanceFromDoc(docRef.id, docRef.data() as Record<string, unknown>);
};

export const setAttendance = async (
  eventId: string,
  userId: string,
  userName: string,
  status: AttendanceStatus
): Promise<void> => {
  const db = getDb();
  const docId = `${eventId}_${userId}`;
  await setDoc(doc(db, COLLECTION, docId), {
    eventId,
    userId,
    userName,
    status,
    updatedAt: new Date(),
  });
};

export const getAttendanceCounts = async (
  eventId: string
): Promise<{ going: number; notGoing: number; undecided: number }> => {
  const attendances = await getAttendanceByEvent(eventId);
  return {
    going: attendances.filter((a) => a.status === 'going').length,
    notGoing: attendances.filter((a) => a.status === 'not_going').length,
    undecided: attendances.filter((a) => a.status === 'undecided').length,
  };
};
