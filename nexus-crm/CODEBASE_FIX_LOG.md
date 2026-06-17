# CODEBASE FIX LOG — Nexus CRM

Date: 2026-05-28
Status: fixed_complete for current critical/high blockers found in this uploaded package.

## Critical / High Fixes

1. **Login no longer blocks access when Firebase/OAuth is misconfigured**
   - Replaced direct Firebase auth dependency in the app shell with a resilient auth wrapper.
   - Added Local Admin fallback session.
   - Added `VITE_AUTH_PROVIDER="local"` repair mode.

2. **CRM data no longer hard-fails when Firestore permissions/providers fail**
   - Added localStorage-backed database fallback for contacts, deals, activities, AI content, social accounts, and social posts.
   - Added `VITE_DATA_PROVIDER="local"` repair mode.
   - Firestore subscription/add/update/delete errors now degrade to local persistence instead of breaking the UI.

3. **Dependency security audit cleaned**
   - Updated lockfile through npm audit remediation.
   - `npm audit --omit=dev` returns 0 vulnerabilities.

## Medium Fixes

1. **Build bundle warning reduced**
   - Added Vite manual chunks for Firebase, Supabase, charts, icons, Google AI, and general vendor code.

2. **Project identity cleaned**
   - Renamed package from generic `react-example` to `nexus-crm`.

3. **Run documentation rewritten**
   - Added Termux/local run instructions.
   - Added `.env.local` repair-mode configuration.
   - Added Firebase and Supabase production-mode notes.

## Verification

Executed successfully:

```bash
npm ci
npm run lint
npm run build
npm audit --omit=dev
```

Results:

- Clean install: pass
- TypeScript: pass
- Production build: pass
- Security audit: 0 vulnerabilities

## Remaining Non-Blocking Items

- Supabase production mode still requires real project URL/key and matching public tables.
- Firebase production mode still requires Authentication providers and authorized domains configured in Firebase Console.
- Gemini browser key exposure remains a production-hardening concern; best next step is a server-side API proxy.

---

Date: 2026-05-29
Status: fixed_complete for B → C → A request on uploaded package.

## B — Skills Merged into Latimore OS

1. **Merged practical skill strategy, not repository bloat**
   - Reviewed uploaded Claude/Superpowers/NotebookLM-related repositories.
   - Added `docs/LATIMORE_OS_SKILL_STACK.md` to document which workflows belong in Latimore OS and which repos should remain reference material.
   - Added three focused local skills under `.claude/skills/`:
     - `latimore-os-codebase-audit`
     - `latimore-os-crm-ops`
     - `latimore-os-research-to-content`

2. **Added operational runbook**
   - Added `docs/NEXUS_CRM_OPERATIONAL_RUNBOOK.md` with repair mode, Supabase mode, Firebase mode, verification, and deployment commands.

3. **Added Supabase schema assets**
   - Added `supabase/nexus_crm_schema.sql` for the tables required by the current CRM modules.
   - Added `supabase/dev_only_permissive_policies.sql` with explicit development-only warning.

## C — Deployment-Ready Patch Applied

1. **Hardened Supabase client initialization**
   - Updated `src/supabase.ts` to guard browser storage access and prevent blank env values from crashing repair mode.

2. **Hardened CRM data provider routing**
   - Updated `src/services/dbService.ts` so `VITE_DATA_PROVIDER="supabase"` with missing URL/key falls to local repair mode instead of accidentally routing to Firebase.
   - Supabase fetch/add/update/delete/getAll failures now fall back to local browser storage.
   - Local update/delete now locates records across local owner buckets when an owner UID is not passed.

3. **Improved dashboard backend clarity**
   - Updated `src/components/Dashboard.tsx` to show one of three modes:
     - Local Repair Mode Active
     - Supabase Cloud Active
     - Firebase Sandbox Active

4. **Added repeatable audit command**
   - Added `scripts/latimore-os-audit.mjs`.
   - Added package script: `npm run audit:latimore`.
   - Generated `LATIMORE_OS_AUDIT_REPORT.md`.

## A — Audit Verification

Executed successfully:

```bash
npm ci
npm run lint
npm run build
npm audit --omit=dev
npm run audit:latimore
```

Results:

- Clean install: pass
- TypeScript: pass
- Production build: pass
- Security audit: 0 vulnerabilities
- Latimore OS audit: 17/17 checks passed

