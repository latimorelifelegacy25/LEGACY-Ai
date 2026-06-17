import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Auth is handled directly via Google Identity Services (GIS) — no Firebase
// Auth dependency. Firebase is still initialized here because Firestore
// remains a supported data provider (see VITE_DATA_PROVIDER in dbService.ts).
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: { type: string; message?: string }) => void;
          }): GoogleTokenClient;
          revoke(accessToken: string, done: () => void): void;
        };
      };
    };
  }
}

interface GoogleTokenClient {
  requestAccessToken(overrideConfig?: { prompt?: '' | 'none' | 'consent' | 'select_account' }): void;
}

interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
  providerId?: string;
  __localFallback?: boolean;
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

const CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string | undefined;
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar',
].join(' ');
const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

type AuthListener = (user: AuthUser | null) => void;

const LOCAL_AUTH_KEY = 'nexus_crm_local_admin_session';
const configuredAuthMode = String((import.meta as any).env?.VITE_AUTH_PROVIDER || 'firebase')
  .trim()
  .toLowerCase();

const listeners = new Set<AuthListener>();
let cachedToken: string | null = null;
let scriptLoadPromise: Promise<void> | null = null;

function loadGoogleIdentityServices(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

// initTokenClient has no public setter for callback, so each call site
// rebuilds the client bound to its own callback closure.
async function getTokenClient(callback: (response: GoogleTokenResponse) => void): Promise<GoogleTokenClient> {
  if (!CLIENT_ID) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not configured. Add it to your .env file.');
  }
  await loadGoogleIdentityServices();
  return window.google!.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback,
    error_callback: (error) => callback({ error: error.type, error_description: error.message }),
  });
}

async function fetchGoogleUser(accessToken: string): Promise<AuthUser> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch Google user info');
  const data = await res.json();
  return {
    uid: data.sub,
    displayName: data.name || 'Latimore Admin',
    email: data.email ?? null,
    photoURL: data.picture ?? null,
    isAnonymous: false,
    providerId: 'google.com',
  };
}

const readLocalUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    console.warn('Could not read local Nexus CRM session:', error);
    return null;
  }
};

const writeLocalUser = (user: AuthUser | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      window.localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(LOCAL_AUTH_KEY);
    }
  } catch (error) {
    console.warn('Could not persist local Nexus CRM session:', error);
  }
};

const emitAuthChange = () => {
  listeners.forEach((listener) => listener(auth.currentUser));
};

const setCurrentUser = (user: AuthUser | null, persistLocal = false) => {
  auth.currentUser = user;
  if (persistLocal || user?.__localFallback) {
    writeLocalUser(user);
  }
  emitAuthChange();
};

export const auth: { currentUser: AuthUser | null } = {
  currentUser: readLocalUser(),
};

// Attempt a silent session restore (no popup) on load, mirroring the
// previous Firebase onAuthStateChanged behavior.
if (configuredAuthMode !== 'local') {
  (async () => {
    try {
      const client = await getTokenClient(async (response) => {
        if (!response.access_token || response.error) return;
        cachedToken = response.access_token;
        try {
          setCurrentUser(await fetchGoogleUser(response.access_token));
        } catch (error) {
          console.warn('Could not load Google profile during silent restore:', error);
        }
      });
      client.requestAccessToken({ prompt: '' });
    } catch (error) {
      console.warn('Google auth silent restore failed:', error);
    }
  })();
}

export const onAuthChange = (listener: AuthListener): (() => void) => {
  listeners.add(listener);
  listener(auth.currentUser);
  return () => listeners.delete(listener);
};

const createLocalAdminUser = (): AuthUser => ({
  uid: 'local-admin-latimore',
  displayName: 'Latimore Admin',
  email: 'admin@latimorelifelegacy.local',
  photoURL: null,
  isAnonymous: false,
  providerId: 'local',
  __localFallback: true,
});

export const signIn = async () => {
  if (configuredAuthMode === 'local') {
    const user = createLocalAdminUser();
    setCurrentUser(user, true);
    return { user };
  }

  try {
    const user = await new Promise<AuthUser>((resolve, reject) => {
      getTokenClient(async (response) => {
        if (!response.access_token || response.error) {
          reject(new Error(response.error_description || response.error || 'Google sign-in failed'));
          return;
        }
        try {
          cachedToken = response.access_token;
          resolve(await fetchGoogleUser(response.access_token));
        } catch (err) {
          reject(err);
        }
      })
        .then((client) => client.requestAccessToken({ prompt: 'consent' }))
        .catch(reject);
    });
    setCurrentUser(user);
    return { user };
  } catch (error) {
    console.error('Google authentication failed:', error);
    throw error;
  }
};

export const signInAsGuest = async () => {
  const user = createLocalAdminUser();
  setCurrentUser(user, true);
  return { user };
};

export const getAccessToken = (): string | null => cachedToken;

export const setAccessToken = (token: string | null) => {
  cachedToken = token;
};

export const getAuthProviderMode = () => configuredAuthMode;

export const logOut = async () => {
  if (cachedToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(cachedToken, () => {});
  }
  cachedToken = null;
  writeLocalUser(null);
  setCurrentUser(null);
};
