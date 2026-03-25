import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for indie developers. Start free, upgrade when you're ready. Plans from $9/mo.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    annual: "",
    description: "Get started with essential ASO tools",
    cta: "Get Started",
    popular: false,
    features: [
      { name: "Keyword Density Checker", included: true, detail: "Unlimited" },
      { name: "Listing Analyzer", included: true, detail: "3/day" },
      { name: "ASO Audit", included: true, detail: "1/month" },
      { name: "Review Analyzer", included: true, detail: "50 reviews" },
      { name: "Keyword Explorer", included: true, detail: "5/day" },
      { name: "Competitor Tracker", included: true, detail: "1 app + 2 competitors" },
      { name: "Screenshot Lab", included: false },
      { name: "CSV Export", included: false },
      { name: "API Access", included: false },
      { name: "Priority Support", included: false },
    ],
  },
  {
    name: "Starter",
    price: "$9",
    period: "/mo",
    annual: "$86/year (save 20%)",
    description: "For serious indie developers",
    cta: "Start Free Trial",
    popular: true,
    features: [
      { name: "Keyword Density Checker", included: true, detail: "Unlimited" },
      { name: "Listing Analyzer", included: true, detail: "20/day" },
      { name: "ASO Audit", included: true, detail: "10/month" },
      { name: "Review Analyzer", included: true, detail: "500 reviews" },
      { name: "Keyword Explorer", included: true, detail: "50/day" },
      { name: "Competitor Tracker", included: true, detail: "3 apps + 5 competitors" },
      { name: "Screenshot Lab", included: true, detail: "10/day" },
      { name: "CSV Export", included: true },
      { name: "API Access", included: false },
      { name: "Priority Support", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    annual: "$278/year (save 20%)",
    description: "For growing apps & teams",
    cta: "Start Free Trial",
    popular: false,
    features: [
      { name: "Keyword Density Checker", included: true, detail: "Unlimited" },
      { name: "Listing Analyzer", included: true, detail: "Unlimited" },
      { name: "ASO Audit", included: true, detail: "Unlimited" },
      { name: "Review Analyzer", included: true, detail: "Full history" },
      { name: "Keyword Explorer", included: true, detail: "Unlimited" },
      { name: "Competitor Tracker", included: true, detail: "10 apps + 20 competitors" },
      { name: "Screenshot Lab", included: true, detail: "Unlimited" },
      { name: "CSV Export", included: true },
      { name: "API Access", included: true },
      { name: "Priority Support", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Can I try before I buy?",
    a: "Absolutely! Start with our free tier — no credit card required. All our core tools are available for free with usage limits.",
  },
  {
    q: "Can I change plans anytime?",
    a: "Yes. Upgrade, downgrade, or cancel anytime. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes! Save 20% with annual billing. Starter is $86/year and Pro is $278/year.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards via Stripe. All payments are secure and encrypted.",
  },
  {
    q: "Is there an enterprise plan?",
    a: "Not yet — but if you need custom limits or features, reach out to hello@asohack.com and we'll work something out.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free, upgrade when you need more. Built for indie dev budgets.
        </p>
      </div>

      {/* Plans */}
      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.popular ? "border-amber-500 shadow-xl dark:border-amber-400" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-500 text-white">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-lg text-muted-foreground">{plan.period}</span>
                )}
              </div>
              {plan.annual && (
                <p className="mt-1 text-sm text-muted-foreground">{plan.annual}</p>
              )}
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground/60"}>
                      {feature.name}
                    </span>
                    {feature.detail && feature.included && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {feature.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 w-full ${
                  plan.popular
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                asChild
              >
                <Link href="/signup">{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-24 max-w-3xl">
        <h2 className="text-center text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="mt-10 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-lg border p-6">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
