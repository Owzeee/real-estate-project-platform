# Real Estate Project Marketplace

## Overview

This project is a billboard-style real estate development marketplace built with `Next.js` and `Supabase`.

It is not a classifieds platform for individual property listings.

The product is designed around:

- developer profiles
- development projects
- project media
- project inquiries
- role-based users: `admin`, `developer`, `buyer`

The working codebase is in:

- `/Users/omarzaari/Desktop/real-estate-platform`

## Product Direction

The platform is intended to help developers showcase entire real estate projects with rich media and direct lead capture.

Core business goals:

- let developers publish and manage projects
- let admins moderate and feature projects
- let buyers submit inquiries on projects
- make developer brands visible through profile pages
- support premium media presentation rather than listing-level classifieds

## Database

Primary SQL files:

- `/Users/omarzaari/Desktop/real-estate-platform/supabase/sql/final_mvp_setup.sql`
- `/Users/omarzaari/Desktop/real-estate-platform/supabase/migrations/20260316224500_mvp_marketplace_schema.sql`

### Main Tables

`profiles`

- linked to `auth.users`
- stores app role and basic user data
- roles: `admin`, `developer`, `buyer`

`developer_profiles`

- linked to a user
- stores company-facing profile data
- fields include company name, slug, description, website, logo, verification state

`projects`

- linked to `developer_profiles`
- stores project title, slug, description, location, pricing, type, stage, visibility, approval state, map coordinates, featured state

`project_media`

- linked to `projects`
- supports:
  - images
  - videos
  - brochures
  - 3D tour links
- uses `sort_order` for gallery order and cover media behavior

`inquiries`

- linked to `projects`
- stores buyer lead information and a simple inquiry pipeline status

### Important Behaviors

- project approval status is separate from visibility status
- approved projects are set to `active`
- rejected projects are set to `archived`
- pending projects are set to `draft`
- project media ordering controls which asset becomes the public cover image

## Auth And Roles

Authentication uses Supabase auth.

Implemented auth flows:

- sign up
- sign in
- sign out
- developer onboarding after signup

Role model:

- `buyer`
  - public browsing and inquiry submission
- `developer`
  - onboarding
  - project creation/editing
  - profile editing
  - inquiry inbox for own projects only
- `admin`
  - project moderation
  - developer verification
  - inquiry oversight

Important auth files:

- `/Users/omarzaari/Desktop/real-estate-platform/lib/auth.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/lib/supabase/server.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/lib/supabase/client.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/lib/supabase/middleware.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/proxy.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/features/auth/actions.ts`

## Implemented Application Areas

### Public Marketplace

Routes:

- `/`
- `/projects`
- `/projects/[slug]`
- `/developers`
- `/developers/[slug]`

Current public features:

- homepage with featured marketplace positioning
- project listing page with filters
- project detail pages
- developer profile pages
- project inquiries
- counters and empty states on marketplace pages

Relevant files:

- `/Users/omarzaari/Desktop/real-estate-platform/app/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/projects/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/projects/[slug]/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/developers/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/developers/[slug]/page.tsx`

### Developer Workspace

Routes:

- `/developer/onboarding`
- `/developer/projects`
- `/developer/projects/new`
- `/developer/projects/[id]/edit`
- `/developer/profiles`
- `/developer/profiles/[id]/edit`
- `/developer/inquiries`

Current developer features:

- onboarding flow for first developer profile creation
- create project flow
- edit owned projects only
- manage owned project media
- set cover media
- reorder media
- delete media
- view and edit own developer profile only
- see own inquiries only
- update inquiry status only for own projects

Relevant files:

- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/developer/onboarding/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/developer/projects/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/developer/projects/new/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/developer/projects/[id]/edit/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/developer/profiles/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/developer/profiles/[id]/edit/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/developer/inquiries/page.tsx`

### Admin Workspace

Routes:

- `/admin/projects`
- `/admin/developers`
- `/admin/inquiries`

Current admin features:

- approve, reject, or reset project moderation state
- feature or unfeature projects
- verify or unverify developers
- review all inquiries
- move inquiries through status pipeline

Relevant files:

- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/admin/projects/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/admin/developers/page.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/app/(dashboard)/admin/inquiries/page.tsx`

