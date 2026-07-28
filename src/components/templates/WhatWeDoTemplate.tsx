import Image from "next/image";
import Link from "next/link";

const agentProducts = [
  {
    title: "AIコールエージェント",
    body: "見込み客や入居者からの電話に応対する。",
    icon: "/images/services/agents/call-agent.svg"
  },
  {
    title: "AIチャットエージェント",
    body: "見込み客や入居者からのメールやチャットの返信をAIが応対する。",
    icon: "/images/services/agents/chat-agent.svg"
  },
  {
    title: "オーナーエージェント",
    body: "オーナー様訪問前に確認するべき社内情報をまとめる。",
    icon: "/images/services/agents/owner-agent.svg"
  },
  {
    title: "AI Docs エージェント",
    body: "各種契約書などの煩雑な書類作成をAIが完了する。",
    icon: "/images/services/agents/docs-agent.svg"
  },
  {
    title: "退去手続きエージェント",
    body: "退去連絡から退去完了までの一連の業務をAIが支援する。",
    icon: "/images/services/agents/move-out-agent.svg"
  },
  {
    title: "更新案内エージェント",
    body: "契約更新対象者への連絡・リマインドを定期的に実行する。",
    icon: "/images/services/agents/renewal-agent.svg"
  },
  {
    title: "大規模修繕エージェント",
    body: "水回りからリノベーションまで、修繕提案をAIが支援する。",
    icon: "/images/services/agents/repair-agent.svg"
  }
] as const;

function CtaLink({
  href,
  children,
  variant = "primary"
}: {
  href: string;
  children: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <Link href={href} className={`fx-service-page-cta fx-service-page-cta-${variant}`}>
      {children}
    </Link>
  );
}

export function WhatWeDoTemplate() {
  return (
    <>
      <section className="fx-service-page-hero" aria-labelledby="service-page-title">
        <div className="fx-service-page-hero-inner">
          <h1 id="service-page-title" className="fx-service-page-title">
            SERVICE
          </h1>
          <p className="fx-service-page-lead">
            Field Xは賃貸管理業務に特化したAIエージェントカンパニーです。
            <br />
            Field
            XのAIエージェントがどのように、賃貸管理業務を支援し成果をもたらすのかご覧ください。
          </p>
          <div className="fx-service-page-hero-actions">
            <CtaLink href="/contact">まずは相談する</CtaLink>
            <CtaLink href="/contact?intent=materials" variant="ghost">
              資料を請求する
            </CtaLink>
          </div>
        </div>
      </section>

      <section className="fx-service-page-products" aria-labelledby="service-products-title">
        <div className="fx-service-page-shell">
          <h2 id="service-products-title" className="fx-service-page-section-title">
            主要なプロダクト
          </h2>

          <section
            className="fx-service-page-agent-suite"
            aria-labelledby="service-agent-suite-title"
          >
            <h3 id="service-agent-suite-title" className="fx-service-page-red-heading">
              <span>賃貸管理業務のあらゆる業務を支える</span>
              <span>エージェント型AI</span>
            </h3>
            <p className="fx-service-page-agent-lead">
              エージェント型AIを構築し活用することで、賃貸管理に関わるあらゆる業務を効率的に支え、
              <br />
              ヒトがヒトにしかできない業務に集中できる時間を創出し、クライアントの利益拡大に貢献します。
            </p>

            <div className="fx-service-page-agent-grid">
              {agentProducts.map((product) => (
                <article key={product.title} className="fx-service-page-agent-card">
                  <Image
                    src={product.icon}
                    alt=""
                    width={160}
                    height={160}
                    className="fx-service-page-agent-thumb"
                  />
                  <div className="fx-service-page-agent-copy">
                    <h4 className="fx-service-page-agent-title">{product.title}</h4>
                    <p className="fx-service-page-agent-body">{product.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="fx-service-page-platform" aria-labelledby="service-platform-title">
            <h3 id="service-platform-title" className="fx-service-page-red-heading">
              <span>強力なエージェント群を支える</span>
              <span>AIエージェントのためのプラットフォーム</span>
            </h3>
            <p className="fx-service-page-platform-lead">
              オーナー・入居者・物件・部屋ごとに独立する既存の基幹システムやCRMをシームレスに連携し、
              <br />
              AIエージェントが扱える構造化されたデータに変換。
              <br />
              セキュアなクラウド上に構築されたエージェントプラットフォームがAIエージェントを支えます。
            </p>

            <div className="fx-service-page-platform-visual" aria-hidden="true">
              <Image
                src="/images/services/platform/agent-platform-overview-v11.png"
                alt=""
                width={1672}
                height={941}
                className="fx-service-page-platform-image"
              />
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
