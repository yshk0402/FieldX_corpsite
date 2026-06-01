import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";

import {
  getMicrocmsClient,
  getMicrocmsColumnEndpoint,
  getMicrocmsManagementContents
} from "@/lib/content/microcms";
import { publishedNewsPosts } from "@/lib/news";
import type {
  ColumnPost,
  ColumnPostTocItem,
  LandingPage,
  LandingPageFrontmatter
} from "@/types/content";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const isoDateSchema = z
  .string()
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "publishedAt must be a valid ISO date string"
  );

const lpSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  campaign: z.string().min(1),
  status: z.enum(["draft", "published"]),
  publishedAt: isoDateSchema.optional(),
  heroCta: z.string().optional(),
  ogImage: z.string().optional()
});

function sortByPublishedDate<T extends { publishedAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bDate - aDate;
  });
}

async function readMdxFiles(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .map((entry) => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function ensureSlugMatches(
  filePath: string,
  expected: string,
  actual: string,
  label: string
): void {
  if (expected !== actual) {
    throw new Error(
      `[content] ${label} mismatch in ${filePath}. Expected "${expected}" based on filename.`
    );
  }
}

const microcmsCategorySchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional()
});

const microcmsBlogSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  publishedAt: isoDateSchema.optional(),
  eyecatch: z
    .object({
      url: z.string().min(1)
    })
    .optional(),
  category: z
    .union([microcmsCategorySchema, z.array(microcmsCategorySchema)])
    .nullable()
    .optional()
});

type MicrocmsBlogResponse = z.infer<typeof microcmsBlogSchema>;

const microcmsManagementStatusSchema = z.enum([
  "DRAFT",
  "PUBLISH",
  "CLOSED",
  "PUBLISH_AND_DRAFT"
]);

const microcmsManagementContentSchema = z.object({
  id: z.string().min(1),
  closedAt: z.string().nullable().optional(),
  status: z.array(microcmsManagementStatusSchema).optional()
});

type MicrocmsManagementContent = z.infer<typeof microcmsManagementContentSchema>;

