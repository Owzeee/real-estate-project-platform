create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'developer', 'buyer')),
  full_name text,
  email text unique,
  phone text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.developer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  company_name text not null,
  slug text not null unique,
  description text,
  website_url text,
  logo_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  developer_profile_id uuid not null references public.developer_profiles (id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text not null,
  location text not null,
  city text,
  country text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  min_price numeric(14,2),
  max_price numeric(14,2),
  currency_code char(3) not null default 'USD',
  status text not null check (status in ('draft', 'active', 'sold_out', 'archived')),
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  project_type text not null check (project_type in ('apartment', 'villa', 'townhouse', 'mixed_use', 'commercial', 'land')),
  completion_stage text not null check (completion_stage in ('pre_launch', 'under_construction', 'ready', 'completed')),
  is_featured boolean not null default false,
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint projects_price_range_check check (
    min_price is null
    or max_price is null
    or min_price <= max_price
  ),
  constraint projects_coordinates_check check (
    (latitude is null and longitude is null)
    or (latitude is not null and longitude is not null)
  )
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video', 'brochure', 'tour_3d')),
  file_url text not null,
  thumbnail_url text,
  title text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  buyer_profile_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email, phone, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'buyer'),
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.owns_developer_profile(target_developer_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.developer_profiles
    where id = target_developer_profile_id
      and user_id = auth.uid()
  );
$$;

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists developer_profiles_user_id_idx on public.developer_profiles (user_id);
create index if not exists developer_profiles_slug_idx on public.developer_profiles (slug);
create index if not exists projects_developer_profile_id_idx on public.projects (developer_profile_id);
create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_approval_status_idx on public.projects (approval_status);
create index if not exists projects_project_type_idx on public.projects (project_type);
create index if not exists projects_completion_stage_idx on public.projects (completion_stage);
create index if not exists projects_location_idx on public.projects (location);
create index if not exists projects_featured_idx on public.projects (is_featured);
create index if not exists projects_map_idx on public.projects (latitude, longitude);
create index if not exists project_media_project_sort_idx on public.project_media (project_id, sort_order);
create index if not exists project_media_media_type_idx on public.project_media (media_type);
create index if not exists inquiries_project_id_idx on public.inquiries (project_id);
create index if not exists inquiries_buyer_profile_id_idx on public.inquiries (buyer_profile_id);
create index if not exists inquiries_status_idx on public.inquiries (status);

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_developer_profiles_updated_at on public.developer_profiles;
create trigger set_developer_profiles_updated_at
before update on public.developer_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

drop trigger if exists set_project_media_updated_at on public.project_media;
create trigger set_project_media_updated_at
before update on public.project_media
for each row
execute function public.set_updated_at();

drop trigger if exists set_inquiries_updated_at on public.inquiries;
create trigger set_inquiries_updated_at
before update on public.inquiries
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.developer_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "public read developer profiles" on public.developer_profiles;
create policy "public read developer profiles"
on public.developer_profiles
for select
to anon, authenticated
using (true);

drop policy if exists "public read approved projects" on public.projects;
create policy "public read approved projects"
on public.projects
for select
to anon, authenticated
using (status = 'active' and approval_status = 'approved');

drop policy if exists "public read media for approved projects" on public.project_media;
create policy "public read media for approved projects"
on public.project_media
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_media.project_id
      and projects.status = 'active'
      and projects.approval_status = 'approved'
  )
);

drop policy if exists "public insert inquiries" on public.inquiries;
create policy "public insert inquiries"
on public.inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "read own profile or admin" on public.profiles;
create policy "read own profile or admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "update own profile or admin" on public.profiles;
create policy "update own profile or admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "developers manage own developer profile" on public.developer_profiles;
create policy "developers manage own developer profile"
on public.developer_profiles
for all
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "developers manage own projects" on public.projects;
create policy "developers manage own projects"
on public.projects
for all
to authenticated
using (
  public.owns_developer_profile(developer_profile_id)
  or public.is_admin()
)
with check (
  public.owns_developer_profile(developer_profile_id)
  or public.is_admin()
);

drop policy if exists "developers manage own project media" on public.project_media;
create policy "developers manage own project media"
on public.project_media
for all
to authenticated
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_media.project_id
      and (
        public.owns_developer_profile(projects.developer_profile_id)
        or public.is_admin()
      )
  )
)
with check (
  exists (
    select 1
    from public.projects
    where projects.id = project_media.project_id
      and (
        public.owns_developer_profile(projects.developer_profile_id)
        or public.is_admin()
      )
  )
);

drop policy if exists "admins manage inquiries" on public.inquiries;
create policy "admins manage inquiries"
on public.inquiries
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
