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
      entries?: {
        title: string;
        subtitle?: string;
        body: string;
      }[];
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
  companyProfile: {
    heading: string;
    items: {
      label: string;
      value: string | string[];
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
          body: "様々なFieldのXを解き、社会を次代につなげる。"
        },
        {
          label: "Vision",
          body: "すべての事業領域・業界でAIが意思決定を支え、\nヒトがヒトにしかできない業務に集中できる世界の実現"
        },
        {
          label: "Value",
          entries: [
            {
              title: "Solve the X",
              subtitle: "見えない課題を見つけ、構造から解く。",
              body:
                "私たちは表面的な問題ではなく、\n業務や産業の構造そのものにある「X」を見つけ出し、解決する。"
            },
            {
              title: "Build Fast",
              subtitle: "速く作り、速く学び、速く進む。",
              body:
                "AI時代において最大の競争力はスピードである。\nField X は、仮説・実装・改善を高速で回す。"
            },
            {
              title: "AI First",
              subtitle: "AIを前提に世界を設計する。",
              body:
                "AIはツールではなく、\n新しいインフラである。\n私たちはすべての業務をAI前提で再設計する。"
            },
            {
              title: "Think from the Field",
              subtitle: "現場から考える。",
              body:
                "机上の理論ではなく、\n現場の業務・顧客・産業構造から答えを導く。"
            },
            {
              title: "Create the Next Standard",
              subtitle: "次の当たり前をつくる。",
              body:
                "AIエージェントが企業の業務を支える世界。\nField X はその標準をつくる。"
            }
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
          name: "佐藤善彦",
          role: "代表取締役",
          bio: "2002年広島県呉市生まれ。呉工業高等専門学校卒業後University of the Peopleへ編入し中退。在学中に広告代理店系ベンチャーで長期インターンシップを開始しその後新卒入社。ChatGPTなどの生成AI技術の指数関数的な発展をビジネスの現場で目の当たりにし、2026年AIによる業務改革を基軸事業に展開する株式会社Field Xを創業。",
          imageSrc: "/images/team/sato-yoshihiko.jpg",
          imageAlt: "佐藤善彦の顔写真"
        },
        {
          name: "吉村佑介",
          role: "共同創業者 専務取締役",
          bio: "2002年広島県福山市生まれ。呉工業高等専門学校プロジェクトデザイン工学専攻卒業。新卒から、大手電力会社、大手不動産ディベロッパーで営業職として渡り歩く。2026年AIによる業務改革を基軸事業に展開する株式会社Field Xを共同創業。現在は事業最高責任者として不動産賃貸管理会社のコールセンターAIや書類管理をDXするAIサービスを展開している。",
          imageSrc: "/images/team/yoshimura-yusuke.jpg",
          imageAlt: "吉村佑介の顔写真"
        }
      ]
    },
    companyProfile: {
      heading: "会社概要",
      items: [
        { label: "会社名", value: "Field X" },
        { label: "代表者", value: "佐藤 善彦" },
        { label: "所在地", value: "東京都渋谷区神泉町10-15" },
        { label: "設立", value: "2026年" },
        {
          label: "主な事業領域",
          value: [
            "AIコールエージェントの開発・導入",
            "書類業務のAI自動化",
            "業務オペレーションのAIエージェント化",
            "ナレッジベース / RAGシステムの構築",
            "AI活用プロダクトの開発"
          ]
        }
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
