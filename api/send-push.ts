import type { VercelRequest, VercelResponse } from '@vercel/node';

const ONESIGNAL_APP_ID = 'c39d05df-07ac-4315-b489-f13fc9d0b8bb';
const ONESIGNAL_API_URL = 'https://onesignal.com/api/v1/notifications';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ONESIGNAL_REST_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ONESIGNAL_REST_API_KEY' });
  }

  const { title, body, url } = req.body || {};
  if (!title || !body) {
    return res.status(400).json({ error: 'Missing title or body' });
  }

  try {
    const response = await fetch(ONESIGNAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        contents: { en: body },
        headings: { en: title },
        url: url || '/',
        included_segments: ['Subscribed Users'],
      }),
    });

    const data = await response.json();
    if (data.id) {
      return res.status(200).json({ success: true, id: data.id });
    }
    return res.status(400).json({ success: false, error: data.errors?.[0] || 'Unknown error' });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
}
