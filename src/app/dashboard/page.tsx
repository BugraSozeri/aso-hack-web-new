import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Search, FileText, Camera, Users, Zap, ArrowRight, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your ASOHack dashboard — track your ASO progress, access tools, and view recent analyses.",
};

const tools = [
  { name: "Keyword Density", href: "/tools/keyword-density", icon: Search, badge: "Free", description: "Analyze keyword distribution in your metadata" },
  { name: "Listing Analyzer", href: "/tools/listing-analyzer", icon: FileText, badge: "Free", description: "Get an instant ASO score for your listing" },
  { name: "ASO Audit", href: "/tools/aso-audit", icon: BarChart3, badge: "Free", description: "Full 9-dimension ASO health check" },
  { name: "Screenshot Lab", href: "/tools/screenshot-lab", icon: Camera, badge: "Free", description: "AI creative direction for your screenshots" },
  { name: "Competitor Tracker", href: "/tools/competitor-tracker", icon: Users, badge: "Free", description: "Compare ratings and strategy vs competitors" },
  { name: "Keyword Explorer", href: "/tools/keyword-explorer", icon: Zap, badge: "Free", description: "Discover high-value keywords to target" },
];

const stats = [
  { label: "Tools Available", value: "9", sub: "All free to start" },
  { label: "AI Analyses", value: "1", sub: "Free per month" },
  { label: "Blog Posts", value: "30+", sub: "ASO guides" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back. Start optimizing your app.</p>
        </div>
        <Button asChild className="mt-4 w-fit bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg sm:mt-0">
          <Link href="/pricing">Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-amber-500">{s.value}</p>
              <p className="text-sm font-medium mt-0.5">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tools */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Tools</h2>
        <Link href="/tools" className="text-sm text-amber-500 hover:text-amber-400">View all →</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.href}>
            <Card className="group h-full transition-all hover:border-amber-500/50 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                    <tool.icon className="h-4 w-4 text-amber-500" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{tool.badge}</Badge>
                </div>
                <CardTitle className="mt-3 text-base group-hover:text-amber-500 transition-colors">{tool.name}</CardTitle>
                <CardDescription className="text-xs">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-xs font-medium text-amber-500 flex items-center gap-1">
                  Open tool <ArrowRight className="h-3 w-3" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Upgrade CTA */}
      <Card className="mt-10 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <Lock className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Unlock unlimited AI analyses</p>
            <p className="text-sm text-muted-foreground mt-0.5">Upgrade to Pro for unlimited analyses, full review history, and CSV exports.</p>
          </div>
          <Button asChild className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg">
            <Link href="/pricing">See Plans</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
