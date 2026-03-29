/**
 * One-time: generate 5 trending blog posts based on real search data
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../src/content/blog");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const dateStr = "2026-03-28"; // backfill for missed day

const POSTS = [
  {
    category: "ASO Fundamentals",
    topic: "Your App Title Is Your #1 Ranking Signal — How to Rewrite It Without Losing Brand Identity",
    slug: "app-title-ranking-signal-rewrite-strategy",
    context: "Appfigures reports 557K new App Store submissions in 2025. The #1 most asked beginner question is about keyword placement priority. Apple and Google both weight title keywords highest. Developers want to know: how do I add keywords to my title without making it look spammy or losing my brand?",
  },
  {
    category: "Growth Hacks",
    topic: "The TikTok-to-App-Store Funnel: How Indie Apps Are Getting 100K+ Downloads Without Paying for UA",
    slug: "tiktok-app-store-funnel-organic-downloads",
    context: "Post-ATT era with 25-35% opt-in rates has made paid attribution harder. Short-form UGC is the breakout channel of 2025. Developers search for a concrete TikTok playbook, not generic social media advice. Include specific hooks, video formats, and link-in-bio strategies that convert viewers to installs.",
  },
  {
    category: "Ad Fundamentals",
    topic: "Apple Ads in 2025: Basic vs. Advanced — Which One Should Indie Developers Start With?",
    slug: "apple-ads-basic-vs-advanced-indie-developers-2025",
    context: "Apple rebranded Search Ads to Apple Ads in April 2025 and added new placements. Every beginner campaign guide is now outdated. SplitMetrics and AppSamurai flag Basic vs Advanced as the #1 beginner confusion point. Include: budget thresholds, control differences, automation tradeoffs, and a decision framework.",
  },
  {
    category: "Ad Networks",
    topic: "Apple Ads vs. Google App Campaigns vs. Meta: Which Wins for Subscription Apps in 2025?",
    slug: "apple-ads-google-meta-comparison-subscription-apps-2025",
    context: "ShyftUp and Watsspace confirm this three-way comparison is the most-searched ad network question. iOS users have higher LTV; Android has lower CPI. Include real CPI/ROAS benchmarks per network, best use cases, and a recommendation matrix by app type and budget size.",
  },
  {
    category: "Paywall & Pricing",
    topic: "The 7-Day Trial Is Winning: What 2025 Paywall Data Says About Trial Length and Conversion",
    slug: "7-day-trial-paywall-conversion-data-2025",
    context: "Superwall research: 7-day trials peak at 5.2% conversion; longer trials see diminishing returns. RevenueCat App Growth Annual 2025 lists paywall timing as the top question. Apps running A/B tests achieve up to 100x more revenue (Adapty). Include data tables comparing 3/7/14/30-day trials, hard vs soft paywall, and placement timing.",
  },
];

const SYSTEM_PROMPT = `You are an expert ASO and mobile growth content writer. You write data-driven, SEO-optimized articles for indie app developers that rank on Google and get cited by AI systems.

Writing principles:
- Hook with a specific stat or insight in the first sentence
- Use clear H2/H3 structure (## and ###)
- Include numbered lists and comparison tables for featured snippets
- Cite specific industry data (Superwall, RevenueCat, AppFollow, SplitMetrics, etc.)
- Write for developers — direct, no fluff, actionable
- Target 1,300-1,600 words
- End with a concrete next step CTA

Output ONLY valid MDX (frontmatter + content). No preamble.`;

async function generatePost(post) {
  const existing = fs.readdirSync(CONTENT_DIR).filter((f) => f.startsWith(post.slug.slice(0, 25)));
  if (existing.length > 0) {
    console.log(`  ⏭️  Skipping (exists): ${post.slug}`);
    return null;
  }

  console.log(`  🤖 Generating: ${post.topic.slice(0, 60)}...`);

  const userPrompt = `Write a data-driven blog post for indie app developers on this topic:

**Title:** "${post.topic}"
**Category:** ${post.category}
**Research context (use these data points):** ${post.context}

Frontmatter (start with ---):
---
title: "${post.topic}"
description: "150-160 char meta description with primary keyword"
category: "${post.category}"
date: "${dateStr}"
author: "ASOHack Team"
published: true
---

Write the full MDX content. No \`\`\` wrappers — raw markdown only.`;

  let content = "";
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2500,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
      content += chunk.delta.text;
      process.stdout.write(".");
    }
  }
  process.stdout.write("\n");

  if (!content.trim().startsWith("---")) {
    console.log(`  ⚠️  Malformed response, skipping`);
    return null;
  }

  // Sanitize MDX: escape bare < that aren't valid HTML/JSX tags
  content = content.replace(/<(?![a-zA-Z\/!])/g, "&lt;");

  const filepath = path.join(CONTENT_DIR, `${post.slug}.mdx`);
  fs.writeFileSync(filepath, content.trim() + "\n");
  console.log(`  ✅ Written: ${post.slug}.mdx`);
  return post.slug;
}

async function main() {
  console.log(`\n🚀 Generating 5 trending posts for ${dateStr}\n`);
  const results = [];
  for (const post of POSTS) {
    console.log(`\n📂 ${post.category}`);
    const result = await generatePost(post);
    if (result) results.push(result);
  }
  console.log(`\n✨ Done! Generated ${results.length}/5 posts.`);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
