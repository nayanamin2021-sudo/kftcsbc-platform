-- =============================================================================
-- KFTCSBC (KFT Collegiate School Business Club)
-- Full Schema, Governance Constraints, Triggers & RLS Policies
-- Follows Supabase Postgres Best Practices
-- =============================================================================

-- 1. Custom Enum Types
create type public.admin_role as enum (
  'site_owner',
  'publisher',
  'content_editor',
  'membership_reviewer',
  'enquiry_handler'
);

create type public.account_status as enum (
  'active',
  'invited',
  'suspended'
);

create type public.workflow_status as enum (
  'draft',
  'in_review',
  'changes_requested',
  'approved',
  'published',
  'archived'
);

create type public.application_status as enum (
  'new',
  'in_review',
  'approved',
  'declined'
);

create type public.enquiry_status as enum (
  'open',
  'in_progress',
  'resolved',
  'archived'
);

create type public.notice_status as enum (
  'pending',
  'sent',
  'failed',
  'manual'
);

-- 2. Admin Profiles Table
create table public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null unique,
  full_name text not null,
  initials text not null,
  role public.admin_role not null,
  committee_title text not null,
  session_term text not null default '2026–27',
  status public.account_status not null default 'active',
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index idx_admin_profiles_role on public.admin_profiles(role);
create index idx_admin_profiles_status on public.admin_profiles(status);

-- Last-Owner Protection Trigger (Figma Governance Rule: Cannot remove or suspend last active Site Owner)
create or replace function public.prevent_last_owner_removal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  remaining_owners integer;
begin
  if (tg_op = 'DELETE' and old.role = 'site_owner' and old.status = 'active') or
     (tg_op = 'UPDATE' and old.role = 'site_owner' and old.status = 'active' and (new.role <> 'site_owner' or new.status <> 'active')) then
    select count(*) into remaining_owners
    from public.admin_profiles
    where role = 'site_owner'
      and status = 'active'
      and id <> old.id;

    if remaining_owners < 1 then
      raise exception 'LAST_OWNER_PROTECTION: At least one active Site Owner account must remain in the workspace.';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger trg_prevent_last_owner_removal
before update or delete on public.admin_profiles
for each row execute function public.prevent_last_owner_removal();

-- 3. Admin Invitations & Owner Handovers
create table public.admin_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  role public.admin_role not null,
  committee_title text not null,
  invited_by uuid references public.admin_profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_admin_invitations_invited_by on public.admin_invitations(invited_by);

create table public.owner_handovers (
  id uuid primary key default gen_random_uuid(),
  from_owner_id uuid not null references public.admin_profiles(id) on delete restrict,
  to_admin_id uuid not null references public.admin_profiles(id) on delete restrict,
  target_session text not null default '2027–28',
  checklist_completed boolean not null default false,
  note text,
  status text not null default 'ready' check (status in ('ready', 'completed', 'cancelled')),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 4. Events & Event Registrations (Independent Review Enforced)
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  topic text not null,
  summary text not null,
  body text not null,
  date_label text not null,
  time_label text not null,
  venue text not null,
  cover_image text not null,
  registration_state text not null default 'open' check (registration_state in ('open', 'closed', 'completed', 'cancelled')),
  registration_mode text not null default 'in_app' check (registration_mode in ('in_app', 'external')),
  external_url text,
  capacity integer not null default 60,
  registered_count integer not null default 0,
  is_past boolean not null default false,
  workflow_status public.workflow_status not null default 'draft',
  author_id uuid references public.admin_profiles(id) on delete set null,
  reviewer_id uuid references public.admin_profiles(id) on delete set null,
  approved_by uuid references public.admin_profiles(id) on delete set null,
  review_note text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1,
  constraint events_independent_review_chk check (
    workflow_status not in ('approved', 'published')
    or (approved_by is not null and author_id is not null and approved_by <> author_id)
  )
);

create index idx_events_workflow_status on public.events(workflow_status);
create index idx_events_author_id on public.events(author_id);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text not null,
  student_id text not null,
  class_year text not null,
  email text not null,
  phone text,
  question text,
  created_at timestamptz not null default now()
);

create index idx_event_registrations_event_id on public.event_registrations(event_id);

-- 5. Membership Applications
create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  full_name text not null,
  class_level text not null,
  section_roll text not null,
  email text not null,
  phone text not null,
  interest_area text not null,
  statement text not null,
  prior_experience text,
  status public.application_status not null default 'new',
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  decision_by uuid references public.admin_profiles(id) on delete set null,
  decision_reason text,
  decision_at timestamptz,
  notice_status public.notice_status not null default 'pending',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index idx_membership_applications_status on public.membership_applications(status);
