import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Rocket, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "ASOHack is on a mission to democratize App Store Optimization for indie developers. Enterprise-grade ASO tools at prices everyone can afford.",
};

const values = [
  {
    icon: Rocket,
    title: "Built for Builders",
    description:
      "We're indie developers ourselves. Every feature is designed for people who build apps, not manage portfolios of thousands.",
  },
  {
    icon: Target,
    title: "Actionable, Not Overwhelming",
    description:
      "We don't dump data on you. Every insight comes with a clear recommendation and priority level so you know exactly what to do next.",
  },
  {
    icon: Heart,
    title: "Affordable by Design",
    description:
      "ASO shouldn't be a luxury. Our pricing starts free and stays affordable, because growing your app shouldn't require a corporate budget.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          ASO Tools That{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Actually Help
          </span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          The app store optimization market is broken. Enterprise tools charge $25,000+ per
          year. Mid-tier tools start at $100/month. That&apos;s not built for someone shipping
          their first app from a coffee shop.
        </p>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          We started ASOHack because we needed it ourselves — and we think every indie developer
          deserves access to the same insights the big players use.
        </p>
      </div>

      {/* Mission */}
      <div className="mx-auto mt-20 max-w-3xl rounded-2xl border bg-muted/30 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Democratize App Store Optimization. Give every developer — solo or small team —
          the tools and knowledge to compete on merit, not budget.
        </p>
      </div>

      {/* Values */}
      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold">What We Believe</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-xl border p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950">
                <value.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What we offer */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-bold">What We Offer</h2>
        <div className="mt-8 space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Free ASO tools</strong> — keyword density
            checker, listing analyzer, and more. No credit card, no signup walls on our core
            tools.
          </p>
          <p>
            <strong className="text-foreground">In-depth educational content</strong> — guides,
            case studies, and tactical tips written by developers who&apos;ve been in the
            trenches.
          </p>
          <p>
            <strong className="text-foreground">Premium tools from $9/mo</strong> — keyword
            explorer, competitor tracking, AI screenshot analysis, and more. All at a fraction
            of what enterprise tools charge.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
        <p className="mt-4 text-muted-foreground">
          Try our free tools — no signup required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/tools">
              Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/blog">Read the Blog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
