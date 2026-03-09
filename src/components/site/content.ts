import type { ServiceCard, WhatWeDoFeatureRow } from "@/types/site";

export type SiteLocaleContent = {
  company: string;
  nav: {
    about: string;
    whatWeDo: string;
    news: string;
    contact: string;
  };
  hero: {
    title: string;
    body: string;
  };
  poem: {
    heading: string;
    body: string;
    aboutCtaLabel: string;
  };
  about: {
    heading: string;
    body: string;
  };
  mvv: {
    heading: string;
    items: {
      label: string;
      body?: string;
      points?: string[];
    }[];
  };
  whatWeDo: {
    heading: string;
    intro?: string;
    featuredRows: WhatWeDoFeatureRow[];
    services: ServiceCard[];
  };
  team: {
    heading: string;
    body: string;
    members: {
      name: string;
      role: string;
      bio: string;
      imageSrc: string;
      imageAlt: string;
    }[];
  };
  history: {
    heading: string;
    items: {
      year: string;
      detail: string;
    }[];
  };
  companyProfile: {
    heading: string;
    items: {
      label: string;
      value: string;
    }[];
  };
  news: {
    heading: string;
    empty: string;
    publishedLabel: string;
  };
  contact: {
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
  blog: {
    heading: string;
    description: string;
    empty: string;
    listAriaLabel: string;
    publishedLabel: string;
  };
  lp: {
    eyebrow: string;
    ctaLabel: string;
  };
};

export const siteContent: SiteLocaleContent = {
    company: "Field X",
    nav: {
      about: "About",
      whatWeDo: "What We Do",
      news: "News",
      contact: "Contact"
    },
    hero: {
      title: "様々なFieldのXを解き、\n社会を次代につなげる。",
      body: ""
    },
    poem: {
      heading: "",
      body: `多くの企業では、
電話対応、書類処理、データ入力など、
人が時間を使い続けている業務が数多く残っています。

AIの進化により、
これらの業務は自動化・半自動化できる時代になりました。

コール対応、書類業務、マーケティングオペレーションなど、
さまざまな領域でAIを実装し、

Field Xは、すべての事業領域・業界でAIが意思決定を支え、
ヒトがヒトにしかできない業務に集中できる世界の実現を目指しています。`,
      aboutCtaLabel: "About→"
    },
    about: {
      heading: "",
      body: "Field Xは高専出身の二人によって立ち上げられたスタートアップです。合理化が進むこの時代に、様々な分野で事業創造を続け、集団で有り続けることの価値を証明します。"
    },
    mvv: {
      heading: "MVV",
      items: [
        {
          label: "Mission",
          body: "挑戦を、連続させる。"
        },
        {
          label: "Vision",
          body: "経済圏を創り、主導する。"
        },
        {
          label: "Value",
          points: [
            "市場から逃げない",
            "試す前に諦めない",
            "速く作り、速く修正する",
            "熱量を伝播させる",
            "勝てない挑戦は続けない"
          ]
        }
      ]
    },
    whatWeDo: {
      heading: "What We Do",
      intro:
        "Xとは、まだ名前のついていない挑戦や未解決の社会課題。様々な領域のXを解く、創造的な事業開発を実行します。",
      featuredRows: [
        {
          title: "AI Agent Platform",
          body:
            "企業の業務を分解し、\nAIエージェントとして再構築します。\nコール対応、書類業務、マーケティング運用など、\n企業活動を支えるオペレーションをAI化し、\n企業の生産性を大きく引き上げます。"
        },
        {
          title: "Vertical AI Products",
          body:
            "AIエージェントを基盤に、\n業界ごとの課題を解決するプロダクトを開発します。\n不動産、マーケティング、ECなど、\n各産業の業務構造に最適化されたAIプロダクトを展開し、\n産業全体の進化を支えていきます。"
        }
      ],
      services: [
        {
          category: "AI DX 事業",
          name: "Operates X",
          description: "業務フローを再設計し、AIを実装して現場に定着させる。",
          slug: "operates-x",
          image: {
            src: "/images/services/operates-x.svg",
            alt: "Operates X service visual"
          }
        },
        {
          category: "AI DX 事業",
          name: "Launch X",
          description: "企画から公開までを最短で。あなたのアイデア実装をAIでエンパワーメントします。",
          image: {
            src: "/images/services/launch-x.svg",
            alt: "Launch X service visual"
          }
        },
        {
          category: "教育 事業",
          name: "高専ジョブ",
          description: "高専生のための、高専生によるキャリアサービス",
          image: {
            src: "/images/services/kosen-job.svg",
            alt: "高専ジョブ service visual"
          }
        }
      ]
    },
    team: {
      heading: "Team",
      body: "異なる専門性を持つ少数精鋭で、最後まで実装する。",
      members: [
        {
          name: "Yusuke",
          role: "Co-Founder / Product",
          bio: "事業設計とプロダクト開発を横断し、顧客価値の立ち上げをリードします。",
          imageSrc: "/images/team/member-placeholder.svg",
          imageAlt: "Yusuke profile placeholder"
        },
        {
          name: "Shun",
          role: "Co-Founder / Engineering",
          bio: "技術戦略から実装までを担い、現場運用に乗る品質でのリリースを推進します。",
          imageSrc: "/images/team/member-placeholder.svg",
          imageAlt: "Shun profile placeholder"
        },
        {
          name: "Kaede",
          role: "Operations",
          bio: "プロジェクト進行と顧客コミュニケーションを支え、成果が届く運用基盤を整えます。",
          imageSrc: "/images/team/member-placeholder.svg",
          imageAlt: "Kaede profile placeholder"
        }
      ]
    },
    history: {
      heading: "沿革",
      items: [
        { year: "2025.04", detail: "Field Xを創業" },
        { year: "2025.08", detail: "AI DX支援サービス「Operates X」を提供開始" },
        { year: "2026.01", detail: "教育事業「高専ジョブ」をリリース" }
      ]
    },
    companyProfile: {
      heading: "会社概要",
      items: [
        { label: "会社名", value: "株式会社Field X" },
        { label: "設立", value: "2025年4月" },
        { label: "所在地", value: "東京都（リモート中心）" },
        { label: "事業内容", value: "AI DX事業 / 教育事業" },
        { label: "代表", value: "共同代表" }
      ]
    },
    news: {
      heading: "Latest News",
      empty: "公開中のニュースはまだありません。",
      publishedLabel: "Published"
    },
    contact: {
      heading: "Contact",
      body: "ご相談・協業に関するお問い合わせはこちら。",
      ctaLabel: "お問い合わせはこちら",
      ctaHref: "/contact"
    },
    blog: {
      heading: "Blog",
      description: "公開中の記事のみ表示しています。",
      empty: "公開中の記事はありません。",
      listAriaLabel: "ブログ記事一覧",
      publishedLabel: "Published"
    },
    lp: {
      eyebrow: "Landing Page",
      ctaLabel: "CTA"
    }
};
