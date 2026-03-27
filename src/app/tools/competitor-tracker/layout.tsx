import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitor Tracker — App Competitive Analysis | ASOHack",
  description:
    "Compare your app against up to 5 competitors. Get rating comparisons, keyword gap analysis, and AI-powered strategy to win market share.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
