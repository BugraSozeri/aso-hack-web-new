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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent dark:from-amber-950/30" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              App Store Optimization for Indie Developers
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Rank Higher.{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Grow Faster.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Enterprise-grade ASO tools at indie-dev prices. Research keywords, analyze
              listings, track competitors, and optimize your app store presence — starting
              free.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-xl bg-amber-500 px-8 text-base font-semibold text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600"
                asChild
              >
                <Link href="/tools/keyword-density">
                  Try Free Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-xl px-8 text-base" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-amber-500 dark:text-amber-400 sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Indie Developers Choose ASOHack
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop overpaying for ASO tools. Get everything you need to compete with the big players.
            </p>
          </div>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/50">
                  <benefit.icon className="h-7 w-7 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful ASO Tools</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to optimize your app store presence, all in one place.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.name} href={tool.href}>
                <Card className="group h-full border-border/50 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/50">
                        <tool.icon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                      </div>
                      <Badge
                        variant={tool.badge === "Free" ? "secondary" : "default"}
                        className={
                          tool.badge === "Pro"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : ""
                        }
                      >
                        {tool.badge}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-lg">{tool.name}</CardTitle>
                    <CardDescription className="leading-relaxed">{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" className="h-11 rounded-xl px-6" asChild>
              <Link href="/tools">
                View All Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Indie-Friendly Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free. Upgrade when you&apos;re ready. No surprises.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
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
                className={`relative flex flex-col ${plan.popular ? "border-amber-500 shadow-lg shadow-amber-500/10 dark:border-amber-400/50" : "border-border/50"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 px-3 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-3">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col pt-4">
                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-8 h-11 w-full rounded-xl ${plan.popular ? "bg-amber-500 font-semibold text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600" : ""}`}
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
      <section className="border-t">
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-950 dark:to-stone-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Boost Your App Store Rankings?
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Join thousands of indie developers using ASOHack to grow their apps organically.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-amber-600 shadow-lg hover:bg-amber-50"
                  asChild
                >
                  <Link href="/tools/keyword-density">
                    Try Free Tools <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-white/30 px-8 text-base text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/blog">Read the Blog</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