function hasMicrocmsConfig(): boolean {
  return Boolean(process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY);
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function buildDescriptionFromContent(content: string): string {
  const plainText = stripHtml(content);
  return plainText.slice(0, 120);
}

function buildLeadFromContent(content: string): string | undefined {
  const firstParagraphMatch = content.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);

  if (!firstParagraphMatch) {
    return undefined;
  }

  const lead = stripTags(firstParagraphMatch[1]);
  return lead || undefined;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripTags(value: string): string {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(value: string): string {
  const normalized = value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized || "section";
}

function appendClassName(rawAttrs: string, nextClassName: string): string {
  const classMatch = rawAttrs.match(/\sclass=(['"])(.*?)\1/i);

  if (!classMatch) {
    return `${rawAttrs} class="${nextClassName}"`;
  }

  const existingClasses = classMatch[2].trim();
  const mergedClassName = existingClasses ? `${existingClasses} ${nextClassName}` : nextClassName;

  return rawAttrs.replace(/\sclass=(['"])(.*?)\1/i, ` class="${mergedClassName}"`);
}

function buildColumnBodyWithToc(content: string): Pick<ColumnPost, "body" | "toc"> {
  const slugCounts = new Map<string, number>();
  const toc: ColumnPostTocItem[] = [];
  const body = content.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (fullMatch, levelText, rawAttrs, rawHeading) => {
      const text = stripTags(rawHeading);

      if (!text) {
        return fullMatch;
      }

      const baseSlug = slugifyHeading(text);
      const duplicateCount = slugCounts.get(baseSlug) ?? 0;
      const id = duplicateCount === 0 ? baseSlug : `${baseSlug}-${duplicateCount + 1}`;
      slugCounts.set(baseSlug, duplicateCount + 1);

      toc.push({
        id,
        text,
        level: Number(levelText) as 2 | 3
      });

      const attrsWithoutId = rawAttrs.replace(/\s+id=(['"]).*?\1/gi, "");
      const attrsWithClasses = appendClassName(
        attrsWithoutId,
        `fx-editorial-heading fx-editorial-heading-level-${levelText}`
      );
      return `<h${levelText}${attrsWithClasses} id="${id}">${rawHeading}</h${levelText}>`;
    }
  );

  return { body, toc };
}

function normalizeCategoryTags(category: MicrocmsBlogResponse["category"]): string[] | undefined {
  if (!category) {
    return undefined;
  }

  const values = Array.isArray(category) ? category : [category];
  const tags = values
    .map((item) => item.name ?? item.title)
    .filter((value): value is string => Boolean(value));

  return tags.length > 0 ? tags : undefined;
}

function isPublishedColumnPost(post: ColumnPost): boolean {
  return Boolean(post.publishedAt);
}

function isPublishedMicrocmsContent(content: MicrocmsManagementContent): boolean {
  const statuses = content.status ?? [];
  return (
    !content.closedAt &&
    (statuses.includes("PUBLISH") || statuses.includes("PUBLISH_AND_DRAFT"))
  );
}

async function getPublishedMicrocmsContentIds(endpoint: string): Promise<Set<string> | null> {
  const ids = new Set<string>();
  let offset = 0;
  const limit = 100;

  try {
    while (true) {
      const response = await getMicrocmsManagementContents<unknown>({
        endpoint,
        limit,
        offset
      });
      const contents = response.contents.map((item) => microcmsManagementContentSchema.parse(item));

      for (const content of contents) {
        if (isPublishedMicrocmsContent(content)) {
          ids.add(content.id);
        }
      }

      offset += contents.length;

      if (offset >= response.totalCount || contents.length === 0) {
        break;
      }
    }

    return ids;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[microCMS] Failed to fetch publication status from Management API. Falling back to Content API publishedAt filtering. Original error: ${message}`
    );
    return null;
  }
}

const loadColumnPosts = cache(async (): Promise<ColumnPost[]> => {
  if (!hasMicrocmsConfig()) {
    return [];
  }

  const client = getMicrocmsClient();
  const endpoint = getMicrocmsColumnEndpoint();
  const posts: MicrocmsBlogResponse[] = [];
  let offset = 0;
  const limit = 100;

  try {
    while (true) {
      const response = await client.getList<MicrocmsBlogResponse>({
        endpoint,
        customRequestInit: {
          cache: "no-store"
        },
        queries: {
          fields: "id,title,content,publishedAt,eyecatch,category",
          orders: "-publishedAt",
          limit,
          offset
        }
      });

      posts.push(...response.contents.map((item) => microcmsBlogSchema.parse(item)));

      offset += response.contents.length;

      if (offset >= response.totalCount || response.contents.length === 0) {
        break;
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `[microCMS] Failed to fetch Column data from endpoint "${endpoint}". Check MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY, MICROCMS_COLUMN_ENDPOINT, and network access. Original error: ${message}`
    );
  }

  const publishedContentIds = await getPublishedMicrocmsContentIds(endpoint);
  const publicPosts = publishedContentIds
    ? posts.filter((post) => publishedContentIds.has(post.id))
    : posts;

  return publicPosts.map((post) => {
    const article = buildColumnBodyWithToc(post.content);

    return {
      id: post.id,
      title: post.title,
      description: buildDescriptionFromContent(post.content),
      lead: buildLeadFromContent(post.content),
      slug: post.id,
      publishedAt: post.publishedAt,
      tags: normalizeCategoryTags(post.category),
      ogImage: post.eyecatch?.url,
      body: article.body,
      toc: article.toc
    };
  });
});

const loadLandingPages = cache(async (): Promise<LandingPage[]> => {
  const dirPath = path.join(CONTENT_ROOT, "lp");
  const fileNames = await readMdxFiles(dirPath);

  const pages = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(dirPath, fileName);
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = matter(raw);
      const frontmatter = lpSchema.parse(parsed.data) as LandingPageFrontmatter;

      ensureSlugMatches(filePath, fileName.replace(/\.mdx$/, ""), frontmatter.campaign, "campaign");

      return {
        ...frontmatter,
        body: parsed.content,
        filePath
      };
    })
  );

  const campaignFilePaths = new Map<string, string>();

  for (const page of pages) {
    const existingFilePath = campaignFilePaths.get(page.campaign);

    if (existingFilePath) {
      throw new Error(
        `[content] Duplicate landing page campaign "${page.campaign}" in ${existingFilePath} and ${page.filePath}.`
      );
    }

    campaignFilePaths.set(page.campaign, page.filePath);
  }

  return pages;
});

export async function getColumnPosts(): Promise<ColumnPost[]> {
  const allPosts = await loadColumnPosts();
  return sortByPublishedDate(allPosts.filter(isPublishedColumnPost));
}

export async function getColumnPostBySlug(slug: string): Promise<ColumnPost | null> {
  const allPosts = await loadColumnPosts();
  const post = allPosts.find((entry) => entry.slug === slug && isPublishedColumnPost(entry));
  return post ?? null;
}

export async function getLandingPages(includeDraft = false): Promise<LandingPage[]> {
  const allPages = await loadLandingPages();
  const filtered = includeDraft ? allPages : allPages.filter((page) => page.status === "published");
  return sortByPublishedDate(filtered);
}

export async function getLandingPageByCampaign(campaign: string): Promise<LandingPage | null> {
  const allPages = await loadLandingPages();
  const page = allPages.find((entry) => entry.campaign === campaign);

  if (!page || page.status !== "published") {
    return null;
  }

  return page;
}

export async function getAllPublishedRoutes(): Promise<string[]> {
  const routes: string[] = [
    "/",
    "/about",
    "/column/magazine",
    "/column/materials",
    "/contact",
    "/service",
    "/news"
  ];

  const [posts, pages] = await Promise.all([getColumnPosts(), getLandingPages()]);
  routes.push(...posts.map((post) => `/column/${post.slug}`));
  routes.push(...publishedNewsPosts.map((post) => `/news/${post.slug}`));
  routes.push(...pages.map((page) => `/lp/${page.campaign}`));

  return [...new Set(routes)];
}