## UI And UX Work Completed

### Header

The header is now auth-aware.

Logged out:

- `Home`
- `Projects`
- `Developers`
- `Sign in`
- `Sign up`

Developer:

- public links
- `Dashboard`
- `Inbox`
- `Profile`
- `Sign out`

Admin:

- public links
- `Admin`
- `Developers Review`
- `Inquiries`
- `Sign out`

Header file:

- `/Users/omarzaari/Desktop/real-estate-platform/components/shared/site-header.tsx`

### Form Improvements

Project form improvements:

- automatic slug generation from title
- cleaner single-developer selection behavior
- clearer publishing guidance
- media upload guidance
- stronger empty states and workflow messaging

Main form files:

- `/Users/omarzaari/Desktop/real-estate-platform/features/projects/project-form.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/features/projects/project-form-fields.tsx`
- `/Users/omarzaari/Desktop/real-estate-platform/features/projects/project-form-shared.ts`

### Media Management

Project media manager supports:

- reorder up/down
- set cover asset
- delete asset

Media manager:

- `/Users/omarzaari/Desktop/real-estate-platform/features/projects/project-media-manager.tsx`

## Security And Ownership Hardening

This pass tightened several important gaps.

Now enforced:

- developer dashboard reads are scoped to the logged-in developer
- developer profile pages in dashboard only expose the owner’s profile
- developer inquiry inbox only exposes inquiries for that developer’s projects
- developer edit pages reject access to other developers’ records
- admin pages require admin access
- developer actions verify ownership before mutating records
- admin-only actions enforce admin role before updates

Main hardening files:

- `/Users/omarzaari/Desktop/real-estate-platform/lib/auth.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/features/projects/actions.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/features/projects/queries.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/features/inquiries/actions.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/features/inquiries/queries.ts`
- `/Users/omarzaari/Desktop/real-estate-platform/features/developers/actions.ts`

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Important note:

- the service role key was used during setup and should be rotated if it was ever exposed outside your secure environment

## Storage And Uploads

Project media is stored through Supabase storage and project media rows.

Important notes:

- large video uploads can exceed request limits if pushed through form bodies
- server action body size was increased in `next.config.ts`
- long term, direct client uploads to Supabase Storage would be a better architecture for large media files

Relevant config:

- `/Users/omarzaari/Desktop/real-estate-platform/next.config.ts`

## Testing And Verification

Verified repeatedly during development:

- `npm run lint`
- `npx next build --webpack`

Current result:

- lint passes
- build passes

Manual QA areas:

- signup and login
- developer onboarding
- project creation
- project approval
- public project visibility
- developer profile editing
- inquiry submission
- developer inquiry status updates
- admin verification controls
- project media reordering and cover image changes

## Current Known Architecture Tradeoffs

The platform is working, but a few areas are still pragmatic MVP choices rather than final production architecture.

Current tradeoffs:

- many privileged writes still rely on the service-role server client
- email notifications are not yet implemented
- direct client-to-storage upload for very large media files is not yet implemented
- no favorites, saved searches, messaging, map browsing, or analytics yet
- no mortgage tools yet

## Recommended Next Steps

Best next implementation order:

1. Email notifications
   - notify developers on new inquiry
   - notify admins on new project submission
2. Direct client uploads to Supabase Storage
   - especially for large videos
3. RLS review and reduction of service-role dependence
4. Favorites and saved projects
5. Map browsing
6. Analytics for developer dashboards
7. Messaging between buyers and developers

## Short Status Summary

The platform now has:

- working auth
- role-aware dashboards
- developer onboarding
- project creation and editing
- admin moderation
- inquiry management
- developer profile management
- media ordering and cover management
- public marketplace pages
- a cleaner production-ready UI baseline

This is now a usable MVP foundation rather than just a schema and mock interface.
