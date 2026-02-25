import fs from "node:fs";
import path from "node:path";

export type ArticleCategory = "article" | "case" | "news";

export type ArticleStatus = "draft" | "published";
export type SearchIntent = "awareness" | "consideration" | "decision" | "implementation";
export type CtaType = "consult" | "document";

export type ArticleFrontmatter = {
  title: string;
  description: string;
  slug: string;
  status: ArticleStatus;
  publishedAt?: string;
  tags?: string[];
  newsLabel?: string;
  ogImage?: string;
  thumbnail?: string;
  campaign?: string;
  targetIntent?: SearchIntent;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  ctaType?: CtaType;
};

export type ArticleHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

export type ArticleEntry = {
  category: ArticleCategory;
  frontmatter: ArticleFrontmatter;
  body: string;
  headings: ArticleHeading[];
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function getCategoryDir(category: ArticleCategory) {
  return path.join(CONTENT_ROOT, category);
}

function parseFrontmatterValue(rawValue: string): string | string[] {
  const value = rawValue.trim();

  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) {
      return [];
    }

    return inner
      .split(",")
      .map((item) => item.trim().replace(/^['\"]|['\"]$/g, ""))
      .filter(Boolean);
  }

  return value;
}

function parseFrontmatter(raw: string): { data: Record<string, string | string[]>; body: string } {
  if (!raw.startsWith("---\n")) {
    return { data: {}, body: raw };
  }

  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) {
    return { data: {}, body: raw };
  }

  const frontmatterBlock = raw.slice(4, end);
  const body = raw.slice(end + 5);
  const data: Record<string, string | string[]> = {};

  for (const line of frontmatterBlock.split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) {
      continue;
    }

    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1);
    data[key] = parseFrontmatterValue(value);
  }

  return { data, body };
}

function stripMarkdownSyntax(input: string): string {
  return input
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/^#+\s*/, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

function createSlugBase(input: string): string {
  return stripMarkdownSyntax(input)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-_]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function scanAllHeadings(markdown: string) {
  const lines = markdown.split("\n");
  const counts = new Map<string, number>();
  const headings: Array<{ depth: number; text: string; id: string }> = [];
  let inCodeFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence) {
      continue;
    }

    const match = /^(#{1,6})\s+(.+)$/.exec(line);
    if (!match) {
      continue;
    }

    const depth = match[1].length;
    const text = stripMarkdownSyntax(match[2]);
    const slugBase = createSlugBase(text) || "section";
    const usedCount = (counts.get(slugBase) ?? 0) + 1;
    counts.set(slugBase, usedCount);
    const id = usedCount === 1 ? slugBase : `${slugBase}-${usedCount}`;

    headings.push({ depth, text, id });
  }

  return headings;
}

export function extractHeadingsFromMdx(markdown: string): ArticleHeading[] {
  return scanAllHeadings(markdown)
    .filter((heading) => heading.depth === 2 || heading.depth === 3)
    .map((heading) => ({
      depth: heading.depth as 2 | 3,
      text: heading.text,
      id: heading.id
    }));
}

function ensureArticleFrontmatter(
  category: ArticleCategory,
  fileSlug: string,
  frontmatterData: Record<string, string | string[]>
): ArticleFrontmatter | null {
  const title = typeof frontmatterData.title === "string" ? frontmatterData.title : "";
  const description = typeof frontmatterData.description === "string" ? frontmatterData.description : "";
  const statusRaw = typeof frontmatterData.status === "string" ? frontmatterData.status : "draft";
  const status = statusRaw === "published" ? "published" : "draft";
  const slugRaw = typeof frontmatterData.slug === "string" ? frontmatterData.slug : fileSlug;
  const slug = createSlugBase(slugRaw) || fileSlug;

  if (!title || !description) {
    return null;
  }

  const publishedAt = typeof frontmatterData.publishedAt === "string" ? frontmatterData.publishedAt : undefined;
  const tags = Array.isArray(frontmatterData.tags) ? frontmatterData.tags : undefined;
  const newsLabel = typeof frontmatterData.newsLabel === "string" ? frontmatterData.newsLabel : undefined;
  const ogImage = typeof frontmatterData.ogImage === "string" ? frontmatterData.ogImage : undefined;
  const thumbnail = typeof frontmatterData.thumbnail === "string" ? frontmatterData.thumbnail : undefined;
  const campaign = category === "case" && typeof frontmatterData.campaign === "string" ? frontmatterData.campaign : undefined;
  const primaryKeyword = typeof frontmatterData.primaryKeyword === "string" ? frontmatterData.primaryKeyword : undefined;
  const secondaryKeywords = Array.isArray(frontmatterData.secondaryKeywords)
    ? frontmatterData.secondaryKeywords
    : undefined;
  const targetIntentRaw = typeof frontmatterData.targetIntent === "string" ? frontmatterData.targetIntent : undefined;
  const targetIntent: SearchIntent | undefined =
    targetIntentRaw === "awareness" ||
    targetIntentRaw === "consideration" ||
    targetIntentRaw === "decision" ||
    targetIntentRaw === "implementation"
      ? targetIntentRaw
      : undefined;
  const ctaTypeRaw = typeof frontmatterData.ctaType === "string" ? frontmatterData.ctaType : undefined;
  const ctaType: CtaType | undefined = ctaTypeRaw === "document" || ctaTypeRaw === "consult" ? ctaTypeRaw : undefined;

  if (status === "published") {
    const hasRequiredPublishedFields =
      Boolean(publishedAt) && Boolean(ogImage) && Boolean(thumbnail) && Boolean(primaryKeyword) && Boolean(targetIntent);

    if (!hasRequiredPublishedFields) {
      return null;
    }
  }

  return {
    title,
    description,
    slug,
    status,
    publishedAt,
    tags,
    newsLabel,
    ogImage,
    thumbnail,
    campaign,
    targetIntent,
    primaryKeyword,
    secondaryKeywords,
    ctaType
  };
}

