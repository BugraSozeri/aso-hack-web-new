"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  ArrowRight,
  Crown,
  Info,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIAnalysisPanel } from "@/components/tools/ai-analysis-panel";

// ─── Benchmark Data ───────────────────────────────────────────────────────────
// Sources: AppsFlyer Performance Index, Adjust Benchmarks Report, Sensor Tower

type CategoryBenchmark = {
  label: string;
  ios: { cpi: [number, number, number]; ctr: [number, number, number]; cvr: [number, number, number]; ltv30: [number, number, number]; roas30: [number, number, number] };
  android: { cpi: [number, number, number]; ctr: [number, number, number]; cvr: [number, number, number]; ltv30: [number, number, number]; roas30: [number, number, number] };
  trialRate: [number, number, number]; // [p25, median, p75] — platform agnostic
  subRate: [number, number, number];
  bestNetworks: string[];
  tip: string;
};
// Each metric: [bottom 25%, median, top 25%]

const BENCHMARKS: Record<string, CategoryBenchmark> = {
  games: {
    label: "Games",
    ios: { cpi: [1.5, 3.2, 6.5], ctr: [0.8, 1.8, 3.5], cvr: [15, 28, 48], ltv30: [2.5, 6.0, 14.0], roas30: [0.4, 0.8, 1.4] },
    android: { cpi: [0.5, 1.2, 2.8], ctr: [0.6, 1.4, 2.8], cvr: [18, 32, 55], ltv30: [1.5, 4.0, 9.0], roas30: [0.5, 0.9, 1.6] },
    trialRate: [0, 0, 0], subRate: [0, 0, 0],
    bestNetworks: ["Unity Ads", "Meta Ads", "Google Ads", "IronSource"],
    tip: "Games rely heavily on IAP and ads monetization. Focus on D1/D7/D30 ROAS instead of subscription metrics.",
  },
  health: {
    label: "Health & Fitness",
    ios: { cpi: [2.2, 4.5, 8.0], ctr: [1.2, 2.4, 4.5], cvr: [22, 38, 60], ltv30: [8.0, 18.0, 35.0], roas30: [0.6, 1.2, 2.5] },
    android: { cpi: [1.0, 2.2, 4.5], ctr: [1.0, 2.0, 3.8], cvr: [25, 42, 65], ltv30: [5.0, 12.0, 24.0], roas30: [0.7, 1.4, 2.8] },
    trialRate: [20, 32, 48], subRate: [28, 42, 58],
    bestNetworks: ["Apple Search Ads", "Meta Ads", "Google Ads"],
    tip: "Health apps have high LTV due to habit-forming nature. Apple Search Ads delivers the highest-intent users.",
  },
  productivity: {
    label: "Productivity",
    ios: { cpi: [2.5, 5.0, 9.0], ctr: [1.5, 2.8, 5.0], cvr: [28, 45, 65], ltv30: [10.0, 22.0, 40.0], roas30: [0.7, 1.4, 2.8] },
    android: { cpi: [1.2, 2.5, 5.0], ctr: [1.2, 2.2, 4.0], cvr: [30, 48, 68], ltv30: [7.0, 15.0, 28.0], roas30: [0.8, 1.6, 3.0] },
    trialRate: [25, 38, 55], subRate: [30, 45, 62],
    bestNetworks: ["Apple Search Ads", "Google Ads"],
    tip: "Productivity apps convert best through Apple Search Ads. Intent-based targeting beats social for B2B-adjacent tools.",
  },
  finance: {
    label: "Finance",
    ios: { cpi: [3.5, 7.0, 14.0], ctr: [0.8, 1.6, 3.0], cvr: [18, 30, 50], ltv30: [15.0, 35.0, 70.0], roas30: [0.5, 1.2, 2.5] },
    android: { cpi: [1.5, 3.5, 7.0], ctr: [0.7, 1.4, 2.6], cvr: [20, 34, 54], ltv30: [10.0, 24.0, 50.0], roas30: [0.6, 1.3, 2.8] },
    trialRate: [18, 28, 42], subRate: [35, 52, 68],
    bestNetworks: ["Google Ads", "Apple Search Ads", "Meta Ads"],
    tip: "Finance apps have the highest LTV but also highest CPIs. Trust-building creatives (reviews, press logos) outperform.",
  },
  education: {
    label: "Education",
    ios: { cpi: [2.0, 4.2, 8.0], ctr: [1.0, 2.2, 4.2], cvr: [20, 35, 55], ltv30: [6.0, 14.0, 28.0], roas30: [0.5, 1.1, 2.2] },
    android: { cpi: [0.8, 1.8, 3.8], ctr: [0.9, 1.8, 3.5], cvr: [22, 38, 58], ltv30: [4.0, 9.0, 18.0], roas30: [0.6, 1.2, 2.4] },
    trialRate: [22, 35, 50], subRate: [25, 38, 55],
    bestNetworks: ["Meta Ads", "Google Ads", "TikTok Ads"],
    tip: "Education apps peak in Q4 (back-to-school, New Year). TikTok delivers strong results for language/skills apps.",
  },
  social: {
    label: "Social & Dating",
    ios: { cpi: [1.8, 3.8, 7.5], ctr: [1.5, 3.0, 5.5], cvr: [25, 42, 62], ltv30: [5.0, 12.0, 25.0], roas30: [0.4, 0.9, 1.8] },
    android: { cpi: [0.7, 1.6, 3.4], ctr: [1.2, 2.5, 4.8], cvr: [28, 46, 66], ltv30: [3.5, 8.0, 17.0], roas30: [0.5, 1.0, 2.0] },
    trialRate: [15, 25, 40], subRate: [20, 35, 52],
    bestNetworks: ["Meta Ads", "TikTok Ads", "Snapchat Ads"],
    tip: "Social apps thrive on viral loops. Paid UA is most effective when paired with referral mechanics.",
  },
  shopping: {
    label: "Shopping & eCommerce",
    ios: { cpi: [1.5, 3.0, 6.0], ctr: [1.8, 3.5, 6.0], cvr: [30, 48, 68], ltv30: [8.0, 20.0, 45.0], roas30: [0.8, 1.8, 3.5] },
    android: { cpi: [0.6, 1.4, 3.0], ctr: [1.5, 3.0, 5.2], cvr: [32, 52, 72], ltv30: [5.5, 14.0, 32.0], roas30: [0.9, 2.0, 4.0] },
    trialRate: [0, 0, 0], subRate: [0, 0, 0],
    bestNetworks: ["Google Ads", "Meta Ads", "TikTok Ads"],
    tip: "Shopping apps have the highest ROAS potential. Dynamic product ads (DPA) on Meta and Google Shopping outperform static creatives.",
  },
  travel: {
    label: "Travel",
    ios: { cpi: [2.0, 4.2, 8.5], ctr: [1.0, 2.0, 3.8], cvr: [18, 32, 52], ltv30: [10.0, 25.0, 55.0], roas30: [0.5, 1.2, 2.5] },
    android: { cpi: [0.9, 2.0, 4.2], ctr: [0.9, 1.8, 3.4], cvr: [20, 35, 55], ltv30: [7.0, 17.0, 38.0], roas30: [0.6, 1.3, 2.7] },
    trialRate: [12, 22, 38], subRate: [28, 44, 60],
    bestNetworks: ["Google Ads", "Meta Ads", "Apple Search Ads"],
    tip: "Travel apps are extremely seasonal. Cut budget in off-season and double down in Q2/Q3. Use retargeting heavily.",
  },
  utilities: {
    label: "Utilities",
    ios: { cpi: [2.0, 4.0, 7.5], ctr: [1.2, 2.4, 4.5], cvr: [25, 42, 62], ltv30: [7.0, 16.0, 32.0], roas30: [0.6, 1.3, 2.6] },
    android: { cpi: [0.8, 1.8, 3.8], ctr: [1.0, 2.0, 3.8], cvr: [28, 46, 66], ltv30: [5.0, 11.0, 22.0], roas30: [0.7, 1.4, 2.8] },
    trialRate: [20, 32, 48], subRate: [30, 46, 62],
    bestNetworks: ["Apple Search Ads", "Google Ads"],
    tip: "Utilities convert well on keyword-intent platforms. Highlight the problem solved in the first 3 seconds of video ads.",
  },
  entertainment: {
    label: "Entertainment",
    ios: { cpi: [1.2, 2.8, 5.5], ctr: [1.5, 3.0, 5.5], cvr: [22, 38, 58], ltv30: [4.0, 10.0, 22.0], roas30: [0.4, 0.9, 1.8] },
    android: { cpi: [0.5, 1.2, 2.6], ctr: [1.2, 2.5, 4.8], cvr: [25, 42, 62], ltv30: [3.0, 7.5, 16.0], roas30: [0.5, 1.0, 2.0] },
    trialRate: [15, 26, 42], subRate: [22, 36, 52],
    bestNetworks: ["Meta Ads", "TikTok Ads", "Google Ads"],
    tip: "Entertainment thrives on video ads. TikTok and Instagram Reels deliver best results for content-driven apps.",
  },
};

