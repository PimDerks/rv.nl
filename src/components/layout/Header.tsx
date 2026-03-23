import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Navigation } from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Header(): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Navigation />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