function readArticleFile(category: ArticleCategory, filePath: string): ArticleEntry | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const fileSlug = path.basename(filePath, path.extname(filePath));
  const frontmatter = ensureArticleFrontmatter(category, fileSlug, data);

  if (!frontmatter) {
    return null;
  }

  return {
    category,
    frontmatter,
    body,
    headings: extractHeadingsFromMdx(body)
  };
}

function getAllArticles(category: ArticleCategory): ArticleEntry[] {
  const categoryDir = getCategoryDir(category);
  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const files = fs
    .readdirSync(categoryDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(categoryDir, file));

  const articles = files
    .map((filePath) => readArticleFile(category, filePath))
    .filter((article): article is ArticleEntry => article !== null)
    .sort((a, b) => {
      const aTime = a.frontmatter.publishedAt ? new Date(a.frontmatter.publishedAt).getTime() : 0;
      const bTime = b.frontmatter.publishedAt ? new Date(b.frontmatter.publishedAt).getTime() : 0;
      return bTime - aTime;
    });

  return articles;
}

export function getPublishedArticles(category: ArticleCategory): ArticleEntry[] {
  return getAllArticles(category).filter((article) => article.frontmatter.status === "published");
}

export function getArticleBySlug(category: ArticleCategory, slug: string): ArticleEntry | null {
  const normalized = createSlugBase(slug);
  const article = getPublishedArticles(category).find((entry) => entry.frontmatter.slug === normalized);
  return article ?? null;
}

export function getArticleSlugs(category: ArticleCategory): string[] {
  return getPublishedArticles(category).map((article) => article.frontmatter.slug);
}

export function formatDisplayDate(date?: string) {
  if (!date) {
    return "";
  }

  return date.replaceAll("-", ".");
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInline(markdown: string): string {
  let html = escapeHtml(markdown);

  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  return html;
}

export function renderMarkdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const headingOrder = scanAllHeadings(markdown);
  let headingIndex = 0;
  let inCodeFence = false;
  let listType: "ul" | "ol" | null = null;
  let paragraphBuffer: string[] = [];
  const chunks: string[] = [];

  const closeList = () => {
    if (listType) {
      chunks.push(`</${listType}>`);
      listType = null;
    }
  };

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      chunks.push(`<p>${renderInline(paragraphBuffer.join(" "))}</p>`);
      paragraphBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");

    if (/^```/.test(line.trim())) {
      flushParagraph();
      closeList();

      if (!inCodeFence) {
        inCodeFence = true;
        chunks.push("<pre><code>");
      } else {
        inCodeFence = false;
        chunks.push("</code></pre>");
      }
      continue;
    }

    if (inCodeFence) {
      chunks.push(`${escapeHtml(rawLine)}\n`);
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const heading = headingOrder[headingIndex];
      headingIndex += 1;
      const level = headingMatch[1].length;
      const fallbackText = stripMarkdownSyntax(headingMatch[2]);
      const id = heading?.id ?? (createSlugBase(fallbackText) || `section-${headingIndex}`);
      const text = heading?.text ?? fallbackText;
      chunks.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`);
      continue;
    }

    const unordered = /^[-*]\s+(.+)$/.exec(line);
    if (unordered) {
      flushParagraph();
      if (listType !== "ul") {
        closeList();
        listType = "ul";
        chunks.push("<ul>");
      }
      chunks.push(`<li>${renderInline(unordered[1])}</li>`);
      continue;
    }

    const ordered = /^\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      flushParagraph();
      if (listType !== "ol") {
        closeList();
        listType = "ol";
        chunks.push("<ol>");
      }
      chunks.push(`<li>${renderInline(ordered[1])}</li>`);
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      flushParagraph();
      closeList();
      chunks.push(`<blockquote><p>${renderInline(quote[1])}</p></blockquote>`);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    paragraphBuffer.push(line.trim());
  }

  flushParagraph();
  closeList();

  return chunks.join("\n");
}
