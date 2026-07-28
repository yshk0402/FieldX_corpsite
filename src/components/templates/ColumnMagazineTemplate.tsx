import Link from "next/link";

import { NewsCard } from "@/components/molecules";
import type { SiteLocaleContent } from "@/components/site/content";
import type { ColumnPost } from "@/types/content";

type ColumnMagazineTemplateProps = {
  content: SiteLocaleContent;
  posts: ColumnPost[];
};

export function ColumnMagazineTemplate({ content, posts }: ColumnMagazineTemplateProps) {
  return (
    <>
      <section className="fx-column-page-hero" aria-labelledby="column-magazine-title">
        <div className="fx-column-page-hero-inner">
          <h1 id="column-magazine-title" className="fx-column-page-title">
            MAGAZINE
          </h1>
          <p className="fx-column-page-lead">
            Field XのAIエージェントやAgent Platformに関するお役立ちコンテンツをお届けします。
          </p>
          <div className="fx-column-page-hero-actions">
            <Link href="/column/materials" className="fx-column-page-primary-link">
              資料請求する
            </Link>
            <Link href="/contact" className="fx-column-page-secondary-link">
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>

      <section className="fx-column-page-section" aria-labelledby="column-list-title">
        <div className="fx-column-page-shell">
          <h2 id="column-list-title" className="fx-column-page-section-title">
            マガジン一覧
          </h2>
          <p className="fx-column-page-description">{content.columnPage.description}</p>

          {posts.length === 0 ? (
            <p className="fx-column-page-empty">{content.column.empty}</p>
          ) : (
            <ul className="fx-column-page-grid" aria-label={content.column.listAriaLabel}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <NewsCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
