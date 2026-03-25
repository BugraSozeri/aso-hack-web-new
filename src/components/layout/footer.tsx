import Link from "next/link";
import { Rocket } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Tools", href: "/tools" },
    { name: "Pricing", href: "/pricing" },
    { name: "Changelog", href: "/changelog" },
  ],
  Resources: [
    { name: "Blog", href: "/blog" },
    { name: "ASO Guide", href: "/blog/aso-guide-for-beginners" },
    { name: "Documentation", href: "/docs" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "mailto:hello@asohack.com" },
  ],
  Legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <span className="text-lg font-bold">
                ASO<span className="text-amber-500 dark:text-amber-400">Hack</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Affordable ASO tools built for indie developers. Rank higher, grow faster.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold">{category}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ASOHack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
