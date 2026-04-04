import type { Metadata } from "next";
import Link from "next/link";
import { User, Bell, CreditCard, Shield, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your ASOHack account settings, notifications, and billing.",
};

const sections = [
  {
    icon: User,
    title: "Profile",
    description: "Update your name, email, and account details.",
    badge: null,
    action: "Edit Profile",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Choose which email updates and alerts you receive.",
    badge: null,
    action: "Manage",
  },
  {
    icon: CreditCard,
    title: "Billing & Plan",
    description: "View your current plan, usage, and payment history.",
    badge: "Free Plan",
    action: "Upgrade",
    actionHref: "/pricing",
    highlight: true,
  },
  {
    icon: Shield,
    title: "Security",
    description: "Manage your password and two-factor authentication.",
    badge: null,
    action: "Manage",
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account preferences and subscription.</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.title} className={section.highlight ? "border-amber-500/30 bg-amber-500/5" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${section.highlight ? "bg-amber-500/15" : "bg-muted"}`}>
                    <section.icon className={`h-4 w-4 ${section.highlight ? "text-amber-500" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {section.title}
                      {section.badge && (
                        <Badge variant="secondary" className="text-xs font-normal">{section.badge}</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-0.5">{section.description}</CardDescription>
                  </div>
                </div>
                <Button
                  variant={section.highlight ? "default" : "outline"}
                  size="sm"
                  className={`shrink-0 rounded-lg ${section.highlight ? "bg-amber-500 hover:bg-amber-600 text-white font-semibold" : ""}`}
                  asChild={!!section.actionHref}
                >
                  {section.actionHref ? (
                    <Link href={section.actionHref}>{section.action}</Link>
                  ) : (
                    <span>{section.action}</span>
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Danger zone */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Danger Zone</h2>
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently remove your account and all data. This cannot be undone.</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 rounded-lg border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
              Delete
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
