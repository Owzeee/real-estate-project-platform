create table if not exists public.project_units (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  slug text not null,
  summary text,
  monthly_rent numeric(14,2),
  currency_code char(3) not null default 'USD',
  area_sqm numeric(10,2),
  rooms integer,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  amenity_groups jsonb not null default '[]'::jsonb,
  beds jsonb not null default '[]'::jsonb,
  minimum_stay_months integer,
  maximum_stay_months integer,
  available_from date,
  availability_months jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint project_units_project_slug_unique unique (project_id, slug)
);

create index if not exists project_units_project_sort_idx
  on public.project_units (project_id, sort_order);

create trigger set_project_units_updated_at
before update on public.project_units
for each row
execute function public.set_updated_at();
