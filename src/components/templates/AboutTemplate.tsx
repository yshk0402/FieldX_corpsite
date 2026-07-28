import Image from "next/image";
import Link from "next/link";

import type { SiteLocaleContent } from "@/components/site/content";

type AboutTemplateProps = {
  content: SiteLocaleContent;
};

const companyProfile = [
  { label: "会社名", value: "株式会社Field X / Field X inc." },
  { label: "代表者", value: "佐藤 善彦" },
  { label: "設立", value: "2026年3月" },
  { label: "住所", value: "東京都渋谷区神泉町10-35" }
];

const recruitmentItems = [
  "長期インターンシップ_オープンポジション",
  "27卒新卒_FDE",
  "27卒新卒_DS（営業職）",
  "27卒新卒_プロダクトエンジニア",
  "業務委託_営業職",
  "業務委託_プロダクトエンジニア",
  "業務委託_QAエンジニア",
  "28卒新卒_FDE（Foward Deployed Engineer）",
  "28卒新卒_DS（営業職）",
  "28卒新卒_プロダクトエンジニア"
];

function SectionTitle({ children, id }: { children: string; id?: string }) {
  return (
    <h2 id={id} className="fx-about-page-section-title">
      {children}
    </h2>
  );
}

export function AboutTemplate({ content }: AboutTemplateProps) {
  const [mission, vision] = content.mvv.items;

  return (
    <>
      <section className="fx-about-page-hero" aria-labelledby="about-page-title">
        <div className="fx-about-page-hero-inner">
          <h1 id="about-page-title" className="fx-about-page-title">
            ABOUT
          </h1>
          <p className="fx-about-page-lead">
            様々なFieldのXを解き、社会を次代につなげる。
            <br />
            Field Xは、既存産業にAIを実装しより良い形で社会を次代につなげる会社です。
          </p>
          <div className="fx-about-page-hero-actions">
            <Link href="/contact" className="fx-about-page-primary-link">
              まずは相談する
            </Link>
            <Link href="/contact?intent=materials" className="fx-about-page-secondary-link">
              資料を請求する
            </Link>
          </div>
        </div>
      </section>

      <section
        id="company-profile"
        className="fx-about-page-section fx-about-page-company"
        aria-labelledby="about-company-title"
      >
        <div className="fx-about-page-shell">
          <SectionTitle id="about-company-title">企業情報</SectionTitle>
          <dl className="fx-about-page-profile">
            {companyProfile.map((item) => (
              <div key={item.label} className="fx-about-page-profile-row">
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="team"
        className="fx-about-page-section fx-about-page-team"
        aria-labelledby="about-team-title"
      >
        <div className="fx-about-page-shell">
          <SectionTitle id="about-team-title">役員紹介</SectionTitle>
          <ul className="fx-about-page-members" aria-label="役員紹介">
            {content.team.members.map((member, index) => (
              <li key={member.name} className="fx-about-page-member">
                <Image
                  className="fx-about-page-member-image"
                  src={member.imageSrc}
                  alt={member.imageAlt}
                  width={357}
                  height={244}
                />
                <div className="fx-about-page-member-copy">
                  <p className="fx-about-page-member-role">
                    {index === 0 ? "Founder｜代表取締役" : "Co-Founder｜専務取締役"}
                  </p>
                  <h3 className="fx-about-page-member-name">{member.name}</h3>
                  <p className="fx-about-page-member-bio">{member.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="mvv"
        className="fx-about-page-section fx-about-page-story"
        aria-labelledby="about-story-title"
      >
        <div className="fx-about-page-shell">
          <SectionTitle id="about-story-title">私たちについて</SectionTitle>
          <div className="fx-about-page-logo-wrap" aria-hidden="true">
            <Image
              src="/images/brand/field-x-logo-wide.png"
              alt=""
              width={2280}
              height={666}
              className="fx-about-page-logo"
            />
          </div>

          <div className="fx-about-page-mvv">
            {[mission, vision].map((item) => (
              <div key={item.label} className="fx-about-page-mvv-row">
                <div className="fx-about-page-mvv-label">
                  <h3>{item.label}</h3>
                  <p>{item.label === "Mission" ? "存在意義" : "実現したい世界観"}</p>
                </div>
                <p className="fx-about-page-mvv-body">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="fx-about-page-story-body">
            <p>私たちは、高専をバックグラウンドにもつ二人が創業したAIスタートアップです。</p>
            <p>
              社名である「Field X」には弊社のミッションである
              <strong>「様々なFieldのXを解き、社会を次代につなげる。」</strong>
              に由来しています。
            </p>
            <p>
              現在に至るまでに社会を形作ってきた先人達に敬意を持ちながらも、既存産業をAIネイティブに変革することで本質的に
              <strong>ヒトがヒトにしかできない業務に集中できる世界の実現</strong>
              を目指しています。
            </p>
          </div>
        </div>
      </section>

      <section
        id="history"
        className="fx-about-page-section fx-about-page-recruit"
        aria-labelledby="about-recruit-title"
      >
        <div className="fx-about-page-shell fx-about-page-recruit-shell">
          <SectionTitle id="about-recruit-title">採用情報</SectionTitle>
          <p className="fx-about-page-recruit-lead">Field Xで通年で人材募集を実施しております。</p>
          <ul className="fx-about-page-recruit-list" aria-label="採用情報">
            {recruitmentItems.map((item) => (
              <li key={item} className="fx-about-page-recruit-item">
                <span>{item}</span>
                <Link
                  href="https://recruit.fieldx.site"
                  aria-label={`${item}の募集ページを見る`}
                  className="fx-about-page-recruit-link"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
