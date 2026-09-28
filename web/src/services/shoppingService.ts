import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { getDb } from './firebase';

export interface ShoppingItem {
  id: string;
  name: string;
  assignedTo: string | null;
  assignedToName: string | null;
  assignedToPhoto: string | null;
  purchased: boolean;
  createdAt: Date;
}

const COLLECTION = 'shoppingList';

const itemFromDoc = (d: { id: string; data: () => Record<string, unknown> }): ShoppingItem => {
  const data = d.data();
  return {
    id: d.id,
    name: data.name as string,
    assignedTo: (data.assignedTo as string) || null,
    assignedToName: (data.assignedToName as string) || null,
    assignedToPhoto: (data.assignedToPhoto as string) || null,
    purchased: data.purchased as boolean,
    createdAt: (data.createdAt as Timestamp)?.toDate?.() || new Date(),
  };
};

export const subscribeToShoppingList = (
  callback: (items: ShoppingItem[]) => void
): Unsubscribe => {
  const db = getDb();
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(itemFromDoc));
  });
};

export const addShoppingItem = async (
  name: string
): Promise<string> => {
  const db = getDb();
  const docRef = await addDoc(collection(db, COLLECTION), {
    name,
    assignedTo: null,
    assignedToName: null,
    assignedToPhoto: null,
    purchased: false,
    createdAt: new Date(),
  });
  return docRef.id;
};

export const assignShoppingItem = async (
  itemId: string,
  userId: string,
  userName: string,
  userPhoto: string | null
): Promise<void> => {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, itemId), {
    assignedTo: userId,
    assignedToName: userName,
    assignedToPhoto: userPhoto || null,
  });
};

export const unassignShoppingItem = async (itemId: string): Promise<void> => {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, itemId), {
    assignedTo: null,
    assignedToName: null,
    assignedToPhoto: null,
  });
};

export const togglePurchased = async (
  itemId: string,
  purchased: boolean
): Promise<void> => {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, itemId), { purchased });
};

export const deleteShoppingItem = async (itemId: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTION, itemId));
};
