import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function getBlogSlugsWithDates(): { slug: string; date: string }[] {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  if (!fs.existsSync(blogDir)) return [];

  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const content = fs.readFileSync(path.join(blogDir, f), "utf-8");
      const dateMatch = content.match(/^date:\s*"([^"]+)"/m);
      const date = dateMatch ? dateMatch[1] : "2026-03-26";
      return { slug, date };
    });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://asohack.com";

  const staticPages: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, changeFreq: "weekly" },
    { path: "/blog", priority: 0.9, changeFreq: "daily" },
    { path: "/tools", priority: 0.9, changeFreq: "monthly" },
    { path: "/tools/keyword-density", priority: 0.85, changeFreq: "monthly" },
    { path: "/tools/listing-analyzer", priority: 0.85, changeFreq: "monthly" },
    { path: "/tools/aso-audit", priority: 0.85, changeFreq: "monthly" },
    { path: "/tools/review-analyzer", priority: 0.85, changeFreq: "monthly" },
    { path: "/tools/keyword-explorer", priority: 0.85, changeFreq: "monthly" },
    { path: "/tools/competitor-tracker", priority: 0.85, changeFreq: "monthly" },
    { path: "/tools/screenshot-lab", priority: 0.85, changeFreq: "monthly" },
    { path: "/tools/ad-analytics", priority: 0.85, changeFreq: "monthly" },
    { path: "/tools/ad-benchmark", priority: 0.85, changeFreq: "monthly" },
    { path: "/pricing", priority: 0.8, changeFreq: "monthly" },
    { path: "/about", priority: 0.7, changeFreq: "monthly" },
    { path: "/ads", priority: 0.7, changeFreq: "monthly" },
    { path: "/privacy", priority: 0.5, changeFreq: "yearly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path: p, priority, changeFreq }) => ({
    url: `${baseUrl}${p}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }));

  const blogPosts = getBlogSlugsWithDates();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map(({ slug, date }) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticEntries, ...blogEntries];
}
