import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDb } from './firebase';
import { DROPBOX_APP_KEY, getDropboxRedirectUri } from '../config/dropbox';

const TOKEN_ENDPOINT = 'https://api.dropboxapi.com/oauth2/token';
const UPLOAD_ENDPOINT = 'https://content.dropboxapi.com/2/files/upload';
const SHARE_ENDPOINT =
  'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';

const CONFIG_REF = () => doc(getDb(), 'config', 'dropbox');
const ACCESS_CACHE_KEY = '@dropbox_access';

const generateCodeVerifier = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';
  let result = '';
  const array = new Uint8Array(96);
  crypto.getRandomValues(array);
  for (let i = 0; i < array.length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
};

const sha256Base64Url = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(str));
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const cacheAccessToken = (data: { access_token: string; expires_in: number }): void => {
  const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
  localStorage.setItem(
    ACCESS_CACHE_KEY,
    JSON.stringify({ accessToken: data.access_token, expiresAt })
  );
};

export const isDropboxConnected = async (): Promise<boolean> => {
  try {
    const snap = await getDoc(CONFIG_REF());
    return !!snap.data()?.refreshToken;
  } catch {
    return false;
  }
};

export const startOAuthFlow = async (): Promise<void> => {
  const verifier = generateCodeVerifier();
  const challenge = await sha256Base64Url(verifier);
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
  sessionStorage.setItem('@dropbox_verifier', verifier);
  sessionStorage.setItem('@dropbox_state', state);

  const params = new URLSearchParams({
    client_id: DROPBOX_APP_KEY,
    response_type: 'code',
    token_access_type: 'offline',
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state,
    scope: 'files.content.write sharing.write',
    redirect_uri: getDropboxRedirectUri(),
  });

  window.location.href = `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
};

export const handleOAuthCallback = async (code: string, state: string): Promise<boolean> => {
  const savedState = sessionStorage.getItem('@dropbox_state');
  if (savedState && savedState !== state) return false;
  const verifier = sessionStorage.getItem('@dropbox_verifier');
  if (!verifier) return false;

  const body = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    code_verifier: verifier,
    client_id: DROPBOX_APP_KEY,
    redirect_uri: getDropboxRedirectUri(),
  });

  try {
    const res = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (!data.refresh_token) return false;
    await setDoc(CONFIG_REF(), { refreshToken: data.refresh_token, updatedAt: new Date() });
    sessionStorage.removeItem('@dropbox_verifier');
    sessionStorage.removeItem('@dropbox_state');
    cacheAccessToken(data);
    return true;
  } catch {
    return false;
  }
};

const getAccessToken = async (): Promise<string> => {
  const cached = localStorage.getItem(ACCESS_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as { accessToken: string; expiresAt: number };
      if (parsed.expiresAt > Date.now()) return parsed.accessToken;
    } catch {
      // ignore and refresh
    }
  }

  const snap = await getDoc(CONFIG_REF());
  const refreshToken = snap.data()?.refreshToken as string | undefined;
  if (!refreshToken) throw new Error('Dropbox no conectado');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: DROPBOX_APP_KEY,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error('Error al obtener token de Dropbox');
  const data = await res.json();
  cacheAccessToken(data);
  return data.access_token as string;
};

export const uploadVideoToDropbox = async (file: File): Promise<string> => {
  const accessToken = await getAccessToken();
  const baseName = file.name.replace(/[^\w.\-]/g, '_');
  const timestamp = Date.now();
  const path = `/alarma_${timestamp}_${baseName}`;

  const uploadRes = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Dropbox-API-Arg': JSON.stringify({ path, mode: 'add', autorename: true, mute: true }),
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  });
  if (!uploadRes.ok) throw new Error('Error al subir el vídeo a Dropbox');

  const shareRes = await fetch(SHARE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path, settings: { requested_visibility: 'public' } }),
  });
  if (!shareRes.ok) throw new Error('Error al crear enlace compartido');

  const shareData = await shareRes.json();
  return shareData.url as string;
};