type Platform = "ios" | "android";
type Metric = "cpi" | "ctr" | "cvr" | "ltv30" | "roas30" | "trialRate" | "subRate";

const METRIC_LABELS: Record<Metric, { label: string; unit: string; description: string; higherIsBetter: boolean }> = {
  cpi: { label: "CPI", unit: "$", description: "Cost Per Install", higherIsBetter: false },
  ctr: { label: "CTR", unit: "%", description: "Click-Through Rate", higherIsBetter: true },
  cvr: { label: "CVR", unit: "%", description: "Click → Install", higherIsBetter: true },
  ltv30: { label: "LTV (30-day)", unit: "$", description: "Revenue per user, 30 days", higherIsBetter: true },
  roas30: { label: "ROAS (30d)", unit: "x", description: "Return on Ad Spend, 30 days", higherIsBetter: true },
  trialRate: { label: "Trial Rate", unit: "%", description: "Install → Trial Start", higherIsBetter: true },
  subRate: { label: "Sub Rate", unit: "%", description: "Trial → Subscription", higherIsBetter: true },
};

function getPercentile(value: number, benchmarks: [number, number, number], higherIsBetter: boolean): { pct: number; label: string; color: string } {
  const [p25, median, p75] = benchmarks;
  let pct: number;
  if (higherIsBetter) {
    if (value >= p75) pct = 90;
    else if (value >= median) pct = 65;
    else if (value >= p25) pct = 35;
    else pct = 15;
  } else {
    if (value <= p25) pct = 90;
    else if (value <= median) pct = 65;
    else if (value <= p75) pct = 35;
    else pct = 15;
  }
  const label = pct >= 75 ? "Top 25%" : pct >= 50 ? "Above Average" : pct >= 30 ? "Below Average" : "Bottom 25%";
  const color = pct >= 75 ? "text-emerald-500" : pct >= 50 ? "text-blue-500" : pct >= 30 ? "text-amber-500" : "text-red-500";
  return { pct, label, color };
}

