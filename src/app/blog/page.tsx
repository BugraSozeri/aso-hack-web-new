import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "ASO guides, case studies, and growth strategies for indie app developers. Learn how to rank higher on App Store and Google Play.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  const categories = ["All", ...new Set(posts.map((p) => p.category))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          ASO guides, case studies, and actionable growth strategies for indie developers.
        </p>
      </div>

      {/* Categories */}
      {categories.length > 1 && (
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={cat === "All" ? "default" : "secondary"}
              className={`cursor-pointer px-4 py-1.5 text-sm ${
                cat === "All" ? "bg-amber-500 text-white hover:bg-amber-600" : ""
              }`}
            >
              {cat}
            </Badge>
          ))}
        </div>
      )}

      {/* Posts */}
      {posts.length > 0 ? (
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
                  <p className="mt-3 text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-muted-foreground">
          <p>Articles coming soon. Stay tuned!</p>
        </div>
      )}

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
            className="flex-1 rounded-md border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600">
            Subscribe
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}
