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

export interface Payment {
  userId: string;
  userName: string;
  year: number;
  paid: boolean;
  paidAt: Date | null;
}

const COLLECTION = 'payments';

const paymentFromDoc = (data: Record<string, unknown>): Payment => ({
  userId: data.userId as string,
  userName: data.userName as string,
  year: data.year as number,
  paid: data.paid as boolean,
  paidAt: data.paidAt
    ? ((data.paidAt as Timestamp)?.toDate?.() as Date) || new Date(data.paidAt as string)
    : null,
});

export const getPaymentsByYear = async (year: number): Promise<Payment[]> => {
  const db = getDb();
  const q = query(collection(db, COLLECTION), where('year', '==', year));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => paymentFromDoc(d.data() as Record<string, unknown>));
};

export const setPayment = async (
  userId: string,
  userName: string,
  year: number,
  paid: boolean
): Promise<void> => {
  const db = getDb();
  const docId = `${userId}_${year}`;
  await setDoc(doc(db, COLLECTION, docId), {
    userId,
    userName,
    year,
    paid,
    paidAt: paid ? new Date() : null,
  });
};
