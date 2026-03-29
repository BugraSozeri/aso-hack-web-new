"use client";

import { useState, useRef, useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { Sparkles, Loader2, AlertCircle, ChevronDown, ChevronUp, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ToolId } from "@/lib/prompts";

interface AIAnalysisPanelProps {
  toolId: ToolId;
  data: Record<string, unknown>;
  disabled?: boolean;
  disabledMessage?: string;
}

// ─── localStorage usage tracking ──────────────────────────────────────────────

const STORAGE_KEY = "aso_ai_usage";
const MONTHLY_FREE_LIMIT = 1;

type UsageStore = Record<string, number>; // { "2026-03": 2 }

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getUsageStore(): UsageStore {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function getMonthlyUsage(): number {
  return getUsageStore()[getMonthKey()] ?? 0;
}

function incrementUsage(): void {
  const store = getUsageStore();
  const key = getMonthKey();
  store[key] = (store[key] ?? 0) + 1;
  // Keep only last 2 months to avoid bloat
  const keys = Object.keys(store).sort();
  if (keys.length > 2) delete store[keys[0]];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderMarkdown(text: string): string {
  // Escape raw HTML first to prevent injection, then apply safe markdown transforms
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const html = escaped
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold mt-5 mb-2 first:mt-0">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-4 mb-1.5">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2 my-1"><span class="shrink-0 font-semibold text-amber-500 dark:text-amber-400">$1.</span><span>$2</span></div>')
    .replace(/^- (.+)$/gm, '<div class="flex gap-2 my-1"><span class="shrink-0 text-amber-500 dark:text-amber-400 mt-1">•</span><span>$1</span></div>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-xs font-mono">$1</code>')
    .replace(/^(?!<)(.+)$/gm, '<p class="my-1 leading-relaxed">$1</p>')
    .replace(/<p class="[^"]*"><\/p>/g, '')
    .replace(/^---$/gm, '<hr class="my-3 border-border" />');

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["h2", "h3", "strong", "code", "p", "div", "span", "hr"],
    ALLOWED_ATTR: ["class"],
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AIAnalysisPanel({
  toolId,
  data,
  disabled = false,
  disabledMessage = "Fill in the form above to enable AI analysis.",
}: AIAnalysisPanelProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "streaming" | "done" | "error" | "limit">("idle");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check limit on mount
  useEffect(() => {
    if (getMonthlyUsage() >= MONTHLY_FREE_LIMIT) {
      setStatus("limit");
    }
  }, []);

  useEffect(() => {
    if (status === "streaming" && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [content, status]);

  const analyze = async () => {
    // Double-check client-side limit
    if (getMonthlyUsage() >= MONTHLY_FREE_LIMIT) {
      setStatus("limit");
      return;
    }

    setStatus("loading");
    setContent("");
    setError("");

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: toolId, data }),
      });

      if (!response.ok) {
        const err = await response.json();
        if (err.error === "LIMIT_REACHED") {
          incrementUsage(); // sync local with server
          setStatus("limit");
          return;
        }
        throw new Error(err.error || "Analysis failed");
      }

      if (!response.body) throw new Error("No response body");

      // Mark usage before streaming starts
      incrementUsage();

      setStatus("streaming");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setContent((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  // ─── Limit reached UI ───────────────────────────────────────────────────────
  if (status === "limit") {
    return (
      <Card className="border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-950/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
              <Crown className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">AI Analysis</CardTitle>
              <CardDescription className="text-xs">Powered by Claude Sonnet</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Free limit reached for this month</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You&apos;ve used your 1 free AI analysis for {new Date().toLocaleString("en", { month: "long", year: "numeric" })}.
                Upgrade to Pro for unlimited analyses every month.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              "Unlimited AI analyses per month",
              "Claude Sonnet — most accurate model",
              "Priority processing speed",
              "All premium ASO tools",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 shrink-0 text-amber-500" />
                {f}
              </div>
            ))}
          </div>
          <Button
            className="w-full bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20"
            asChild
          >
            <Link href="/pricing">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro — $9/mo
            </Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Resets on the 1st of each month
          </p>
        </CardContent>
      </Card>
    );
  }

  // ─── Default UI ─────────────────────────────────────────────────────────────
  return (
    <Card className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">AI Analysis</CardTitle>
              <CardDescription className="text-xs">Powered by Claude Sonnet · 1 free / month</CardDescription>
            </div>
          </div>
          {(status === "done" || status === "streaming") && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-md p-1 hover:bg-muted"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {status === "idle" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Get expert-level recommendations from Claude Sonnet. Analyzes your specific data
              and produces a prioritized action plan.
            </p>
            <Button
              onClick={analyze}
              disabled={disabled}
              className="w-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze with AI
            </Button>
            {disabled ? (
              <p className="text-center text-xs text-muted-foreground">{disabledMessage}</p>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                1 free analysis per month · <Link href="/pricing" className="underline underline-offset-2">Upgrade for unlimited</Link>
              </p>
            )}
          </div>
        )}

        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing with Claude Sonnet…
          </div>
        )}

        {(status === "streaming" || status === "done") && expanded && (
          <div ref={contentRef} className="space-y-1">
            <div
              className="prose-sm text-sm leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
            {status === "streaming" && (
              <span className="inline-block h-4 w-1 animate-pulse rounded-sm bg-amber-500" />
            )}
          </div>
        )}

        {status === "done" && (
          <div className="mt-4 border-t pt-3 space-y-2">
            <p className="text-center text-xs text-muted-foreground">
              Free limit used · <Link href="/pricing" className="underline underline-offset-2 text-amber-500">Upgrade for unlimited</Link>
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Analysis failed</p>
                <p className="mt-1 text-xs text-red-600 dark:text-red-500">{error}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={analyze} className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
