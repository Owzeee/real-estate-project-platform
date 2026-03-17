# Real Estate Project Marketplace

This repository is the MVP foundation for a billboard-style real estate development marketplace built with Next.js and Supabase.

The product is designed to showcase development projects from real estate companies and developers. It is not a classifieds platform for individual listings.

## Current MVP Scope

- Developer profiles
- Projects
- Project media
- Inquiries
- Basic user profiles with `admin`, `developer`, and `buyer` roles

## Product Direction From Blueprint

The wider platform vision includes:

- Rich project presentation with images, videos, brochures, and 3D tours
- Search filters for location, price range, project type, and completion stage
- Interactive map browsing
- Developer dashboards and project upload workflows
- Admin approval before projects go live
- Premium placement and promotional inventory

The current schema keeps the data model intentionally small while preparing for that direction. In particular, the `projects` table already includes:

- `approval_status` for admin moderation
- `is_featured` for premium placement
- `latitude` and `longitude` for future map browsing

## Database Files

- Schema migration: `supabase/migrations/20260316224500_mvp_marketplace_schema.sql`
- Supabase browser client: `lib/supabase/client.ts`
- Environment example: `.env.example`

## Suggested App Structure

```text
app/
  (marketing)/
    page.tsx
  (dashboard)/
    developer/
      projects/
        page.tsx
        new/
          page.tsx
  developers/
    [slug]/
      page.tsx
  projects/
    [slug]/
      page.tsx
  inquiries/
    actions.ts
  api/
    inquiries/
      route.ts
components/
  shared/
    section-heading.tsx
features/
  developers/
    queries.ts
    types.ts
  projects/
    queries.ts
    types.ts
  inquiries/
    actions.ts
    types.ts
lib/
  supabase/
    client.ts
  utils/
    format-price.ts
supabase/
  migrations/
    20260316224500_mvp_marketplace_schema.sql
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build Notes

- `npm run lint` should pass locally.
- In this environment, `npx next build --webpack` is the reliable production build command.
- Plain Turbopack build may fail in restricted sandboxes because of process and port-binding limitations.
