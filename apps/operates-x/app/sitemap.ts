import type { MetadataRoute } from "next";

import { getPublishedArticles } from "./lib/content";
import { getSiteUrl } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/article`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/case`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/news`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4
    }
  ];

  const articleRoutes: MetadataRoute.Sitemap = getPublishedArticles("article").map((article) => ({
    url: `${siteUrl}/article/${article.frontmatter.slug}`,
    lastModified: article.frontmatter.publishedAt ? new Date(article.frontmatter.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const caseRoutes: MetadataRoute.Sitemap = getPublishedArticles("case").map((article) => ({
    url: `${siteUrl}/case/${article.frontmatter.slug}`,
    lastModified: article.frontmatter.publishedAt ? new Date(article.frontmatter.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const newsRoutes: MetadataRoute.Sitemap = getPublishedArticles("news").map((article) => ({
    url: `${siteUrl}/news/${article.frontmatter.slug}`,
    lastModified: article.frontmatter.publishedAt ? new Date(article.frontmatter.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  return [...staticRoutes, ...articleRoutes, ...caseRoutes, ...newsRoutes];
}
