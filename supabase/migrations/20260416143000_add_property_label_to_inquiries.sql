alter table public.inquiries
add column if not exists property_label text;

create index if not exists inquiries_property_label_idx
on public.inquiries (property_label);
