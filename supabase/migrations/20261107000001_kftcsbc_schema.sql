-- ============================================================================
-- KFT Collegiate School Business Club (KFTCSBC) — Production PostgreSQL Schema
-- Compliant with Supabase Security & Postgres Best Practices (RLS + Indexes)
-- ============================================================================

-- 1. Atomic Workspace State Table (Synchronizes full strongly-typed state)
create table if not exists public.kftcsbc_workspace_state (
  id text primary key,
  state jsonb not null,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.kftcsbc_workspace_state enable row level security;

-- 2. Institutional Club Settings
create table if not exists public.club_settings (
  id text primary key default 'default',
  club_name text not null,
  short_name text not null,
  tagline text not null,
  mission text not null,
  active_session text not null,
  recruitment_open boolean not null default true,
  banner_message text not null,
  contact_email text not null,
  campus_address text not null,
  office_hours text not null,
  require_independent_review boolean not null default true,
  auto_send_application_receipt boolean not null default true,
  auto_send_enquiry_receipt boolean not null default true,
  retention_months integer not null default 24,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

alter table public.club_settings enable row level security;

drop policy if exists "Public can read club_settings" on public.club_settings;
create policy "Public can read club_settings"
  on public.club_settings
  for select
  to anon, authenticated
  using ( true );

-- 3. Committee Admin Profiles (5-Role RBAC)
create table if not exists public.admin_profiles (
  id text primary key,
  full_name text not null,
  initials text not null,
  email text unique not null,
  role text not null,
  committee_title text not null,
  session_term text not null,
  status text not null default 'active',
  last_active_at timestamptz not null default now(),
  version integer not null default 1
);

create index if not exists idx_admin_profiles_role on public.admin_profiles (role);
create index if not exists idx_admin_profiles_status on public.admin_profiles (status);

alter table public.admin_profiles enable row level security;

-- 4. Events & Workshops
create table if not exists public.events (
  id text primary key,
  slug text unique not null,
  title text not null,
  category text not null,
  topic text not null,
  summary text not null,
  date_label text not null,
  time_label text not null,
  venue text not null,
  registration_state text not null default 'open',
  capacity integer not null default 60,
  registered_count integer not null default 0,
  is_past boolean not null default false,
  workflow_status text not null default 'published',
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index if not exists idx_events_workflow_status on public.events (workflow_status);
create index if not exists idx_events_is_past on public.events (is_past);

alter table public.events enable row level security;

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
  on public.events
  for select
  to anon, authenticated
  using ( workflow_status = 'published' );

-- 5. Event Seat Registrations (Student PII - Server Access Only)
create table if not exists public.event_registrations (
  id text primary key,
  event_id text not null references public.events(id) on delete cascade,
  event_title text not null,
  reference_code text unique not null,
  full_name text not null,
  student_id text not null,
  class_year text not null,
  email text not null,
  phone text not null,
  question text,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_registrations_event_id on public.event_registrations (event_id);
create index if not exists idx_event_registrations_created_at on public.event_registrations (created_at desc);

alter table public.event_registrations enable row level security;

-- 6. Membership Applications (Student PII - Server Access Only)
create table if not exists public.membership_applications (
  id text primary key,
  reference_code text unique not null,
  full_name text not null,
  class_level text not null,
  section_roll text not null,
  email text not null,
  phone text not null,
  interest_area text not null,
  statement text not null,
  status text not null default 'new',
  assigned_to text,
  assigned_to_name text,
  notice_status text not null default 'pending',
  payload jsonb not null,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index if not exists idx_membership_applications_status on public.membership_applications (status);
create index if not exists idx_membership_applications_submitted_at on public.membership_applications (submitted_at desc);

alter table public.membership_applications enable row level security;

-- 7. Public Enquiries (Student/Guardian PII - Server Access Only)
create table if not exists public.enquiries (
  id text primary key,
  reference_code text unique not null,
  sender_name text not null,
  sender_email text not null,
  sender_role text not null,
  topic text not null,
  subject text not null,
  message text not null,
  status text not null default 'open',
  assigned_to text,
  assigned_to_name text,
  payload jsonb not null,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index if not exists idx_enquiries_status on public.enquiries (status);
create index if not exists idx_enquiries_submitted_at on public.enquiries (submitted_at desc);

alter table public.enquiries enable row level security;

-- 8. Study Resources & Worksheets
create table if not exists public.resources (
  id text primary key,
  slug text unique not null,
  title text not null,
  topic text not null,
  format text not null,
  workflow_status text not null default 'published',
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index if not exists idx_resources_workflow_status on public.resources (workflow_status);
create index if not exists idx_resources_topic on public.resources (topic);

alter table public.resources enable row level security;

drop policy if exists "Public can read published resources" on public.resources;
create policy "Public can read published resources"
  on public.resources
  for select
  to anon, authenticated
  using ( workflow_status = 'published' );

-- 9. Student & Committee Articles
create table if not exists public.articles (
  id text primary key,
  slug text unique not null,
  title text not null,
  topic text not null,
  author_name text not null,
  workflow_status text not null default 'published',
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index if not exists idx_articles_workflow_status on public.articles (workflow_status);
create index if not exists idx_articles_topic on public.articles (topic);

alter table public.articles enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
  on public.articles
  for select
  to anon, authenticated
  using ( workflow_status = 'published' );

-- 10. Campus Photo Gallery Albums
create table if not exists public.gallery_albums (
  id text primary key,
  slug text unique not null,
  title text not null,
  category text not null,
  year_label text not null,
  workflow_status text not null default 'published',
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index if not exists idx_gallery_albums_workflow_status on public.gallery_albums (workflow_status);

alter table public.gallery_albums enable row level security;

drop policy if exists "Public can read published gallery_albums" on public.gallery_albums;
create policy "Public can read published gallery_albums"
  on public.gallery_albums
  for select
  to anon, authenticated
  using ( workflow_status = 'published' );

-- 11. Executive Committee Roster
create table if not exists public.committee_members (
  id text primary key,
  full_name text not null,
  role_title text not null,
  role_tier text not null,
  session_term text not null,
  sort_order integer not null default 1,
  payload jsonb not null
);

create index if not exists idx_committee_members_session on public.committee_members (session_term, sort_order);

alter table public.committee_members enable row level security;

drop policy if exists "Public can read committee_members" on public.committee_members;
create policy "Public can read committee_members"
  on public.committee_members
  for select
  to anon, authenticated
  using ( true );

-- 12. Milestones & Achievements
create table if not exists public.achievements (
  id text primary key,
  title text not null,
  category text not null,
  date_label text not null,
  impact_metric text not null,
  is_featured boolean not null default false,
  payload jsonb not null
);

alter table public.achievements enable row level security;

drop policy if exists "Public can read achievements" on public.achievements;
create policy "Public can read achievements"
  on public.achievements
  for select
  to anon, authenticated
  using ( true );

-- 13. Governance Activity & Audit Logs (Server Access Only)
create table if not exists public.activity_logs (
  id text primary key,
  actor_id text not null,
  actor_name text not null,
  actor_role text not null,
  module text not null,
  action text not null,
  target_id text not null,
  target_label text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_created_at on public.activity_logs (created_at desc);
create index if not exists idx_activity_logs_module on public.activity_logs (module);

alter table public.activity_logs enable row level security;

-- Explicit table-level SELECT grants for public content tables (Data API compatibility)
grant usage on schema public to anon, authenticated;
grant select on
  public.club_settings,
  public.events,
  public.resources,
  public.articles,
  public.gallery_albums,
  public.committee_members,
  public.achievements
to anon, authenticated;
