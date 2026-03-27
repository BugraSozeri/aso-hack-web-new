import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ad Analytics Calculator — Mobile Ad ROI & ROAS | ASOHack",
  description:
    "Calculate CPI, CTR, CVR, LTV, ROAS, and profitability for your mobile ad campaigns. Free calculator for App Store and Google Play ads.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
