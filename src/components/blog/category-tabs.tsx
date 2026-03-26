"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
}

interface CategoryTabsProps {
  posts: PostSummary[];
  categories: string[];
}

export function CategoryTabs({ posts, categories }: CategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") || "All";

  const filtered =
    current === "All" ? posts : posts.filter((p) => p.category === current);

  function handleCategory(cat: string) {
    if (cat === "All") {
      router.push("/blog");
    } else {
      router.push(`/blog?category=${encodeURIComponent(cat)}`);
    }
  }

  return (
    <>
      {/* Category tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const isActive = cat === current;
          return (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-950 dark:hover:text-amber-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Post grid */}
      {filtered.length > 0 ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
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
          <p>No articles in this category yet. Check back soon!</p>
        </div>
      )}
    </>
  );
}
