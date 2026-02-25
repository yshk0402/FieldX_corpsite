import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "../components/SiteHeader";
import { formatDisplayDate, getBlogArticles } from "../lib/articles";

export const metadata: Metadata = {
  title: "記事 | AImate",
  description: "AImateの記事一覧ページです。"
};

export default function BlogPage() {
  const blogArticles = getBlogArticles();

  return (
    <main className="fx-site fx-listing-page">
      <div className="fx-shell">
        <section className="fx-listing-hero" aria-labelledby="blog-page-title">
          <SiteHeader currentPath="/blog" />
          <div className="fx-listing-title-block">
            <p className="fx-listing-eyebrow">article</p>
            <h1 id="blog-page-title" className="fx-listing-title">
              記事
            </h1>
          </div>
        </section>
        <section className="fx-listing-section" aria-label="記事一覧">
          <div className="fx-listing-grid">
            {blogArticles.map((article) => (
              <article key={article.slug} className="fx-listing-card">
                <Link href={`/blog/${article.slug}`} className="fx-listing-card-link" aria-label={`${article.title} を読む`}>
                  <div className="fx-listing-card-image" aria-hidden="true" />
                  <div className="fx-card-meta">
                    <h3>{article.title}</h3>
                    <p className="fx-listing-card-summary">{article.description}</p>
                    <time className="fx-listing-date" dateTime={article.publishedAt}>
                      {formatDisplayDate(article.publishedAt)}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
