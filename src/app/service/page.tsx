import type { Metadata } from "next";

import { WhatWeDoTemplate } from "@/components/templates";
import { defaultOgImage } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "事業内容",
  description:
    "Field Xは賃貸管理業務に特化したAIエージェントカンパニーです。Field XのAIエージェントがどのように、賃貸管理業務を支援し成果をもたらすのかご覧ください。",
  alternates: {
    canonical: "/service"
  },
  openGraph: {
    title: "事業内容",
    description:
      "Field Xは賃貸管理業務に特化したAIエージェントカンパニーです。Field XのAIエージェントがどのように、賃貸管理業務を支援し成果をもたらすのかご覧ください。",
    images: [defaultOgImage],
    url: "/service"
  },
  twitter: {
    card: "summary_large_image",
    title: "事業内容",
    description:
      "Field Xは賃貸管理業務に特化したAIエージェントカンパニーです。Field XのAIエージェントがどのように、賃貸管理業務を支援し成果をもたらすのかご覧ください。",
    images: [defaultOgImage.url]
  }
};

export default function ServicePage() {
  return <WhatWeDoTemplate />;
}
