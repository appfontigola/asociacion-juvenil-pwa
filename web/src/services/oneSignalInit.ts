import { ONESIGNAL_APP_ID } from '../config/onesignal';

let loaded = false;
let ready: Promise<void> | null = null;

function loadSDK(): Promise<void> {
  if (ready) return ready;
  ready = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
  return ready;
}

export async function initOneSignal(): Promise<void> {
  if (loaded) return;
  loaded = true;
  await loadSDK();
  const w = window as any;
  w.OneSignalDeferred = w.OneSignalDeferred || [];
  return new Promise((resolve) => {
    w.OneSignalDeferred.push(async function (OneSignal: any) {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        notifyButton: { enable: false },
        welcomeNotification: { disable: true },
        allowLocalhostAsSecureOrigin: true,
      });
      resolve();
    });
  });
}

export async function promptOneSignalPermission(): Promise<boolean> {
  const w = window as any;
  if (!w.OneSignal) return false;
  try {
    const granted = await w.OneSignal.Notifications.requestPermission();
    return granted;
  } catch {
    return false;
  }
}

export async function isOneSignalSubscribed(): Promise<boolean> {
  const w = window as any;
  if (!w.OneSignal) return false;
  try {
    return await w.OneSignal.User.PushSubscription.optedIn;
  } catch {
    return false;
  }
}
