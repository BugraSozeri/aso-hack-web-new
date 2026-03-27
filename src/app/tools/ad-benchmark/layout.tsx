import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ad Benchmark Analyzer — Category Ad Performance Benchmarks | ASOHack",
  description:
    "Compare your CPI, CTR, CVR, LTV, and ROAS against industry benchmarks for your app category. See where you rank and get AI strategy to reach top quartile.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
