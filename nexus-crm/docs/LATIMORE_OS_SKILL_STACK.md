# Latimore OS Skill Stack

This package now includes a practical Latimore OS workflow layer distilled from the uploaded skill/tool repositories.

## What was reviewed

| Uploaded package | Useful takeaway for Latimore OS | Decision |
|---|---|---|
| `awesome-claude-skills-main` | Broad catalog of development, testing, CRM, research, and automation skills. Best used as an index, not copied wholesale. | Keep as discovery source. Do not merge 9,000+ skills into the CRM repo. |
| `superpowers-main` | Strong engineering methodology: clarify objective, write spec, plan implementation, execute in small steps, verify with tests/build, keep fix log. | Merged as Latimore OS codebase audit workflow. |
| `notebooklm-py-main` | Mature NotebookLM CLI/API patterns for source ingestion, source-grounded Q&A, artifact generation, and auth diagnostics. | Merged as optional research-to-content workflow documentation. |
| `qiaomu-anything-to-notebooklm-main` | Content ingestion patterns for URLs, PDFs, Office docs, audio/video, and ZIP source processing before NotebookLM generation. | Merged as optional content-ingestion workflow documentation. |
| `nexus-crm-4-patched` | Operational CRM shell with local auth/data fallback, Firebase optional mode, Supabase optional mode, and Latimore business modules. | Patched and kept as the working app. |

## Operating doctrine

Latimore OS should treat every system update as a closed loop:

1. **Ingest**: collect uploaded files, repo zips, screenshots, Vercel logs, Supabase errors, or user notes.
2. **Classify**: decide whether the task is CRM, website, marketing/content, automation, research, or data.
3. **Patch**: apply the smallest complete change that makes the system operational.
4. **Verify**: run available checks: `npm run lint`, `npm run build`, `npm audit --omit=dev`, and any task-specific test.
5. **Log**: update `CODEBASE_FIX_LOG.md` with what changed, what passed, and what remains.
6. **Package**: return a deployable zip or exact commands.

## Priority workflows now included

### 1. Codebase Audit & Fix Loop

Use for Nexus CRM, Latimore website, Vercel builds, Supabase routes, and admin dashboard work.

Outputs:
- prioritized blocker list
- applied patch
- verification results
- updated fix log
- deploy commands

### 2. CRM Ops Loop

Use for lead capture, follow-up, pipeline hygiene, contact imports, and local/Supabase/Firebase data-mode issues.

Outputs:
- backend mode diagnosis
- schema status
- lead/contact/deal/activity integrity checks
- next operational action

### 3. Research → NotebookLM → Content Loop

Use for carrier brochures, product PDFs, estate planning docs, training decks, and local market research.

Outputs:
- source summary
- client-facing education content
- social/GBP posts
- sales scripts
- internal training notes

## Guardrails

- Do not expose production secrets in client code.
- Prefer server-side API routes for Gemini, CRM writes, and privileged Supabase operations.
- Keep local repair mode available so the CRM never becomes unusable during Firebase/Supabase configuration work.
- Treat permissive Supabase policies as development-only.
- Every CRM record must carry `ownerUid` in the browser model and `owner_uid` in Supabase.
