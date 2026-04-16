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
  property_label text,
  full_name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

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
create index if not exists inquiries_property_label_idx on public.inquiries (property_label);
create index if not exists inquiries_status_idx on public.inquiries (status);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_developer_profiles_updated_at
before update on public.developer_profiles
for each row
execute function public.set_updated_at();

create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create trigger set_project_media_updated_at
before update on public.project_media
for each row
execute function public.set_updated_at();

create trigger set_inquiries_updated_at
before update on public.inquiries
for each row
execute function public.set_updated_at();
