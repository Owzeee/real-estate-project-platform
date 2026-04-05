alter table public.projects
  add column if not exists offer_type text not null default 'sale'
    check (offer_type in ('sale', 'rent')),
  add column if not exists category text not null default 'residential'
    check (category in ('residential', 'commercial', 'office'));

create index if not exists projects_offer_type_idx on public.projects (offer_type);
create index if not exists projects_category_idx on public.projects (category);
