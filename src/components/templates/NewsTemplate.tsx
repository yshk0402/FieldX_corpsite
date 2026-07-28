import Link from "next/link";

import { NewsCard } from "@/components/molecules";
import type { SiteLocaleContent } from "@/components/site/content";
import type { ColumnPost } from "@/types/content";

type NewsTemplateProps = {
  content: SiteLocaleContent;
  posts: ColumnPost[];
  postHrefBasePath?: string;
};

export function NewsTemplate({ content, posts, postHrefBasePath = "/news" }: NewsTemplateProps) {
  return (
    <>
      <section className="fx-news-page-hero" aria-labelledby="news-page-title">
        <div className="fx-news-page-hero-inner">
          <h1 id="news-page-title" className="fx-news-page-title">
            NEWS
          </h1>
          <p className="fx-news-page-lead">Field Xのプレスリリースや最新情報をお届けします。</p>
          <div className="fx-news-page-hero-actions">
            <Link href="/contact" className="fx-news-page-primary-link">
              まずは相談する
            </Link>
            <Link href="/contact?intent=materials" className="fx-news-page-secondary-link">
              資料請求する
            </Link>
          </div>
        </div>
      </section>

      <section className="fx-news-page-section" aria-labelledby="news-list-title">
        <div className="fx-news-page-shell">
          <h2 id="news-list-title" className="fx-news-page-section-title">
            お知らせ一覧
          </h2>
          <p className="fx-news-page-description">公開中のお知らせのみ表示しています。</p>

          {posts.length === 0 ? (
            <p className="fx-news-page-empty">{content.news.empty}</p>
          ) : (
            <ul className="fx-news-page-grid" aria-label={content.nav.news}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <NewsCard post={post} hrefBasePath={postHrefBasePath} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
