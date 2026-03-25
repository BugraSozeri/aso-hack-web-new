import Link from "next/link";
import {
  Search,
  BarChart3,
  Star,
  Image as ImageIcon,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tools = [
  {
    name: "Keyword Density Checker",
    description: "Analyze your app metadata for keyword optimization opportunities.",
    icon: Search,
    href: "/tools/keyword-density",
    badge: "Free",
  },
  {
    name: "Listing Analyzer",
    description: "Get an instant ASO score for any App Store or Play Store listing.",
    icon: BarChart3,
    href: "/tools/listing-analyzer",
    badge: "Free",
  },
  {
    name: "Keyword Explorer",
    description: "Discover high-value keywords with search volume and difficulty scores.",
    icon: TrendingUp,
    href: "/tools/keyword-explorer",
    badge: "Pro",
  },
  {
    name: "Review Analyzer",
    description: "Understand user sentiment and extract actionable insights from reviews.",
    icon: Star,
    href: "/tools/review-analyzer",
    badge: "Free",
  },
  {
    name: "Screenshot Lab",
    description: "Get AI-powered feedback to optimize your app store screenshots.",
    icon: ImageIcon,
    href: "/tools/screenshot-lab",
    badge: "Pro",
  },
  {
    name: "Competitor Tracker",
    description: "Monitor competitor rankings, ratings, and keyword strategies.",
    icon: Users,
    href: "/tools/competitor-tracker",
    badge: "Pro",
  },
];

const stats = [
  { label: "Cheaper than enterprise tools", value: "1000x" },
  { label: "Starting price", value: "$9/mo" },
  { label: "Free tools included", value: "3+" },
  { label: "Stores supported", value: "iOS & Android" },
];

const benefits = [
  {
    icon: Zap,
    title: "Built for Indie Devs",
    description: "No enterprise pricing, no complexity. Just the ASO tools you need at a price you can afford.",
  },
  {
    icon: Shield,
    title: "Data You Can Trust",
    description: "Real-time data from App Store and Google Play. Actionable insights, not vanity metrics.",
  },
  {
    icon: Rocket,
    title: "Grow Faster",
    description: "From keyword research to competitor tracking — everything to boost your organic installs.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent dark:from-indigo-950/30" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              App Store Optimization for Indie Developers
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Rank Higher.{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Grow Faster.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Enterprise-grade ASO tools at indie-dev prices. Research keywords, analyze
              listings, track competitors, and optimize your app store presence — starting
              free.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                <Link href="/tools/keyword-density">
                  Try Free Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Indie Developers Choose ASOHack
            </h2>
            <p className="mt-4 text-muted-foreground">
              Stop overpaying for ASO tools. Get everything you need to compete with the big players.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
                  <benefit.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Powerful ASO Tools</h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to optimize your app store presence, all in one place.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.name} href={tool.href}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950">
                        <tool.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <Badge
                        variant={tool.badge === "Free" ? "secondary" : "default"}
                        className={
                          tool.badge === "Pro"
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : ""
                        }
                      >
                        {tool.badge}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg">{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link href="/tools">
                View All Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Simple, Indie-Friendly Pricing</h2>
            <p className="mt-4 text-muted-foreground">
              Start free. Upgrade when you&apos;re ready. No surprises.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for getting started",
                features: [
                  "Keyword Density Checker",
                  "3 Listing Analyses/day",
                  "1 ASO Audit/month",
                  "Basic Review Analysis",
                ],
              },
              {
                name: "Starter",
                price: "$9",
                period: "/mo",
                description: "For serious indie developers",
                popular: true,
                features: [
                  "Everything in Free",
                  "50 Keyword Searches/day",
                  "10 ASO Audits/month",
                  "Track 3 apps + 5 competitors",
                  "CSV Export",
                ],
              },
              {
                name: "Pro",
                price: "$29",
                period: "/mo",
                description: "For growing apps & teams",
                features: [
                  "Everything in Starter",
                  "Unlimited everything",
                  "Track 10 apps + 20 competitors",
                  "Screenshot Lab",
                  "API Access",
                  "Priority Support",
                ],
              },
            ].map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-indigo-600 shadow-lg dark:border-indigo-400" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-6 w-full ${plan.popular ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/pricing">
                      {plan.price === "$0" ? "Get Started" : "Start Free Trial"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-indigo-600 dark:bg-indigo-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to Boost Your App Store Rankings?
            </h2>
            <p className="mt-4 text-indigo-100">
              Join thousands of indie developers using ASOHack to grow their apps organically.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50"
                asChild
              >
                <Link href="/tools/keyword-density">
                  Try Free Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/blog">Read the Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
