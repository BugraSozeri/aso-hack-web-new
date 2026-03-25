import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "ASO guides, case studies, and growth strategies for indie app developers. Learn how to rank higher on App Store and Google Play.",
};

const posts = [
  {
    title: "The Complete ASO Guide for Indie Developers (2026)",
    description:
      "Everything you need to know about App Store Optimization — from keyword research to screenshot design. A comprehensive guide for developers just getting started.",
    category: "ASO Fundamentals",
    date: "Coming Soon",
    slug: "aso-guide-for-beginners",
    readTime: "15 min read",
  },
  {
    title: "How to Do Keyword Research for Your Mobile App",
    description:
      "A step-by-step guide to finding high-value, low-competition keywords for your app store listing. Includes free and paid strategies.",
    category: "ASO Fundamentals",
    date: "Coming Soon",
    slug: "app-store-keyword-research",
    readTime: "10 min read",
  },
  {
    title: "App Store Screenshots That Convert: A Data-Driven Guide",
    description:
      "Learn what makes app store screenshots convert browsers into downloaders. Real examples, best practices, and common mistakes to avoid.",
    category: "Growth Hacks",
    date: "Coming Soon",
    slug: "app-store-screenshot-best-practices",
    readTime: "8 min read",
  },
  {
    title: "iOS vs Android ASO: Key Differences You Need to Know",
    description:
      "App Store and Google Play have different ranking algorithms, metadata fields, and optimization strategies. Here's how to master both.",
    category: "ASO Fundamentals",
    date: "Coming Soon",
    slug: "ios-vs-android-aso-differences",
    readTime: "12 min read",
  },
  {
    title: "How to Track Your App Store Rankings (Without Expensive Tools)",
    description:
      "You don't need a $500/month tool to track your app rankings. Here are practical, affordable approaches for indie developers.",
    category: "Growth Hacks",
    date: "Coming Soon",
    slug: "track-app-store-rankings-cheap",
    readTime: "7 min read",
  },
  {
    title: "App Store Review Management: Turn Feedback Into Growth",
    description:
      "Learn how to respond to reviews, improve your rating, and use review insights to guide your product roadmap.",
    category: "Growth Hacks",
    date: "Coming Soon",
    slug: "app-store-review-management",
    readTime: "9 min read",
  },
];

const categories = ["All", "ASO Fundamentals", "Growth Hacks", "Case Studies", "App Store Updates"];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          ASO guides, case studies, and actionable growth strategies for indie developers.
        </p>
      </div>

      {/* Categories */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={cat === "All" ? "default" : "secondary"}
            className={`cursor-pointer px-4 py-1.5 text-sm ${
              cat === "All" ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""
            }`}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Posts */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="mt-3 text-lg leading-snug">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                <p className="mt-3 text-xs text-muted-foreground">{post.date}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mx-auto mt-20 max-w-xl rounded-2xl border bg-muted/30 p-8 text-center">
        <h2 className="text-xl font-bold">Stay Updated</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Get weekly ASO tips, app store algorithm updates, and growth strategies delivered to
          your inbox.
        </p>
        <div className="mt-6 flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 rounded-md border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Subscribe
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}
