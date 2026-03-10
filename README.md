# Corporates-site

Next.js App Router based corporate website starter for AI-driven iteration.

## Features
- Git-managed MDX content (`blog`, `lp`)
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

## Release Phase
Use `SITE_RELEASE_PHASE` to switch publication mode.

- `full` (default): all routes are available.
- `prelaunch_operates_x`: only `/` and `/contact` are public, and other routes return `404`.

For Operates X prelaunch deployment on Vercel, set:

```bash
SITE_RELEASE_PHASE=prelaunch_operates_x
```

When you are ready to open the full site, change it back to:

```bash
SITE_RELEASE_PHASE=full
```

## Separate Domain Deployment (`apps/operates-x`)
When you want to run Operates X on a different domain permanently, use the standalone app at `apps/operates-x`.

- Corporate main site: deploy repository root (`/`)
- Operates X site: deploy `apps/operates-x` as a separate Vercel project (Root Directory)

Local run for Operates X app:

```bash
cd apps/operates-x
pnpm install
pnpm dev
```

Recommended env for the Operates X project:

```bash
NEXT_PUBLIC_SITE_URL=https://operatesx.example.com
```

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
    blog/[slug]/page.tsx
    lp/[campaign]/page.tsx
  lib/
    content/
content/
  blog/
  lp/
docs/
```

## Content Authoring
### Blog (`content/blog/{slug}.mdx`)
```mdx
---
title: "..."
description: "..."
slug: "..."
status: "draft"
publishedAt: "2026-02-10"
---

本文
```

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
