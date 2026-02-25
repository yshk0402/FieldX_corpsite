import { type ArticleEntry, type SearchIntent, formatDisplayDate, getPublishedArticles } from "./content";

export type ListingArticle = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  targetIntent?: SearchIntent;
  primaryKeyword?: string;
  ctaType?: "consult" | "document";
  newsLabel?: string;
  thumbnail?: string;
};

function toListingArticle(article: ArticleEntry): ListingArticle {
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    slug: article.frontmatter.slug,
    publishedAt: article.frontmatter.publishedAt ?? "",
    tags: article.frontmatter.tags ?? [],
    targetIntent: article.frontmatter.targetIntent,
    primaryKeyword: article.frontmatter.primaryKeyword,
    ctaType: article.frontmatter.ctaType,
    newsLabel: article.frontmatter.newsLabel,
    thumbnail: article.frontmatter.thumbnail
  };
}

export function getCaseArticles(): ListingArticle[] {
  return getPublishedArticles("case").map(toListingArticle);
}

export function getBlogArticles(): ListingArticle[] {
  return getPublishedArticles("article").map(toListingArticle);
}

export function getNewsArticles(): ListingArticle[] {
  return getPublishedArticles("news").map(toListingArticle);
}

export { formatDisplayDate };

export function getHomeCaseHighlights(): ListingArticle[] {
  return getCaseArticles().slice(0, 3);
}

type HomeNewsItem = ListingArticle & {
  href: string;
  label: string;
  fallbackThumbnail: string;
};

const NEWS_LIMIT = 6;

function sortByPublishedAtDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

function toHomeNewsItem(
  article: ListingArticle,
  defaults: {
    label: string;
    hrefPrefix: "/news" | "/article" | "/case";
    fallbackThumbnail: string;
  }
): HomeNewsItem {
  return {
    ...article,
    label: article.newsLabel?.trim() || defaults.label,
    href: `${defaults.hrefPrefix}/${article.slug}`,
    fallbackThumbnail: defaults.fallbackThumbnail
  };
}

function pickHomeNewsItems(): HomeNewsItem[] {
  const items = [
    ...getNewsArticles().map((article) =>
      toHomeNewsItem(article, {
        label: "ニュース",
        hrefPrefix: "/news",
        fallbackThumbnail: "/images/operates-x/placeholders/blog-cover.svg"
      })
    ),
    ...getBlogArticles().map((article) =>
      toHomeNewsItem(article, {
        label: "記事",
        hrefPrefix: "/article",
        fallbackThumbnail: "/images/operates-x/placeholders/blog-cover.svg"
      })
    ),
    ...getCaseArticles().map((article) =>
      toHomeNewsItem(article, {
        label: "導入事例",
        hrefPrefix: "/case",
        fallbackThumbnail: "/images/operates-x/placeholders/case-cover.svg"
      })
    )
  ];

  return sortByPublishedAtDesc(items).slice(0, NEWS_LIMIT);
}

export function getHomeNewsItems(): HomeNewsItem[] {
  return pickHomeNewsItems();
}

export function getAllArticleTags(): string[] {
  const tags = new Set<string>();

  for (const article of getBlogArticles()) {
    for (const tag of article.tags) {
      if (tag.trim()) {
        tags.add(tag.trim());
      }
    }
  }

  return [...tags].sort((a, b) => a.localeCompare(b, "ja"));
}

export function getRelatedCasesForArticle(article: ArticleEntry, limit = 3): ListingArticle[] {
  const caseArticles = getCaseArticles();
  const sourceTags = new Set((article.frontmatter.tags ?? []).map((tag) => tag.trim()).filter(Boolean));
  const sourceIntent = article.frontmatter.targetIntent;

  const scored = caseArticles
    .map((caseArticle) => {
      const overlap = caseArticle.tags.filter((tag) => sourceTags.has(tag)).length;
      const intentBonus = sourceIntent && caseArticle.targetIntent === sourceIntent ? 1 : 0;
      return {
        article: caseArticle,
        score: overlap * 3 + intentBonus
      };
    })
    .sort((a, b) => b.score - a.score || new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime())
    .map((item) => item.article);

  return scored.slice(0, limit);
}
