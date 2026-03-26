"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Search, Lightbulb, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIAnalysisPanel } from "@/components/tools/ai-analysis-panel";

// ─── Seed suggestions by category ─────────────────────────────────────────────

const SEED_EXAMPLES: Record<string, string[]> = {
  "Health & Fitness": ["workout tracker", "calorie counter", "meditation", "running app", "yoga"],
  "Productivity": ["task manager", "habit tracker", "focus timer", "notes app", "planner"],
  "Finance": ["budget tracker", "expense tracker", "savings app", "investment tracker"],
  "Education": ["language learning", "flashcards", "math tutor", "quiz app", "reading"],
  "Games": ["puzzle game", "word game", "strategy game", "casual game", "brain game"],
  "Social Networking": ["chat app", "community app", "dating app", "friend finder"],
  "Photo & Video": ["photo editor", "video editor", "collage maker", "filter app"],
  "Music": ["music player", "guitar tuner", "chord finder", "beat maker", "metronome"],
  "Travel": ["travel planner", "flight tracker", "hotel finder", "city guide"],
  "Shopping": ["price tracker", "coupon finder", "wishlist app", "shopping list"],
  "Utilities": ["qr scanner", "pdf editor", "file manager", "vpn", "cleaner app"],
  "Lifestyle": ["journal app", "recipe app", "meal planner", "sleep tracker"],
};

const CATEGORIES = [
  "Games", "Entertainment", "Education", "Photo & Video", "Utilities",
  "Social Networking", "Health & Fitness", "Lifestyle", "Music", "Productivity",
  "Finance", "Travel", "News", "Food & Drink", "Shopping", "Sports",
  "Navigation", "Books", "Business", "Medical",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function KeywordExplorerPage() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [seedKeyword, setSeedKeyword] = useState("");
  const [appName, setAppName] = useState("");
  const [category, setCategory] = useState("");
  const [appContext, setAppContext] = useState("");
  const [titleKeywords, setTitleKeywords] = useState("");
  const [competitors, setCompetitors] = useState("");

  const seeds = SEED_EXAMPLES[category] ?? [];
  const hasEnoughData = seedKeyword.trim().length >= 2;

  const aiData = useMemo(() => ({
    platform,
    seedKeyword: seedKeyword.trim(),
    appName: appName.trim(),
    category,
    appContext: appContext.trim(),
    titleKeywords: titleKeywords.trim(),
    competitors: competitors.trim(),
  }), [platform, seedKeyword, appName, category, appContext, titleKeywords, competitors]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">Free Tool</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Keyword Explorer</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Enter a seed keyword and your app context — get AI-powered keyword suggestions with
          competition levels, search volume estimates, and placement recommendations.
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

          {/* Seed Keyword */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Seed Keyword</CardTitle>
              <CardDescription>The core topic or feature of your app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={seedKeyword}
                  onChange={(e) => setSeedKeyword(e.target.value)}
                  placeholder="e.g. meditation, budget tracker, workout"
                  className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground/50"
                />
                {seedKeyword && (
                  <button
                    onClick={() => setSeedKeyword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Example seeds */}
              {seeds.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Try for {category}:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {seeds.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSeedKeyword(s)}
                        className="rounded-full border px-2.5 py-1 text-xs hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Context */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">App Context</CardTitle>
              <CardDescription>More context = better keyword suggestions</CardDescription>
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
              <div>
                <label className="mb-1.5 block text-sm font-medium">Keywords in Current Title/Subtitle</label>
                <input
                  value={titleKeywords}
                  onChange={(e) => setTitleKeywords(e.target.value)}
                  placeholder="e.g. meditation, sleep, calm"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
                <p className="mt-1 text-xs text-muted-foreground">AI avoids suggesting duplicates</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">What does your app do? (optional)</label>
                <textarea
                  value={appContext}
                  onChange={(e) => setAppContext(e.target.value)}
                  placeholder="Briefly describe your app's main features and target user..."
                  rows={3}
                  className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Known Competitors (optional)</label>
                <input
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="e.g. Calm, Headspace, Insight Timer"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* How it works */}
          {!hasEnoughData && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  How Keyword Explorer Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Enter a seed keyword and click "Analyze with AI" to get:</p>
                <div className="space-y-2">
                  {[
                    "15-20 keyword suggestions with competition levels (Low / Medium / High)",
                    "Monthly search volume estimates for the App Store / Play Store",
                    "Exact placement recommendations (Title, Subtitle, Keyword Field, Description)",
                    "Long-tail phrase opportunities you can realistically rank for",
                    "Optimized iOS keyword field string (100 chars, ready to copy-paste)",
                    "5 quick wins you could rank for within 30 days",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs pt-2">
                  💡 Tip: Add your app category and current title keywords for more targeted suggestions.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Seed summary */}
          {hasEnoughData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Research Target</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                    <Search className="h-3.5 w-3.5" />
                    {seedKeyword}
                  </span>
                  {category && (
                    <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                      {category}
                    </span>
                  )}
                  <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                    {platform === "ios" ? "iOS App Store" : "Google Play"}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Ready to explore. Click "Analyze with AI" to generate keyword suggestions.
                </p>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis Panel */}
          <AIAnalysisPanel
            toolId="keyword-explorer"
            data={aiData}
            disabled={!hasEnoughData}
            disabledMessage="Enter a seed keyword (at least 2 characters) to enable AI analysis."
          />

          {/* Note about data */}
          <p className="text-xs text-muted-foreground text-center">
            Search volume estimates are based on industry benchmarks and AI knowledge — not live App Store data.
            Use as directional guidance, not exact figures.
          </p>
        </div>
      </div>
    </div>
  );
}
