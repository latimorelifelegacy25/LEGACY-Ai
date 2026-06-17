// Google sign-in via Google Identity Services (GIS) — no Firebase dependency.
// Docs: https://developers.google.com/identity/oauth2/web/guides/use-token-model

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

export interface GoogleUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

const CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string | undefined;
const SCOPES = 'openid email profile https://www.googleapis.com/auth/drive';
const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let scriptLoadPromise: Promise<void> | null = null;
let cachedAccessToken: string | null = null;

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

async function fetchUserInfo(accessToken: string): Promise<GoogleUser> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch Google user info');
  const data = await res.json();
  return {
    uid: data.sub,
    displayName: data.name ?? null,
    email: data.email ?? null,
    photoURL: data.picture ?? null,
  };
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

// Attempts to silently restore a previously granted session (no popup).
// Call once on app load. Returns an unsubscribe function for symmetry with
// the previous Firebase-based listener API.
export const initAuth = (
  onAuthSuccess?: (user: GoogleUser, token: string | null) => void,
  onAuthFailure?: () => void
): (() => void) => {
  let cancelled = false;

  (async () => {
    try {
      const client = await getTokenClient(async (response) => {
        if (cancelled) return;
        if (!response.access_token || response.error) {
          cachedAccessToken = null;
          onAuthFailure?.();
          return;
        }
        cachedAccessToken = response.access_token;
        try {
          const user = await fetchUserInfo(response.access_token);
          onAuthSuccess?.(user, cachedAccessToken);
        } catch (err) {
          console.error('Failed to load Google user profile:', err);
          onAuthFailure?.();
        }
      });
      client.requestAccessToken({ prompt: '' });
    } catch (err) {
      console.error('Google auth init failed:', err);
      onAuthFailure?.();
    }
  })();

  return () => {
    cancelled = true;
  };
};

// Must be called from a button click or other direct user interaction.
export const googleSignIn = async (): Promise<{ user: GoogleUser; accessToken: string } | null> => {
  return new Promise((resolve, reject) => {
    getTokenClient(async (response) => {
      if (!response.access_token || response.error) {
        reject(new Error(response.error_description || response.error || 'Google sign-in failed'));
        return;
      }
      try {
        cachedAccessToken = response.access_token;
        const user = await fetchUserInfo(response.access_token);
        resolve({ user, accessToken: cachedAccessToken });
      } catch (err) {
        reject(err);
      }
    })
      .then((client) => client.requestAccessToken({ prompt: 'consent' }))
      .catch(reject);
  });
};

export const getAccessToken = async (): Promise<string | null> => cachedAccessToken;

export const logout = async (): Promise<void> => {
  if (cachedAccessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(cachedAccessToken, () => {});
  }
  cachedAccessToken = null;
};
