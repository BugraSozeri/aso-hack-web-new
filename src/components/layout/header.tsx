"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Rocket, LayoutDashboard, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Tools", href: "/tools" },
  { name: "Ads", href: "/ads" },
  { name: "Blog", href: "/blog" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-amber-500 dark:text-amber-400" />
          <span className="text-xl font-bold tracking-tight">
            ASO<span className="text-amber-500 dark:text-amber-400">Hack</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing">Log in</Link>
          </Button>
          <Button size="sm" className="rounded-lg bg-amber-500 px-4 font-semibold text-white shadow-sm shadow-amber-500/25 hover:bg-amber-600" asChild>
            <Link href="/pricing">Get Started Free</Link>
          </Button>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
              A
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm text-foreground">My Account</span>
                  <span className="text-xs font-normal text-muted-foreground">Free Plan</span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/settings'}>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/pricing'}>
                  <User className="h-4 w-4 text-muted-foreground" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2 text-red-500 cursor-pointer" variant="destructive">
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="mt-8 flex flex-col gap-4">
                {/* Profile section in mobile menu */}
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-semibold">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold">My Account</p>
                    <p className="text-xs text-muted-foreground">Free Plan</p>
                  </div>
                </div>

                <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Settings className="h-4 w-4" /> Settings
                </Link>

                <div className="border-t pt-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/pricing" onClick={() => setOpen(false)}>Log in</Link>
                  </Button>
                  <Button className="rounded-lg bg-amber-500 font-semibold text-white shadow-sm shadow-amber-500/25 hover:bg-amber-600" asChild>
                    <Link href="/pricing" onClick={() => setOpen(false)}>Get Started Free</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
