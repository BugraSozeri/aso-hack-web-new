import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Target,
  TrendingUp,
  DollarSign,
  Smartphone,
  Megaphone,
  ArrowRight,
  BookOpen,
  Calculator,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mobile Ad Networks & Strategy",
  description:
    "Learn mobile advertising strategies, compare ad networks, and analyze your ad performance. Guides for Meta Ads, Apple Search Ads, Google Ads, TikTok Ads, Unity Ads, and more.",
  keywords: [
    "mobile advertising",
    "app install ads",
    "meta ads mobile",
    "apple search ads",
    "google ads app campaigns",
    "tiktok ads",
    "unity ads",
    "mobile ad analytics",
    "ROAS",
    "CPI",
    "LTV",
  ],
};

const adNetworks = [
  {
    name: "Apple Search Ads",
    description:
      "Reach users at the moment of search in the App Store. High intent, premium CPI, great for iOS apps.",
    icon: Target,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    stats: { avgCpi: "$2.50", bestFor: "iOS Discovery" },
    blogSlug: "apple-search-ads-guide",
  },
  {
    name: "Meta Ads (Facebook & Instagram)",
    description:
      "The largest mobile ad platform. Powerful targeting, broad reach, and advanced optimization for app installs.",
    icon: Megaphone,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
    stats: { avgCpi: "$1.80", bestFor: "Scale & Targeting" },
    blogSlug: "meta-ads-app-install-guide",
  },
  {
    name: "Google Ads (App Campaigns)",
    description:
      "Automated app promotion across Search, Play Store, YouTube, and Display Network with machine learning optimization.",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    stats: { avgCpi: "$1.50", bestFor: "Android & Cross-platform" },
    blogSlug: "google-app-campaigns-guide",
  },
  {
    name: "TikTok Ads",
    description:
      "Reach Gen Z and millennial audiences with engaging short-form video ads. Fast-growing platform with competitive CPIs.",
    icon: Smartphone,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400",
    stats: { avgCpi: "$1.20", bestFor: "Young Audiences" },
    blogSlug: "tiktok-ads-mobile-guide",
  },
  {
    name: "Unity Ads",
    description:
      "In-app video and rewarded ads for gaming apps. Reach highly engaged gamers across thousands of mobile games.",
    icon: Layers,
    color: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
    stats: { avgCpi: "$0.80", bestFor: "Gaming Apps" },
    blogSlug: "unity-ads-gaming-guide",
  },
  {
    name: "Ad Analytics Calculator",
    description:
      "Calculate ROAS, LTV, CPI, and conversion rates. Analyze your ad funnel and get strategy recommendations.",
    icon: Calculator,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    stats: { avgCpi: "Free Tool", bestFor: "All Platforms" },
    href: "/tools/ad-analytics",
    isTool: true,
  },
  {
    name: "Ad Benchmark Analyzer",
    description:
      "Compare your CPI, ROAS, CTR, and CVR against category-specific benchmarks. See where you rank and get AI-powered recommendations to reach top quartile.",
    icon: BarChart3,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    stats: { avgCpi: "Pro Tool", bestFor: "All Categories" },
    href: "/tools/ad-benchmark",
    isTool: true,
  },
];

const keyMetrics = [
  {
    name: "CPI",
    fullName: "Cost Per Install",
    description: "How much you pay for each app install from your ad campaigns.",
  },
  {
    name: "ROAS",
    fullName: "Return on Ad Spend",
    description: "Revenue generated per dollar spent on advertising.",
  },
  {
    name: "LTV",
    fullName: "Lifetime Value",
    description: "Total revenue a user generates over their entire relationship with your app.",
  },
  {
    name: "CPA",
    fullName: "Cost Per Action",
    description: "Cost for a specific action like trial start, subscription, or purchase.",
  },
  {
    name: "CTR",
    fullName: "Click-Through Rate",
    description: "Percentage of users who click your ad after seeing it.",
  },
  {
    name: "CVR",
    fullName: "Conversion Rate",
    description: "Percentage of users who install after clicking your ad.",
  },
];

const guides = [
  {
    title: "Mobile Ad Metrics 101",
    description: "Learn the essential metrics every app developer needs to understand before running ads.",
    href: "/blog/mobile-ad-metrics-guide",
    category: "Fundamentals",
  },
  {
    title: "Apple Search Ads Complete Guide",
    description: "Step-by-step guide to setting up and optimizing Apple Search Ads campaigns.",
    href: "/blog/apple-search-ads-guide",
    category: "Ad Networks",
  },
  {
    title: "Meta Ads for App Installs",
    description: "How to create high-performing Facebook & Instagram app install campaigns.",
    href: "/blog/meta-ads-app-install-guide",
    category: "Ad Networks",
  },
];

export default function AdsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent dark:from-amber-950/30" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              Mobile Advertising for Indie Developers
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Grow Your App with{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Smart Ads
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Compare ad networks, learn mobile advertising strategies, and analyze your campaign
              performance — all tailored for indie developers on a budget.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-xl bg-amber-500 px-8 text-base font-semibold text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600"
                asChild
              >
                <Link href="/tools/ad-analytics">
                  Try Ad Calculator <Calculator className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-xl px-8 text-base" asChild>
                <Link href="/blog/mobile-ad-metrics-guide">Learn the Basics</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
            Key Metrics Every App Developer Should Know
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {keyMetrics.map((metric) => (
              <div key={metric.name} className="rounded-xl border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">{metric.name}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{metric.fullName}</p>
                <p className="mt-2 text-xs text-muted-foreground/80">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Networks */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ad Networks & Tools
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore the top mobile ad networks and our free analytics tools to maximize your ad spend.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {adNetworks.map((network) => (
              <Link
                key={network.name}
                href={network.isTool ? network.href! : `/blog/${network.blogSlug}`}
              >
                <Card className="group h-full transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${network.color}`}>
                        <network.icon className="h-5 w-5" />
                      </div>
                      {network.isTool ? (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          Free Tool
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Avg CPI: <strong>{network.stats.avgCpi}</strong>
                        </span>
                      )}
                    </div>
                    <CardTitle className="mt-4 text-lg">{network.name}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {network.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Best for: <strong>{network.stats.bestFor}</strong>
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <BookOpen className="mr-2 inline-block h-8 w-8 text-amber-500" />
              Advertising Guides
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              In-depth guides to help you run profitable ad campaigns for your app.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.title} href={guide.href}>
                <Card className="group h-full transition-all hover:border-amber-500/50 hover:shadow-lg">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">{guide.category}</Badge>
                    <CardTitle className="mt-3 text-lg group-hover:text-amber-500 transition-colors">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="flex items-center text-sm font-medium text-amber-500">
                      Read Guide <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-10 text-center dark:from-amber-950/30 dark:to-orange-950/30">
            <DollarSign className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Calculate Your Ad Performance
            </h2>
            <p className="mt-3 text-muted-foreground">
              Use our free Ad Analytics Calculator to analyze your ROAS, LTV, CPI, and get
              personalized strategy recommendations.
            </p>
            <Button
              size="lg"
              className="mt-8 h-12 rounded-xl bg-amber-500 px-8 text-base font-semibold text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600"
              asChild
            >
              <Link href="/tools/ad-analytics">
                Open Ad Calculator <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
