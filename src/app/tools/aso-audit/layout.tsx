import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASO Audit — Full App Store Optimization Audit | ASOHack",
  description:
    "Run a complete ASO audit for your app. Get a scored report across title, keywords, description, ratings, and visual assets with AI-powered action items.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
