# Latimore Notion Sync

A [Notion Workers](https://developers.notion.com/workers) project that syncs
Education Funnel lead data from Supabase (the database behind
`latimore-legacy-checkup`) into two Notion databases, so the data can be
viewed as charts and dashboards in Notion.

## What gets synced

| Notion database   | Source table                | Primary key   |
| ------------------ | ---------------------------- | ------------- |
| **Education Leads**  | `public.education_leads`   | `Lead ID`     |
| **Lead Activities**  | `public.lead_activities`   | `Activity ID` |

Each `Lead Activities` row has a two-way `Lead` relation back to
`Education Leads` (exposed as an `Activities` rollup on each lead), so you
can see a lead's full activity history from its Notion page.

Both syncs run on a 15-minute schedule in `mode: "incremental"`, paging
through Supabase ordered by `(updated_at, id)` / `(created_at, id)` so no
rows are skipped or duplicated.

### Chartable fields

Once synced, build Notion board/chart/timeline views grouped or filtered by:

- **Education Leads**: `Priority Path`, `Lead Status`, `Lead Source`,
  `Income Stability`, `Retirement Status`, `Life Insurance Status`,
  `DIME Coverage`, `Living Benefits Interest`, `Estate Planning Interest`,
  `Family Dependents`, `Mortgage or Debt`, `Legacy Score` (number),
  `Created At` / `Last Activity` (date).
- **Lead Activities**: `Type` (activity type), `Logged At` (date), `Lead`
  (relation, for per-lead activity counts).

Notion's chart database views (bar, line, donut) can group by any of the
select / multi-select / number / date properties above.

> Select properties are seeded with the known option set from the
> education funnel. If new values appear upstream (e.g. a new `activity_type`
> from `/api/event`), Notion adds them as new options automatically.

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

On first deploy, Notion creates the **Education Leads** and **Lead
Activities** databases in your workspace. Subsequent deploys migrate the
schema in place.

## Operating

```bash
# Check sync status / last run
ntn workers sync status

# Run a sync immediately (e.g. after first deploy)
ntn workers sync trigger educationLeadsSync
ntn workers sync trigger leadActivitiesSync

# Preview changes without writing to Notion
ntn workers sync trigger educationLeadsSync --preview

# Re-sync everything from scratch
ntn workers sync state reset educationLeadsSync
ntn workers sync state reset leadActivitiesSync
```

## Building charts in Notion

The Workers SDK only syncs the underlying data — charts are built in
Notion's UI on top of the synced databases:

1. Open the **Education Leads** database.
2. Add a new view → **Chart**.
3. Pick a chart type (bar, donut, line) and group by a field such as
   `Priority Path` or `Lead Status` to see lead distribution.
4. Use `Legacy Score` with a number aggregation (average/sum) for score
   trends, or `Created At` on a timeline/line chart for leads over time.
5. Repeat for **Lead Activities**, grouping by `Type` or `Logged At` to see
   funnel engagement over time.
