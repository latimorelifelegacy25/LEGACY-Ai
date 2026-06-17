# Nexus CRM — Latimore Repair Build

This patched build keeps the CRM operational even when Google OAuth (via Google Identity Services) or Firestore rules are not fully configured.

## Fast local run in Termux

```bash
cd ~/latimore-nexus-crm
npm install
cp .env.example .env.local
npm run dev
```

Open the local Vite URL and click **Sign In with Local Admin**.

## Recommended repair-mode `.env.local`

```bash
VITE_AUTH_PROVIDER="local"
VITE_DATA_PROVIDER="local"
VITE_GEMINI_API_KEY=""
GEMINI_API_KEY=""
VITE_GEMINI_MODEL="gemini-2.5-flash"
VITE_SUPABASE_URL=""
VITE_SUPABASE_ANON_KEY=""
```


### Gemini AI content tools

The AI content and personalized email tools use `VITE_GEMINI_API_KEY` first, then fall back to legacy `GEMINI_API_KEY`. The default model is `gemini-2.5-flash`; override it with `VITE_GEMINI_MODEL` if needed.

## Production modes

### Supabase-backed CRM

```bash
VITE_AUTH_PROVIDER="local"
VITE_DATA_PROVIDER="supabase"
VITE_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

### Google-auth-backed CRM (Firestore data)

```bash
VITE_AUTH_PROVIDER="firebase"
VITE_DATA_PROVIDER="firebase"
VITE_GOOGLE_CLIENT_ID="YOUR_GOOGLE_OAUTH_CLIENT_ID"
```

Sign-in uses Google Identity Services directly (no Firebase Auth dependency). Create an OAuth 2.0 Web client ID in Google Cloud Console under APIs & Services > Credentials, and add your deployed domain to that client's Authorized JavaScript origins. Firestore is still used for data storage and configured separately via `firebase-applet-config.json`.

## Verification

```bash
npm run lint
npm run build
npm audit --omit=dev
```
