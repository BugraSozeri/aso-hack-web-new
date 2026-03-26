"use client";

import { useState, useMemo } from "react";
import { Star, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIAnalysisPanel } from "@/components/tools/ai-analysis-panel";

// ─── Sentiment keyword lists ──────────────────────────────────────────────────

const POSITIVE_WORDS = new Set([
  "love", "great", "amazing", "excellent", "perfect", "awesome", "fantastic",
  "best", "wonderful", "brilliant", "superb", "good", "nice", "helpful",
  "easy", "smooth", "fast", "clean", "intuitive", "simple", "beautiful",
  "recommend", "worth", "useful", "impressed", "enjoy", "like", "works",
  "flawless", "reliable", "stable", "improved", "better", "outstanding",
]);

const NEGATIVE_WORDS = new Set([
  "bad", "terrible", "awful", "horrible", "worst", "broken", "crash",
  "bug", "slow", "laggy", "freeze", "glitch", "hate", "annoying", "useless",
  "waste", "disappointed", "frustrating", "confusing", "difficult", "expensive",
  "overpriced", "scam", "delete", "uninstall", "fix", "issue", "problem",
  "error", "fail", "not working", "doesn't work", "stopped working",
  "poor", "disappointing", "misleading", "ads", "spam",
]);

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "this", "that", "these", "those",
  "i", "me", "my", "we", "our", "you", "your", "it", "its", "he", "she",
  "they", "them", "their", "what", "which", "who", "how", "when", "where",
  "app", "it's", "i've", "i'm", "can't", "don't", "very", "just", "really",
  "so", "like", "use", "get", "got", "also", "not", "no", "one", "all",
  "than", "then", "now", "up", "out", "about", "more", "some", "there",
]);

// ─── Analysis helpers ─────────────────────────────────────────────────────────

function parseReviews(text: string): string[] {
  return text
    .split(/\n{2,}|\n(?=\d+[.)]\s)|\n(?=[-*]\s)/)
    .map((r) => r.replace(/^\s*[\d\-*•.]+\s*/, "").trim())
    .filter((r) => r.length > 10);
}

function scoreSentiment(review: string): "positive" | "neutral" | "negative" {
  const words = review.toLowerCase().split(/\W+/);
  let pos = 0;
  let neg = 0;
  for (const w of words) {
    if (POSITIVE_WORDS.has(w)) pos++;
    if (NEGATIVE_WORDS.has(w)) neg++;
  }
  if (pos > neg) return "positive";
  if (neg > pos) return "negative";
  return "neutral";
}

