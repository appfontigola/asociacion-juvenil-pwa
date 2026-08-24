import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getDb } from './firebase';

const COLLECTION = 'pushSubscriptions';

export async function subscribeToPush(userId: string): Promise<void> {}
export async function unsubscribeFromPush(userId: string): Promise<void> {}

export async function sendPushNotification(
  title: string,
  body: string,
  url?: string
): Promise<{ success: number; failed: number; total: number }> {
  return { success: 0, failed: 0, total: 0 };
}
