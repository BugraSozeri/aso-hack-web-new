"use client";

import { useState, useMemo } from "react";
import { FileCheck, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIAnalysisPanel } from "@/components/tools/ai-analysis-panel";

type Platform = "ios" | "android";

type AuditInput = {
  title: string;
  subtitle: string;
  keywords: string;
  description: string;
  category: string;
  rating: string;
  ratingCount: string;
};

// ─── Shared scoring helpers ────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  "from","is","it","its","as","are","was","be","this","that","you","your",
]);

function getKeywords(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

type CheckItem = {
  label: string;
  pass: boolean;
  warning?: boolean;
  detail: string;
};

function buildAuditChecks(input: AuditInput, platform: Platform): CheckItem[] {
  const titleLen = input.title.trim().length;
  const subtitleLen = input.subtitle.trim().length;
  const kwLen = input.keywords.trim().length;
  const descLen = input.description.trim().length;
  const titleMax = platform === "ios" ? 30 : 50;
  const subtitleMax = platform === "ios" ? 30 : 80;
  const rating = parseFloat(input.rating) || 0;
  const count = parseInt(input.ratingCount) || 0;

  const titleKws = getKeywords(input.title);
  const subtitleKws = getKeywords(input.subtitle);
  const kwFieldWords = input.keywords.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  const overlap = kwFieldWords.filter(k => titleKws.includes(k) || subtitleKws.includes(k));

  const hasBullets = /[•\-\*]|^\d+\./m.test(input.description);

  const checks: CheckItem[] = [
    {
      label: "Title at character limit",
      pass: titleLen >= titleMax * 0.8 && titleLen <= titleMax,
      warning: titleLen > 0 && titleLen < titleMax * 0.8,
      detail: titleLen === 0 ? "Title is empty." :
        titleLen > titleMax ? `Over limit (${titleLen}/${titleMax})` :
        titleLen >= titleMax * 0.8 ? `Good (${titleLen}/${titleMax})` :
        `Too short — ${titleMax - titleLen} chars unused`,
    },
    {
      label: "Subtitle / Short Description filled",
      pass: subtitleLen >= subtitleMax * 0.7 && subtitleLen <= subtitleMax,
      warning: subtitleLen > 0 && subtitleLen < subtitleMax * 0.7,
      detail: subtitleLen === 0 ? "Empty — missing keyword opportunity." :
        subtitleLen >= subtitleMax * 0.7 ? `Good (${subtitleLen}/${subtitleMax})` :
        `Only ${subtitleLen}/${subtitleMax} chars used`,
    },
    ...(platform === "ios" ? [{
      label: "iOS Keyword field 90–100 chars",
      pass: kwLen >= 90 && kwLen <= 100,
      warning: kwLen > 0 && kwLen < 90,
      detail: kwLen === 0 ? "Empty — you're losing 100 chars of indexing power." :
        kwLen >= 90 ? `Great (${kwLen}/100)` :
        `Underfilled (${kwLen}/100)`,
    }] : []),
    {
      label: "No keyword overlap between title & keyword field",
      pass: platform === "ios" ? overlap.length === 0 : true,
      warning: false,
      detail: platform !== "ios" ? "N/A for Android" :
        overlap.length === 0 ? "No wasted repetitions." :
        `Repeated: ${overlap.slice(0, 3).join(", ")} — remove from keyword field`,
    },
    {
      label: "Description 3000+ characters",
      pass: descLen >= 3000,
      warning: descLen >= 1000 && descLen < 3000,
      detail: descLen === 0 ? "Empty." :
        descLen >= 3000 ? `${descLen.toLocaleString()} chars ✓` :
        `Only ${descLen.toLocaleString()} chars — add more content`,
    },
    {
      label: "Description uses bullet points / formatting",
      pass: hasBullets,
      warning: false,
      detail: hasBullets ? "Formatted description detected." : "Plain text only — add bullets for scanability",
    },
    {
      label: "Rating 4.0 or higher",
      pass: rating >= 4.0,
      warning: rating >= 3.5 && rating < 4.0,
      detail: rating === 0 ? "Not provided." :
        rating >= 4.0 ? `${rating}★ ✓` :
        `${rating}★ — consider a prompt campaign to boost ratings`,
    },
    {
      label: "100+ ratings for social proof",
      pass: count >= 100,
      warning: count >= 20 && count < 100,
      detail: count === 0 ? "Not provided." :
        count >= 100 ? `${count.toLocaleString()} ratings ✓` :
        `Only ${count} ratings — needs more social proof`,
    },
    {
      label: "Category specified",
      pass: input.category.length > 0,
      warning: false,
      detail: input.category || "Not specified",
    },
  ];

  return checks;
}

const categories = [
  "Games", "Entertainment", "Education", "Photo & Video", "Utilities",
  "Social Networking", "Health & Fitness", "Lifestyle", "Music", "Productivity",
  "Finance", "Travel", "News", "Food & Drink", "Shopping", "Sports",
  "Navigation", "Books", "Business", "Medical", "Reference", "Weather",
];

export default function ASOAuditPage() {
  const [platform, setPlatform] = useState<Platform>("ios");
  const [input, setInput] = useState<AuditInput>({
    title: "", subtitle: "", keywords: "", description: "",
    category: "", rating: "", ratingCount: "",
  });

  const update = (field: keyof AuditInput, value: string) =>
    setInput((prev) => ({ ...prev, [field]: value }));

  const checks = useMemo(() => buildAuditChecks(input, platform), [input, platform]);

  const passed = checks.filter((c) => c.pass).length;
  const warnings = checks.filter((c) => !c.pass && c.warning).length;
  const failed = checks.filter((c) => !c.pass && !c.warning).length;
  const score = Math.round((passed / checks.length) * 100);

  const scoreColor = score >= 75 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-red-500";
  const scoreBg = score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";

  const topKws = useMemo(() => {
    const words = getKeywords(input.title + " " + input.subtitle + " " + input.description);
    const freq: Record<string, number> = {};
    words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word);
  }, [input]);

  const hasData = input.title.length > 0;

  const aiData = useMemo(() => ({
    platform,
    title: input.title,
    subtitle: input.subtitle,
    keywords: input.keywords,
    description: input.description,
    category: input.category,
    rating: input.rating,
    ratingCount: input.ratingCount,
    score,
    topKeywords: topKws,
    checksPassedPct: `${passed}/${checks.length}`,
  }), [input, platform, score, topKws, passed, checks.length]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">Free Tool</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          ASO Audit
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          A comprehensive checklist audit of your App Store listing. Get a health score across
          9 dimensions and a full AI-generated improvement roadmap.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Input */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Platform</CardTitle></CardHeader>
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

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">App Metadata</CardTitle>
              <CardDescription>Paste your current listing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "title" as const, label: platform === "ios" ? "Title" : "App Name", max: platform === "ios" ? 30 : 50, placeholder: "Your App Name" },
                { key: "subtitle" as const, label: platform === "ios" ? "Subtitle" : "Short Description", max: platform === "ios" ? 30 : 80, placeholder: "Your value proposition" },
              ].map((f) => (
                <div key={f.key}>
                  <div className="mb-1.5 flex justify-between">
                    <label className="text-sm font-medium">{f.label}</label>
                    <span className={`text-xs ${input[f.key].length > f.max ? "text-red-500" : "text-muted-foreground"}`}>
                      {input[f.key].length}/{f.max}
                    </span>
                  </div>
                  <input
                    value={input[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                  />
                </div>
              ))}

              {platform === "ios" && (
                <div>
                  <div className="mb-1.5 flex justify-between">
                    <label className="text-sm font-medium">Keyword Field</label>
                    <span className={`text-xs ${input.keywords.length > 100 ? "text-red-500" : "text-muted-foreground"}`}>
                      {input.keywords.length}/100
                    </span>
                  </div>
                  <input
                    value={input.keywords}
                    onChange={(e) => update("keywords", e.target.value)}
                    placeholder="keyword1,keyword2,keyword3"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/50"
                  />
                </div>
              )}

              <div>
                <div className="mb-1.5 flex justify-between">
                  <label className="text-sm font-medium">Description</label>
                  <span className="text-xs text-muted-foreground">{input.description.length.toLocaleString()}</span>
                </div>
                <textarea
                  value={input.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Paste your full app description..."
                  rows={5}
                  className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Store Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <select
                  value={input.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select category…</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Avg Rating</label>
                  <input type="number" value={input.rating} onChange={(e) => update("rating", e.target.value)}
                    placeholder="4.5" min="1" max="5" step="0.1"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Rating Count</label>
                  <input type="number" value={input.ratingCount} onChange={(e) => update("ratingCount", e.target.value)}
                    placeholder="1250"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Overall score */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="col-span-1">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <span className={`text-4xl font-bold tabular-nums ${scoreColor}`}>{score}</span>
                <span className="text-sm text-muted-foreground">/100</span>
                <span className="mt-1 text-xs text-muted-foreground">ASO Score</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <span className="text-3xl font-bold text-emerald-500">{passed}</span>
                <span className="mt-1 text-xs text-muted-foreground">Passed</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <span className="text-3xl font-bold text-red-500">{failed}</span>
                <span className="mt-1 text-xs text-muted-foreground">Failed</span>
              </CardContent>
            </Card>
          </div>

          {/* Progress bar */}
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className={`h-full rounded-full transition-all duration-700 ${scoreBg}`} style={{ width: `${score}%` }} />
          </div>

          {/* Checklist */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-amber-500" />
                ASO Checklist
              </CardTitle>
              <CardDescription>{passed}/{checks.length} checks passed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {checks.map((check, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${
                  check.pass ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20"
                  : check.warning ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20"
                  : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20"
                }`}>
                  {check.pass
                    ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    : check.warning
                    ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
                  <div>
                    <p className="text-sm font-medium">{check.label}</p>
                    <p className="text-xs text-muted-foreground">{check.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Panel */}
          <AIAnalysisPanel
            toolId="aso-audit"
            data={aiData}
            disabled={!hasData}
            disabledMessage="Enter your app title to enable the AI audit."
          />
        </div>
      </div>
    </div>
  );
}
