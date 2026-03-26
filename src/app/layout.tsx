import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ASOHack - App Store Optimization Tools for Indie Developers",
    template: "%s | ASOHack",
  },
  description:
    "Affordable ASO tools and guides to help indie developers rank higher on App Store and Google Play. Keyword research, listing analysis, competitor tracking, and more.",
  keywords: [
    "app store optimization",
    "aso tools",
    "keyword research",
    "app store ranking",
    "indie developer",
    "mobile app growth",
    "play store optimization",
  ],
  metadataBase: new URL("https://asohack.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://asohack.com",
    siteName: "ASOHack",
    title: "ASOHack - App Store Optimization Tools for Indie Developers",
    description:
      "Affordable ASO tools and guides to help indie developers rank higher on App Store and Google Play.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASOHack - ASO Tools for Indie Developers",
    description:
      "Affordable ASO tools and guides to help indie developers rank higher on App Store and Google Play.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head suppressHydrationWarning>
        {/* AdSense — raw tag so it appears in static HTML for Google's verification crawler */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7500177412741241"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N5GRSD9NMF"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-N5GRSD9NMF');
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
