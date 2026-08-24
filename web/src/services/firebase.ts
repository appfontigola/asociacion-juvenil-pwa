import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth as getFirebaseAuth, Auth } from 'firebase/auth';
import firebaseConfig from '../config/firebase';

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

const initializeFirebase = () => {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getFirebaseAuth(app);
  return { app, db, auth };
};

let firebaseInstance: ReturnType<typeof initializeFirebase> | null = null;

export const getFirebaseInstance = () => {
  if (!firebaseInstance) {
    firebaseInstance = initializeFirebase();
  }
  return firebaseInstance;
};

export const getDb = (): Firestore => {
  const instance = getFirebaseInstance();
  return instance.db;
};

export const getAuth = (): Auth => {
  const instance = getFirebaseInstance();
  return instance.auth;
};
