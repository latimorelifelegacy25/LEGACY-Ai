create extension if not exists pgcrypto;

create table if not exists public.education_leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text not null,
  state text not null,
  county text not null,
  priority_path text,
  family_dependents text[] not null default '{}',
  income_stability text,
  mortgage_or_debt text[] not null default '{}',
  retirement_status text,
  life_insurance_status text,
  dime_coverage text,
  living_benefits_interest text,
  estate_planning_interest text,
  legacy_score integer check (legacy_score is null or legacy_score between 0 and 100),
  lead_source text not null default 'Education Funnel',
  lead_status text not null default 'New Lead',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity timestamptz not null default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.education_leads(id) on delete set null,
  email text,
  activity_type text not null,
  activity_detail text,
  page_path text not null default '/education',
  created_at timestamptz not null default now()
);

create index if not exists education_leads_email_idx
on public.education_leads(email);

create index if not exists education_leads_status_idx
on public.education_leads(lead_status);

create index if not exists lead_activities_lead_id_idx
on public.lead_activities(lead_id);

create index if not exists lead_activities_email_idx
on public.lead_activities(email);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_education_leads_updated_at on public.education_leads;

create trigger set_education_leads_updated_at
before update on public.education_leads
for each row
execute function public.set_updated_at();

alter table public.education_leads enable row level security;
alter table public.lead_activities enable row level security;

-- No public RLS policies are required because the Next.js API routes use the server-only service role key.
-- Keep the service role key out of frontend code and public repositories.
