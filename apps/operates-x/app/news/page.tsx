import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "../components/SiteHeader";
import { formatDisplayDate, getNewsArticles } from "../lib/articles";
import { getSiteUrl } from "../lib/site";

export const metadata: Metadata = {
  title: "ニュース | AImate",
  description: "AImateのニュース一覧ページです。",
  alternates: {
    canonical: `${getSiteUrl()}/news`
  }
};

export default function NewsPage() {
  const newsArticles = getNewsArticles();

  return (
    <main className="fx-site fx-listing-page">
      <div className="fx-shell">
        <section className="fx-listing-hero" aria-labelledby="news-page-title">
          <SiteHeader currentPath="/news" />
          <div className="fx-listing-title-block">
            <p className="fx-listing-eyebrow">news</p>
            <h1 id="news-page-title" className="fx-listing-title">
              ニュース
            </h1>
          </div>
        </section>
        <section className="fx-listing-section" aria-label="ニュース記事一覧">
          <div className="fx-listing-grid">
            {newsArticles.map((article) => (
              <article key={article.slug} className="fx-listing-card">
                <Link href={`/news/${article.slug}`} className="fx-listing-card-link" aria-label={`${article.title} を読む`}>
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
