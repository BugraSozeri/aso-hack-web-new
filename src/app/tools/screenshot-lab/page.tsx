import type { Metadata } from "next";
import Link from "next/link";
import { Image as ImageIcon, Bell, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Screenshot Lab",
  description:
    "AI-powered app screenshot analysis and feedback. Get expert suggestions on text readability, feature highlighting, color contrast, and CTA placement.",
};

export default function ScreenshotLabPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950">
          <ImageIcon className="h-8 w-8 text-violet-500" />
        </div>
      </div>

      <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Screenshot Lab</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
        Upload your app store screenshots and get AI-powered feedback.
        Boost your conversion rate with expert-level visual optimization.
      </p>

      <Card className="mt-10 text-left">
        <CardContent className="p-6 space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">What&apos;s included</p>
          {[
            "AI analysis of text readability and headline strength",
            "Feature highlighting and storytelling flow review",
            "Color contrast and visual hierarchy feedback",
            "CTA placement and conversion optimization tips",
            "Side-by-side comparison with top apps in your category",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0" />
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
