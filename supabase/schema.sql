-- BuildTrial database. Run this once in Supabase: SQL Editor > New query > paste > Run.
-- Every table has Row Level Security, so a user can only see their own data.

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '',
  type text not null default 'software' check (type in ('software', 'hardware', 'both')),
  roadmap_json jsonb,
  created_at timestamptz not null default now()
);

create table public.issues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null default auth.uid() references auth.users(id),
  title text not null check (char_length(title) between 1 and 200),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'fixed', 'verified')),
  steps text not null default '',
  expected text not null default '',
  actual text not null default '',
  error_log text not null default '',
  code_version text not null default '',
  created_at timestamptz not null default now()
);

create table public.issue_events (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  created_by uuid not null default auth.uid() references auth.users(id),
  type text not null check (type in ('comment', 'fix', 'retest')),
  note text not null default '',
  result text check (result in ('pass', 'fail')),
  created_at timestamptz not null default now()
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  event_id uuid references public.issue_events(id) on delete set null,
  created_by uuid not null default auth.uid() references auth.users(id),
  file_path text not null,
  kind text not null default 'screenshot' check (kind in ('screenshot', 'log', 'circuit', 'reading', 'other')),
  created_at timestamptz not null default now()
);

create table public.share_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  token text not null unique default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index on public.issues (project_id);
create index on public.issue_events (issue_id);
create index on public.attachments (issue_id);
create index on public.share_links (project_id);

alter table public.projects     enable row level security;
alter table public.issues       enable row level security;
alter table public.issue_events enable row level security;
alter table public.attachments  enable row level security;
alter table public.share_links  enable row level security;

create policy "own projects" on public.projects for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "own issues" on public.issues for all
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "own events" on public.issue_events for all
  using (exists (select 1 from public.issues i join public.projects p on p.id = i.project_id
                 where i.id = issue_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.issues i join public.projects p on p.id = i.project_id
                      where i.id = issue_id and p.owner_id = auth.uid()));

create policy "own attachments" on public.attachments for all
  using (exists (select 1 from public.issues i join public.projects p on p.id = i.project_id
                 where i.id = issue_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.issues i join public.projects p on p.id = i.project_id
                      where i.id = issue_id and p.owner_id = auth.uid()));

create policy "own share links" on public.share_links for all
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));
