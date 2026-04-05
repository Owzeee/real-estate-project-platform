alter table public.projects
  add column if not exists price_mode text not null default 'fixed'
    check (price_mode in ('fixed', 'range', 'contact')),
  add column if not exists fixed_price numeric(14,2),
  add column if not exists rent_price numeric(14,2);

alter table public.project_units
  add column if not exists offer_type text not null default 'sale'
    check (offer_type in ('sale', 'rent')),
  add column if not exists price_mode text not null default 'fixed'
    check (price_mode in ('fixed', 'range', 'contact')),
  add column if not exists fixed_price numeric(14,2),
  add column if not exists min_price numeric(14,2),
  add column if not exists max_price numeric(14,2);

create index if not exists projects_price_mode_idx on public.projects (price_mode);
create index if not exists project_units_offer_type_idx on public.project_units (offer_type);
create index if not exists project_units_price_mode_idx on public.project_units (price_mode);
