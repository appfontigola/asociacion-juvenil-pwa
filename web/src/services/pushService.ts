export async function subscribeToPush(): Promise<void> {
  const w = window as any;
  if (!w.OneSignal) return;
  try {
    await w.OneSignal.registerForPushNotifications();
  } catch {}
}

export async function setExternalUserId(userId: string): Promise<void> {
  const w = window as any;
  if (!w.OneSignal) return;
  try {
    await w.OneSignal.setExternalUserId(userId);
  } catch {}
}

export async function removeExternalUserId(): Promise<void> {
  const w = window as any;
  if (!w.OneSignal) return;
  try {
    await w.OneSignal.removeExternalUserId();
  } catch {}
}