function topWords(reviews: string[], n = 20): { word: string; count: number }[] {
  const freq: Record<string, number> = {};
  for (const review of reviews) {
    const words = review.toLowerCase().split(/\W+/);
    for (const w of words) {
      if (w.length < 3 || STOP_WORDS.has(w)) continue;
      freq[w] = (freq[w] ?? 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

// ─── Component ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Games", "Entertainment", "Education", "Photo & Video", "Utilities",
  "Social Networking", "Health & Fitness", "Lifestyle", "Music", "Productivity",
  "Finance", "Travel", "News", "Food & Drink", "Shopping", "Sports",
  "Navigation", "Books", "Business", "Medical",
];

export default function ReviewAnalyzerPage() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [appName, setAppName] = useState("");
  const [category, setCategory] = useState("");
  const [reviewText, setReviewText] = useState("");

  const reviews = useMemo(() => parseReviews(reviewText), [reviewText]);

  const sentiments = useMemo(() => reviews.map(scoreSentiment), [reviews]);

  const positiveCount = sentiments.filter((s) => s === "positive").length;
  const neutralCount = sentiments.filter((s) => s === "neutral").length;
  const negativeCount = sentiments.filter((s) => s === "negative").length;
  const total = reviews.length;

  const positivePercent = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  const neutralPercent = total > 0 ? Math.round((neutralCount / total) * 100) : 0;
  const negativePercent = total > 0 ? Math.round((negativeCount / total) * 100) : 0;

  const words = useMemo(() => topWords(reviews), [reviews]);

  const hasEnoughData = reviews.length >= 3;

  const aiData = useMemo(() => ({
    platform,
    appName,
    category,
    reviewCount: total,
    sentimentSummary: total > 0
      ? `${positivePercent}% positive, ${neutralPercent}% neutral, ${negativePercent}% negative`
      : "N/A",
    positiveCount,
    neutralCount,
    negativeCount,
    positivePercent,
    neutralPercent,
    negativePercent,
    topWords: words.slice(0, 15),
    reviews: reviewText.slice(0, 6000), // cap to avoid token overflow
  }), [platform, appName, category, total, positivePercent, neutralPercent, negativePercent, positiveCount, neutralCount, negativeCount, words, reviewText]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">Free Tool</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Review Analyzer</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Paste your app reviews and get instant sentiment analysis + AI-powered insights on what
          users love, hate, and want next.
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

          {/* App Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">App Info</CardTitle>
              <CardDescription>Optional but improves AI accuracy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">App Name</label>
                <input
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. Mindful: Meditation & Sleep"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Paste Reviews</CardTitle>
              <CardDescription>
                One review per paragraph. Copy from App Store / Play Store.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={`Paste your reviews here, separated by blank lines.\n\nExample:\nLove this app! Works perfectly and saves me so much time.\n\nKeeps crashing on my iPhone 15. Please fix ASAP.\n\nGreat concept but missing dark mode.`}
                rows={14}
                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/40"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {total > 0 ? `${total} reviews detected` : "Paste 3+ reviews to enable analysis"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sentiment Overview */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Sentiment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {total === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Paste reviews on the left to see sentiment analysis
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Bar chart */}
                  <div className="space-y-3">
                    {[
                      { label: "Positive", count: positiveCount, percent: positivePercent, color: "bg-emerald-500", icon: ThumbsUp, textColor: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Neutral", count: neutralCount, percent: neutralPercent, color: "bg-amber-400", icon: Minus, textColor: "text-amber-600 dark:text-amber-400" },
                      { label: "Negative", count: negativeCount, percent: negativePercent, color: "bg-red-500", icon: ThumbsDown, textColor: "text-red-600 dark:text-red-400" },
                    ].map(({ label, count, percent, color, icon: Icon, textColor }) => (
                      <div key={label}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`h-3.5 w-3.5 ${textColor}`} />
                            <span className="font-medium">{label}</span>
                          </div>
                          <span className={`font-bold tabular-nums ${textColor}`}>
                            {count} <span className="font-normal text-muted-foreground">({percent}%)</span>
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${color}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary line */}
                  <p className="text-xs text-muted-foreground pt-1">
                    {positivePercent >= 70
                      ? "🎉 Users are mostly happy. Focus on maintaining quality and gathering more ratings."
                      : positivePercent >= 50
                      ? "⚠️ Mixed sentiment. Address the negative themes to push your rating above 4.5."
                      : "🔴 High negative sentiment. Prioritize bug fixes and UX issues before running paid UA."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Words */}
          {words.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Most Mentioned Words</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {words.slice(0, 20).map(({ word, count }) => {
                    const isPos = POSITIVE_WORDS.has(word);
                    const isNeg = NEGATIVE_WORDS.has(word);
                    return (
                      <span
                        key={word}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                          isPos
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : isNeg
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {word}
                        <span className="opacity-60">×{count}</span>
                      </span>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Positive signal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> Negative signal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30" /> Neutral
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Star distribution hint */}
          {total >= 3 && (
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Quick Tips Based on Your Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {negativeCount > 0 && (
                  <p>• {negativeCount} negative review{negativeCount > 1 ? "s" : ""} detected — use AI analysis below to identify the exact issues and get fix suggestions.</p>
                )}
                {positiveCount > 0 && (
                  <p>• {positiveCount} positive review{positiveCount > 1 ? "s" : ""} — the AI will extract what users love so you can highlight these features in your store listing.</p>
                )}
                <p>• Paste at least 20-30 reviews for the most accurate AI recommendations.</p>
              </CardContent>
            </Card>
          )}

          {/* AI Panel */}
          <AIAnalysisPanel
            toolId="review-analyzer"
            data={aiData}
            disabled={!hasEnoughData}
            disabledMessage="Paste at least 3 reviews to enable AI analysis."
          />
        </div>
      </div>
    </div>
  );
}