create index idx_membership_applications_assigned_to on public.membership_applications(assigned_to);

-- 6. Enquiries
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  sender_name text not null,
  sender_email text not null,
  sender_role text not null,
  topic text not null,
  subject text not null,
  message text not null,
  status public.enquiry_status not null default 'open',
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  response_text text,
  responded_at timestamptz,
  notice_status public.notice_status not null default 'pending',
  linked_record_type text,
  linked_record_id text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index idx_enquiries_status on public.enquiries(status);
create index idx_enquiries_assigned_to on public.enquiries(assigned_to);

-- 7. Resources, Articles & Gallery Albums (Independent Review Enforced)
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  topic text not null,
  format text not null check (format in ('PDF', 'Worksheet', 'Video', 'Link')),
  language text not null default 'English',
  meta_label text not null,
  summary text not null,
  preview_points jsonb not null default '[]'::jsonb,
  download_url text not null,
  is_featured boolean not null default false,
  is_available boolean not null default true,
  workflow_status public.workflow_status not null default 'draft',
  author_id uuid references public.admin_profiles(id) on delete set null,
  approved_by uuid references public.admin_profiles(id) on delete set null,
  review_note text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1,
  constraint resources_independent_review_chk check (
    workflow_status not in ('approved', 'published')
    or (approved_by is not null and author_id is not null and approved_by <> author_id)
  )
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  topic text not null,
  author_name text not null,
  author_role text not null,
  published_label text not null,
  read_time text not null,
  cover_image text not null,
  excerpt text not null,
  body_sections jsonb not null default '[]'::jsonb,
  key_takeaways jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  workflow_status public.workflow_status not null default 'draft',
  author_id uuid references public.admin_profiles(id) on delete set null,
  approved_by uuid references public.admin_profiles(id) on delete set null,
  review_note text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1,
  constraint articles_independent_review_chk check (
    workflow_status not in ('approved', 'published')
    or (approved_by is not null and author_id is not null and approved_by <> author_id)
  )
);

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  year text not null,
  date_label text not null,
  photo_count integer not null default 4,
  cover_image text not null,
  summary text not null,
  photos jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  workflow_status public.workflow_status not null default 'draft',
  author_id uuid references public.admin_profiles(id) on delete set null,
  approved_by uuid references public.admin_profiles(id) on delete set null,
  review_note text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version integer not null default 1,
  constraint gallery_independent_review_chk check (
    workflow_status not in ('approved', 'published')
    or (approved_by is not null and author_id is not null and approved_by <> author_id)
  )
);

-- 8. Club Info, Committee Members & Achievements
create table public.committee_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  initials text not null,
  role_title text not null,
  tier text not null check (tier in ('adviser', 'executive', 'working')),
  session_term text not null default '2026–27',
  bio text not null,
  class_department text not null,
  photo_url text,
  sort_order integer not null default 1,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  year text not null,
  date_label text not null,
  metric_highlight text not null,
  summary text not null,
  impact_detail text not null,
  is_featured boolean not null default false,
  status text not null default 'active' check (status in ('active', 'archived')),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create index idx_resources_status_topic on public.resources(workflow_status, topic);
create index idx_articles_status_topic on public.articles(workflow_status, topic);
create index idx_gallery_albums_status_year on public.gallery_albums(workflow_status, year);
create index idx_committee_members_session_sort on public.committee_members(session_term, sort_order) where is_visible = true;
create index idx_achievements_status_year on public.achievements(status, year);

-- 9. Workspace Settings, Activity Logs & Notification Outbox
create table public.workspace_settings (
  id integer primary key default 1 check (id = 1),
  club_name text not null default 'KFT Collegiate School Business Club',
  short_name text not null default 'KFTCSBC',
  tagline text not null default 'Learn. Connect. Create.',
  active_session text not null default '2026–27',
  recruitment_open boolean not null default true,
  recruitment_auto_notice boolean not null default true,
  recruitment_banner_note text not null default 'Applications for the 2026–27 session are currently open for Class IX–XII students.',
  contact_email text not null default 'businessclub@kftcollegiate.edu.bd',
  campus_address text not null default 'Academic Block B, Room 204 • KFT Collegiate School Campus, Dhaka',
  office_room text not null default 'Room 204, Academic Block B',
  office_hours text not null default 'Sunday – Thursday · 3:15 PM – 4:45 PM BDT',
  default_language text not null default 'EN',
  require_independent_review boolean not null default true,
  retention_months integer not null default 24,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.admin_profiles(id) on delete set null,
  actor_name text not null,
  actor_role public.admin_role not null,
  module text not null,
  action text not null,
  target_id text not null,
  target_label text not null,
  summary text not null,
  before_snapshot jsonb,
  after_snapshot jsonb,
  created_at timestamptz not null default now()
);

