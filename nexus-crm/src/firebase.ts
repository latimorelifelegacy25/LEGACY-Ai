import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInAnonymously,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export type AuthUser = Pick<User, 'uid' | 'displayName' | 'email' | 'photoURL'> & {
  isAnonymous?: boolean;
  providerId?: string;
  __localFallback?: boolean;
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

googleProvider.addScope('https://www.googleapis.com/auth/contacts');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/calendar');

type AuthListener = (user: AuthUser | null) => void;

const LOCAL_AUTH_KEY = 'nexus_crm_local_admin_session';
const configuredAuthMode = String((import.meta as any).env?.VITE_AUTH_PROVIDER || 'firebase')
  .trim()
  .toLowerCase();

const listeners = new Set<AuthListener>();
let cachedToken: string | null = null;

const normalizeFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName || 'Latimore Admin',
    email: user.email,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    providerId: user.providerId,
  };
};

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

if (configuredAuthMode !== 'local') {
  firebaseOnAuthStateChanged(firebaseAuth, (firebaseUser) => {
    if (firebaseUser) {
      setCurrentUser(normalizeFirebaseUser(firebaseUser));
      return;
    }

    // Do not let a missing Firebase session wipe the intentional local fallback session.
    const localUser = readLocalUser();
    if (localUser?.__localFallback) {
      setCurrentUser(localUser, true);
      return;
    }

    setCurrentUser(null);
  });
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
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) cachedToken = credential.accessToken;
    setCurrentUser(normalizeFirebaseUser(result.user));
    return result;
  } catch (error) {
    console.error('Google popup authentication failed:', error);
    throw error;
  }
};

export const signInAsGuest = async () => {
  if (configuredAuthMode !== 'local') {
    try {
      const result = await signInAnonymously(firebaseAuth);
      setCurrentUser(normalizeFirebaseUser(result.user));
      return result;
    } catch (error) {
      console.warn('Firebase anonymous auth failed. Falling back to local admin session:', error);
    }
  }

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
  cachedToken = null;
  writeLocalUser(null);
  setCurrentUser(null);

  if (configuredAuthMode !== 'local') {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.warn('Firebase sign-out failed after local session was cleared:', error);
    }
  }
};
