import { type ArticleEntry, formatDisplayDate, getPublishedArticles } from "./content";

export type ListingArticle = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  newsLabel?: string;
  thumbnail?: string;
};

function toListingArticle(article: ArticleEntry): ListingArticle {
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    slug: article.frontmatter.slug,
    publishedAt: article.frontmatter.publishedAt ?? "",
    newsLabel: article.frontmatter.newsLabel,
    thumbnail: article.frontmatter.thumbnail
  };
}

export function getCaseArticles(): ListingArticle[] {
  return getPublishedArticles("case").map(toListingArticle);
}

export function getBlogArticles(): ListingArticle[] {
  return getPublishedArticles("blog").map(toListingArticle);
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
    hrefPrefix: "/news" | "/blog" | "/case";
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
        hrefPrefix: "/blog",
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
