"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIAnalysisPanel } from "@/components/tools/ai-analysis-panel";

type FunnelData = {
  adSpend: string;
  impressions: string;
  clicks: string;
  installs: string;
  trialStarts: string;
  subscriptions: string;
  revenuePerSub: string;
  avgSubMonths: string;
  platform: "ios" | "android" | "both";
  adNetwork: string;
};

const defaultData: FunnelData = {
  adSpend: "",
  impressions: "",
  clicks: "",
  installs: "",
  trialStarts: "",
  subscriptions: "",
  revenuePerSub: "",
  avgSubMonths: "",
  platform: "ios",
  adNetwork: "meta",
};

const adNetworkOptions = [
  { value: "meta", label: "Meta (Facebook/Instagram)" },
  { value: "apple", label: "Apple Search Ads" },
  { value: "google", label: "Google Ads" },
  { value: "tiktok", label: "TikTok Ads" },
  { value: "unity", label: "Unity Ads" },
  { value: "other", label: "Other" },
];

const benchmarks: Record<string, { ctr: number; cvr: number; trialRate: number; subRate: number }> = {
  meta: { ctr: 1.5, cvr: 25, trialRate: 30, subRate: 40 },
  apple: { ctr: 7.0, cvr: 50, trialRate: 35, subRate: 45 },
  google: { ctr: 2.0, cvr: 30, trialRate: 28, subRate: 38 },
  tiktok: { ctr: 1.2, cvr: 20, trialRate: 25, subRate: 35 },
  unity: { ctr: 3.0, cvr: 15, trialRate: 20, subRate: 30 },
  other: { ctr: 1.5, cvr: 20, trialRate: 25, subRate: 35 },
};

