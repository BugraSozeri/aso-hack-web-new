"use client";

import { useState, useCallback, useRef } from "react";
import { Camera, Upload, X, ImageIcon, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIAnalysisPanel } from "@/components/tools/ai-analysis-panel";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScreenshotFile = {
  id: string;
  name: string;
  preview: string;
  base64: string;
  mediaType: string;
  sizeKB: number;
};

const CATEGORIES = [
  "Games", "Entertainment", "Education", "Photo & Video", "Utilities",
  "Social Networking", "Health & Fitness", "Lifestyle", "Music", "Productivity",
  "Finance", "Travel", "News", "Food & Drink", "Shopping", "Sports",
  "Navigation", "Books", "Business", "Medical",
];

const MAX_SCREENSHOTS = 6;
const MAX_SIZE_MB = 4;

// ─── Compress image to base64 ─────────────────────────────────────────────────

async function compressToBase64(file: File): Promise<{ base64: string; mediaType: string; sizeKB: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX_W = 900;
      const scale = img.width > MAX_W ? MAX_W / img.width : 1;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      const base64 = dataUrl.split(",")[1];
      resolve({ base64, mediaType: "image/jpeg", sizeKB: Math.round((base64.length * 3) / 4 / 1024) });
    };
    img.onerror = reject;
    img.src = url;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScreenshotLabPage() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [category, setCategory] = useState("");
  const [appName, setAppName] = useState("");
  const [screenshots, setScreenshots] = useState<ScreenshotFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError("");
    setUploading(true);

    const remaining = MAX_SCREENSHOTS - screenshots.length;
    const toProcess = Array.from(files).slice(0, remaining);

    const results: ScreenshotFile[] = [];
    for (const file of toProcess) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`${file.name} is too large (max ${MAX_SIZE_MB}MB)`);
        continue;
      }
      try {
        const { base64, mediaType, sizeKB } = await compressToBase64(file);
        results.push({
          id: crypto.randomUUID(),
          name: file.name,
          preview: `data:${mediaType};base64,${base64}`,
          base64,
          mediaType,
          sizeKB,
        });
      } catch {
        setUploadError(`Failed to process ${file.name}`);
      }
    }

    setScreenshots((prev) => [...prev, ...results]);
    setUploading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenshots.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const remove = (id: string) => setScreenshots((prev) => prev.filter((s) => s.id !== id));

  const hasEnoughData = screenshots.length >= 1 && appName.trim().length > 0;

  const aiData = {
    platform,
    category,
    appName,
    images: screenshots.map(({ base64, mediaType }) => ({ base64, mediaType })),
  };

  const totalKB = screenshots.reduce((acc, s) => acc + s.sizeKB, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">Free Tool</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Screenshot Lab</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Upload your App Store screenshots and get AI-powered creative direction.
          Find out exactly what&apos;s hurting your conversion rate and how to fix it.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* ── Input ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* App Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">App Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
              <input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="App name *"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50"
              />
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

          {/* Upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Camera className="h-4 w-4 text-amber-500" />
                Screenshots
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  {screenshots.length}/{MAX_SCREENSHOTS}
                </span>
              </CardTitle>
              <CardDescription>
                PNG or JPG · max {MAX_SIZE_MB}MB each · up to {MAX_SCREENSHOTS} screenshots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {screenshots.length < MAX_SCREENSHOTS && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => inputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-amber-500 hover:bg-amber-500/5"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {uploading ? "Processing…" : "Drop screenshots here"}
                    </p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => processFiles(e.target.files)}
                  />
                </div>
              )}

              {uploadError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950/30">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                  <p className="text-xs text-red-600 dark:text-red-400">{uploadError}</p>
                </div>
              )}

              {screenshots.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {screenshots.map((s, idx) => (
                    <div key={s.id} className="group relative aspect-[9/19.5] overflow-hidden rounded-lg border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.preview} alt={`Screenshot ${idx + 1}`} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex flex-col justify-between p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <button
                          onClick={() => remove(s.id)}
                          className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <span className="text-[10px] text-white/80 text-center">{s.sizeKB}KB</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5 text-center text-[10px] text-white/80">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {screenshots.length > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Total: ~{totalKB}KB compressed · {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-dashed">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tips for best results</p>
              {[
                "Upload in display order (1st screenshot first)",
                "Include all screenshots from your store listing",
                "Use screenshots from the actual live listing",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2">
                  <ImageIcon className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                  <span className="text-xs text-muted-foreground">{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Preview + AI ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search result preview */}
          {screenshots.length > 0 ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Search Result Preview</CardTitle>
                <CardDescription>How the first 3 screenshots appear in search (approximate)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {screenshots.slice(0, 3).map((s, idx) => (
                    <div
                      key={s.id}
                      className={`shrink-0 overflow-hidden border bg-muted ${
                        idx === 0 ? "w-[140px] h-[248px] rounded-[12px]" : "w-[120px] h-[212px] rounded-[10px]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.preview} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  {screenshots.length < 3 && (
                    <div className="flex shrink-0 w-[120px] h-[212px] items-center justify-center rounded-[10px] border border-dashed text-xs text-muted-foreground">
                      +more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 text-center text-muted-foreground">
              <Camera className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Upload screenshots to see a preview</p>
            </div>
          )}

          {/* AI Panel */}
          <AIAnalysisPanel
            toolId="screenshot-lab"
            data={aiData}
            disabled={!hasEnoughData}
            disabledMessage="Enter your app name and upload at least 1 screenshot to enable AI analysis."
          />
        </div>
      </div>
    </div>
  );
}
