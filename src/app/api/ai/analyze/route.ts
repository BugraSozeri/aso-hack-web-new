import Anthropic from "@anthropic-ai/sdk";
import { getMasterPrompt, isValidToolId } from "@/lib/prompts";
import { headers } from "next/headers";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Sanitize user-supplied strings before interpolating into prompts
function s(value: unknown, maxLen = 500): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "").slice(0, maxLen);
}

// In-memory monthly rate limiter: key = "ip:YYYY-MM", value = usage count
// Resets automatically as months change; cleared on server restart (acceptable for now)
const usageMap = new Map<string, number>();
const MONTHLY_LIMIT = 1;

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function POST(request: Request) {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  const usageKey = `${ip}:${getMonthKey()}`;
  const currentUsage = usageMap.get(usageKey) ?? 0;

  if (currentUsage >= MONTHLY_LIMIT) {
    return new Response(
      JSON.stringify({
        error: "LIMIT_REACHED",
        message: "You have used your free AI analysis for this month. Upgrade to Pro for unlimited analyses.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.json();
  const { tool, data } = body as { tool: string; data: Record<string, unknown> };

  if (!tool || !isValidToolId(tool)) {
    return new Response(JSON.stringify({ error: "Invalid tool ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Service temporarily unavailable." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const systemPrompt = getMasterPrompt(tool);
  const userContent = buildUserContent(tool, data);

  // Stream the response
  // Increment usage before streaming (count the attempt)
  usageMap.set(usageKey, currentUsage + 1);

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

import type { MessageParam } from "@anthropic-ai/sdk/resources/messages.js";
type UserContent = MessageParam["content"];

function buildUserContent(tool: string, data: Record<string, unknown>): UserContent {
  if (tool === "screenshot-lab") {
    const images = (data.images as Array<{ base64: string; mediaType: string }> | undefined) ?? [];
    const imageBlocks = images.slice(0, 6).map((img) => ({
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: img.mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
        data: img.base64,
      },
    }));

    const textBlock = {
      type: "text" as const,
      text: `Please analyze these ${images.length} app screenshot(s) and provide your expert creative direction:

**App Name:** ${data.appName || "Not provided"}
**Platform:** ${data.platform === "android" ? "Google Play" : "iOS App Store"}
**Category:** ${data.category || "Not specified"}
**Number of screenshots:** ${images.length}

Please provide your full screenshot analysis following the output format in your instructions.`,
    };

    return [...imageBlocks, textBlock];
  }

  return buildUserMessage(tool, data);
}

function buildUserMessage(tool: string, data: Record<string, unknown>): string {
  switch (tool) {
    case "listing-analyzer":
      return `Please analyze this app listing and provide your expert recommendations:

**Platform:** ${s(data.platform) || "iOS"}
**App Title:** ${s(data.title) || "Not provided"} (${s(data.title).length} chars)
**Subtitle/Short Description:** ${s(data.subtitle) || "Not provided"} (${s(data.subtitle).length} chars)
**Keyword Field (iOS):** ${s(data.keywords) || "Not provided"} (${s(data.keywords).length} chars)
**Description:** ${data.description ? `${s(data.description, 500)}... [${s(data.description, 5000).length} total chars]` : "Not provided"}
**Category:** ${s(data.category) || "Not specified"}
**Rating:** ${s(data.rating) || "N/A"} (${s(data.ratingCount) || 0} ratings)
**ASO Score:** ${s(data.score) || "N/A"}/100

Please provide your full analysis following the output format in your instructions.`;

    case "keyword-density":
      return `Please analyze this app metadata keyword optimization:

**Platform:** ${s(data.platform) || "iOS"}
**Title:** ${s(data.title)}
**Subtitle:** ${s(data.subtitle)}
**Keywords Field:** ${s(data.keywords)}
**Description length:** ${Number(data.descriptionLength) || 0} characters
**Top keywords found:** ${JSON.stringify(data.topKeywords || [])}
**Bigrams found:** ${JSON.stringify(data.bigrams || [])}
**Character limits:** ${JSON.stringify(data.charLimits || {})}
**App category (if known):** ${s(data.category) || "Not specified"}

Please provide your keyword optimization recommendations.`;

    case "ad-analytics":
      return `Please analyze this mobile app ad campaign performance:

**Platform:** ${data.platform || "iOS/Android"}
**Ad Network:** ${data.adNetwork || "Not specified"}
**Ad Spend:** $${data.adSpend || 0}
**Impressions:** ${data.impressions || 0}
**Clicks:** ${data.clicks || 0}
**Installs:** ${data.installs || 0}
**Trial Starts:** ${data.trialStarts || 0}
**Subscriptions:** ${data.subscriptions || 0}
**Revenue per Sub/Month:** $${data.revenuePerSub || 0}
**Avg Subscription Length:** ${data.avgSubMonths || 0} months

**Calculated Metrics:**
- CTR: ${data.ctr || 0}%
- CVR (click→install): ${data.cvr || 0}%
- Install→Trial Rate: ${data.itr || 0}%
- Trial→Subscription Rate: ${data.tsr || 0}%
- CPI: $${data.cpi || 0}
- CPA (cost per sub): $${data.cpa || 0}
- LTV: $${data.ltv || 0}
- ROAS: ${data.roas || 0}x
- Total Revenue: $${data.totalRevenue || 0}
- Profit/Loss: $${data.profit || 0}

Please provide your mobile growth strategy recommendations.`;

    case "aso-audit":
      return `Please conduct a comprehensive ASO audit for this app:

**Platform:** ${s(data.platform) || "iOS"}
**App Title:** ${s(data.title)} (${s(data.title).length} chars)
**Subtitle:** ${s(data.subtitle)} (${s(data.subtitle).length} chars)
**Keyword Field:** ${s(data.keywords)} (${s(data.keywords).length} chars)
**Description:** ${data.description ? `${s(data.description, 600)}... [${s(data.description, 5000).length} total chars]` : "Not provided"}
**Category:** ${s(data.category) || "Not specified"}
**Rating:** ${s(data.rating) || "N/A"} avg (${Number(data.ratingCount) || 0} ratings)
**ASO Score:** ${s(data.score) || "N/A"}/100
**Top Keywords:** ${JSON.stringify(data.topKeywords || [])}

Please provide your full ASO audit report.`;

    case "ad-benchmark":
      return `Please analyze this app's ad performance against category benchmarks and provide a strategy to reach top-quartile performance:

**App Category:** ${data.category || "Not specified"}
**Platform:** ${data.platform || "iOS"}

**User's Metrics:**
- CPI (Cost Per Install): ${data.cpi ? `$${data.cpi}` : "Not provided"}
- CTR (Click-Through Rate): ${data.ctr ? `${data.ctr}%` : "Not provided"}
- CVR (Click → Install): ${data.cvr ? `${data.cvr}%` : "Not provided"}
- LTV (30-day): ${data.ltv30 ? `$${data.ltv30}` : "Not provided"}
- ROAS (30-day): ${data.roas30 ? `${data.roas30}x` : "Not provided"}
- Install → Trial Rate: ${data.trialRate ? `${data.trialRate}%` : "N/A"}
- Trial → Subscription Rate: ${data.subRate ? `${data.subRate}%` : "N/A"}

**Category Benchmarks (${data.platform === "ios" ? "iOS" : "Android"}, P25 / Median / Top 25%):**
${JSON.stringify(data.benchmarks || {}, null, 2)}

**Top Ad Networks for this category:** ${JSON.stringify(data.bestNetworks || [])}
**Category Insight:** ${data.categoryTip || ""}

Please provide your full benchmark analysis and strategy following the output format in your instructions.`;

    case "competitor-tracker": {
      const competitors = (data.competitors as Array<Record<string, string>> | undefined) ?? [];
      const competitorText = competitors
        .filter((c) => c.name)
        .slice(0, 5)
        .map((c, i) => `
Competitor ${i + 1}: ${s(c.name)}
- Rating: ${s(c.rating) || "N/A"} (${s(c.reviewCount) || "N/A"} reviews)
- Title/Keywords: ${s(c.titleKeywords) || "N/A"}
- Key Features / Notes: ${s(c.notes, 200) || "N/A"}`)
        .join("\n");

      return `Please analyze this competitive landscape and provide strategic recommendations:

**My App:**
- Name: ${s(data.appName) || "Not provided"}
- Category: ${s(data.category) || "Not specified"}
- Platform: ${s(data.platform) === "android" ? "Google Play" : "iOS App Store"}
- Rating: ${s(data.myRating) || "N/A"} (${s(data.myReviewCount) || "N/A"} reviews)
- Title/Keywords in listing: ${s(data.myTitleKeywords) || "N/A"}
- Key differentiators / features: ${s(data.myNotes, 300) || "N/A"}

**Competitors (${competitors.filter((c) => c.name).length}):**
${competitorText || "No competitors provided"}

Please provide your full competitive intelligence report following the output format in your instructions.`;
    }

    case "keyword-explorer":
      return `Please research keywords for this app and provide comprehensive keyword opportunities:

**Seed Keyword:** ${s(data.seedKeyword) || "Not provided"}
**App Category:** ${s(data.category) || "Not specified"}
**Platform:** ${s(data.platform) === "android" ? "Google Play" : "iOS App Store"}
**App Name:** ${s(data.appName) || "Not provided"}
**App Description / Context:** ${s(data.appContext, 400) || "Not provided"}
**Current Title Keywords:** ${s(data.titleKeywords) || "Not provided"}
**Competitor Apps (if known):** ${s(data.competitors, 200) || "Not provided"}

Please provide your full keyword research report following the output format in your instructions.`;

    case "review-analyzer":
      return `Please analyze these app reviews and provide your expert recommendations:

**App Name:** ${s(data.appName) || "Not provided"}
**Platform:** ${s(data.platform) || "iOS"}
**Category:** ${s(data.category) || "Not specified"}
**Total Reviews Analyzed:** ${Number(data.reviewCount) || 0}
**Average Sentiment Score (client-side):** ${s(data.sentimentSummary) || "N/A"}
**Positive Reviews:** ${Number(data.positiveCount) || 0} (${Number(data.positivePercent) || 0}%)
**Neutral Reviews:** ${Number(data.neutralCount) || 0} (${Number(data.neutralPercent) || 0}%)
**Negative Reviews:** ${Number(data.negativeCount) || 0} (${Number(data.negativePercent) || 0}%)
**Top Words in Reviews:** ${JSON.stringify(data.topWords || [])}

**Full Review Text:**
${s(data.reviews, 6000) || "No reviews provided"}

Please provide your full review analysis report following the output format in your instructions.`;

    default:
      return `Please analyze the following data and provide actionable recommendations: ${JSON.stringify(data)}`;
  }
}
