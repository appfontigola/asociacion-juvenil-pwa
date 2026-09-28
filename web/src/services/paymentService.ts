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

export type PaymentPeriod = 'FEB' | 'SEP';

export interface Payment {
  userId: string;
  userName: string;
  year: number;
  period: PaymentPeriod;
  paid: boolean;
  paidAt: Date | null;
}

const COLLECTION = 'payments';

const paymentFromDoc = (data: Record<string, unknown>): Payment => ({
  userId: data.userId as string,
  userName: data.userName as string,
  year: data.year as number,
  period: (data.period as PaymentPeriod) || 'FEB',
  paid: data.paid as boolean,
  paidAt: data.paidAt
    ? ((data.paidAt as Timestamp)?.toDate?.() as Date) || new Date(data.paidAt as string)
    : null,
});

export const getPaymentsByYear = async (year: number, period?: PaymentPeriod): Promise<Payment[]> => {
  const db = getDb();
  let q;
  if (period) {
    q = query(
      collection(db, COLLECTION),
      where('year', '==', year),
      where('period', '==', period)
    );
  } else {
    q = query(collection(db, COLLECTION), where('year', '==', year));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => paymentFromDoc(d.data() as Record<string, unknown>));
};

export const setPayment = async (
  userId: string,
  userName: string,
  year: number,
  period: PaymentPeriod,
  paid: boolean
): Promise<void> => {
  const db = getDb();
  const docId = `${userId}_${year}_${period}`;
  await setDoc(doc(db, COLLECTION, docId), {
    userId,
    userName,
    year,
    period,
    paid,
    paidAt: paid ? new Date() : null,
  });
};
