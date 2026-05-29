---
name: latimore-os-codebase-audit
description: Audit and patch Latimore OS codebases, especially Nexus CRM, Next.js/Vite apps, Supabase integrations, Firebase auth, Vercel deployments, and build failures.
---

# Latimore OS Codebase Audit & Fix Loop

Use this skill when a repo zip, build log, terminal error, deployment issue, CRM failure, or "Go" instruction is provided.

## Workflow

1. Load the latest repo state and identify stack: Vite, Next.js, Firebase, Supabase, Gemini, Vercel, or static hosting.
2. Run or infer the available checks from `package.json`.
3. Prioritize blockers:
   - Critical: cannot install, cannot build, cannot login, app crashes, missing env guard, exposed server secret.
   - High: data write failure, auth provider mismatch, webhook break, broken route, deployment blocker.
   - Medium: warnings, UX confusion, missing docs, missing schema, missing fallback.
4. Apply the smallest complete patch.
5. Verify with available commands: `npm ci`, `npm run lint`, `npm run build`, `npm audit --omit=dev`.
6. Update `CODEBASE_FIX_LOG.md` with changed files, verification results, and remaining items.

## Nexus CRM defaults

- Keep `VITE_AUTH_PROVIDER="local"` available.
- Keep `VITE_DATA_PROVIDER="local"` available.
- Supabase failures must degrade to local mode instead of blocking the app.
- Firebase failures must degrade to local mode instead of blocking the app.
- Do not require Google OAuth to enter the CRM during repair.