create index idx_activity_logs_module on public.activity_logs(module);
create index idx_activity_logs_created_at on public.activity_logs(created_at desc);

create table public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  recipient_email text not null,
  recipient_name text not null,
  subject text not null,
  body text not null,
  status public.notice_status not null default 'sent',
  error_detail text,
  created_at timestamptz not null default now()
);

-- 10. Enable Row Level Security (RLS)
alter table public.admin_profiles enable row level security;
alter table public.admin_invitations enable row level security;
alter table public.owner_handovers enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.membership_applications enable row level security;
alter table public.enquiries enable row level security;
alter table public.resources enable row level security;
alter table public.articles enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.committee_members enable row level security;
alter table public.achievements enable row level security;
alter table public.workspace_settings enable row level security;
alter table public.activity_logs enable row level security;
alter table public.notification_outbox enable row level security;

-- Public Read Policies (TO anon, authenticated)
create policy "Public can view published events"
  on public.events for select to anon, authenticated
  using (workflow_status = 'published');

create policy "Public can view published resources"
  on public.resources for select to anon, authenticated
  using (workflow_status = 'published');

create policy "Public can view published articles"
  on public.articles for select to anon, authenticated
  using (workflow_status = 'published');

create policy "Public can view published gallery albums"
  on public.gallery_albums for select to anon, authenticated
  using (workflow_status = 'published');

create policy "Public can view visible committee members"
  on public.committee_members for select to anon, authenticated
  using (is_visible = true);

create policy "Public can view active achievements"
  on public.achievements for select to anon, authenticated
  using (status = 'active');

create policy "Public can view workspace settings"
  on public.workspace_settings for select to anon, authenticated
  using (true);

-- Public Submission Policies (TO anon, authenticated)
create policy "Public can submit membership applications"
  on public.membership_applications for insert to anon, authenticated
  with check (true);

create policy "Public can submit enquiries"
  on public.enquiries for insert to anon, authenticated
  with check (true);

create policy "Public can submit event registrations"
  on public.event_registrations for insert to anon, authenticated
  with check (true);

-- Authenticated Admin Policies using (select auth.uid()) initPlan caching per supabase-postgres-best-practices
create policy "Active admins can view admin profiles"
  on public.admin_profiles for select to authenticated
  using (
    exists (
      select 1 from public.admin_profiles ap
      where ap.auth_user_id = (select auth.uid())
        and ap.status = 'active'
    )
  );

create policy "Site owners can manage admin profiles"
  on public.admin_profiles for all to authenticated
  using (
    exists (
      select 1 from public.admin_profiles ap
      where ap.auth_user_id = (select auth.uid())
        and ap.status = 'active'
        and ap.role = 'site_owner'
    )
  )
  with check (
    exists (
      select 1 from public.admin_profiles ap
      where ap.auth_user_id = (select auth.uid())
        and ap.status = 'active'
        and ap.role = 'site_owner'
    )
  );

create policy "Active content roles can manage editorial tables"
  on public.events for all to authenticated
  using (
    exists (
      select 1 from public.admin_profiles ap
      where ap.auth_user_id = (select auth.uid())
        and ap.status = 'active'
        and ap.role in ('site_owner', 'publisher', 'content_editor')
    )
  );

create policy "Active membership reviewers can manage applications"
  on public.membership_applications for all to authenticated
  using (
    exists (
      select 1 from public.admin_profiles ap
      where ap.auth_user_id = (select auth.uid())
        and ap.status = 'active'
        and ap.role in ('site_owner', 'membership_reviewer')
    )
  );

create policy "Active enquiry handlers can manage enquiries"
  on public.enquiries for all to authenticated
  using (
    exists (
      select 1 from public.admin_profiles ap
      where ap.auth_user_id = (select auth.uid())
        and ap.status = 'active'
        and ap.role in ('site_owner', 'enquiry_handler')
    )
  );

