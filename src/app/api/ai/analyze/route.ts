import Anthropic from "@anthropic-ai/sdk";
import { getMasterPrompt, isValidToolId } from "@/lib/prompts";
import { headers } from "next/headers";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
      JSON.stringify({ error: "AI analysis is not configured. Please add ANTHROPIC_API_KEY." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const systemPrompt = getMasterPrompt(tool);
  const userMessage = buildUserMessage(tool, data);

  // Stream the response
  // Increment usage before streaming (count the attempt)
  usageMap.set(usageKey, currentUsage + 1);

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
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

function buildUserMessage(tool: string, data: Record<string, unknown>): string {
  switch (tool) {
    case "listing-analyzer":
      return `Please analyze this app listing and provide your expert recommendations:

**Platform:** ${data.platform || "iOS"}
**App Title:** ${data.title || "Not provided"} (${String(data.title || "").length} chars)
**Subtitle/Short Description:** ${data.subtitle || "Not provided"} (${String(data.subtitle || "").length} chars)
**Keyword Field (iOS):** ${data.keywords || "Not provided"} (${String(data.keywords || "").length} chars)
**Description:** ${data.description ? `${String(data.description).substring(0, 500)}... [${String(data.description).length} total chars]` : "Not provided"}
**Category:** ${data.category || "Not specified"}
**Rating:** ${data.rating || "N/A"} (${data.ratingCount || 0} ratings)
**ASO Score:** ${data.score || "N/A"}/100

Please provide your full analysis following the output format in your instructions.`;

    case "keyword-density":
      return `Please analyze this app metadata keyword optimization:

**Platform:** ${data.platform || "iOS"}
**Title:** ${data.title || ""}
**Subtitle:** ${data.subtitle || ""}
**Keywords Field:** ${data.keywords || ""}
**Description length:** ${data.descriptionLength || 0} characters
**Top keywords found:** ${JSON.stringify(data.topKeywords || [])}
**Bigrams found:** ${JSON.stringify(data.bigrams || [])}
**Character limits:** ${JSON.stringify(data.charLimits || {})}
**App category (if known):** ${data.category || "Not specified"}

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

**Platform:** ${data.platform || "iOS"}
**App Title:** ${data.title || ""} (${String(data.title || "").length} chars)
**Subtitle:** ${data.subtitle || ""} (${String(data.subtitle || "").length} chars)
**Keyword Field:** ${data.keywords || ""} (${String(data.keywords || "").length} chars)
**Description:** ${data.description ? `${String(data.description).substring(0, 600)}... [${String(data.description).length} total chars]` : "Not provided"}
**Category:** ${data.category || "Not specified"}
**Rating:** ${data.rating || "N/A"} avg (${data.ratingCount || 0} ratings)
**ASO Score:** ${data.score || "N/A"}/100
**Top Keywords:** ${JSON.stringify(data.topKeywords || [])}

Please provide your full ASO audit report.`;

    default:
      return `Please analyze the following data and provide actionable recommendations: ${JSON.stringify(data)}`;
  }
}
