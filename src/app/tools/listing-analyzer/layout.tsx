import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Listing Analyzer — ASO Score & AI Recommendations | ASOHack",
  description:
    "Get an instant ASO score (0-100) for your App Store or Google Play listing. Analyzes title, subtitle, description, screenshots, ratings, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
