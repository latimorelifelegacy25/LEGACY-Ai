# Latimore Notion Sync

A [Notion Workers](https://developers.notion.com/workers) project that syncs
lead, event, and booking data from Supabase into Notion databases, so the
data can be browsed, filtered, and charted in Notion without ever touching
Supabase or writing SQL directly.

## What gets synced

| Notion database | Source table    | Primary key  |
| ---------------- | ---------------- | ------------ |
| **Leads**         | `public.leads`    | `Lead ID`    |
| **Events**         | `public.events`   | `Event ID`   |
| **Bookings**       | `public.bookings`  | `Booking ID` |

`public.leads`/`events`/`bookings` are the unified schema from
`supabase-unified/sql/001_unified_schema.sql` (built from
`SPEC1LatimoreLifeLegacyEducationFunnelSystemFINAL.md`), backfilled from the
real production data in `latimore-hub-main`'s database
(`supabase-unified/sql/002_backfill_from_latimore_hub_main.sql`).

> An earlier version of this project synced `education_leads`/
> `lead_activities` (from `latimore-legacy-checkup`). Those tables were
> designed but never deployed to the live database, so they held no real
> data — production leads have always landed in the Prisma-backed tables
> instead. This version points at the schema that actually has data.

Both `Events` and `Bookings` have a two-way `Lead` relation back to `Leads`
(exposed as `Events`/`Bookings` rollups on each lead page), so you can see a
lead's full activity and booking history from its Notion page.

All three syncs run on a 15-minute schedule in `mode: "incremental"`,
paging through Supabase ordered by `(updated_at, id)` or `(created_at, id)`
so no rows are skipped or duplicated.

### Chartable fields

Once synced, build Notion board/chart/timeline views grouped or filtered by:

- **Leads**: `Funnel`, `Lead Status`, `Preferred Contact Method`,
  `Lead Score` (number), `UTM Source`/`UTM Medium`/`UTM Campaign`,
  `Created At`/`Updated At` (date). `Legacy Source` shows which leads were
  backfilled from `latimore-hub-main` vs. captured natively going forward.
- **Events**: `Event Name`, `Funnel`, `Lead` (relation, for per-lead event
  counts), `Logged At` (date).
- **Bookings**: `Status`, `Scheduled Start` (date), `Lead` (relation).

> Select properties are seeded with the known option set from the unified
> schema. If new values appear upstream, Notion adds them as new options
> automatically.

## Setup

1. Install the `ntn` CLI:

   ```bash
   curl -fsSL https://ntn.dev | bash
   ntn login
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set Supabase credentials (service role key — never commit this):

   ```bash
   ntn workers env set SUPABASE_URL=https://eoihgvahvfpgbromvzkd.supabase.co
   ntn workers env set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. Type-check:

   ```bash
   npm run check
   ```

5. Deploy:

   ```bash
   ntn workers deploy
   ```

On first deploy, Notion creates the **Leads**, **Events**, and **Bookings**
databases in your workspace. Subsequent deploys migrate the schema in place.

## Operating

```bash
# Check sync status / last run
ntn workers sync status

# Run a sync immediately (e.g. after first deploy)
ntn workers sync trigger leadsSync
ntn workers sync trigger eventsSync
ntn workers sync trigger bookingsSync

# Preview changes without writing to Notion
ntn workers sync trigger leadsSync --preview

# Re-sync everything from scratch
ntn workers sync state reset leadsSync
ntn workers sync state reset eventsSync
ntn workers sync state reset bookingsSync
```

## Building charts in Notion

The Workers SDK only syncs the underlying data — charts are built in
Notion's UI on top of the synced databases:

1. Open the **Leads** database.
2. Add a new view → **Chart**.
3. Pick a chart type (bar, donut, line) and group by a field such as
   `Funnel` or `Lead Status` to see lead distribution.
4. Use `Lead Score` with a number aggregation (average/sum) for score
   trends, or `Created At` on a timeline/line chart for leads over time.
5. Repeat for **Events**, grouping by `Event Name` or `Logged At` to see
   funnel engagement over time, and **Bookings**, grouping by `Status`.
