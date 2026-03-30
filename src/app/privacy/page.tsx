import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ASOHack Privacy Policy — how we collect, use, and protect your data.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 30, 2026</p>

      <div className="mt-10 space-y-8 text-muted-foreground leading-7">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
          <p>
            ASOHack (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates asohack.com. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit our website or use
            our tools. Please read this policy carefully. If you disagree with its terms, please
            discontinue use of the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
          <p className="mb-3">We may collect information about you in the following ways:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong className="text-foreground">Usage Data:</strong> Pages visited, time spent on
              pages, browser type, referring URLs, and other standard web analytics data collected
              automatically.
            </li>
            <li>
              <strong className="text-foreground">Tool Inputs:</strong> When you use our ASO tools,
              the data you enter (app names, metadata, screenshots) is processed to generate analysis
              results. We do not permanently store tool input data.
            </li>
            <li>
              <strong className="text-foreground">Account Data:</strong> If you create an account,
              we collect your email address and profile information you provide.
            </li>
            <li>
              <strong className="text-foreground">Cookies:</strong> We use cookies and similar
              tracking technologies to improve your experience and analyze site traffic.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>To provide and improve our services and tools</li>
            <li>To analyze usage patterns and optimize user experience</li>
            <li>To send transactional emails (account confirmations, billing receipts)</li>
            <li>To send newsletters and product updates, if you have opted in</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Advertising</h2>
          <p>
            We use Google AdSense to display advertisements on our website. Google AdSense uses
            cookies to serve ads based on your prior visits to our website or other websites.
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based on
            your visit to our site and/or other sites on the Internet.
          </p>
          <p className="mt-3">
            You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 underline underline-offset-4 hover:text-amber-400"
            >
              Google Ads Settings
            </a>
            . For more information on how Google uses data from sites that use its advertising
            services, visit{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 underline underline-offset-4 hover:text-amber-400"
            >
              Google&apos;s Privacy &amp; Terms
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Services</h2>
          <p>We use the following third-party services that may collect data:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>
              <strong className="text-foreground">Google Analytics:</strong> Website traffic
              analytics. Data is anonymized and subject to{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 underline underline-offset-4 hover:text-amber-400"
              >
                Google&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-foreground">Google AdSense:</strong> Advertising delivery.
              Subject to Google&apos;s advertising policies and privacy terms.
            </li>
            <li>
              <strong className="text-foreground">Vercel:</strong> Hosting and analytics. Subject to{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 underline underline-offset-4 hover:text-amber-400"
              >
                Vercel&apos;s Privacy Policy
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies</h2>
          <p>
            We use essential cookies for site functionality, analytics cookies to understand usage
            patterns, and advertising cookies served by Google AdSense. You can control cookie
            preferences through your browser settings. Disabling cookies may affect the functionality
            of some features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Retention</h2>
          <p>
            Analytics data is retained for up to 26 months as per Google Analytics default settings.
            Account data is retained for as long as your account is active. Tool input data is not
            permanently stored — it is processed in real time and discarded.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Withdraw consent for optional data processing</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:privacy@asohack.com"
              className="text-amber-500 underline underline-offset-4 hover:text-amber-400"
            >
              privacy@asohack.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">9. Children&apos;s Privacy</h2>
          <p>
            ASOHack is not directed at children under 13 years of age. We do not knowingly collect
            personal information from children under 13. If you believe we have inadvertently
            collected such information, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by updating the &quot;Last updated&quot; date at the top of this page. Your continued use
            of the site after changes are posted constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a
              href="mailto:privacy@asohack.com"
              className="text-amber-500 underline underline-offset-4 hover:text-amber-400"
            >
              privacy@asohack.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 border-t pt-8">
        <Link href="/" className="text-sm text-amber-500 hover:text-amber-400 underline underline-offset-4">
          ← Back to ASOHack
        </Link>
      </div>
    </div>
  );
}
