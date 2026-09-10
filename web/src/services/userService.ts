import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { getDb } from './firebase';
import firebaseConfig from '../config/firebase';
import { AppUser, CreateUserData, UpdateUserData } from '../types';

const API_BASE = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'https://asociacion-juvenil-pwa.vercel.app';

const COLLECTION = 'users';

const FIREBASE_AUTH_BASE = 'https://identitytoolkit.googleapis.com/v1';

export const getAllUsers = async (): Promise<AppUser[]> => {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
  })) as AppUser[];
};

export const getUserById = async (userId: string): Promise<AppUser | null> => {
  const db = getDb();
  const docRef = await getDoc(doc(db, COLLECTION, userId));
  if (!docRef.exists()) return null;
  const data = docRef.data();
  return {
    id: docRef.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  } as AppUser;
};

export const createUser = async (
  data: CreateUserData
): Promise<AppUser> => {
  const db = getDb();

  const res = await fetch(
    `${FIREBASE_AUTH_BASE}/accounts:signUp?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        returnSecureToken: true,
      }),
    }
  );

  const authData = await res.json();
  if (!res.ok) {
    throw new Error(authData.error?.message || 'Error al crear usuario');
  }

  const uid = authData.localId;

  const userDoc = {
    email: data.email,
    displayName: data.displayName,
    role: data.role,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, COLLECTION, uid), userDoc);

  return {
    id: uid,
    ...userDoc,
  };
};

export const updateUser = async (
  userId: string,
  data: UpdateUserData
): Promise<void> => {
  const db = getDb();
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (data.displayName !== undefined) updateData.displayName = data.displayName;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.active !== undefined) updateData.active = data.active;
  if (data.photoURL !== undefined) updateData.photoURL = data.photoURL;

  await updateDoc(doc(db, COLLECTION, userId), updateData as any);
};

export const toggleUserActive = async (
  userId: string,
  active: boolean
): Promise<void> => {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, userId), {
    active,
    updatedAt: new Date(),
  });
  if (!active) {
    try {
      await deleteDoc(doc(db, 'pushSubscriptions', userId));
    } catch {}
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  const db = getDb();
  try {
    await deleteDoc(doc(db, 'pushSubscriptions', userId));
  } catch {}
  const res = await fetch(`${API_BASE}/api/delete-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Error al eliminar usuario');
  }
};
