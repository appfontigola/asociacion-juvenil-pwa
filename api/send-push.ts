import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';
import webPush from 'web-push';

const VAPID_PUBLIC_KEY = 'BMkWPF3_4FrjVQ1iY9tua6bZ0_8hcZmSxLKQ6yjrXJX1v6En9b_rwqD4H_cE0qPDD4xuJfm952h9V1iF7C_pClQ';
const VAPID_PRIVATE_KEY = 'KFWNupFphL5lHJXIkvuy5ftvQT0PtBxKAxzRe8blxnM';
const VAPID_SUBJECT = 'mailto:admin@fontigola.com';

let firebaseError: string | null = null;

if (!admin.apps.length) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT || '';
    if (!raw || raw.trim() === '') {
      firebaseError = 'FIREBASE_SERVICE_ACCOUNT está vacía';
    } else {
      const serviceAccount = JSON.parse(raw);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  } catch (err: any) {
    firebaseError = err.message || 'Error inicializando Firebase Admin';
    console.error('Firebase init error:', firebaseError);
  }
}

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      firebase: firebaseError ? `error: ${firebaseError}` : 'initialized',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (firebaseError) {
    return res.status(500).json({ error: firebaseError });
  }

  const { title, body, url } = req.body || {};
  if (!title || !body) {
    return res.status(400).json({ error: 'Missing title or body' });
  }

  try {
    const db = admin.firestore();
    const snapshot = await db.collection('pushSubscriptions').get();
    const subscriptions = snapshot.docs.map((d) => d.data());

    let success = 0;
    let failed = 0;

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(
            { endpoint: sub.endpoint, keys: sub.keys },
            JSON.stringify({
              title,
              body,
              url: url ? (url.startsWith('/') ? '/asociacion-juvenil-pwa' + url : url) : '/asociacion-juvenil-pwa/',
            })
          );
          success++;
        } catch {
          failed++;
          if (sub.userId) {
            await db.collection('pushSubscriptions').doc(sub.userId).delete().catch(() => {});
          }
        }
      })
    );

    return res.status(200).json({ success, failed, total: subscriptions.length });
  } catch (err: any) {
    console.error('send-push error:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}
