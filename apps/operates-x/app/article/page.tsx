import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "../components/SiteHeader";
import { formatDisplayDate, getAllArticleTags, getBlogArticles } from "../lib/articles";
import { getSiteUrl } from "../lib/site";

export const metadata: Metadata = {
  title: "記事 | AI業務改善の進め方",
  description: "AI業務改善の進め方、導入判断、運用定着までをテーマ別にまとめた記事一覧です。",
  alternates: {
    canonical: `${getSiteUrl()}/article`
  }
};

type ArticlePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const INTENT_OPTIONS = ["awareness", "consideration", "decision", "implementation"] as const;
type IntentType = (typeof INTENT_OPTIONS)[number];

function normalizeParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}

export default async function BlogPage({ searchParams }: ArticlePageProps) {
  const params = (await searchParams) ?? {};
  const blogArticles = getBlogArticles();
  const allTags = getAllArticleTags();

  const intentParam = normalizeParam(params.intent);
  const tagParam = normalizeParam(params.tag);

  const selectedIntent = INTENT_OPTIONS.find((intent) => intent === intentParam) as IntentType | undefined;
  const selectedTag = tagParam && allTags.includes(tagParam) ? tagParam : undefined;

  const filteredArticles = blogArticles.filter((article) => {
    const intentMatch = selectedIntent ? article.targetIntent === selectedIntent : true;
    const tagMatch = selectedTag ? article.tags.includes(selectedTag) : true;
    return intentMatch && tagMatch;
  });

  const intentLinks: Array<{ key: IntentType; label: string }> = [
    { key: "awareness", label: "課題認知" },
    { key: "consideration", label: "比較検討" },
    { key: "decision", label: "導入判断" },
    { key: "implementation", label: "実装運用" }
  ];

  const buildFilterHref = (nextIntent?: string, nextTag?: string) => {
    const query = new URLSearchParams();
    if (nextIntent) {
      query.set("intent", nextIntent);
    }
    if (nextTag) {
      query.set("tag", nextTag);
    }
    const queryString = query.toString();
    return queryString ? `/article?${queryString}` : "/article";
  };

  return (
    <main className="fx-site fx-listing-page">
      <div className="fx-shell">
        <section className="fx-listing-hero" aria-labelledby="article-page-title">
          <SiteHeader currentPath="/article" />
          <div className="fx-listing-title-block">
            <p className="fx-listing-eyebrow">article</p>
            <h1 id="article-page-title" className="fx-listing-title">
              記事
            </h1>
          </div>
        </section>
        <section className="fx-listing-section" aria-label="記事一覧">
          <div className="fx-article-filters" aria-label="記事フィルター">
            <div className="fx-filter-row">
              <span className="fx-filter-label">検索意図</span>
              <Link href={buildFilterHref(undefined, selectedTag)} className={`fx-filter-chip ${!selectedIntent ? "is-active" : ""}`}>
                すべて
              </Link>
              {intentLinks.map((intent) => (
                <Link
                  key={intent.key}
                  href={buildFilterHref(intent.key, selectedTag)}
                  className={`fx-filter-chip ${selectedIntent === intent.key ? "is-active" : ""}`}
                >
                  {intent.label}
                </Link>
              ))}
            </div>
            <div className="fx-filter-row">
              <span className="fx-filter-label">タグ</span>
              <Link href={buildFilterHref(selectedIntent, undefined)} className={`fx-filter-chip ${!selectedTag ? "is-active" : ""}`}>
                すべて
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={buildFilterHref(selectedIntent, tag)}
                  className={`fx-filter-chip ${selectedTag === tag ? "is-active" : ""}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <div className="fx-listing-grid">
            {filteredArticles.map((article) => (
              <article key={article.slug} className="fx-listing-card">
                <Link href={`/article/${article.slug}`} className="fx-listing-card-link" aria-label={`${article.title} を読む`}>
                  <div className="fx-listing-card-image" aria-hidden="true" />
                  <div className="fx-card-meta">
                    <h3>{article.title}</h3>
                    <p className="fx-listing-card-summary">{article.description}</p>
                    {article.targetIntent ? <p className="fx-listing-intent">{article.targetIntent}</p> : null}
                    <time className="fx-listing-date" dateTime={article.publishedAt}>
                      {formatDisplayDate(article.publishedAt)}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          {filteredArticles.length === 0 ? <p className="fx-empty-state">該当する記事はまだありません。</p> : null}
        </section>
      </div>
    </main>
  );
}
