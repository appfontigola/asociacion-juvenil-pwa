import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { getDb } from './firebase';
import { VAPID_PUBLIC_KEY } from '../config/vapid';

const COLLECTION = 'pushSubscriptions';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function waitForReady(): Promise<ServiceWorkerRegistration> {
  const reg = await navigator.serviceWorker.getRegistration('/asociacion-juvenil-pwa/');
  if (reg) return reg;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('SW no registrado tras 15s')), 15000);
    const interval = setInterval(async () => {
      const r = await navigator.serviceWorker.getRegistration('/asociacion-juvenil-pwa/');
      if (r) {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(r);
      }
    }, 200);
  });
}

export async function subscribeToPush(userId: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('PushManager no disponible');
  }

  if (Notification.permission === 'denied') {
    throw new Error('Permiso denegado');
  }

  if (Notification.permission !== 'granted') {
    const result = await Promise.race([
      Notification.requestPermission(),
      new Promise<string>((r) => setTimeout(() => r(Notification.permission), 5000)),
    ]);
    if (result !== 'granted') {
      throw new Error('Permiso no concedido');
    }
  }

  const registration = await waitForReady();

  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    const db = getDb();
    const subJson = existing.toJSON();
    await setDoc(doc(db, COLLECTION, userId), {
      userId,
      endpoint: subJson.endpoint,
      keys: subJson.keys,
      createdAt: new Date(),
    });
    return true;
  }

  let subscription: PushSubscription;
  try {
    subscription = await Promise.race([
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('subscribe timeout')), 15000)),
    ]);
  } catch (e: any) {
    throw new Error('subscribe() fallo: ' + (e.message || String(e)));
  }

  const db = getDb();
  const subJson = subscription.toJSON();
  await setDoc(doc(db, COLLECTION, userId), {
    userId,
    endpoint: subJson.endpoint,
    keys: subJson.keys,
    createdAt: new Date(),
  });

  return true;
}

export async function unsubscribeFromPush(userId: string): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration('/asociacion-juvenil-pwa/');
  if (reg) {
    const subscription = await reg.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
  }
  const db = getDb();
  await deleteDoc(doc(db, COLLECTION, userId));
}

export async function isSubscribed(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
  try {
    const reg = await navigator.serviceWorker.getRegistration('/asociacion-juvenil-pwa/');
    if (!reg) return false;
    const subscription = await reg.pushManager.getSubscription();
    return !!subscription;
  } catch {
    return false;
  }
}

export async function getAllSubscriptions(): Promise<Array<{ endpoint: string; keys: { p256dh: string; auth: string } }>> {
  const db = getDb();
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => d.data() as { endpoint: string; keys: { p256dh: string; auth: string } });
}
