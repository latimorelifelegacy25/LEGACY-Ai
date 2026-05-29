-- DEV ONLY. Do not use these policies for a public production CRM.
-- These policies allow the browser anon key to read/write all Nexus CRM rows.
-- Use only for a private test project while wiring the dashboard.

alter table contacts enable row level security;
alter table deals enable row level security;
alter table activities enable row level security;
alter table contents enable row level security;
alter table social_accounts enable row level security;
alter table social_posts enable row level security;

create policy "dev_allow_all_contacts" on contacts for all using (true) with check (true);
create policy "dev_allow_all_deals" on deals for all using (true) with check (true);
create policy "dev_allow_all_activities" on activities for all using (true) with check (true);
create policy "dev_allow_all_contents" on contents for all using (true) with check (true);
create policy "dev_allow_all_social_accounts" on social_accounts for all using (true) with check (true);
create policy "dev_allow_all_social_posts" on social_posts for all using (true) with check (true);
