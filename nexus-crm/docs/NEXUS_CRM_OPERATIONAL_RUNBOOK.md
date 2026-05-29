# Nexus CRM Operational Runbook

## Fast repair mode

Use this when login, Firebase, Firestore, or Supabase is blocking the dashboard.

```bash
cp .env.example .env.local
printf '\nVITE_AUTH_PROVIDER="local"\nVITE_DATA_PROVIDER="local"\n' >> .env.local
npm install
npm run dev
```

Click **Sign In with Local Admin**. Data is saved in browser localStorage.

## Supabase mode

Use this only after the tables exist and your public anon key is configured.

```bash
VITE_AUTH_PROVIDER="local"
VITE_DATA_PROVIDER="supabase"
VITE_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

The app now behaves safely if Supabase is missing or fails at runtime:

- If `VITE_DATA_PROVIDER="supabase"` but URL/key are blank, it falls back to local repair mode.
- If Supabase read/write/realtime fails, it falls back to local browser storage instead of breaking the UI.
- The dashboard badge displays the active backend: Local Repair Mode, Supabase Cloud, or Firebase Sandbox.

## Firebase mode

Use this only after Firebase Auth providers and authorized domains are configured.

```bash
VITE_AUTH_PROVIDER="firebase"
VITE_DATA_PROVIDER="firebase"
```

If Firestore permissions fail, the app falls back to local browser storage.

## Verification commands

```bash
npm ci
npm run lint
npm run build
npm audit --omit=dev
npm run audit:latimore
```

## Deployment commands

```bash
npm run build
vercel --prod --yes
```

For static hosting, publish the `dist/` folder.

## Current production-hardening target

Gemini is still referenced from the browser bundle. For production, move Gemini calls behind a server-side API route and expose only a safe endpoint to the Vite client.
