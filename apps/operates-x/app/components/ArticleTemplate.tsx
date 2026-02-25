import Image from "next/image";
import Link from "next/link";

import { type ArticleCategory, type ArticleEntry, formatDisplayDate, renderMarkdownToHtml } from "../lib/content";
import { SiteHeader } from "./SiteHeader";

type ArticleTemplateProps = {
  article: ArticleEntry;
  category: ArticleCategory;
};

const categoryMeta = {
  blog: {
    path: "/blog",
    label: "記事",
    fallbackThumbnail: "/images/operates-x/placeholders/blog-cover.svg"
  },
  case: {
    path: "/case",
    label: "導入事例",
    fallbackThumbnail: "/images/operates-x/placeholders/case-cover.svg"
  },
  news: {
    path: "/news",
    label: "ニュース",
    fallbackThumbnail: "/images/operates-x/placeholders/blog-cover.svg"
  }
} as const;

export function ArticleTemplate({ article, category }: ArticleTemplateProps) {
  const meta = categoryMeta[category];
  const publishedDate = formatDisplayDate(article.frontmatter.publishedAt);
  const thumbnail = article.frontmatter.thumbnail ?? meta.fallbackThumbnail;
  const tocItems = article.headings;

  return (
    <main className="fx-site fx-article-page">
      <div className="fx-shell">
        <section className="fx-listing-hero fx-article-hero" aria-labelledby="article-title">
          <SiteHeader currentPath={meta.path} />
          <div className="fx-listing-title-block">
            <p className="fx-listing-eyebrow">{category}</p>
            <h1 id="article-title" className="fx-listing-title">
              {meta.label}
            </h1>
          </div>
        </section>

        <nav className="fx-article-breadcrumb" aria-label="パンくずリスト">
          <ol>
            <li>
              <Link href="/">ホーム</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={meta.path}>{meta.label}</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{article.frontmatter.title}</li>
          </ol>
        </nav>

        <article className="fx-article-shell" aria-label={`${article.frontmatter.title} の記事本文`}>
          <div className="fx-article-cover-wrap">
            <Image
              src={thumbnail}
              alt={`${article.frontmatter.title} のサムネイル`}
              width={1200}
              height={675}
              className="fx-article-cover"
            />
          </div>

          <header className="fx-article-header">
            <h2 className="fx-article-title">{article.frontmatter.title}</h2>
            {publishedDate ? (
              <time dateTime={article.frontmatter.publishedAt} className="fx-article-date">
                {publishedDate}
              </time>
            ) : null}
          </header>

          {tocItems.length > 0 ? (
            <details className="fx-article-toc" open>
              <summary>目次</summary>
              <nav aria-label="記事目次">
                <ol>
                  {tocItems.map((heading) => (
                    <li key={heading.id} className={heading.depth === 3 ? "fx-article-toc-sub" : undefined}>
                      <a href={`#${heading.id}`}>{heading.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>
          ) : null}

          <div className="fx-article-body" dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(article.body) }} />

          <section className="fx-article-banner-section" aria-label="関連バナー">
            <div className="fx-article-banner-grid">
              <div className="fx-article-banner-item">
                <Link href="/contact" aria-label="お問い合わせページへ移動（お問い合わせバナー）">
                  <Image
                    src="/images/operates-x/AImate_banner_contact2.png"
                    alt="お問い合わせバナー"
                    width={1200}
                    height={420}
                    className="fx-article-banner-image"
                  />
                </Link>
              </div>
              <div className="fx-article-banner-item">
                <Link href="/contact" aria-label="お問い合わせページへ移動（資料バナー）">
                  <Image
                    src="/images/operates-x/AImate_banner_slide.png"
                    alt="資料バナー"
                    width={1200}
                    height={420}
                    className="fx-article-banner-image"
                  />
                </Link>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
