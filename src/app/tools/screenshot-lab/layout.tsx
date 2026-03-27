import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screenshot Lab — App Store Screenshot Analyzer | ASOHack",
  description:
    "Upload your App Store screenshots and get AI-powered creative direction. Find out exactly what's hurting your conversion rate and how to fix it.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
