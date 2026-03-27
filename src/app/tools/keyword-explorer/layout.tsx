import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyword Explorer — ASO Keyword Research Tool | ASOHack",
  description:
    "Discover high-value keywords for your app. Get competition levels, search volume estimates, and placement recommendations powered by AI.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
