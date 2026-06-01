import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ColumnPostTemplate } from "@/components/templates";
import { getColumnPostBySlug } from "@/lib/content/repository";
import { defaultOgImage } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getColumnPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/column/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/column/${post.slug}`,
      siteName: "Field X",
      locale: "ja_JP",
      type: "article",
      publishedTime: post.publishedAt,
      images: post.ogImage ? [post.ogImage] : [defaultOgImage]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.ogImage ?? defaultOgImage.url]
    }
  };
}

export default async function ColumnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getColumnPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <ColumnPostTemplate post={post} />;
}
