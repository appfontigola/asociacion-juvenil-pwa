import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../config/firebase';

let app: FirebaseApp;
let db: Firestore;

const initializeFirebase = () => {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  return { app, db };
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
