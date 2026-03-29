/**
 * Daily Blog Post Generator
 *
 * Generates 5 blog posts per day (one per category), alternating between
 * SEO-focused and GEO-focused (Generative Engine Optimization) strategies.
 *
 * SEO days: structured long-form content with keyword-rich headings
 * GEO days: conversational, cited, and AI-answer-friendly content
 *
 * Usage: node scripts/generate-blog-posts.mjs
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../src/content/blog");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Alternates SEO / GEO based on day of year parity
const today = new Date();
const dayOfYear = Math.floor(
  (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
);
const mode = dayOfYear % 2 === 0 ? "SEO" : "GEO";
const dateStr = today.toISOString().split("T")[0];

console.log(`📅 Date: ${dateStr}  |  Mode: ${mode}-focused`);

const CATEGORIES = [
  {
    id: "aso-fundamentals",
    label: "ASO Fundamentals",
    topics: [
      "App Store algorithm ranking factors",
      "iOS vs Android metadata strategy differences",
      "Keyword research methods for app stores",
      "Ratings and review generation strategies",
      "App Store category selection strategy",
      "A/B testing app store listings",
      "Localization and international ASO",
      "ASO for subscription apps",
      "Core Web Vitals and app performance in rankings",
      "How screenshots affect conversion rates",
    ],
  },
  {
    id: "growth-hacks",
    label: "Growth Hacks",
    topics: [
      "Referral programs that drive app installs",
      "Viral loops for mobile apps",
      "Product Hunt launch strategy for apps",
      "Cross-promotion between apps",
      "Seasonal ASO strategies and keyword timing",
      "Featured app placement strategy",
      "In-app share mechanics that drive organic growth",
      "Building social proof for new apps",
      "Influencer campaigns for app installs",
      "Beta testing communities and early adopters",
    ],
  },
  {
    id: "ad-fundamentals",
    label: "Ad Fundamentals",
    topics: [
      "Mobile ad attribution models explained",
      "Understanding SKAN and privacy-first measurement",
      "LTV modeling for mobile apps",
      "Incrementality testing for app install campaigns",
      "Creative fatigue and refresh cycles",
      "Audience segmentation for app install ads",
      "Retargeting strategies for mobile apps",
      "In-app bidding vs waterfall monetization",
      "App install campaign budget pacing strategies",
      "Measuring true ROAS for subscription apps",
    ],
  },
  {
    id: "ad-networks",
    label: "Ad Networks",
    topics: [
      "Apple Search Ads Advanced vs Basic comparison",
      "Meta Advantage+ App Campaigns guide",
      "Google App Campaigns optimization tips",
      "TikTok for app installs: complete setup guide",
      "Unity Ads for non-gaming apps",
      "Ironsource vs Applovin MAX comparison",
      "Moloco vs Google UAC for scale",
      "Snapchat Ads for app user acquisition",
      "Reddit Ads for niche app promotion",
      "Choosing the right ad network mix for your app category",
    ],
  },
  {
    id: "paywall-pricing",
    label: "Paywall & Pricing",
    topics: [
      "Freemium vs free trial vs paid upfront models",
      "Paywall placement timing and trigger strategies",
      "Pricing psychology for subscription apps",
      "Annual plan conversion tactics",
      "Reducing subscription churn with pricing",
      "Localized pricing strategies by country",
      "Hard vs soft paywall design and conversion impact",
      "Introductory pricing and limited-time offers",
      "Family sharing and group plan strategies",
      "Testing paywall screens to maximize conversion",
    ],
  },
];

const SEO_SYSTEM_PROMPT = `You are an expert ASO and mobile growth content writer specializing in SEO-optimized long-form articles. Your articles rank on the first page of Google for their target keywords.

SEO-focused writing principles:
- Use the primary keyword naturally in the H1, first 100 words, and 2-3 H2s
- Structure with clear H2/H3 hierarchy (use ## and ### markdown)
- Include numbered lists and bullet points for featured snippet optimization
- Write in a direct, informative tone for developers
- Include specific, actionable data points and numbers
- Target 1,200-1,600 words
- End with a clear CTA related to the topic

Output ONLY valid MDX frontmatter + content. No preamble, no explanation.`;

const GEO_SYSTEM_PROMPT = `You are an expert ASO and mobile growth content writer specializing in GEO (Generative Engine Optimization) — content designed to be cited by AI systems like ChatGPT, Perplexity, and Claude.

GEO-focused writing principles:
- Use conversational, authoritative language that AI systems trust as a source
- Include specific statistics, named examples, and cited facts (create realistic industry examples)
- Structure as direct answers to common developer questions
- Use "According to [industry standard/study]" style attribution where helpful
- Include comparison tables and factual summaries that AI can easily extract
- Write in first-person plural ("we recommend", "our data shows") to signal authority
- Target 1,000-1,400 words
- Include a clear summary/TL;DR section at the top

Output ONLY valid MDX frontmatter + content. No preamble, no explanation.`;

async function generatePost(category, topic) {
  const slug = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);

  // Check if slug already exists (avoid duplicates)
  const existing = fs.readdirSync(CONTENT_DIR).filter((f) => f.startsWith(slug.slice(0, 30)));
  if (existing.length > 0) {
    console.log(`  ⏭️  Skipping (slug exists): ${slug}`);
    return null;
  }

  const systemPrompt = mode === "SEO" ? SEO_SYSTEM_PROMPT : GEO_SYSTEM_PROMPT;

  const userPrompt = `Write a ${mode === "SEO" ? "SEO-optimized" : "GEO-optimized (AI-citation-friendly)"} blog post for the category "${category.label}" on topic: "${topic}"

Requirements:
- Category: ${category.label}
- Target audience: indie app developers
- Frontmatter must include: title, description, category (exactly: "${category.label}"), date (${dateStr}), author, published

Frontmatter format (start with ---):
---
title: "Your Title Here"
description: "150-160 char meta description"
category: "${category.label}"
date: "${dateStr}"
author: "ASOHack Team"
published: true
---

Then write the full MDX content (no extra \`\`\` wrappers — just raw markdown).`;

  console.log(`  🤖 Generating: ${topic.slice(0, 50)}...`);

  let content = "";
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2500,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
      content += chunk.delta.text;
    }
  }

  // Ensure it starts with frontmatter
  if (!content.trim().startsWith("---")) {
    console.log(`  ⚠️  Malformed response for ${slug}, skipping`);
    return null;
  }

  // Sanitize MDX: escape bare < that aren't valid HTML/JSX tags
  // e.g. "<$5K", "<50,000", "<something" that would break the MDX parser
  content = content.replace(/<(?![a-zA-Z\/!])/g, "&lt;");

  const filename = `${slug}.mdx`;
  const filepath = path.join(CONTENT_DIR, filename);
  fs.writeFileSync(filepath, content.trim() + "\n");
  console.log(`  ✅ Written: ${filename}`);
  return filename;
}

async function pickTopic(category) {
  // Pick a topic that hasn't been used recently
  // Simple hash of date + category index to deterministically pick different topics each day
  const hash = (dateStr + category.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return category.topics[hash % category.topics.length];
}

async function main() {
  console.log(`\n🚀 Starting daily blog generation (${mode} mode)\n`);

  const results = [];

  for (const category of CATEGORIES) {
    const topic = await pickTopic(category);
    console.log(`\n📂 ${category.label}`);
    console.log(`   Topic: ${topic}`);
    const filename = await generatePost(category, topic);
    if (filename) results.push(filename);
  }

  console.log(`\n✨ Done! Generated ${results.length}/5 posts.`);
  if (results.length > 0) {
    console.log("New files:");
    results.forEach((f) => console.log(`  - src/content/blog/${f}`));
  }
}

main().catch((err) => {
  console.error("❌ Generation failed:", err);
  process.exit(1);
});
