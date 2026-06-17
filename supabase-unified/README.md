# Unified Schema (SPEC-1)

Implements the database schema from `SPEC1LatimoreLifeLegacyEducationFunnelSystemFINAL.md`
(`funnels`, `leads`, `lead_consents`, `quiz_responses`, `events`, `bookings`)
in the shared Supabase project `eoihgvahvfpgbromvzkd` ("Latimore-hub"), the
same project already used by `latimore-hub-main` (production) and `nexus-crm`.

This is additive only. It does not modify, rename, or drop any existing
table from the Prisma schema, nexus-crm, or `latimore-legacy-checkup`.

## Why this exists

The Supabase project had accumulated five overlapping, mostly-disconnected
schemas (Prisma/CRM, nexus-crm, an unused `leads`/`tracking_events` set, an
unused intake/DIME-calculator set, and an automation/ops layer). The SPEC
schema is the agreed target for unifying lead capture, funnel attribution,
quiz routing, and bookings going forward.

## Files

- `sql/001_unified_schema.sql` — creates the SPEC tables, seeds the 7 MVP
  funnels, adds `legacy_source`/`legacy_id` traceability columns (not in
  the original SPEC) so backfilled rows are distinguishable and re-runs
  are idempotent.
- `sql/002_backfill_from_latimore_hub_main.sql` — backfills real production
  data from the live Prisma tables (`Contact`, `Inquiry`, `LeadSession`,
  `Event`, `Appointment`) into the new schema.

## Backfill scope and decisions

- **Source of truth**: `latimore-hub-main`'s Prisma tables. This is where
  the live `/education` page and all other production lead capture
  actually write to today — `latimore-legacy-checkup`'s own
  `education_leads`/`lead_activities` schema was designed but never
  deployed/applied, so it holds no data.
- **nexus-crm's `contacts` table (300 rows) was excluded.** It's a bulk
  phone-contacts import (no emails, single `owner_uid`), not funnel/lead
  data, and `leads.email` is required by the unified schema.
- **No consent records were fabricated.** Legacy `Contact`/`Inquiry` rows
  have no stored consent text or timestamp. Per the SPEC's own compliance
  requirements (exact consent text + timestamp + source URL), inventing
  one would create a misleading compliance record. `lead_consents` stays
  empty for backfilled leads; only leads captured through the new system
  going forward will have real consent rows.
- **Funnel attribution is inferred**, not authoritative. Legacy data only
  has the Prisma `ProductInterest` enum, which is mapped onto the SPEC's
  7 funnel slugs by `_legacy_product_interest_to_funnel()` in the backfill
  script (e.g. `Mortgage_Protection` → `mortgage-protection`, `IUL` →
  `retirement-annuities`, `General` → no funnel). Review this mapping if
  funnel-level reporting on legacy leads needs to be precise.
- Contacts with no email (3 abandoned Fillout sessions) are skipped —
  there's nothing to dedupe on and `leads.email` is required.

## Applying

Run `001_unified_schema.sql` then `002_backfill_from_latimore_hub_main.sql`
against project `eoihgvahvfpgbromvzkd`, e.g. via the Supabase SQL editor,
CLI, or MCP `apply_migration`. Both are idempotent and safe to re-run.
