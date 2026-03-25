import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://asohack.com";

  const staticPages = [
    "",
    "/tools",
    "/tools/keyword-density",
    "/tools/listing-analyzer",
    "/tools/aso-audit",
    "/tools/review-analyzer",
    "/tools/keyword-explorer",
    "/tools/competitor-tracker",
    "/tools/screenshot-lab",
    "/pricing",
    "/about",
    "/blog",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/tools") ? 0.9 : 0.8,
  }));

  // TODO: Add dynamic blog posts from MDX content
  // const blogPosts = getBlogPosts().map(post => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }));

  return [...staticEntries];
}
