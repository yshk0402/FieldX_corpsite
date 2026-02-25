import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "../components/SiteHeader";
import { formatDisplayDate, getCaseArticles } from "../lib/articles";
import { getSiteUrl } from "../lib/site";

export const metadata: Metadata = {
  title: "導入事例 | AImate",
  description: "AImateの導入事例をまとめたページです。",
  alternates: {
    canonical: `${getSiteUrl()}/case`
  }
};

export default function CasePage() {
  const caseArticles = getCaseArticles();

  return (
    <main className="fx-site fx-listing-page">
      <div className="fx-shell">
        <section className="fx-listing-hero" aria-labelledby="case-page-title">
          <SiteHeader currentPath="/case" />
          <div className="fx-listing-title-block">
            <p className="fx-listing-eyebrow">case</p>
            <h1 id="case-page-title" className="fx-listing-title">
              導入事例
            </h1>
          </div>
        </section>
        <section className="fx-listing-section" aria-label="導入事例一覧">
          <div className="fx-listing-grid">
            {caseArticles.map((article) => (
              <article key={article.slug} className="fx-listing-card">
                <Link href={`/case/${article.slug}`} className="fx-listing-card-link" aria-label={`${article.title} を読む`}>
                  <div className="fx-listing-card-image-wrap" aria-hidden="true">
                    <Image
                      src={article.thumbnail ?? "/images/operates-x/placeholders/case-cover.svg"}
                      alt=""
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 1080px) 42vw, 320px"
                      className="fx-listing-card-image"
                    />
                  </div>
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
