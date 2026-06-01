import type { MetadataRoute } from "next";

import { getAllPublishedRoutes } from "@/lib/content/repository";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const routes = await getAllPublishedRoutes();
  const updatedAt = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: updatedAt,
    changeFrequency: "weekly",
    priority: route.includes("/lp/") ? 0.9 : 0.7
  }));
}