function BarCompare({ value, benchmarks, higherIsBetter, unit }: { value: number; benchmarks: [number, number, number]; higherIsBetter: boolean; unit: string }) {
  const [p25, median, p75] = benchmarks;
  const max = p75 * 1.5;
  const pctPos = Math.min((value / max) * 100, 100);
  const p25Pos = Math.min((p25 / max) * 100, 100);
  const medianPos = Math.min((median / max) * 100, 100);
  const p75Pos = Math.min((p75 / max) * 100, 100);
  const { color } = getPercentile(value, benchmarks, higherIsBetter);
  return (
    <div className="mt-2">
      <div className="relative h-6 rounded-full bg-muted overflow-hidden">
        {/* Good zone */}
        <div className="absolute inset-y-0 bg-emerald-500/10" style={{ left: `${higherIsBetter ? p75Pos : 0}%`, right: `${higherIsBetter ? 0 : 100 - p25Pos}%` }} />
        {/* Markers */}
        <div className="absolute inset-y-0 w-0.5 bg-muted-foreground/30" style={{ left: `${p25Pos}%` }} />
        <div className="absolute inset-y-0 w-0.5 bg-muted-foreground/50" style={{ left: `${medianPos}%` }} />
        <div className="absolute inset-y-0 w-0.5 bg-emerald-500/60" style={{ left: `${p75Pos}%` }} />
        {/* Your value */}
        <div className={`absolute top-0.5 bottom-0.5 w-2.5 rounded-full ${color.replace("text-", "bg-")} shadow-sm`} style={{ left: `calc(${pctPos}% - 5px)` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>P25: {unit === "$" ? "$" : ""}{p25}{unit !== "$" ? unit : ""}</span>
        <span>Median: {unit === "$" ? "$" : ""}{median}{unit !== "$" ? unit : ""}</span>
        <span>Top 25%: {unit === "$" ? "$" : ""}{p75}{unit !== "$" ? unit : ""}</span>
      </div>
    </div>
  );
}

export default function AdBenchmarkPage() {
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState<Platform>("ios");
  const [inputs, setInputs] = useState<Record<Metric, string>>({
    cpi: "", ctr: "", cvr: "", ltv30: "", roas30: "", trialRate: "", subRate: "",
  });
  const [showAll, setShowAll] = useState(false);

  const bench = category ? BENCHMARKS[category] : null;
  const isSubApp = bench && (bench.trialRate[1] > 0);

  const update = (k: Metric, v: string) => setInputs(prev => ({ ...prev, [k]: v }));
  const num = (v: string) => parseFloat(v) || 0;

  const hasData = useMemo(() => Object.values(inputs).some(v => parseFloat(v) > 0) && !!category, [inputs, category]);

  const benchmarkComparisons = useMemo(() => {
    if (!bench) return [];
    const platformData = bench[platform];
    const metrics: { key: Metric; benchmarks: [number, number, number] }[] = [
      { key: "cpi", benchmarks: platformData.cpi },
      { key: "ctr", benchmarks: platformData.ctr },
      { key: "cvr", benchmarks: platformData.cvr },
      { key: "ltv30", benchmarks: platformData.ltv30 },
      { key: "roas30", benchmarks: platformData.roas30 },
      ...(isSubApp ? [{ key: "trialRate" as Metric, benchmarks: bench.trialRate }, { key: "subRate" as Metric, benchmarks: bench.subRate }] : []),
    ];
    return metrics.filter(m => num(inputs[m.key]) > 0);
  }, [bench, platform, inputs, isSubApp]);

  const aiData = useMemo(() => ({
    category: bench?.label,
    platform,
    ...Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, num(v)])),
    benchmarks: bench ? {
      ...bench[platform],
      trialRate: bench.trialRate,
      subRate: bench.subRate,
    } : {},
    bestNetworks: bench?.bestNetworks,
    categoryTip: bench?.tip,
  }), [bench, platform, inputs]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">Pro Tool</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Ad Benchmark Analyzer</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Compare your ad metrics against industry benchmarks for your specific app category.
          See where you rank and get AI-powered recommendations to reach top-quartile performance.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Category & Platform */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">App Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-lg border bg-background px-3 py-2 pr-8 text-sm"
                  >
                    <option value="">Select your category…</option>
                    {Object.entries(BENCHMARKS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Platform</label>
                <div className="flex gap-2">
                  {(["ios", "android"] as Platform[]).map(p => (
                    <button key={p} onClick={() => setPlatform(p)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${platform === p ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400" : "border-border hover:bg-muted"}`}>
                      {p === "ios" ? "🍎 iOS" : "🤖 Android"}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Metrics */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Your Metrics</CardTitle>
              <CardDescription>Enter the metrics you want to benchmark</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Object.entries(METRIC_LABELS) as [Metric, typeof METRIC_LABELS[Metric]][])
                .filter(([k]) => k !== "trialRate" && k !== "subRate" || isSubApp)
                .map(([key, meta]) => (
                  <div key={key}>
                    <label className="mb-1 flex items-center justify-between text-sm font-medium">
                      <span>{meta.label}</span>
                      <span className="text-xs text-muted-foreground">{meta.description}</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      {meta.unit === "$" && <span className="text-sm text-muted-foreground">$</span>}
                      <input
                        type="number"
                        value={inputs[key]}
                        onChange={e => update(key, e.target.value)}
                        placeholder={bench ? String(BENCHMARKS[category][platform === "ios" ? "ios" : "android"][key as keyof typeof BENCHMARKS[string]["ios"]]?.[1] ?? "") : "—"}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm tabular-nums placeholder:text-muted-foreground/40"
                      />
                      {meta.unit !== "$" && <span className="text-sm text-muted-foreground">{meta.unit}</span>}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Category Tip */}
          {bench && (
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">{bench.label} Insight</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{bench.tip}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {bench.bestNetworks.map(n => (
                        <span key={n} className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">{n}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {!category && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium">Select your app category</p>
                <p className="mt-1 text-xs text-muted-foreground">Benchmarks will appear here</p>
              </CardContent>
            </Card>
          )}

          {bench && benchmarkComparisons.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <TrendingUp className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium">{bench.label} benchmarks loaded</p>
                <p className="mt-1 text-xs text-muted-foreground">Enter your metrics to see how you compare</p>
              </CardContent>
            </Card>
          )}

          {/* Benchmark cards */}
          {bench && benchmarkComparisons.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Your Performance vs {bench.label} Benchmarks</h2>
                <Badge variant="secondary" className="text-xs">{platform === "ios" ? "iOS" : "Android"}</Badge>
              </div>

              {benchmarkComparisons.slice(0, showAll ? 99 : 4).map(({ key, benchmarks }) => {
                const meta = METRIC_LABELS[key];
                const value = num(inputs[key]);
                const { label, color } = getPercentile(value, benchmarks, meta.higherIsBetter);
                return (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-sm font-semibold">{meta.label}</span>
                          <span className="ml-2 text-sm text-muted-foreground">{meta.unit === "$" ? `$${value}` : `${value}${meta.unit}`}</span>
                        </div>
                        <span className={`text-xs font-semibold ${color}`}>{label}</span>
                      </div>
                      <BarCompare value={value} benchmarks={benchmarks} higherIsBetter={meta.higherIsBetter} unit={meta.unit} />
                    </CardContent>
                  </Card>
                );
              })}

              {benchmarkComparisons.length > 4 && (
                <button onClick={() => setShowAll(!showAll)} className="w-full text-center text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 py-1">
                  <ChevronDown className={`h-3 w-3 transition-transform ${showAll ? "rotate-180" : ""}`} />
                  {showAll ? "Show less" : `Show ${benchmarkComparisons.length - 4} more metrics`}
                </button>
              )}
            </div>
          )}

          {/* Reference benchmarks (no input needed) */}
          {bench && !hasData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{bench.label} · {platform === "ios" ? "iOS" : "Android"} Benchmarks</CardTitle>
                <CardDescription className="text-xs">Industry reference data (P25 / Median / Top 25%)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(Object.entries(METRIC_LABELS) as [Metric, typeof METRIC_LABELS[Metric]][]).map(([key, meta]) => {
                    const platformBench = bench[platform] as Record<string, [number, number, number]>;
                    const b = key === "trialRate" || key === "subRate" ? bench[key] : platformBench[key];
                    if (!b || (key === "trialRate" || key === "subRate") && !isSubApp) return null;
                    return (
                      <div key={key} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                        <span className="text-muted-foreground">{meta.label}</span>
                        <div className="flex gap-3 text-xs tabular-nums">
                          <span className="text-red-500">{meta.unit === "$" ? "$" : ""}{b[0]}{meta.unit !== "$" ? meta.unit : ""}</span>
                          <span className="font-medium">{meta.unit === "$" ? "$" : ""}{b[1]}{meta.unit !== "$" ? meta.unit : ""}</span>
                          <span className="text-emerald-500">{meta.unit === "$" ? "$" : ""}{b[2]}{meta.unit !== "$" ? meta.unit : ""}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
                  <span className="text-red-500">● Bottom 25%</span>
                  <span>● Median</span>
                  <span className="text-emerald-500">● Top 25%</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pro CTA for AI */}
          <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/8 to-orange-500/5 p-5">
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Pro Feature: AI Strategy Recommendations</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter your metrics, then let Claude Sonnet analyze your position and generate a custom action plan to reach top-quartile performance in your category.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <AIAnalysisPanel
                toolId="ad-benchmark"
                data={aiData}
                disabled={!hasData}
                disabledMessage="Select a category and enter at least one metric to enable AI recommendations."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom — more tools coming */}
      <div className="mt-14 border-t pt-10">
        <h2 className="text-xl font-bold mb-6">More Ads Tools Coming Soon</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Ad Network Selector", desc: "Answer 5 questions about your app and budget — get a ranked recommendation of which ad networks to use first.", badge: "Coming Soon" },
            { title: "Seasonality Planner", desc: "See peak and off-peak CPI trends by category and month. Plan your ad budget around seasonality.", badge: "Coming Soon" },
            { title: "Creative Brief Generator", desc: "Generate an AI-written ad creative brief for your category, platform, and target audience.", badge: "Coming Soon" },
            { title: "Ad Budget Allocator", desc: "Given a monthly budget and your category, get a recommended split across networks.", badge: "Coming Soon" },
            { title: "Competitor Ad Spy", desc: "See what ad creatives and formats top apps in your category are running.", badge: "Coming Soon" },
            { title: "LTV Predictor", desc: "Predict your app's LTV based on early retention signals and category benchmarks.", badge: "Coming Soon" },
          ].map(t => (
            <Card key={t.title} className="opacity-75">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t.title}</CardTitle>
                  <Badge variant="secondary" className="text-[10px]">{t.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link href="/pricing">Unlock All Pro Tools <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