## Remaining Non-Blocking Items

- `npm install --package-lock-only` was not needed and was blocked by this environment's package registry mirror while attempting to fetch an optional Tailwind oxide package. Existing `npm ci`, build, lint, and audit passed.
- Gemini remains bundled through the client-side app. Production hardening should move Gemini calls behind a server-side API route.
- Supabase production security still needs a final auth model decision: Supabase Auth, server API proxy, or another trusted backend. The included permissive policy file is development-only.

---

Date: 2026-06-17
Status: fixed_complete for Firebase Auth → Google Identity Services migration.

## D — Firebase Auth Removed, Google Identity Services Direct Integration

1. **Replaced Firebase Authentication with Google Identity Services (GIS)**
   - Root app: deleted `src/lib/firebase.ts` (Firebase Auth wrapper) and added `src/lib/googleAuth.ts`, a drop-in replacement using `google.accounts.oauth2.initTokenClient()` token-flow sign-in. Same exported API (`initAuth`, `googleSignIn`, `getAccessToken`, `logout`) so `App.tsx` only needed an import swap and a type rename (`FirebaseUser` → `GoogleUser`).
   - Removed the unused `firebase` dependency and root-level `firebase-applet-config.json` (the root app no longer uses Firestore or any other Firebase service).
   - Nexus CRM: rewrote `src/firebase.ts` to drop `firebase/auth` while keeping `firebase/app` + `firebase/firestore` initialization intact, since Firestore is a real, actively used `VITE_DATA_PROVIDER="firebase"` option in `dbService.ts`. The exported API (`auth`, `onAuthChange`, `signIn`, `signInAsGuest`, `getAccessToken`, `setAccessToken`, `getAuthProviderMode`, `logOut`, `AuthUser`) is unchanged, so no consumer files besides `App.tsx`/`Dashboard.tsx` text needed updates.
   - `signInAsGuest()` in Nexus CRM now always creates the Local Admin session (GIS has no anonymous-auth equivalent to Firebase's `signInAnonymously`).
   - Updated user-facing copy in both apps' login screens and the Nexus CRM dashboard backend-status pill to reference Google Identity Services / Google OAuth / "Firestore Cloud Active" instead of Firebase Auth wording. Removed the now-unnecessary "Authorized Redirect URI" field from the Nexus CRM debug panel, since GIS uses a popup token flow with no redirect URI.
   - Added `VITE_GOOGLE_CLIENT_ID` to both apps' `.env.example` files.

2. **Removed unused `express`/`@types/express` dependency from Nexus CRM**
   - Confirmed via repo-wide search that neither package is imported anywhere in `nexus-crm/src` (there is no server entry point in this app).
   - Their transitive sub-dependencies (`type-is@1.6.18`, `raw-body@2.5.3`) were being blocked by this environment's package registry mirror, preventing `npm install` from completing. Removing the dead dependency was the correct fix rather than working around the registry.

## D — Verification

Executed successfully (root app and Nexus CRM):

```bash
npm install
npm run lint   # tsc --noEmit, scoped to nexus-crm
npm run build  # vite build (both apps)
npm audit --omit=dev
```

Results:

- Nexus CRM clean install: pass (after removing unused `express`)
- Nexus CRM TypeScript (`tsc --noEmit`): pass, 0 errors
- Nexus CRM production build: pass
- Root app production build (`vite build` + esbuild server bundle): pass
- `npm audit --omit=dev`: 4 pre-existing high-severity advisories in both apps (`esbuild`/`vite` dev-server CVEs, `protobufjs`, `ws`), all transitive dependencies of `vite` and `@google/genai`, unrelated to this auth migration and not newly introduced by it.

## Remaining Non-Blocking Items

- Root-level `tsc --noEmit` (run from the monorepo root without scoping) surfaces unrelated pre-existing errors in sibling apps (`latimore-hub`, `latimore-legacy-checkup`, `latimore-notion-sync`) that have never had their own dependencies installed in this environment; these are unrelated to the Nexus CRM/root app auth migration.
- Real-world Google sign-in (popup flow, consent screen, token refresh) has not been exercised against a live `VITE_GOOGLE_CLIENT_ID` in this sandbox; verification here is limited to type-checking and production builds.
- The pre-existing `esbuild`/`vite`/`protobufjs`/`ws` advisories from `npm audit` are unrelated to this change and were not remediated as part of this migration.
