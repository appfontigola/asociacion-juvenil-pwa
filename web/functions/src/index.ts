import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as webpush from 'web-push';

admin.initializeApp();

const VAPID_PUBLIC_KEY = 'BGiEmkmWPlw-E7VQkjLSrl9PLLi1dDsZVQVkg3qMMC3oA3VPx00Bk4JJWjrzgqbsjvKMfXdvgorxoWkwgkpWxk';
const VAPID_PRIVATE_KEY = '0dh1m0PNKu-9un0AZstK-PjS5w-fYjngaukBA4nPFOY';

webpush.setVapidDetails('mailto:admin@app-fontigola.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export const sendPushNotification = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userData = userDoc.data();
    if (!userData || userData.role !== 'admin') {
      res.status(403).json({ error: 'Solo administradores' });
      return;
    }

    const { title, body, url } = req.body;
    if (!title || !body) {
      res.status(400).json({ error: 'Faltan título o cuerpo' });
      return;
    }

    const snapshot = await admin.firestore().collection('pushSubscriptions').get();
    const results = { success: 0, failed: 0, total: snapshot.docs.length };

    const promises = snapshot.docs.map(async (d) => {
      const sub = d.data();
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify({ title, body, url: url || '/' })
        );
        results.success++;
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await d.ref.delete();
        }
        results.failed++;
      }
    });

    await Promise.allSettled(promises);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
