import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const auth = admin.auth();
    await auth.deleteUser(userId);

    const db = admin.firestore();
    await db.collection('users').doc(userId).delete();

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
