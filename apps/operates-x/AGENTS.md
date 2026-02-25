# AGENTS.md

## Purpose
This repository is an AI-assisted corporate website foundation.
The goal is to ship blog content and landing pages rapidly while keeping all source in Git.

## Tech Stack
- Framework: Next.js App Router + TypeScript
- Package manager: pnpm
- Hosting target: Vercel
- Content source: Markdown/MDX + frontmatter (no CMS)
- Language: Japanese only

## Standard Commands
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Type check: `pnpm typecheck`
- Build: `pnpm build`

## Change Policy
- Keep changes small and focused per PR.
- Update docs together with structural or workflow changes.
- If a change is breaking, document impact and migration steps in PR description.

## Content Placement Rules
- Article content: `content/article/*.mdx`
- Case study content: `content/case/*.mdx`
- News content: `content/news/*.mdx`
- Landing pages: `content/lp/*.mdx`
- Public images: `public/images/*`

## Frontmatter Requirements
### Article
Required fields:
- `title`
- `description`
- `slug`
- `status` (`draft` | `published`)

Optional fields:
- `publishedAt` (ISO date)
- `tags`
- `newsLabel` (ニュースカード上の赤ラベル文字列)
- `ogImage`
- `thumbnail`

### Case Study
Required fields:
- `title`
- `description`
- `slug`
- `status` (`draft` | `published`)

Optional fields:
- `publishedAt` (ISO date)
- `campaign`
- `tags`
- `newsLabel` (ニュースカード上の赤ラベル文字列)
- `ogImage`
- `thumbnail`

### News
Required fields:
- `title`
- `description`
- `slug`
- `status` (`draft` | `published`)

Optional fields:
- `publishedAt` (ISO date)
- `tags`
- `newsLabel` (ニュースカード上の赤ラベル文字列)
- `ogImage`
- `thumbnail`

## Publication Rules
- Only `status: published` appears in list/detail/sitemap output.
- `status: draft` remains in Git and is hidden from production outputs.

## Routing Rules
- Route format: `/...` (no locale prefix)
- Article detail: `/article/[slug]`
- Case detail: `/case/[slug]`
- News detail: `/news/[slug]`
