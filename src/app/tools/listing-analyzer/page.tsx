"use client";

import { useState, useMemo } from "react";
import { BarChart3, CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIAnalysisPanel } from "@/components/tools/ai-analysis-panel";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "ios" | "android";

type ListingInput = {
  title: string;
  subtitle: string;
  keywords: string;       // iOS only
  description: string;
  category: string;
  rating: string;
  ratingCount: string;
};

// ─── Limits ───────────────────────────────────────────────────────────────────

const LIMITS = {
  ios: { title: 30, subtitle: 30, keywords: 100, description: 4000 },
  android: { title: 50, subtitle: 80, description: 4000 },
};

// ─── Scoring ──────────────────────────────────────────────────────────────────

type ScoreDimension = {
  name: string;
  score: number;
  max: number;
  status: "good" | "warning" | "bad";
  feedback: string;
};

function scoreTitle(title: string, platform: Platform): ScoreDimension {
  const len = title.trim().length;
  const maxLen = platform === "ios" ? 30 : 50;
  const targetMin = platform === "ios" ? 20 : 30;

  let score = 0;
  let feedback = "";
  let status: "good" | "warning" | "bad" = "bad";

  if (len === 0) {
    feedback = "Title is empty.";
  } else if (len >= targetMin && len <= maxLen) {
    score = 20;
    status = "good";
    feedback = `Great length (${len}/${maxLen} chars). Using the space well.`;
  } else if (len < targetMin) {
    score = 10;
    status = "warning";
    feedback = `Title is short (${len}/${maxLen} chars). Add your primary keyword to use more space.`;
  } else {
    score = 5;
    status = "bad";
    feedback = `Title exceeds limit (${len}/${maxLen} chars). Trim to fit.`;
  }

  return { name: "Title", score, max: 20, status, feedback };
}

function scoreSubtitle(subtitle: string, platform: Platform): ScoreDimension {
  const len = subtitle.trim().length;
  const maxLen = platform === "ios" ? 30 : 80;
  const targetMin = platform === "ios" ? 20 : 40;

  let score = 0;
  let feedback = "";
  let status: "good" | "warning" | "bad" = "bad";

  if (len === 0) {
    score = 0;
    status = "bad";
    feedback = "Subtitle is empty — this is valuable keyword real estate!";
  } else if (len >= targetMin && len <= maxLen) {
    score = 15;
    status = "good";
    feedback = `Good subtitle length (${len}/${maxLen} chars).`;
  } else if (len < targetMin) {
    score = 8;
    status = "warning";
    feedback = `Subtitle could be longer (${len}/${maxLen} chars). Include a secondary keyword or value prop.`;
  } else {
    score = 5;
    status = "bad";
    feedback = `Subtitle exceeds limit (${len}/${maxLen} chars).`;
  }

  return { name: platform === "ios" ? "Subtitle" : "Short Description", score, max: 15, status, feedback };
}

function scoreKeywords(keywords: string): ScoreDimension {
  const len = keywords.trim().length;
  let score = 0;
  let feedback = "";
  let status: "good" | "warning" | "bad" = "bad";

  if (len === 0) {
    feedback = "Keyword field is empty — you're leaving 100 characters of search value unused!";
  } else if (len >= 90) {
    score = 15;
    status = "good";
    feedback = `Excellent keyword field usage (${len}/100 chars). Well optimized.`;
  } else if (len >= 70) {
    score = 10;
    status = "warning";
    feedback = `Good usage but room to add more (${len}/100 chars). Try to reach 90-100 chars.`;
  } else {
    score = 5;
    status = "warning";
    feedback = `Keyword field is underfilled (${len}/100 chars). Add more keywords separated by commas.`;
  }

  return { name: "Keyword Field", score, max: 15, status, feedback };
}

function scoreDescription(description: string): ScoreDimension {
  const len = description.trim().length;
  const hasBullets = /[•\-\*]/.test(description) || /^\d+\./.test(description);

  let score = 0;
  let feedback = "";
  let status: "good" | "warning" | "bad" = "bad";

  if (len === 0) {
    feedback = "Description is empty.";
  } else if (len >= 3000 && hasBullets) {
    score = 20;
    status = "good";
    feedback = `Great description (${len} chars, has structured formatting).`;
  } else if (len >= 2000) {
    score = 14;
    status = "warning";
    feedback = `Decent length (${len} chars) but ${!hasBullets ? "add bullet points for scanability" : "could be longer (aim for 3000+)"}. `;
  } else if (len >= 500) {
    score = 8;
    status = "warning";
    feedback = `Description is too short (${len} chars). Aim for 3000+ chars with features and benefits.`;
  } else {
    score = 3;
    status = "bad";
    feedback = `Very short description (${len} chars). Expand significantly — this hurts conversion and rankings.`;
  }

  return { name: "Description", score, max: 20, status, feedback };
}

