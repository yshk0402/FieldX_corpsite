import type { Metadata } from "next";

import { siteContent } from "@/components/site/content";
import { ColumnMagazineTemplate } from "@/components/templates";
import { getColumnPosts } from "@/lib/content/repository";
import { defaultOgImage } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "マガジン",
  description:
    "Field Xのマガジン。AIエージェント、業務設計、運用定着に関する記事を掲載しています。",
  alternates: {
    canonical: "/column/magazine"
  },
  openGraph: {
    title: "マガジン",
    description:
      "Field Xのマガジン。AIエージェント、業務設計、運用定着に関する記事を掲載しています。",
    images: [defaultOgImage],
    url: "/column/magazine"
  },
  twitter: {
    card: "summary_large_image",
    title: "マガジン",
    description:
      "Field Xのマガジン。AIエージェント、業務設計、運用定着に関する記事を掲載しています。",
    images: [defaultOgImage.url]
  }
};

export default async function ColumnMagazinePage() {
  const posts = await getColumnPosts();

  return <ColumnMagazineTemplate content={siteContent} posts={posts} />;
}
