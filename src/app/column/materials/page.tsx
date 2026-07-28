import type { Metadata } from "next";

import { ColumnMaterialsTemplate } from "@/components/templates";
import { defaultOgImage } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "資料一覧",
  description: "Field Xの資料一覧。AI導入や業務設計の検討に使える資料を集約していきます。",
  alternates: {
    canonical: "/column/materials"
  },
  openGraph: {
    title: "資料一覧",
    description: "Field Xの資料一覧。AI導入や業務設計の検討に使える資料を集約していきます。",
    images: [defaultOgImage],
    url: "/column/materials"
  },
  twitter: {
    card: "summary_large_image",
    title: "資料一覧",
    description: "Field Xの資料一覧。AI導入や業務設計の検討に使える資料を集約していきます。",
    images: [defaultOgImage.url]
  }
};

export default function ColumnMaterialsPage() {
  return <ColumnMaterialsTemplate />;
}