function scoreRatings(rating: string, ratingCount: string): ScoreDimension {
  const r = parseFloat(rating);
  const count = parseInt(ratingCount, 10);

  let score = 0;
  let feedback = "";
  let status: "good" | "warning" | "bad" = "bad";

  if (!rating && !ratingCount) {
    return { name: "Ratings", score: 0, max: 15, status: "bad", feedback: "No rating data provided." };
  }

  if (r >= 4.5 && count >= 500) {
    score = 15;
    status = "good";
    feedback = `Excellent: ${r}★ with ${count.toLocaleString()} ratings. Strong social proof.`;
  } else if (r >= 4.0 && count >= 100) {
    score = 10;
    status = "good";
    feedback = `Good: ${r}★ with ${count.toLocaleString()} ratings.`;
  } else if (r >= 3.5) {
    score = 6;
    status = "warning";
    feedback = `Average rating (${r}★, ${(count || 0).toLocaleString()} ratings). Consider a rating prompt campaign.`;
  } else {
    score = 2;
    status = "bad";
    feedback = `Low rating (${r}★). Fix core user issues before investing in UA.`;
  }

  return { name: "Ratings", score, max: 15, status, feedback };
}

function scoreCategoryFit(title: string, subtitle: string, category: string): ScoreDimension {
  if (!category) {
    return {
      name: "Category Fit",
      score: 8,
      max: 15,
      status: "warning",
      feedback: "Category not specified. Add your app category for a more accurate score.",
    };
  }

  const catKeywords = category.toLowerCase().split(/[\s,&/]+/);
  const combined = (title + " " + subtitle).toLowerCase();
  const hasMatch = catKeywords.some((kw) => kw.length > 3 && combined.includes(kw));

  return {
    name: "Category Fit",
    score: hasMatch ? 15 : 7,
    max: 15,
    status: hasMatch ? "good" : "warning",
    feedback: hasMatch
      ? `Category keywords found in title/subtitle. Good discoverability.`
      : `Category "${category}" keywords not found in title or subtitle. Consider adding them.`,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

const categories = [
  "Games", "Entertainment", "Education", "Photo & Video", "Utilities",
  "Social Networking", "Health & Fitness", "Lifestyle", "Music", "Productivity",
  "Finance", "Travel", "News", "Food & Drink", "Shopping", "Sports",
  "Navigation", "Books", "Business", "Medical", "Reference", "Weather",
];

export default function ListingAnalyzerPage() {
  const [platform, setPlatform] = useState<Platform>("ios");
  const [input, setInput] = useState<ListingInput>({
    title: "", subtitle: "", keywords: "", description: "", category: "", rating: "", ratingCount: "",
  });

  const update = (field: keyof ListingInput, value: string) =>
    setInput((prev) => ({ ...prev, [field]: value }));

  const limits = LIMITS[platform];

  const dimensions = useMemo((): ScoreDimension[] => {
    const dims: ScoreDimension[] = [
      scoreTitle(input.title, platform),
      scoreSubtitle(input.subtitle, platform),
      ...(platform === "ios" ? [scoreKeywords(input.keywords)] : []),
      scoreDescription(input.description),
      scoreRatings(input.rating, input.ratingCount),
      scoreCategoryFit(input.title, input.subtitle, input.category),
    ];
    return dims;
  }, [input, platform]);

  const totalScore = useMemo(
    () => dimensions.reduce((sum, d) => sum + d.score, 0),
    [dimensions]
  );

  const maxScore = useMemo(
    () => dimensions.reduce((sum, d) => sum + d.max, 0),
    [dimensions]
  );

  const scorePercent = Math.round((totalScore / maxScore) * 100);

  const scoreColor =
    scorePercent >= 75
      ? "text-emerald-500 dark:text-emerald-400"
      : scorePercent >= 50
      ? "text-amber-500 dark:text-amber-400"
      : "text-red-500 dark:text-red-400";

  const scoreBg =
    scorePercent >= 75
      ? "bg-emerald-500"
      : scorePercent >= 50
      ? "bg-amber-500"
      : "bg-red-500";

  const statusIcon = (status: ScoreDimension["status"]) => {
    if (status === "good") return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
    if (status === "warning") return <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />;
    return <XCircle className="h-4 w-4 text-red-500 shrink-0" />;
  };

  const hasEnoughData = input.title.length > 0 || input.description.length > 0;

  const aiData = useMemo(() => ({
    platform,
    title: input.title,
    subtitle: input.subtitle,
    keywords: input.keywords,
    description: input.description,
    category: input.category,
    rating: input.rating,
    ratingCount: input.ratingCount,
    score: scorePercent,
    topKeywords: [],
  }), [input, platform, scorePercent]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">Free Tool</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          App Listing Analyzer
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Get an instant ASO score for your app listing. Paste your metadata below and
          discover exactly what to improve — then get AI-powered action tasks.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* ── Input ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Platform */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {(["ios", "android"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      platform === p
                        ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {p === "ios" ? "🍎 iOS" : "🤖 Android"}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">App Metadata</CardTitle>
              <CardDescription>Paste your current listing content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {platform === "ios" ? "Title" : "App Name"}
                  </label>
                  <span className={`text-xs ${input.title.length > (platform === "ios" ? LIMITS.ios.title : LIMITS.android.title) ? "text-red-500" : "text-muted-foreground"}`}>
                    {input.title.length}/{platform === "ios" ? LIMITS.ios.title : LIMITS.android.title}
                  </span>
                </div>
                <input
                  value={input.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder={platform === "ios" ? "Mindful: Meditation & Sleep" : "Mindful - Meditation & Sleep"}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Subtitle */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {platform === "ios" ? "Subtitle" : "Short Description"}
                  </label>
                  <span className={`text-xs ${input.subtitle.length > (platform === "ios" ? LIMITS.ios.subtitle : LIMITS.android.subtitle) ? "text-red-500" : "text-muted-foreground"}`}>
                    {input.subtitle.length}/{platform === "ios" ? LIMITS.ios.subtitle : LIMITS.android.subtitle}
                  </span>
                </div>
                <input
                  value={input.subtitle}
                  onChange={(e) => update("subtitle", e.target.value)}
                  placeholder={platform === "ios" ? "Daily calm, focus & sleep aid" : "Daily calm, focus & sleep aid for mindfulness"}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Keywords (iOS only) */}
              {platform === "ios" && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      Keyword Field
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </label>
                    <span className={`text-xs ${input.keywords.length > LIMITS.ios.keywords ? "text-red-500" : "text-muted-foreground"}`}>
                      {input.keywords.length}/{LIMITS.ios.keywords}
                    </span>
                  </div>
                  <input
                    value={input.keywords}
                    onChange={(e) => update("keywords", e.target.value)}
                    placeholder="meditation,sleep,calm,anxiety,breathing,stress"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/50"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Comma-separated, no spaces around commas</p>
                </div>
              )}

              {/* Description */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium">Description</label>
                  <span className="text-xs text-muted-foreground">
                    {input.description.length.toLocaleString()}/4,000
                  </span>
                </div>
                <textarea
                  value={input.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Paste your full app description here..."
                  rows={6}
                  className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Store Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Store Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <select
                  value={input.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select category…</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Average Rating</label>
                  <input
                    type="number"
                    value={input.rating}
                    onChange={(e) => update("rating", e.target.value)}
                    placeholder="4.5"
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Rating Count</label>
                  <input
                    type="number"
                    value={input.ratingCount}
                    onChange={(e) => update("ratingCount", e.target.value)}
                    placeholder="1250"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Score */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">ASO Score</CardTitle>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span className={`text-3xl font-bold tabular-nums ${scoreColor}`}>
                    {scorePercent}
                  </span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreBg}`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {scorePercent >= 75
                  ? "🎉 Great listing! Focus on fine-tuning keywords."
                  : scorePercent >= 50
                  ? "⚠️ Room for improvement. Follow the tasks below."
                  : "🔴 Significant optimizations needed. Start with the critical issues."}
              </p>
            </CardContent>
          </Card>

          {/* Dimensions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dimensions.map((dim) => (
                <div key={dim.name} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {statusIcon(dim.status)}
                      <span className="text-sm font-medium">{dim.name}</span>
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${
                      dim.status === "good"
                        ? "text-emerald-500"
                        : dim.status === "warning"
                        ? "text-amber-500"
                        : "text-red-500"
                    }`}>
                      {dim.score}/{dim.max}
                    </span>
                  </div>
                  <p className="mt-1.5 pl-6 text-xs text-muted-foreground">{dim.feedback}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        dim.status === "good"
                          ? "bg-emerald-500"
                          : dim.status === "warning"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${(dim.score / dim.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Panel */}
          <AIAnalysisPanel
            toolId="listing-analyzer"
            data={aiData}
            disabled={!hasEnoughData}
            disabledMessage="Enter your app title and description to enable AI analysis."
          />
        </div>
      </div>
    </div>
  );
}
