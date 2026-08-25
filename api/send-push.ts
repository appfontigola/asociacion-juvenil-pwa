import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';
import webPush from 'web-push';

const VAPID_PUBLIC_KEY = 'BMkWPF3_4FrjVQ1iY9tua6bZ0_8hcZmSxLKQ6yjrXJX1v6En9b_rwqD4H_cE0qPDD4xuJfm952h9V1iF7C_pClQ';
const VAPID_PRIVATE_KEY = 'KFWNupFphL5lHJXIkvuy5ftvQT0PtBxKAxzRe8blxnM';
const VAPID_SUBJECT = 'mailto:admin@fontigola.com';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(
            { endpoint: sub.endpoint, keys: sub.keys },
            JSON.stringify({ title, body, url: url || '/' })
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
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
