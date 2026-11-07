import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kftcsbc-platform.vercel.app";
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/events",
    "/membership",
    "/committee",
    "/achievements",
    "/resources",
    "/articles",
    "/gallery",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/code-of-conduct",
    "/accessibility",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
