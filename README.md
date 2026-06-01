# Corporates-site

Next.js App Router based corporate website starter for AI-driven iteration.

## Features
- `microCMS` managed Column content
- Git-managed MDX landing pages (`lp`)
- `draft/published` publication control
- Japanese-only flat routes (no locale prefix)
- Sitemap and robots generation
- CI pipeline (lint, typecheck, build)

## Requirements
- Node.js `18.x` (see `.nvmrc`)
- pnpm `10.28.0`

## Setup
```bash
pnpm install
pnpm dev
```

Open: `http://localhost:3000`

## microCMS
`/column` is backed by `microCMS`.

Set the following in `.env.local` or Vercel environment variables:

```bash
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
MICROCMS_COLUMN_ENDPOINT=column
# Optional: use a separate server-only key with Management API read permission
MICROCMS_MANAGEMENT_API_KEY=your-management-api-key
```

Expected content model fields for the Column API:
- `title` (text)
- `content` (rich editor HTML)
- `eyecatch` (media, optional)
- `category` (relation, optional)

Notes:
- URL slug is currently derived from the `microCMS` content ID.
- Description text is generated from the `content` body.
- Production `MICROCMS_API_KEY` should be a read-only Content API key without draft retrieval permissions.
- `/column` cross-checks Management API metadata and only renders entries whose status is `PUBLISH` or `PUBLISH_AND_DRAFT` and whose `closedAt` is empty. This prevents previously published but now stopped entries from remaining visible when an over-broad Content API key can still read them.
- If Management API metadata cannot be fetched, Column posts are hidden instead of falling back to `publishedAt` only. Set `MICROCMS_MANAGEMENT_API_KEY` with Management API read permission in production.

## GTM / GA4
Set the GTM container ID and canonical site URL in `.env.local` or Vercel environment variables.

```bash
NEXT_PUBLIC_SITE_URL=https://www.fieldx.site
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_CLARITY_ID=
```

The root app injects GTM only when `NEXT_PUBLIC_GTM_ID` is present.
Custom lead-gen events are documented in [docs/lead-acquisition-analytics.md](./docs/lead-acquisition-analytics.md).

## Lead Storage
To store contact leads in Supabase, set the following environment variables:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
CRM_API_TOKEN=your-crm-api-token
```

Database schema and reporting views are documented in [docs/lead-db.sql](./docs/lead-db.sql).
API contract for CRM integration is documented in [docs/contact-api.md](./docs/contact-api.md).
Codex side data access prerequisites are documented in [docs/codex-data-access.md](./docs/codex-data-access.md).

CRM integrations can read lead data through the authenticated endpoints:
- `GET /api/leads`
- `GET /api/leads/{id}`
- `GET /api/leads/daily`
- `GET /api/leads/pages`
- `GET /api/leads/campaigns`

Pass `Authorization: Bearer ${CRM_API_TOKEN}` from your server-side CRM environment.

## Scripts
```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm format:check
```

## Contact Form Mail Delivery
To enable `/contact` automatic mail delivery, configure SMTP in `.env.local`.

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mailer@example.com
SMTP_PASS=your-password
CONTACT_FROM_EMAIL=hello@fieldx.site
CONTACT_FROM_NAME=Field X
```

The form sends:
- notification mail to `hello@fieldx.site`
- auto-reply mail to the visitor's email address

## Directory Layout
```text
src/
  app/
    column/[slug]/page.tsx
    lp/[campaign]/page.tsx
  lib/
    content/
content/
  lp/
docs/
```

## Content Authoring
### Column
Manage Column posts in `microCMS`.

### Landing Page (`content/lp/{campaign}.mdx`)
```mdx
---
title: "..."
description: "..."
campaign: "..."
status: "published"
---

本文
```
