const API_BASE = 'https://asociacion-juvenil-pwa.vercel.app';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function isPushEnabled(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch {
    return false;
  }
}

export async function sendPushNotification(
  title: string,
  body: string,
  url?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/api/send-push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, url }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
