import Image from "next/image";
import Link from "next/link";

import { getRelatedCasesForArticle } from "../lib/articles";
import { type ArticleCategory, type ArticleEntry, formatDisplayDate, renderMarkdownToHtml } from "../lib/content";
import { getSiteUrl } from "../lib/site";
import { SiteHeader } from "./SiteHeader";
import { TrackedContactLink } from "./TrackedContactLink";

type ArticleTemplateProps = {
  article: ArticleEntry;
  category: ArticleCategory;
};

const categoryMeta = {
  article: {
    path: "/article",
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
  const relatedCases = category === "article" ? getRelatedCasesForArticle(article, 3) : [];
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}${meta.path}/${article.frontmatter.slug}`;
  const ctaType = article.frontmatter.ctaType ?? "consult";
  const intent = article.frontmatter.targetIntent ?? "awareness";

  const ctaCopy = {
    awareness: {
      title: "業務改善の進め方を整理したい方へ",
      description: "現状の業務フローを整理し、AI導入の優先順位を30分で明確化します。"
    },
    consideration: {
      title: "導入可否の判断材料を集めたい方へ",
      description: "貴社の業務に合わせて、施策の実行優先順位と期待効果を整理します。"
    },
    decision: {
      title: "具体的に導入計画を進めたい方へ",
      description: "直近90日の実行ロードマップと必要体制を無料相談でご提案します。"
    },
    implementation: {
      title: "運用定着まで伴走してほしい方へ",
      description: "実装後の運用ルール設計まで含め、現場で回る体制を設計します。"
    }
  }[intent];

  const ctaLabel =
    ctaType === "document" ? "資料請求についてお問い合わせする" : "無料相談30分を申し込む";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.frontmatter.title,
    description: article.frontmatter.description,
    image: [`${siteUrl}${article.frontmatter.ogImage ?? thumbnail}`],
    datePublished: article.frontmatter.publishedAt,
    dateModified: article.frontmatter.publishedAt,
    mainEntityOfPage: canonicalUrl,
    author: {
      "@type": "Organization",
      name: "AImate"
    },
    publisher: {
      "@type": "Organization",
      name: "AImate"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: `${siteUrl}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: meta.label,
        item: `${siteUrl}${meta.path}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.frontmatter.title,
        item: canonicalUrl
      }
    ]
  };

  return (
    <main className="fx-site fx-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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

          <section className="fx-article-inline-cta" aria-label="記事内CTA">
            <p className="fx-article-inline-cta-title">{ctaCopy.title}</p>
            <p className="fx-article-inline-cta-description">{ctaCopy.description}</p>
            <TrackedContactLink className="fx-btn fx-btn-primary fx-article-inline-cta-link" ariaLabel={ctaLabel} eventLabel={`inline_${intent}`}>
              {ctaLabel}
            </TrackedContactLink>
          </section>

          <section className="fx-article-banner-section" aria-label="関連バナー">
            <div className="fx-article-banner-grid">
              <div className="fx-article-banner-item">
                <TrackedContactLink ariaLabel="お問い合わせページへ移動（お問い合わせバナー）" eventLabel="banner_contact">
                  <Image
                    src="/images/operates-x/AImate_banner_contact2.png"
                    alt="お問い合わせバナー"
                    width={1200}
                    height={420}
                    className="fx-article-banner-image"
                  />
                </TrackedContactLink>
              </div>
              <div className="fx-article-banner-item">
                <TrackedContactLink ariaLabel="お問い合わせページへ移動（資料バナー）" eventLabel="banner_document">
                  <Image
                    src="/images/operates-x/AImate_banner_slide.png"
                    alt="資料バナー"
                    width={1200}
                    height={420}
                    className="fx-article-banner-image"
                  />
                </TrackedContactLink>
              </div>
            </div>
          </section>

          {category === "article" && relatedCases.length > 0 ? (
            <section className="fx-related-case-section" aria-label="関連導入事例">
              <h3 className="fx-related-case-title">関連する導入事例</h3>
              <div className="fx-related-case-grid">
                {relatedCases.map((caseArticle) => (
                  <article key={caseArticle.slug} className="fx-related-case-card">
                    <Link href={`/case/${caseArticle.slug}`} className="fx-related-case-link">
                      <p className="fx-related-case-date">{formatDisplayDate(caseArticle.publishedAt)}</p>
                      <h4>{caseArticle.title}</h4>
                      <p>{caseArticle.description}</p>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </div>
    </main>
  );
}
