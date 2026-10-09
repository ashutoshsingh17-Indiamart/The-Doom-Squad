-- Run once in your Supabase project's SQL Editor. Safe to run again.
begin;
create table if not exists public.voiceops_prompts (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  content text not null,
  improvement text not null default '',
  model text,
  created_at timestamptz not null default now()
);
create table if not exists public.voiceops_experiments (
  id uuid primary key,
  name text not null,
  status text not null,
  scenario text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.voiceops_prompts enable row level security;
alter table public.voiceops_experiments enable row level security;
revoke all on public.voiceops_prompts, public.voiceops_experiments from anon, authenticated;
grant usage on schema public to service_role;
grant select, insert, update, delete on public.voiceops_prompts, public.voiceops_experiments to service_role;
commit;
