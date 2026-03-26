import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Bell, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Keyword Explorer",
  description:
    "Discover high-value keywords your competitors rank for. Get search volume estimates, difficulty scores, and trending data for App Store and Google Play.",
};

export default function KeywordExplorerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950">
          <TrendingUp className="h-8 w-8 text-amber-500" />
        </div>
      </div>

      <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Keyword Explorer</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
        Discover high-value keywords your competitors rank for. Get search volume
        estimates, difficulty scores, and trending keywords for App Store and Google Play.
      </p>

      <Card className="mt-10 text-left">
        <CardContent className="p-6 space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">What&apos;s included</p>
          {[
            "Seed keyword → hundreds of related keyword suggestions",
            "Relative search volume and difficulty scores",
            "Trending keywords in your category",
            "Competitor keyword gap analysis",
            "iOS App Store and Google Play coverage",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button size="lg" className="h-12 rounded-xl bg-amber-500 text-white hover:bg-amber-600 px-8" asChild>
          <Link href="/#newsletter">
            <Bell className="mr-2 h-4 w-4" /> Notify Me When Ready
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-12 rounded-xl px-8" asChild>
          <Link href="/tools">
            Explore Available Tools <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
