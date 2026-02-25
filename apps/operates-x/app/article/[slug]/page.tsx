import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleTemplate } from "../../components/ArticleTemplate";
import { getArticleBySlug, getArticleSlugs } from "../../lib/content";
import { getSiteUrl } from "../../lib/site";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getArticleSlugs("article").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug("article", slug);
  const siteUrl = getSiteUrl();

  if (!article) {
    return {
      title: "記事が見つかりません | AImate"
    };
  }

  return {
    title: `${article.frontmatter.title} | AImate`,
    description: article.frontmatter.description,
    alternates: {
      canonical: `${siteUrl}/article/${article.frontmatter.slug}`
    },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      images: article.frontmatter.ogImage ? [{ url: article.frontmatter.ogImage }] : undefined,
      type: "article"
    }
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug("article", slug);

  if (!article) {
    notFound();
  }

  return <ArticleTemplate article={article} category="article" />;
}
