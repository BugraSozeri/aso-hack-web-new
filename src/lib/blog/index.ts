import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  content: string;
  published: boolean;
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const { text } = readingTime(content);

      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        category: data.category ?? "ASO Fundamentals",
        date: data.date ?? "",
        author: data.author ?? "ASOHack Team",
        readTime: text,
        content,
        published: data.published !== false,
      } satisfies BlogPost;
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const { text } = readingTime(content);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    category: data.category ?? "ASO Fundamentals",
    date: data.date ?? "",
    author: data.author ?? "ASOHack Team",
    readTime: text,
    content,
    published: data.published !== false,
  };
}

export function getBlogCategories(): string[] {
  const posts = getBlogPosts();
  const categories = [...new Set(posts.map((p) => p.category))];
  return categories;
}
