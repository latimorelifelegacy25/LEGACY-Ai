-- Backfills the unified schema (001_unified_schema.sql) from the live
-- latimore-hub-main Prisma tables (Contact / Inquiry / LeadSession /
-- Event / Appointment) that already live in this same Supabase project.
--
-- Idempotent: safe to re-run. Uses (legacy_source, legacy_id) to avoid
-- duplicate inserts on subsequent runs.
--
-- Deliberately excluded:
--   - Contacts with no email (abandoned Fillout sessions) — leads.email
--     is required by the unified schema and there is nothing to dedupe on.
--   - nexus-crm's `contacts` table (phone-contacts import, no emails,
--     not funnel/marketing data) — out of scope per decision.
--   - lead_consents — legacy rows have no stored consent text/timestamp,
--     so none are fabricated. Only leads captured through the new system
--     going forward will have consent records.

-- Maps the legacy ProductInterest enum onto the SPEC's 7 funnel slugs.
-- "General" and unmapped values intentionally fall through to null
-- (no funnel attribution existed in the legacy data).
create or replace function public._legacy_product_interest_to_funnel(p text)
returns text language sql immutable as $$
  select case p
    when 'Mortgage_Protection' then 'mortgage-protection'
    when 'Final_Expense' then 'life-insurance-basics'
    when 'Term_Life' then 'life-insurance-basics'
    when 'Whole_Life' then 'life-insurance-basics'
    when 'Child_Whole_Life' then 'life-insurance-basics'
    when 'Accident' then 'living-benefits'
    when 'Critical_Illness' then 'living-benefits'
    when 'IUL' then 'retirement-annuities'
    when 'Annuity' then 'retirement-annuities'
    when 'Retirement' then 'retirement-annuities'
    when 'Business' then 'business-key-person'
    else null
  end;
$$;

-- Maps the legacy PipelineStage enum onto the SPEC's lead_status values.
create or replace function public._legacy_stage_to_lead_status(s text)
returns text language sql immutable as $$
  select case s
    when 'New' then 'new'
    when 'Attempted_Contact' then 'nurturing'
    when 'Qualified' then 'nurturing'
    when 'Booked' then 'booked'
    when 'Sold' then 'consulted'
    when 'Follow_Up' then 'nurturing'
    when 'Lost' then 'disqualified'
    else 'new'
  end;
$$;

with ranked_inquiries as (
  select
    i.id as inquiry_id,
    i."contactId" as contact_id,
    public._legacy_product_interest_to_funnel(i."productInterest"::text) as funnel_slug,
    i.stage::text as stage,
    i."leadScore" as lead_score,
    i."landingPage" as landing_page,
    ls.referrer as referrer,
    coalesce(ls.source, i.source) as utm_source,
    coalesce(ls.medium, i.medium) as utm_medium,
    coalesce(ls.campaign, i.campaign) as utm_campaign,
    ls.content as utm_content,
    ls.term as utm_term,
    row_number() over (
      partition by i."contactId", public._legacy_product_interest_to_funnel(i."productInterest"::text)
      order by i."createdAt" desc
    ) as rn
  from public."Inquiry" i
  left join public."LeadSession" ls on ls.id = i."leadSessionId"
)
insert into public.leads (
  first_name, last_name, email, phone, zip_code,
  selected_funnel_slug, lead_score, lead_status,
  source_url, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
  legacy_source, legacy_id, created_at, updated_at
)
select
  coalesce(c."firstName", 'Unknown'),
  c."lastName",
  c.email,
  c.phone,
  null,
  ri.funnel_slug,
  greatest(coalesce(ri.lead_score, 0), coalesce(c."leadScore", 0)),
  public._legacy_stage_to_lead_status(ri.stage),
  ri.landing_page,
  ri.referrer,
  ri.utm_source,
  ri.utm_medium,
  ri.utm_campaign,
  ri.utm_content,
  ri.utm_term,
  'latimore-hub-main:Inquiry',
  ri.inquiry_id,
  c."createdAt",
  c."updatedAt"
from ranked_inquiries ri
join public."Contact" c on c.id = ri.contact_id
where ri.rn = 1
  and c.email is not null
on conflict (legacy_source, legacy_id) where legacy_source is not null do nothing;

-- Events: pass the legacy EventType straight through as event_name since
-- the unified schema leaves event_name unconstrained text. Linked to the
-- lead created above for the same contact's email (assumes at most one
-- lead per contact, true for the current dataset).
insert into public.events (
  lead_id, session_id, event_name, funnel_slug, page_url, metadata,
  legacy_source, legacy_id, created_at
)
select
  l.id,
  e."leadSessionId",
  e."eventType"::text,
  public._legacy_product_interest_to_funnel(e."productInterest"::text),
  e."pageUrl",
  coalesce(e.metadata, '{}'::jsonb)
    || jsonb_build_object(
         'legacy_source', e.source,
         'legacy_medium', e.medium,
         'legacy_campaign', e.campaign,
         'legacy_county', e.county
       ),
  'latimore-hub-main:Event',
  e.id,
  e."occurredAt"
from public."Event" e
left join public."Contact" c on c.id = e."contactId"
left join public.leads l on l.email = c.email and l.legacy_source = 'latimore-hub-main:Inquiry'
on conflict (legacy_source, legacy_id) where legacy_source is not null do nothing;

-- Bookings: from Appointment. calendly_event_uri is NOT NULL UNIQUE in the
-- unified schema, so appointments with no real Calendly event id get a
-- synthetic placeholder URI prefixed "legacy:" for traceability.
insert into public.bookings (
  lead_id, calendly_event_uri, scheduled_start_time, invitee_email, invitee_name,
  status, raw_payload, legacy_source, legacy_id, created_at, updated_at
)
select
  l.id,
  coalesce(a."calendlyEventId", 'legacy:appointment:' || a.id),
  a."scheduledFor",
  c.email,
  c."fullName",
  case a.status::text
    when 'scheduled' then 'scheduled'
    when 'confirmed' then 'scheduled'
    when 'completed' then 'completed'
    when 'cancelled' then 'canceled'
    when 'no_show' then 'canceled'
    when 'rescheduled' then 'rescheduled'
    else 'scheduled'
  end,
  jsonb_build_object(
    'id', a.id, 'source', a.source, 'medium', a.medium, 'campaign', a.campaign,
    'location', a.location, 'bookingSource', a."bookingSource", 'metadata', a.metadata
  ),
  'latimore-hub-main:Appointment',
  a.id,
  a."createdAt",
  a."updatedAt"
from public."Appointment" a
left join public."Contact" c on c.id = a."contactId"
left join public.leads l on l.email = c.email and l.legacy_source = 'latimore-hub-main:Inquiry'
on conflict (legacy_source, legacy_id) where legacy_source is not null do nothing;

drop function if exists public._legacy_product_interest_to_funnel(text);
drop function if exists public._legacy_stage_to_lead_status(text);
