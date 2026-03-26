"use client";

import { useRouter } from "next/navigation";

interface CategoryTabsProps {
  categories: string[];
  current: string;
}

export function CategoryTabs({ categories, current }: CategoryTabsProps) {
  const router = useRouter();

  function handleCategory(cat: string) {
    if (cat === "All") {
      router.push("/blog");
    } else {
      router.push(`/blog?category=${encodeURIComponent(cat)}`);
    }
  }

  return (
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
  );
}
