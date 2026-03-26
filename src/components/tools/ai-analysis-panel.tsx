"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ToolId } from "@/lib/prompts";

interface AIAnalysisPanelProps {
  toolId: ToolId;
  data: Record<string, unknown>;
  disabled?: boolean;
  disabledMessage?: string;
}

function renderMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold mt-5 mb-2 first:mt-0">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-4 mb-1.5">$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Numbered lists
    .replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2 my-1"><span class="shrink-0 font-semibold text-amber-500 dark:text-amber-400">$1.</span><span>$2</span></div>')
    // Bullet lists
    .replace(/^- (.+)$/gm, '<div class="flex gap-2 my-1"><span class="shrink-0 text-amber-500 dark:text-amber-400 mt-1">•</span><span>$1</span></div>')
    // Inline code
    .replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-xs font-mono">$1</code>')
    // Paragraphs (lines with content that aren't already wrapped)
    .replace(/^(?!<)(.+)$/gm, '<p class="my-1 leading-relaxed">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="[^"]*"><\/p>/g, '')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-3 border-border" />');
}

export function AIAnalysisPanel({
  toolId,
  data,
  disabled = false,
  disabledMessage = "Fill in the form above to enable AI analysis.",
}: AIAnalysisPanelProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "streaming" | "done" | "error">("idle");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "streaming" && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [content, status]);

  const analyze = async () => {
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
        throw new Error(err.error || "Analysis failed");
      }

      if (!response.body) throw new Error("No response body");

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
              <CardDescription className="text-xs">Powered by Claude</CardDescription>
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
              Get personalized, expert-level recommendations powered by AI. Analyzes your specific
              data and gives you a prioritized action plan.
            </p>
            <Button
              onClick={analyze}
              disabled={disabled}
              className="w-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze with AI
            </Button>
            {disabled && (
              <p className="text-center text-xs text-muted-foreground">{disabledMessage}</p>
            )}
          </div>
        )}

        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing your data…
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
          <div className="mt-4 flex gap-2 border-t pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={analyze}
              className="flex-1"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Re-analyze
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Analysis failed</p>
                <p className="mt-1 text-xs text-red-600 dark:text-red-500">{error}</p>
                {error.includes("ANTHROPIC_API_KEY") && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add your API key to <code className="rounded bg-muted px-1 text-xs">.env.local</code> →
                    Get one at{" "}
                    <a
                      href="https://console.anthropic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      console.anthropic.com
                    </a>
                  </p>
                )}
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
