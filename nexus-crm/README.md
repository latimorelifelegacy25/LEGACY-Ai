# Nexus CRM — Latimore Repair Build

This patched build keeps the CRM operational even when Firebase Google OAuth, anonymous auth, or Firestore rules are not fully configured.

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

### Firebase-backed CRM

```bash
VITE_AUTH_PROVIDER="firebase"
VITE_DATA_PROVIDER="firebase"
```

Make sure Firebase Authentication has Google and/or Anonymous sign-in enabled, and add your deployed domain to Firebase Authentication authorized domains.

## Verification

```bash
npm run lint
npm run build
npm audit --omit=dev
```
