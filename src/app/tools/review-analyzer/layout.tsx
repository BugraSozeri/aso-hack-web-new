import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Analyzer — App Review Sentiment Analysis | ASOHack",
  description:
    "Paste your app reviews and get instant sentiment analysis + AI-powered insights on what users love, hate, and want next.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
