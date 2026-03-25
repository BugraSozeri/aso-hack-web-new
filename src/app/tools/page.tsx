import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  BarChart3,
  Star,
  Image as ImageIcon,
  TrendingUp,
  Users,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "ASO Tools",
  description:
    "Free and premium App Store Optimization tools for indie developers. Keyword research, listing analysis, competitor tracking, and more.",
};

const tools = [
  {
    name: "Keyword Density Checker",
    description:
      "Paste your app metadata or enter a store URL to instantly analyze keyword density, character counts, and optimization opportunities. Completely free, no login required.",
    icon: Search,
    href: "/tools/keyword-density",
    badge: "Free",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    features: ["Word frequency analysis", "Character count vs limits", "Missing keyword suggestions"],
  },
  {
    name: "Listing Analyzer",
    description:
      "Get an instant ASO score (0-100) for any App Store or Play Store listing. Analyzes title, subtitle, description, screenshots, ratings, and more.",
    icon: BarChart3,
    href: "/tools/listing-analyzer",
    badge: "Free",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    features: ["Score across 8 dimensions", "Actionable recommendations", "Shareable score card"],
  },
  {
    name: "ASO Audit",
    description:
      "Generate a comprehensive ASO audit report with prioritized recommendations. Save reports and track improvements over time.",
    icon: FileCheck,
    href: "/tools/aso-audit",
    badge: "Free with Login",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    features: ["Multi-page detailed report", "Priority-ranked recommendations", "Historical tracking"],
  },
  {
    name: "Review Analyzer",
    description:
      "Understand what users love and hate about your app. AI-powered sentiment analysis extracts themes and trends from app reviews.",
    icon: Star,
    href: "/tools/review-analyzer",
    badge: "Free with Login",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    features: ["Sentiment breakdown", "Theme extraction", "Trend analysis"],
  },
  {
    name: "Keyword Explorer",
    description:
      "Discover high-value keywords your competitors are ranking for. Get search volume estimates, difficulty scores, and trending data.",
    icon: TrendingUp,
    href: "/tools/keyword-explorer",
    badge: "Starter",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    features: ["Related keyword discovery", "Volume & difficulty scores", "Country-specific data"],
  },
  {
    name: "Competitor Tracker",
    description:
      "Monitor competitor app rankings, ratings, review velocity, and keyword strategies. Get daily snapshots and alerts.",
    icon: Users,
    href: "/tools/competitor-tracker",
    badge: "Starter",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    features: ["Daily rank snapshots", "Rating & review tracking", "Keyword overlap analysis"],
  },
  {
    name: "Screenshot Lab",
    description:
      "Upload your app store screenshots and get AI-powered feedback on text readability, feature highlighting, color contrast, and CTA placement.",
    icon: ImageIcon,
    href: "/tools/screenshot-lab",
    badge: "Pro",
    badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
    features: ["AI-powered analysis", "Best practice scoring", "Improvement suggestions"],
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">ASO Tools</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to optimize your app store presence. Start with our free
          tools, upgrade as you grow.
        </p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.name} className="flex flex-col transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950">
                  <tool.icon className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${tool.badgeColor}`}>
                  {tool.badge}
                </span>
              </div>
              <CardTitle className="mt-4 text-xl">{tool.name}</CardTitle>
              <CardDescription className="text-base">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <ul className="mb-6 space-y-2">
                {tool.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href={tool.href}>
                  Try {tool.name} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
