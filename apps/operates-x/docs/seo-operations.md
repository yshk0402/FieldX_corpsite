# SEO運用ガイド（お問い合わせ最大化）

## 1. 目標とKPI
- 目標: SEO経由のお問い合わせを最大化する
- 期間目標: 2026年5月31日までにSEO経由問い合わせ月20件

### KPIツリー
1. SEO流入（月間セッション）: 4,000
2. `/contact` 到達率: 3.5%以上
3. 問い合わせ完了率（到達→送信）: 14%以上
4. 最終問い合わせ件数: 月20件

## 2. 計測イベント定義
- `contact_page_view`: お問い合わせページ到達
- `contact_banner_click`: 記事内CTAクリック
- `contact_submit`: Tally送信完了

### 環境変数
- `NEXT_PUBLIC_SITE_URL=https://www.ai-mate.site`
- `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

## 3. 週次ルーチン
1. 月曜: GSCクエリを確認（表示回数・平均掲載順位）
2. 火曜: タイトル/ディスクリプションを改修（CTR改善）
3. 水曜: 関連記事・関連事例の内部リンクを再配置
4. 木曜: CTA文言をA/Bで差し替え
5. 金曜: 流入・CV・順位をレポート化

## 4. 記事公開チェック（必須）
- フロントマター必須:
  - `title`
  - `description`
  - `slug`
  - `status`
  - `publishedAt`
  - `ogImage`
  - `thumbnail`
  - `primaryKeyword`
  - `targetIntent`
- 推奨:
  - `secondaryKeywords`
  - `ctaType`
- 本文要件:
  - H2/H3の見出し構造
  - FAQ節
  - 関連記事リンク2本以上
  - 文中CTA・記事末CTA・バナーCTA

## 5. コンテンツクラスター
- Pillar A: AI業務改善の進め方（How-to）
- Pillar B: 導入失敗回避（Risk/Checklist）
- Pillar C: 事例比較・判断（Case/Comparison）
- Pillar D: 実装運用テンプレート（Template/運用）
