import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 mb-6">
        <Rocket className="h-8 w-8 text-amber-500" />
      </div>
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight">Page not found</h2>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild className="rounded-lg">
          <Link href="/tools">
            <Search className="mr-2 h-4 w-4" />
            Explore Tools
          </Link>
        </Button>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <Link href="/blog" className="hover:text-amber-500 transition-colors">Blog</Link>
        <Link href="/pricing" className="hover:text-amber-500 transition-colors">Pricing</Link>
        <Link href="/about" className="hover:text-amber-500 transition-colors">About</Link>
        <Link href="/tools/keyword-density" className="hover:text-amber-500 transition-colors">Keyword Density</Link>
        <Link href="/tools/listing-analyzer" className="hover:text-amber-500 transition-colors">Listing Analyzer</Link>
      </div>
    </div>
  );
}
