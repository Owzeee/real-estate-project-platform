-- Demo content seed for Real Estate Project Marketplace
-- Run this in Supabase SQL Editor after the schema/setup SQL.
--
-- What this does:
-- - creates sample auth users
-- - creates matching profiles
-- - creates sample developer_profiles
-- - creates approved public projects
-- - creates project media
-- - creates sample inquiries
--
-- Notes:
-- - sample auth users are for seeded content only
-- - passwords are set with bcrypt-compatible pgcrypto hashing
-- - if you do not want extra auth users, do not run this file

create extension if not exists pgcrypto;

do $$
declare
  admin_user_id uuid := '11111111-1111-1111-1111-111111111111';
  buyer_user_id uuid := '22222222-2222-2222-2222-222222222222';
  dev_1_user_id uuid := '33333333-3333-3333-3333-333333333333';
  dev_2_user_id uuid := '44444444-4444-4444-4444-444444444444';
  dev_3_user_id uuid := '55555555-5555-5555-5555-555555555555';
  dev_4_user_id uuid := '66666666-6666-6666-6666-666666666666';
  dev_5_user_id uuid := '77777777-7777-7777-7777-777777777777';

  dev_profile_1_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
  dev_profile_2_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2';
  dev_profile_3_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3';
  dev_profile_4_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4';
  dev_profile_5_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5';

  project_1_id uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
  project_2_id uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
  project_3_id uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3';
  project_4_id uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4';
  project_5_id uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5';
  project_6_id uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values
    (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      'admin@demo-realestate.com',
      crypt('DemoPass123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin","full_name":"Platform Admin"}',
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      buyer_user_id,
      'authenticated',
      'authenticated',
      'buyer@demo-realestate.com',
      crypt('DemoPass123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}',
      '{"role":"buyer","full_name":"Sample Buyer"}',
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      dev_1_user_id,
      'authenticated',
      'authenticated',
      'novastone@demo-realestate.com',
      crypt('DemoPass123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}',
      '{"role":"developer","full_name":"Novastone Developments"}',
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      dev_2_user_id,
      'authenticated',
      'authenticated',
      'redcliff@demo-realestate.com',
      crypt('DemoPass123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}',
      '{"role":"developer","full_name":"Redcliff Urban"}',
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      dev_3_user_id,
      'authenticated',
      'authenticated',
      'bluecrest@demo-realestate.com',
      crypt('DemoPass123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}',
      '{"role":"developer","full_name":"Bluecrest Estates"}',
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      dev_4_user_id,
      'authenticated',
      'authenticated',
      'verde@demo-realestate.com',
      crypt('DemoPass123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}',
      '{"role":"developer","full_name":"Verde Habitat"}',
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      dev_5_user_id,
      'authenticated',
      'authenticated',
      'summit@demo-realestate.com',
      crypt('DemoPass123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}',
      '{"role":"developer","full_name":"Summit Harbour Group"}',
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      ''
    )
  on conflict (id) do nothing;

  insert into public.profiles (id, role, full_name, email, phone, avatar_url)
  values
    (admin_user_id, 'admin', 'Platform Admin', 'admin@demo-realestate.com', '+971500000001', null),
    (buyer_user_id, 'buyer', 'Sample Buyer', 'buyer@demo-realestate.com', '+971500000002', null),
    (dev_1_user_id, 'developer', 'Novastone Developments', 'novastone@demo-realestate.com', '+971500000003', null),
    (dev_2_user_id, 'developer', 'Redcliff Urban', 'redcliff@demo-realestate.com', '+971500000004', null),
    (dev_3_user_id, 'developer', 'Bluecrest Estates', 'bluecrest@demo-realestate.com', '+971500000005', null),
    (dev_4_user_id, 'developer', 'Verde Habitat', 'verde@demo-realestate.com', '+971500000006', null),
    (dev_5_user_id, 'developer', 'Summit Harbour Group', 'summit@demo-realestate.com', '+971500000007', null)
  on conflict (id) do update
  set
    role = excluded.role,
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone;

  insert into public.developer_profiles (
    id,
    user_id,
    company_name,
    slug,
    description,
    website_url,
    logo_url,
    is_verified
  )
  values
    (
      dev_profile_1_id,
      dev_1_user_id,
      'Novastone Developments',
      'novastone-developments',
      'A regional developer focused on premium residential communities and hospitality-led living concepts.',
      'https://example.com/novastone',
      null,
      true
    ),
    (
      dev_profile_2_id,
      dev_2_user_id,
      'Redcliff Urban',
      'redcliff-urban',
      'A mixed-use developer focused on urban districts, public realm-led planning, and highly visible commercial frontage.',
      'https://example.com/redcliff',
      null,
      true
    ),
    (
      dev_profile_3_id,
      dev_3_user_id,
      'Bluecrest Estates',
      'bluecrest-estates',
      'A luxury coastal developer focused on branded residences and premium waterfront living experiences.',
      'https://example.com/bluecrest',
      null,
      true
    ),
    (
      dev_profile_4_id,
      dev_4_user_id,
      'Verde Habitat',
      'verde-habitat',
      'A sustainability-led developer building low-density communities with strong landscaping and family-focused planning.',
      'https://example.com/verde',
      null,
      false
    ),
    (
      dev_profile_5_id,
      dev_5_user_id,
      'Summit Harbour Group',
      'summit-harbour-group',
      'A commercial-led development group specializing in landmark office, retail, and waterfront mixed-use destinations.',
      'https://example.com/summit',
      null,
      true
    )
  on conflict (id) do update
  set
    company_name = excluded.company_name,
    slug = excluded.slug,
    description = excluded.description,
    website_url = excluded.website_url,
    logo_url = excluded.logo_url,
    is_verified = excluded.is_verified;

  insert into public.projects (
    id,
    developer_profile_id,
    title,
    slug,
    description,
    location,
    city,
    country,
    latitude,
    longitude,
    min_price,
    max_price,
    currency_code,
    status,
    approval_status,
    project_type,
    completion_stage,
    is_featured,
    approved_at
  )
  values
    (
      project_1_id,
      dev_profile_1_id,
      'Aurora Residences',
      'aurora-residences',
      'A waterfront residential address designed around panoramic marina views, private wellness amenities, and hotel-grade resident services.',
      'Dubai Marina, Dubai',
      'Dubai',
      'United Arab Emirates',
      25.080400,
      55.140300,
      420000,
      1350000,
      'USD',
      'active',
      'approved',
      'apartment',
      'under_construction',
      true,
      timezone('utc', now())
    ),
    (
      project_2_id,
      dev_profile_2_id,
      'Canyon Square',
      'canyon-square',
      'A mixed-use district combining premium apartments, retail frontage, and a public plaza built for high-footfall urban living.',
      'Riyadh North, Riyadh',
      'Riyadh',
      'Saudi Arabia',
      24.822000,
      46.643000,
      310000,
      2200000,
      'USD',
      'active',
      'approved',
      'mixed_use',
      'pre_launch',
      true,
      timezone('utc', now())
    ),
    (
      project_3_id,
      dev_profile_1_id,
      'Serene Villas',
      'serene-villas',
      'A gated villa community built around landscaped boulevards, private plots, and a resort-style family leisure program.',
      'New Cairo, Cairo',
      'Cairo',
      'Egypt',
      30.015600,
      31.491300,
      580000,
      990000,
      'USD',
      'active',
      'approved',
      'villa',
      'ready',
      false,
      timezone('utc', now())
    ),
    (
      project_4_id,
      dev_profile_3_id,
      'Oceanic Crest',
      'oceanic-crest',
      'A branded coastal apartment tower with panoramic sea views, private lounges, and hospitality-led amenities for global buyers.',
      'Jumeirah Beach, Dubai',
      'Dubai',
      'United Arab Emirates',
      25.203300,
      55.269200,
      690000,
      3100000,
      'USD',
      'active',
      'approved',
      'apartment',
      'pre_launch',
      true,
      timezone('utc', now())
    ),
    (
      project_5_id,
      dev_profile_4_id,
      'Orchid Park Residences',
      'orchid-park-residences',
      'A green-led townhouse development focused on family living, walkable streets, and low-density planning with strong landscaping identity.',
      'Mohammed Bin Rashid City, Dubai',
      'Dubai',
      'United Arab Emirates',
      25.125100,
      55.246200,
      760000,
      1490000,
      'USD',
      'active',
      'approved',
      'townhouse',
      'under_construction',
      false,
      timezone('utc', now())
    ),
    (
      project_6_id,
      dev_profile_5_id,
      'Harbor Exchange',
      'harbor-exchange',
      'A premium commercial and office destination positioned for institutional tenants, waterfront retail, and long-term visibility.',
      'Doha Waterfront, Doha',
      'Doha',
      'Qatar',
      25.285400,
      51.531000,
      980000,
      5400000,
      'USD',
      'active',
      'approved',
      'commercial',
      'under_construction',
      false,
      timezone('utc', now())
    )
  on conflict (id) do update
  set
    developer_profile_id = excluded.developer_profile_id,
    title = excluded.title,
    slug = excluded.slug,
    description = excluded.description,
    location = excluded.location,
    city = excluded.city,
    country = excluded.country,
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    min_price = excluded.min_price,
    max_price = excluded.max_price,
    currency_code = excluded.currency_code,
    status = excluded.status,
    approval_status = excluded.approval_status,
    project_type = excluded.project_type,
    completion_stage = excluded.completion_stage,
    is_featured = excluded.is_featured,
    approved_at = excluded.approved_at;

  insert into public.project_media (
    project_id,
    media_type,
    file_url,
    thumbnail_url,
    title,
    sort_order
  )
  values
    (project_1_id, 'image', 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80', null, 'Main exterior', 0),
    (project_1_id, 'brochure', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', null, 'Project brochure', 1),
    (project_1_id, 'tour_3d', 'https://my.matterport.com/models/25B7rViqy4M', null, '3D walkthrough', 2),
    (project_2_id, 'image', 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=80', null, 'Masterplan view', 0),
    (project_2_id, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', null, 'Launch film', 1),
    (project_3_id, 'image', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80', null, 'Villa exterior', 0),
    (project_4_id, 'image', 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1400&q=80', null, 'Sea-facing facade', 0),
    (project_5_id, 'image', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', null, 'Community street view', 0),
    (project_6_id, 'image', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80', null, 'Commercial frontage', 0)
  on conflict do nothing;

  insert into public.inquiries (
    project_id,
    buyer_profile_id,
    full_name,
    email,
    phone,
    message,
    status
  )
  values
    (
      project_1_id,
      buyer_user_id,
      'Sample Buyer',
      'buyer@demo-realestate.com',
      '+971500000002',
      'Please share brochure, payment plan, and expected handover schedule.',
      'new'
    ),
    (
      project_2_id,
      buyer_user_id,
      'Sample Buyer',
      'buyer@demo-realestate.com',
      '+971500000002',
      'Interested in mixed-use inventory. Please contact me with pricing details.',
      'contacted'
    ),
    (
      project_4_id,
      buyer_user_id,
      'Sample Buyer',
      'buyer@demo-realestate.com',
      '+971500000002',
      'Can I get a private walkthrough link and unit availability list?',
      'qualified'
    )
  on conflict do nothing;
end $$;
