import Link from "next/link";

const plannedMaterials = [
  {
    title: "AI活用最新事例集",
    body: "不動産賃貸管理会社向けのAI活用事例や、導入検討時に見ておきたいポイントをまとめる予定です。",
    status: "準備中"
  },
  {
    title: "AI導入・業務設計チェックリスト",
    body: "PoCで止めずに現場運用へつなげるための確認項目を整理する予定です。",
    status: "準備中"
  },
  {
    title: "サービス概要資料",
    body: "AX Solution事業とAI Agent事業の支援範囲、進め方、相談の入口をまとめる予定です。",
    status: "準備中"
  }
] as const;

export function ColumnMaterialsTemplate() {
  return (
    <>
      <section className="fx-column-page-hero" aria-labelledby="column-materials-title">
        <div className="fx-column-page-hero-inner">
          <h1 id="column-materials-title" className="fx-column-page-title">
            MATERIALS
          </h1>
          <p className="fx-column-page-lead">
            Field Xが提供するサービスの紹介資料です。
            <br />
            資料請求フォームの送信完了後、確認メールから資料をダウンロードいただけます。
          </p>
          <div className="fx-column-page-hero-actions">
            <Link href="/contact?intent=materials" className="fx-column-page-primary-link">
              資料を請求する
            </Link>
            <Link href="/column/magazine" className="fx-column-page-secondary-link">
              マガジンを読む
            </Link>
          </div>
        </div>
      </section>

      <section className="fx-column-page-section" aria-labelledby="column-materials-list-title">
        <div className="fx-column-page-shell">
          <h2 id="column-materials-list-title" className="fx-column-page-section-title">
            資料一覧
          </h2>
          <p className="fx-column-page-description">
            公開予定の資料です。準備が整い次第、このページから直接確認できるようにします。
          </p>

          <ul className="fx-column-materials-grid" aria-label="資料一覧">
            {plannedMaterials.map((material) => (
              <li key={material.title}>
                <article className="fx-column-material-card">
                  <span className="fx-column-material-status">{material.status}</span>
                  <h3 className="fx-column-material-title">{material.title}</h3>
                  <p className="fx-column-material-body">{material.body}</p>
                  <Link href="/contact?intent=materials" className="fx-column-material-link">
                    この資料について問い合わせる
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
