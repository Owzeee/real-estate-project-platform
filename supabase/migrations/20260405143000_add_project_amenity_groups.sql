alter table public.projects
  add column if not exists amenity_groups jsonb not null default '[]'::jsonb;
