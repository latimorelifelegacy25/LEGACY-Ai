# Nexus CRM Review + Patch Report

## Validation

- `npm ci --no-audit --no-fund`: passed
- `npm run lint`: passed
- `npm run build`: passed
- `npm audit --omit=dev`: passed, 0 vulnerabilities
- `npm run audit:latimore`: passed, 17/17 checks

## Fixes applied

1. Gemini runtime hardening
   - Replaced eager Gemini client construction with lazy initialization.
   - Added a clear runtime error when no Gemini API key is configured.
   - Added `VITE_GEMINI_API_KEY` and `VITE_GEMINI_MODEL` support.
   - Updated the default Gemini model from `gemini-3.5-flash` to `gemini-2.5-flash`.

2. AI UX fixes
   - AI Content now displays generation failures in the UI instead of silently logging them.
   - Contact personalized-email drafting now displays Gemini failures in the modal.

3. Gmail MIME safety
   - Sanitized MIME headers to prevent CRLF/header injection.
   - Escaped email body HTML before sending via Gmail API.
   - Added recipient validation before calling Gmail send.

4. Supabase tenant-scope hardening
   - Supabase update/delete queries now include `owner_uid` when available.
   - Delete/update callers now pass `auth.currentUser.uid` across contacts, content, social posts, activities, and pipeline deals.

5. Environment and docs
   - Updated `.env.example`.
   - Updated README repair-mode config and Gemini notes.
   - Updated Vite compatibility mapping for legacy `GEMINI_API_KEY`.

## Review notes

- The project already had strong local-repair fallback coverage for Firebase/Supabase failures.
- Build output is sizable because Firebase, Supabase, Recharts, and Google AI SDK are bundled as separate chunks. This is acceptable for a CRM, but route-level lazy loading would improve first-load performance.
- Production Supabase security still depends on replacing permissive dev policies with real RLS or a server-side API proxy. The client-side owner filters are a useful guard, not a complete authorization boundary.
- Browser-bundled Gemini keys are usable for local/private repair mode, but production should proxy Gemini calls through a backend.
