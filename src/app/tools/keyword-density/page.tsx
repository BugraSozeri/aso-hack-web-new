"use client";

import { useState, useMemo } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Copy,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "is", "it", "as", "be", "was", "are", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
  "may", "might", "shall", "can", "this", "that", "these", "those", "i", "you",
  "he", "she", "we", "they", "me", "him", "her", "us", "them", "my", "your",
  "his", "its", "our", "their", "not", "no", "so", "if", "up", "out", "about",
  "into", "over", "after", "just", "also", "than", "more", "very", "all", "any",
  "each", "every", "both", "few", "most", "other", "some", "such", "only",
  "own", "same", "too", "s", "t", "don", "re", "ve", "ll", "d", "m",
]);

const CHAR_LIMITS = {
  title: { ios: 30, android: 30 },
  subtitle: { ios: 30 },
  shortDescription: { android: 80 },
  keywordField: { ios: 100 },
  description: { ios: 4000, android: 4000 },
};

interface KeywordResult {
  word: string;
  count: number;
  density: number;
}

interface BigramResult {
  phrase: string;
  count: number;
}

function analyzeText(text: string): {
  keywords: KeywordResult[];
  bigrams: BigramResult[];
  totalWords: number;
  charCount: number;
} {
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, "");
  const words = cleanText.split(/\s+/).filter((w) => w.length > 1);
  const totalWords = words.length;

  // Single keywords
  const wordCounts: Record<string, number> = {};
  for (const word of words) {
    if (!STOP_WORDS.has(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  }

  const keywords: KeywordResult[] = Object.entries(wordCounts)
    .map(([word, count]) => ({
      word,
      count,
      density: totalWords > 0 ? (count / totalWords) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  // Bigrams (2-word phrases)
  const bigramCounts: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    if (!STOP_WORDS.has(words[i]) || !STOP_WORDS.has(words[i + 1])) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      bigramCounts[bigram] = (bigramCounts[bigram] || 0) + 1;
    }
  }

  const bigrams: BigramResult[] = Object.entries(bigramCounts)
    .filter(([, count]) => count >= 2)
    .map(([phrase, count]) => ({ phrase, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return { keywords, bigrams, totalWords, charCount: text.length };
}

export default function KeywordDensityPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [keywordField, setKeywordField] = useState("");
  const [description, setDescription] = useState("");
  const [store, setStore] = useState<"ios" | "android">("ios");
  const [analyzed, setAnalyzed] = useState(false);

  const allText = [title, subtitle, keywordField, description]
    .filter(Boolean)
    .join(" ");

  const analysis = useMemo(() => analyzeText(allText), [allText]);

  const handleAnalyze = () => setAnalyzed(true);

  const handleReset = () => {
    setTitle("");
    setSubtitle("");
    setKeywordField("");
    setDescription("");
    setAnalyzed(false);
  };

  const getDensityColor = (density: number) => {
    if (density > 5) return "text-red-500";
    if (density > 3) return "text-amber-500";
    return "text-emerald-500";
  };

  const getCharStatus = (current: number, limit: number) => {
    if (current === 0) return "text-muted-foreground";
    if (current > limit) return "text-red-500";
    if (current > limit * 0.9) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/tools"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Tools
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
            <Search className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Keyword Density Checker</h1>
            <p className="text-muted-foreground">
              Analyze your app metadata for keyword optimization opportunities
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="mt-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Free — No Login Required
        </Badge>
      </div>

      {/* Store Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={store === "ios" ? "default" : "outline"}
          size="sm"
          onClick={() => setStore("ios")}
          className={store === "ios" ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}
        >
          iOS (App Store)
        </Button>
        <Button
          variant={store === "android" ? "default" : "outline"}
          size="sm"
          onClick={() => setStore("android")}
          className={store === "android" ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}
        >
          Android (Google Play)
        </Button>
      </div>

      {/* Input Fields */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium">App Title</label>
              <span className={`text-xs ${getCharStatus(title.length, CHAR_LIMITS.title[store])}`}>
                {title.length}/{CHAR_LIMITS.title[store]}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meditation Timer - Mindfulness"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Subtitle / Short Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium">
                {store === "ios" ? "Subtitle" : "Short Description"}
              </label>
              <span
                className={`text-xs ${getCharStatus(
                  subtitle.length,
                  store === "ios" ? CHAR_LIMITS.subtitle.ios : CHAR_LIMITS.shortDescription.android
                )}`}
              >
                {subtitle.length}/
                {store === "ios" ? CHAR_LIMITS.subtitle.ios : CHAR_LIMITS.shortDescription.android}
              </span>
            </div>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={
                store === "ios"
                  ? "e.g. Guided sessions & sleep sounds"
                  : "e.g. Guided meditation, sleep sounds, breathing exercises for stress relief"
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* iOS Keyword Field */}
          {store === "ios" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">Keyword Field</label>
                <span className={`text-xs ${getCharStatus(keywordField.length, CHAR_LIMITS.keywordField.ios)}`}>
                  {keywordField.length}/{CHAR_LIMITS.keywordField.ios}
                </span>
              </div>
              <input
                type="text"
                value={keywordField}
                onChange={(e) => setKeywordField(e.target.value)}
                placeholder="e.g. relax,calm,breathe,anxiety,sleep,focus,zen,yoga"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Separate with commas, no spaces. Don&apos;t repeat words from title/subtitle.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium">Description</label>
              <span
                className={`text-xs ${getCharStatus(
                  description.length,
                  store === "ios" ? CHAR_LIMITS.description.ios : CHAR_LIMITS.description.android
                )}`}
              >
                {description.length}/
                {store === "ios" ? CHAR_LIMITS.description.ios : CHAR_LIMITS.description.android}
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              placeholder="Paste your app description here..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={!allText.trim()}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analyze Keywords
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {analyzed && analysis.totalWords > 0 ? (
            <>
              {/* Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {analysis.totalWords}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Words</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {analysis.charCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Characters</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {analysis.keywords.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Unique Keywords</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {analysis.bigrams.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Repeated Phrases</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Character Limit Checks */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Character Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Title", value: title, limit: CHAR_LIMITS.title[store] },
                    {
                      label: store === "ios" ? "Subtitle" : "Short Description",
                      value: subtitle,
                      limit: store === "ios" ? CHAR_LIMITS.subtitle.ios : CHAR_LIMITS.shortDescription.android,
                    },
                    ...(store === "ios"
                      ? [{ label: "Keyword Field", value: keywordField, limit: CHAR_LIMITS.keywordField.ios }]
                      : []),
                  ].map((field) => (
                    <div key={field.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {field.value.length === 0 ? (
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        ) : field.value.length <= field.limit ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        {field.label}
                      </span>
                      <span className={getCharStatus(field.value.length, field.limit)}>
                        {field.value.length}/{field.limit}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Keywords */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Top Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {analysis.keywords.slice(0, 20).map((kw) => (
                      <div key={kw.word} className="flex items-center justify-between text-sm">
                        <span className="font-mono">{kw.word}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">{kw.count}x</span>
                          <span className={`w-16 text-right ${getDensityColor(kw.density)}`}>
                            {kw.density.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bigrams */}
              {analysis.bigrams.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Repeated Phrases (2-word)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      {analysis.bigrams.map((bg) => (
                        <div key={bg.phrase} className="flex items-center justify-between text-sm">
                          <span className="font-mono">{bg.phrase}</span>
                          <span className="text-muted-foreground">{bg.count}x</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tips */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {title.length === 0 && (
                    <p className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      Add your app title — it&apos;s the most important ranking factor.
                    </p>
                  )}
                  {store === "ios" && keywordField.length === 0 && (
                    <p className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      Fill your iOS keyword field — use all 100 characters for maximum visibility.
                    </p>
                  )}
                  {store === "ios" && keywordField.includes(" ,") && (
                    <p className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      Remove spaces after commas in your keyword field to save characters.
                    </p>
                  )}
                  {analysis.keywords.some((k) => k.density > 5) && (
                    <p className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      Some keywords have high density (&gt;5%). This may look like keyword stuffing.
                    </p>
                  )}
                  {description.length > 0 && description.length < 500 && (
                    <p className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      Your description is short. Aim for 1000+ characters for better optimization.
                    </p>
                  )}
                  {analysis.keywords.length > 0 && !analysis.keywords.some((k) => k.density > 5) && title.length > 0 && (
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      Keyword density looks healthy. No signs of keyword stuffing.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <div>
                <Search className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="mt-4 font-medium">Paste your app metadata</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your title, subtitle, keywords, and description to see the analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