function num(val: string): number {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function fmt(val: number, decimals = 2): string {
  if (!isFinite(val)) return "—";
  return val.toFixed(decimals);
}

function fmtMoney(val: number): string {
  if (!isFinite(val)) return "—";
  return "$" + val.toFixed(2);
}

function fmtPct(val: number): string {
  if (!isFinite(val)) return "—";
  return val.toFixed(2) + "%";
}

type Rating = "excellent" | "good" | "average" | "poor";

function getRating(value: number, thresholds: [number, number, number]): Rating {
  if (value >= thresholds[0]) return "excellent";
  if (value >= thresholds[1]) return "good";
  if (value >= thresholds[2]) return "average";
  return "poor";
}

function ratingColor(rating: Rating): string {
  switch (rating) {
    case "excellent": return "text-emerald-500 dark:text-emerald-400";
    case "good": return "text-blue-500 dark:text-blue-400";
    case "average": return "text-amber-500 dark:text-amber-400";
    case "poor": return "text-red-500 dark:text-red-400";
  }
}

function ratingBg(rating: Rating): string {
  switch (rating) {
    case "excellent": return "bg-emerald-100 dark:bg-emerald-950/50";
    case "good": return "bg-blue-100 dark:bg-blue-950/50";
    case "average": return "bg-amber-100 dark:bg-amber-950/50";
    case "poor": return "bg-red-100 dark:bg-red-950/50";
  }
}

function RatingIcon({ rating }: { rating: Rating }) {
  if (rating === "excellent" || rating === "good") {
    return <CheckCircle2 className={`h-4 w-4 ${ratingColor(rating)}`} />;
  }
  if (rating === "average") {
    return <Info className={`h-4 w-4 ${ratingColor(rating)}`} />;
  }
  return <AlertTriangle className={`h-4 w-4 ${ratingColor(rating)}`} />;
}

export default function AdAnalyticsPage() {
  const [data, setData] = useState<FunnelData>(defaultData);
  const [showEducation, setShowEducation] = useState(false);

  const update = (field: keyof FunnelData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const metrics = useMemo(() => {
    const spend = num(data.adSpend);
    const impressions = num(data.impressions);
    const clicks = num(data.clicks);
    const installs = num(data.installs);
    const trials = num(data.trialStarts);
    const subs = num(data.subscriptions);
    const revPerSub = num(data.revenuePerSub);
    const avgMonths = num(data.avgSubMonths);

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cvr = clicks > 0 ? (installs / clicks) * 100 : 0;
    const itr = installs > 0 ? (trials / installs) * 100 : 0; // install-to-trial
    const tsr = trials > 0 ? (subs / trials) * 100 : 0; // trial-to-sub
    const overallCvr = installs > 0 ? (subs / installs) * 100 : 0;

    const cpi = installs > 0 ? spend / installs : 0;
    const cpt = trials > 0 ? spend / trials : 0; // cost per trial
    const cpa = subs > 0 ? spend / subs : 0; // cost per acquisition (sub)
    const ltv = revPerSub * avgMonths;
    const roas = spend > 0 ? (subs * ltv) / spend : 0;
    const totalRevenue = subs * ltv;
    const profit = totalRevenue - spend;

    return {
      ctr, cvr, itr, tsr, overallCvr,
      cpi, cpt, cpa, ltv, roas,
      totalRevenue, profit,
      spend, impressions, clicks, installs, trials, subs,
    };
  }, [data]);

  const bench = benchmarks[data.adNetwork] || benchmarks.other;

  const hasData = num(data.adSpend) > 0 && num(data.installs) > 0;

  const strategies = useMemo(() => {
    const tips: { icon: typeof TrendingUp; title: string; description: string; priority: "high" | "medium" | "low" }[] = [];

    if (!hasData) return tips;

    if (metrics.ctr < bench.ctr * 0.7) {
      tips.push({
        icon: Target,
        title: "Improve Ad Creative CTR",
        description: `Your CTR (${fmtPct(metrics.ctr)}) is below the ${adNetworkOptions.find(n => n.value === data.adNetwork)?.label} average of ${bench.ctr}%. Try testing different ad creatives, headlines, and targeting to increase click-through rate.`,
        priority: "high",
      });
    }

    if (metrics.cvr < bench.cvr * 0.7) {
      tips.push({
        icon: BarChart3,
        title: "Optimize Store Listing for Conversions",
        description: `Your click-to-install rate (${fmtPct(metrics.cvr)}) is below average (${bench.cvr}%). Optimize your app store listing — screenshots, description, and ratings directly impact conversion rate.`,
        priority: "high",
      });
    }

    if (metrics.itr < bench.trialRate * 0.7 && metrics.trials > 0) {
      tips.push({
        icon: Users,
        title: "Improve Onboarding to Trial Conversion",
        description: `Only ${fmtPct(metrics.itr)} of installs start a trial (benchmark: ${bench.trialRate}%). Simplify your onboarding flow, show value faster, and consider offering a free trial prompt earlier.`,
        priority: "high",
      });
    }

    if (metrics.tsr < bench.subRate * 0.7 && metrics.subs > 0) {
      tips.push({
        icon: DollarSign,
        title: "Increase Trial-to-Subscription Rate",
        description: `Your trial-to-sub rate (${fmtPct(metrics.tsr)}) is below average (${bench.subRate}%). Consider improving trial experience, sending retention emails, or adjusting pricing.`,
        priority: "medium",
      });
    }

    if (metrics.roas > 0 && metrics.roas < 1) {
      tips.push({
        icon: AlertTriangle,
        title: "ROAS Below Breakeven",
        description: `Your ROAS is ${fmt(metrics.roas)}x — you're spending more than you earn. Focus on reducing CPI or increasing LTV before scaling ad spend.`,
        priority: "high",
      });
    } else if (metrics.roas >= 1 && metrics.roas < 2) {
      tips.push({
        icon: TrendingUp,
        title: "Scale Carefully",
        description: `Your ROAS of ${fmt(metrics.roas)}x is positive but thin. Optimize your funnel before significantly increasing spend. Target 2x+ ROAS before scaling.`,
        priority: "medium",
      });
    } else if (metrics.roas >= 2) {
      tips.push({
        icon: CheckCircle2,
        title: "Strong ROAS — Consider Scaling",
        description: `Your ROAS of ${fmt(metrics.roas)}x is strong. Consider gradually increasing ad spend while monitoring performance. Test new ad networks or geographies.`,
        priority: "low",
      });
    }

    if (metrics.cpi > 0 && metrics.ltv > 0 && metrics.cpi > metrics.ltv * 0.5) {
      tips.push({
        icon: DollarSign,
        title: "CPI to LTV Ratio Needs Attention",
        description: `Your CPI (${fmtMoney(metrics.cpi)}) is more than 50% of your LTV (${fmtMoney(metrics.ltv)}). Healthy apps typically have CPI < 30% of LTV. Focus on reducing acquisition costs or increasing monetization.`,
        priority: "medium",
      });
    }

    return tips.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });
  }, [metrics, hasData, bench, data.adNetwork]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">Free Tool</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ad Analytics Calculator
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Analyze your mobile ad campaign performance. Input your funnel data to calculate
          ROAS, LTV, CPI, and get personalized strategy recommendations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Input */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Campaign Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Platform</label>
                <div className="flex gap-2">
                  {(["ios", "android", "both"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => update("platform", p)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        data.platform === p
                          ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {p === "ios" ? "iOS" : p === "android" ? "Android" : "Both"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Ad Network</label>
                <select
                  value={data.adNetwork}
                  onChange={(e) => update("adNetwork", e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  {adNetworkOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Ad Spend & Funnel</CardTitle>
              <CardDescription>Enter your campaign numbers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "adSpend" as const, label: "Total Ad Spend ($)", placeholder: "1000", icon: DollarSign },
                { key: "impressions" as const, label: "Impressions", placeholder: "100000", icon: BarChart3 },
                { key: "clicks" as const, label: "Clicks", placeholder: "1500", icon: Target },
                { key: "installs" as const, label: "Installs", placeholder: "375", icon: Users },
                { key: "trialStarts" as const, label: "Trial Starts", placeholder: "112", icon: TrendingUp },
                { key: "subscriptions" as const, label: "Subscriptions / Purchases", placeholder: "45", icon: DollarSign },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <field.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {field.label}
                  </label>
                  <input
                    type="number"
                    value={data[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm tabular-nums placeholder:text-muted-foreground/50"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Revenue</CardTitle>
              <CardDescription>Monetization data for LTV calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Revenue per Subscriber/Month ($)</label>
                <input
                  type="number"
                  value={data.revenuePerSub}
                  onChange={(e) => update("revenuePerSub", e.target.value)}
                  placeholder="9.99"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm tabular-nums placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Avg Subscription Length (months)</label>
                <input
                  type="number"
                  value={data.avgSubMonths}
                  onChange={(e) => update("avgSubMonths", e.target.value)}
                  placeholder="6"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm tabular-nums placeholder:text-muted-foreground/50"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              {
                label: "CPI",
                value: hasData ? fmtMoney(metrics.cpi) : "—",
                sub: "Cost Per Install",
                rating: hasData ? getRating(1 / (metrics.cpi || 1), [1, 0.5, 0.3]) : undefined,
              },
              {
                label: "ROAS",
                value: hasData && metrics.roas > 0 ? `${fmt(metrics.roas)}x` : "—",
                sub: "Return on Ad Spend",
                rating: hasData && metrics.roas > 0 ? getRating(metrics.roas, [3, 1.5, 1]) : undefined,
              },
              {
                label: "LTV",
                value: metrics.ltv > 0 ? fmtMoney(metrics.ltv) : "—",
                sub: "Lifetime Value",
              },
              {
                label: "CPA",
                value: hasData && metrics.cpa > 0 ? fmtMoney(metrics.cpa) : "—",
                sub: "Cost Per Subscription",
              },
              {
                label: "Profit",
                value: hasData && metrics.totalRevenue > 0 ? fmtMoney(metrics.profit) : "—",
                sub: "Total Revenue − Spend",
                rating: hasData && metrics.profit !== 0 ? (metrics.profit > 0 ? "good" as Rating : "poor" as Rating) : undefined,
              },
              {
                label: "Revenue",
                value: metrics.totalRevenue > 0 ? fmtMoney(metrics.totalRevenue) : "—",
                sub: "Total Projected Revenue",
              },
            ].map((m) => (
              <Card key={m.label} className={m.rating ? ratingBg(m.rating) : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                    {m.rating && <RatingIcon rating={m.rating} />}
                  </div>
                  <p className={`mt-1 text-2xl font-bold tabular-nums ${m.rating ? ratingColor(m.rating) : ""}`}>
                    {m.value}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Funnel */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Conversion Funnel</CardTitle>
              <CardDescription>Step-by-step breakdown with benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    from: "Impressions → Clicks",
                    rate: metrics.ctr,
                    benchmark: bench.ctr,
                    label: "CTR",
                    values: `${metrics.impressions.toLocaleString()} → ${metrics.clicks.toLocaleString()}`,
                  },
                  {
                    from: "Clicks → Installs",
                    rate: metrics.cvr,
                    benchmark: bench.cvr,
                    label: "CVR",
                    values: `${metrics.clicks.toLocaleString()} → ${metrics.installs.toLocaleString()}`,
                  },
                  {
                    from: "Installs → Trials",
                    rate: metrics.itr,
                    benchmark: bench.trialRate,
                    label: "Install-to-Trial",
                    values: `${metrics.installs.toLocaleString()} → ${metrics.trials.toLocaleString()}`,
                  },
                  {
                    from: "Trials → Subscriptions",
                    rate: metrics.tsr,
                    benchmark: bench.subRate,
                    label: "Trial-to-Sub",
                    values: `${metrics.trials.toLocaleString()} → ${metrics.subs.toLocaleString()}`,
                  },
                ].map((step) => {
                  const pct = step.rate;
                  const rating = hasData && pct > 0
                    ? getRating(pct / step.benchmark, [1.2, 0.8, 0.5])
                    : undefined;
                  return (
                    <div key={step.from} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{step.from}</span>
                        <div className="flex items-center gap-2">
                          {rating && <RatingIcon rating={rating} />}
                          <span className={`text-sm font-bold tabular-nums ${rating ? ratingColor(rating) : ""}`}>
                            {hasData && pct > 0 ? fmtPct(pct) : "—"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{hasData ? step.values : "—"}</span>
                        <span>Benchmark: {step.benchmark}%</span>
                      </div>
                      {hasData && pct > 0 && (
                        <div className="mt-2 h-1.5 rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${
                              rating === "excellent" || rating === "good"
                                ? "bg-emerald-500"
                                : rating === "average"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min((pct / step.benchmark) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {hasData && metrics.overallCvr > 0 && (
                <div className="mt-4 rounded-lg bg-muted/50 p-3 text-center">
                  <span className="text-sm text-muted-foreground">Overall Install → Subscription: </span>
                  <span className="text-sm font-bold">{fmtPct(metrics.overallCvr)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Strategy Recommendations */}
          {strategies.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Strategy Recommendations
                </CardTitle>
                <CardDescription>Based on your funnel data and industry benchmarks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {strategies.map((tip, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        tip.priority === "high"
                          ? "bg-red-100 dark:bg-red-950/50"
                          : tip.priority === "medium"
                          ? "bg-amber-100 dark:bg-amber-950/50"
                          : "bg-emerald-100 dark:bg-emerald-950/50"
                      }`}>
                        <tip.icon className={`h-4 w-4 ${
                          tip.priority === "high"
                            ? "text-red-500"
                            : tip.priority === "medium"
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold">{tip.title}</h4>
                          <Badge variant="secondary" className={`text-xs ${
                            tip.priority === "high"
                              ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                              : tip.priority === "medium"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                              : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                          }`}>
                            {tip.priority}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          <Card>
            <CardHeader
              className="cursor-pointer pb-4"
              onClick={() => setShowEducation(!showEducation)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  📚 Learn: Mobile Ad Metrics Explained
                </CardTitle>
                {showEducation ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
            {showEducation && (
              <CardContent className="space-y-4 border-t pt-4">
                {[
                  {
                    term: "CPI (Cost Per Install)",
                    explain: "Total ad spend divided by the number of installs. This tells you how much each new user costs to acquire through paid advertising. Lower is better, but quality matters — a $3 CPI user who subscribes is worth more than a $0.50 CPI user who churns immediately.",
                  },
                  {
                    term: "ROAS (Return on Ad Spend)",
                    explain: "Total revenue generated divided by total ad spend. A ROAS of 2x means you earn $2 for every $1 spent. Most successful mobile apps target a minimum ROAS of 1.5x-2x before scaling campaigns.",
                  },
                  {
                    term: "LTV (Lifetime Value)",
                    explain: "The total revenue a user generates over their entire relationship with your app. Calculated as: average revenue per period × average number of periods. Your LTV must exceed your CPI for sustainable growth.",
                  },
                  {
                    term: "CTR (Click-Through Rate)",
                    explain: "Percentage of people who click your ad after seeing it. Higher CTR means your creative resonates with the audience. Typical mobile app CTRs range from 0.5% to 3%, with search ads often higher (5-10%).",
                  },
                  {
                    term: "CVR (Conversion Rate / Click-to-Install)",
                    explain: "Percentage of clicks that result in an install. This is heavily influenced by your app store listing quality — screenshots, ratings, reviews, and description all impact CVR.",
                  },
                  {
                    term: "Trial-to-Subscription Rate",
                    explain: "Percentage of free trial users who convert to paid subscribers. Industry average is 30-40%. This is influenced by trial length, onboarding quality, and the perceived value of your premium features.",
                  },
                ].map((item) => (
                  <div key={item.term}>
                    <h4 className="text-sm font-semibold">{item.term}</h4>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.explain}</p>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/blog/mobile-ad-metrics-guide">
                      Read Full Guide <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* AI Strategy Panel */}
          <AIAnalysisPanel
            toolId="ad-analytics"
            data={{
              platform: data.platform,
              adNetwork: data.adNetwork,
              adSpend: num(data.adSpend),
              impressions: num(data.impressions),
              clicks: num(data.clicks),
              installs: num(data.installs),
              trialStarts: num(data.trialStarts),
              subscriptions: num(data.subscriptions),
              revenuePerSub: num(data.revenuePerSub),
              avgSubMonths: num(data.avgSubMonths),
              ctr: fmt(metrics.ctr),
              cvr: fmt(metrics.cvr),
              itr: fmt(metrics.itr),
              tsr: fmt(metrics.tsr),
              cpi: fmt(metrics.cpi),
              cpa: fmt(metrics.cpa),
              ltv: fmt(metrics.ltv),
              roas: fmt(metrics.roas),
              totalRevenue: fmt(metrics.totalRevenue),
              profit: fmt(metrics.profit),
            }}
            disabled={!hasData}
            disabledMessage="Enter your ad spend and install numbers to enable AI strategy analysis."
          />
        </div>
      </div>
    </div>
  );
}
