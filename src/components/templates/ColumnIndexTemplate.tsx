import Link from "next/link";

const columnHubItems = [
  {
    href: "/column/magazine",
    label: "マガジン",
    title: "業務にAIを組み込むための実装知",
    body: "不動産賃貸管理を中心に、AIエージェント、業務設計、運用定着の視点を整理した記事を掲載します。",
    cta: "記事を読む"
  },
  {
    href: "/column/materials",
    label: "資料",
    title: "検討に使える資料をまとめて探す",
    body: "導入事例、サービス概要、業務整理に役立つ資料をここに集約していきます。現在は資料請求から受け付けています。",
    cta: "資料を見る"
  }
] as const;

export function ColumnIndexTemplate() {
  return (
    <>
      <section className="fx-column-page-hero" aria-labelledby="column-page-title">
        <div className="fx-column-page-hero-inner">
          <h1 id="column-page-title" className="fx-column-page-title">
            COLUMN
          </h1>
          <p className="fx-column-page-lead">
            AI活用をPoCで止めず、現場の業務に組み込むための知見をまとめています。
            <br />
            マガジン記事と資料を、目的に合わせて探せる入口です。
          </p>
          <div className="fx-column-page-hero-actions">
            <Link href="/column/magazine" className="fx-column-page-primary-link">
              マガジンを読む
            </Link>
            <Link href="/column/materials" className="fx-column-page-secondary-link">
              資料を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="fx-column-page-section" aria-labelledby="column-hub-title">
        <div className="fx-column-page-shell">
          <h2 id="column-hub-title" className="fx-column-page-section-title">
            コンテンツを選ぶ
          </h2>
          <p className="fx-column-page-description">
            記事で理解を深めるか、資料で検討を進めるか。必要な情報にすぐ移動できます。
          </p>

          <ul className="fx-column-hub-grid" aria-label="Column コンテンツ一覧">
            {columnHubItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="fx-column-hub-card">
                  <span className="fx-column-hub-card-label">{item.label}</span>
                  <h3 className="fx-column-hub-card-title">{item.title}</h3>
                  <p className="fx-column-hub-card-body">{item.body}</p>
                  <span className="fx-column-hub-card-cta">{item.cta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
