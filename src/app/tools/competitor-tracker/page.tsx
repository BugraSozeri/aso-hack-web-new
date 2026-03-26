"use client";

import { useState, useMemo } from "react";
import { Users, Plus, Trash2, Star, MessageSquare, Trophy, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIAnalysisPanel } from "@/components/tools/ai-analysis-panel";

// ─── Types ────────────────────────────────────────────────────────────────────

type Competitor = {
  id: string;
  name: string;
  rating: string;
  reviewCount: string;
  titleKeywords: string;
  notes: string;
};

const CATEGORIES = [
  "Games", "Entertainment", "Education", "Photo & Video", "Utilities",
  "Social Networking", "Health & Fitness", "Lifestyle", "Music", "Productivity",
  "Finance", "Travel", "News", "Food & Drink", "Shopping", "Sports",
  "Navigation", "Books", "Business", "Medical",
];

function newCompetitor(): Competitor {
  return { id: crypto.randomUUID(), name: "", rating: "", reviewCount: "", titleKeywords: "", notes: "" };
}

// ─── Rating badge ─────────────────────────────────────────────────────────────

function RatingBadge({ rating }: { rating: string }) {
  const r = parseFloat(rating);
  if (!r) return <span className="text-xs text-muted-foreground">—</span>;
  const color = r >= 4.5 ? "text-emerald-600 dark:text-emerald-400" : r >= 4.0 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
  return (
    <span className={`flex items-center gap-1 font-semibold tabular-nums ${color}`}>
      <Star className="h-3.5 w-3.5 fill-current" />
      {r.toFixed(1)}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompetitorTrackerPage() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [category, setCategory] = useState("");

  // My app
  const [appName, setAppName] = useState("");
  const [myRating, setMyRating] = useState("");
  const [myReviewCount, setMyReviewCount] = useState("");
  const [myTitleKeywords, setMyTitleKeywords] = useState("");
  const [myNotes, setMyNotes] = useState("");

  // Competitors
  const [competitors, setCompetitors] = useState<Competitor[]>([newCompetitor(), newCompetitor()]);

  const addCompetitor = () => {
    if (competitors.length < 5) setCompetitors((prev) => [...prev, newCompetitor()]);
  };

  const removeCompetitor = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCompetitor = (id: string, field: keyof Omit<Competitor, "id">, value: string) => {
    setCompetitors((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  const filledCompetitors = competitors.filter((c) => c.name.trim().length > 0);
  const hasEnoughData = appName.trim().length > 0 && filledCompetitors.length >= 1;

  // Comparison table data
  const allApps = useMemo(() => {
    const mine = { name: appName || "Your App", rating: myRating, reviewCount: myReviewCount, isOwn: true };
    const comps = filledCompetitors.map((c) => ({ name: c.name, rating: c.rating, reviewCount: c.reviewCount, isOwn: false }));
    return [mine, ...comps];
  }, [appName, myRating, myReviewCount, filledCompetitors]);

  const aiData = useMemo(() => ({
    platform,
    category,
    appName,
    myRating,
    myReviewCount,
    myTitleKeywords,
    myNotes,
    competitors: competitors.map(({ name, rating, reviewCount, titleKeywords, notes }) => ({
      name, rating, reviewCount, titleKeywords, notes,
    })),
  }), [platform, category, appName, myRating, myReviewCount, myTitleKeywords, myNotes, competitors]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">Free Tool</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Competitor Tracker</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Enter your app and up to 5 competitors — get an instant competitive comparison
          and AI-powered strategy to win market share.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* ── Input ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Platform + Category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Platform & Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* My App */}
          <Card className="border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Your App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="App name *"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={myRating}
                  onChange={(e) => setMyRating(e.target.value)}
                  placeholder="Rating (4.5)"
                  min="1" max="5" step="0.1"
                  className="rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
                <input
                  type="number"
                  value={myReviewCount}
                  onChange={(e) => setMyReviewCount(e.target.value)}
                  placeholder="# Reviews"
                  className="rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
              </div>
              <input
                value={myTitleKeywords}
                onChange={(e) => setMyTitleKeywords(e.target.value)}
                placeholder="Keywords in title/subtitle"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
              />
              <textarea
                value={myNotes}
                onChange={(e) => setMyNotes(e.target.value)}
                placeholder="Key features, differentiators, what makes your app unique..."
                rows={2}
                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
              />
            </CardContent>
          </Card>

          {/* Competitors */}
          <div className="space-y-3">
            {competitors.map((c, idx) => (
              <Card key={c.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      Competitor {idx + 1}
                    </CardTitle>
                    {competitors.length > 1 && (
                      <button
                        onClick={() => removeCompetitor(c.id)}
                        className="rounded p-1 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input
                    value={c.name}
                    onChange={(e) => updateCompetitor(c.id, "name", e.target.value)}
                    placeholder="Competitor app name"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={c.rating}
                      onChange={(e) => updateCompetitor(c.id, "rating", e.target.value)}
                      placeholder="Rating"
                      min="1" max="5" step="0.1"
                      className="rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                    />
                    <input
                      type="number"
                      value={c.reviewCount}
                      onChange={(e) => updateCompetitor(c.id, "reviewCount", e.target.value)}
                      placeholder="# Reviews"
                      className="rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <input
                    value={c.titleKeywords}
                    onChange={(e) => updateCompetitor(c.id, "titleKeywords", e.target.value)}
                    placeholder="Keywords in their title/subtitle"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                  />
                  <input
                    value={c.notes}
                    onChange={(e) => updateCompetitor(c.id, "notes", e.target.value)}
                    placeholder="Strengths, features, what users say…"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                  />
                </CardContent>
              </Card>
            ))}

            {competitors.length < 5 && (
              <button
                onClick={addCompetitor}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Competitor ({competitors.length}/5)
              </button>
            )}
          </div>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Comparison Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Rating Comparison</CardTitle>
              <CardDescription>Social proof snapshot across your competitive set</CardDescription>
            </CardHeader>
            <CardContent>
              {allApps.filter((a) => a.name).length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Fill in your app details to see the comparison
                </p>
              ) : (
                <div className="space-y-2">
                  {allApps
                    .filter((a) => a.name)
                    .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
                    .map((app) => {
                      const rating = parseFloat(app.rating) || 0;
                      const pct = rating > 0 ? ((rating - 1) / 4) * 100 : 0;
                      return (
                        <div key={app.name} className={`rounded-lg p-3 ${app.isOwn ? "border border-amber-500/40 bg-amber-500/5" : "border"}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {app.isOwn && <Trophy className="h-3.5 w-3.5 text-amber-500" />}
                              <span className={`text-sm font-medium ${app.isOwn ? "text-amber-600 dark:text-amber-400" : ""}`}>
                                {app.name}
                              </span>
                              {app.isOwn && <Badge variant="secondary" className="text-xs py-0 px-1.5">You</Badge>}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {app.reviewCount && (
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {parseInt(app.reviewCount).toLocaleString()}
                                </span>
                              )}
                              <RatingBadge rating={app.rating} />
                            </div>
                          </div>
                          {rating > 0 && (
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  rating >= 4.5 ? "bg-emerald-500" : rating >= 4.0 ? "bg-amber-500" : "bg-red-500"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rating gap insight */}
          {filledCompetitors.length > 0 && myRating && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                {(() => {
                  const myR = parseFloat(myRating) || 0;
                  const topCompR = Math.max(...filledCompetitors.map((c) => parseFloat(c.rating) || 0));
                  const gap = topCompR - myR;
                  if (gap > 0.3) {
                    return (
                      <div className="flex items-start gap-2 text-sm">
                        <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <span>
                          Your top competitor has a <strong>{gap.toFixed(1)}★ rating advantage</strong>.
                          Use the AI analysis to identify what's driving their higher rating and fix your biggest issues first.
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div className="flex items-start gap-2 text-sm">
                      <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <span>
                        Your rating is competitive. Use the AI analysis to find keyword gaps and listing improvements to gain market share.
                      </span>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* AI Panel */}
          <AIAnalysisPanel
            toolId="competitor-tracker"
            data={aiData}
            disabled={!hasEnoughData}
            disabledMessage="Enter your app name and at least 1 competitor to enable AI analysis."
          />
        </div>
      </div>
    </div>
  );
}
