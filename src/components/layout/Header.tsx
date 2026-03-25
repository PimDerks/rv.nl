"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Navigation } from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Header(): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" aria-label="Robby Valentine — home">
            <Image
              src="/images/logo.svg"
              alt="Robby Valentine"
              width={120}
              height={60}
              className="h-8 w-auto md:h-10 transition-all duration-300"
              priority
            />
          </Link>

          {/* Right side: theme toggle + hamburger */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              className="flex items-center justify-center p-1 text-foreground transition-colors hover:text-heading"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              data-testid="menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen navigation overlay */}
      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
