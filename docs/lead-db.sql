create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company text not null default '',
  name text not null,
  email text not null,
  phone text not null default '',
  inquiry_type text not null check (inquiry_type in ('project', 'partnership', 'media', 'other')),
  message text not null,
  page_path text not null default '',
  page_title text not null default '',
  referrer text not null default '',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  utm_content text not null default '',
  utm_term text not null default '',
  ga_client_id text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'lost')),
  notes text
);

alter table public.leads add column if not exists phone text not null default '';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_page_path_idx on public.leads (page_path);
create index if not exists leads_utm_campaign_idx on public.leads (utm_campaign);
create index if not exists leads_inquiry_type_idx on public.leads (inquiry_type);
create index if not exists leads_status_idx on public.leads (status);

create or replace view public.lead_daily_summary as
select
  date_trunc('day', created_at) as day,
  count(*) as lead_count,
  count(*) filter (where status = 'qualified') as qualified_count
from public.leads
group by 1
order by 1 desc;

create or replace view public.lead_page_summary as
select
  page_path,
  inquiry_type,
  count(*) as lead_count,
  min(created_at) as first_lead_at,
  max(created_at) as last_lead_at
from public.leads
group by 1, 2
order by lead_count desc, page_path asc;

create or replace view public.lead_campaign_summary as
select
  nullif(utm_campaign, '') as utm_campaign,
  count(*) as lead_count,
  count(*) filter (where status = 'qualified') as qualified_count
from public.leads
group by 1
order by lead_count desc nulls last;
