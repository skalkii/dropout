"use client";

import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10">
        <a
          href="#top"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          aria-label="Dropout — top of essay"
        >
          <Logo size={24} />
        </a>

        <nav className="flex items-center gap-3" aria-label="Site">
          <a
            href="#act-1"
            className="hidden font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground sm:inline"
          >
            Read
          </a>
          <a
            href="https://github.com/skalkii/dropout"
            target="_blank"
            rel="noreferrer"
            className="hidden font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground md:inline"
          >
            Source
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
