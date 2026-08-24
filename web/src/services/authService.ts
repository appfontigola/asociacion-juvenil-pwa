import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDb } from './firebase';
import firebaseConfig from '../config/firebase';
import { AppUser } from '../types';

const SESSION_KEY = '@session';
const USER_KEY = '@user_data';

const FIREBASE_AUTH_BASE = 'https://identitytoolkit.googleapis.com/v1';

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AppUser> => {
  const db = getDb();

  const res = await fetch(
    `${FIREBASE_AUTH_BASE}/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Error al iniciar sesión');
  }

  const uid = data.localId;

  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    throw new Error('Usuario no encontrado en la base de datos');
  }

  const rawData = userDoc.data() as Record<string, unknown>;

  if (rawData.active === false) {
    throw new Error('Tu cuenta ha sido desactivada. Contacta al administrador.');
  }

  const appUser: AppUser = {
    id: uid,
    email: rawData.email as string,
    displayName: rawData.displayName as string,
    role: rawData.role as 'admin' | 'user',
    active: rawData.active as boolean,
    createdAt: (rawData.createdAt as any)?.toDate?.() || new Date(),
    updatedAt: (rawData.updatedAt as any)?.toDate?.() || new Date(),
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ uid, email: data.email || email, lastLogin: new Date().toISOString() })
  );
  localStorage.setItem(USER_KEY, JSON.stringify(appUser));
  return appUser;
};

export const logout = async (): Promise<void> => {
  await clearSession();
};

export const clearSession = async (): Promise<void> => {
  [SESSION_KEY, USER_KEY].forEach(k => localStorage.removeItem(k));
};

export const getSavedSession = async (): Promise<AppUser | null> => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      const parsed = JSON.parse(userData) as AppUser & { createdAt: string; updatedAt: string };
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const loginRes = await fetch(
    `${FIREBASE_AUTH_BASE}/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: currentPassword, returnSecureToken: true }),
    }
  );

  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    const msg = loginData.error?.message || '';
    if (msg.includes('INVALID_LOGIN_CREDENTIALS') || msg.includes('INVALID_PASSWORD')) {
      throw new Error('La contraseña actual no es correcta');
    }
    throw new Error('Error al verificar la contraseña actual');
  }

  const updateRes = await fetch(
    `${FIREBASE_AUTH_BASE}/accounts:update?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken: loginData.idToken,
        password: newPassword,
        returnSecureToken: true,
      }),
    }
  );

  const updateData = await updateRes.json();
  if (!updateRes.ok) {
    throw new Error(updateData.error?.message || 'Error al cambiar la contraseña');
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const res = await fetch(
    `${FIREBASE_AUTH_BASE}/accounts:sendOobCode?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email,
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Error al enviar correo de restablecimiento');
  }
};

export const createUserInFirestore = async (
  uid: string,
  userData: {
    email: string;
    displayName: string;
    role: 'admin' | 'user';
  }
): Promise<void> => {
  const db = getDb();
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    email: userData.email,
    displayName: userData.displayName,
    role: userData.role,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};
