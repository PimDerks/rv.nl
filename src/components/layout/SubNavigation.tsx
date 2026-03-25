"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function SubNavigation(): React.ReactElement {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/music") {
      return pathname === "/music";
    }

    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-[var(--header-height,3.5rem)] z-40 overflow-hidden bg-background/80 backdrop-blur border-b border-border/50">
      <div className="container mx-auto px-4">
        <ul className="flex items-center gap-0 overflow-x-auto py-2 scrollbar-none text-center">
          {siteConfig.navigation.music.map((item) => {
            const active = isActive(item.href);

            return (
              <li key={item.href} className="flex-shrink-0">
                <Link
                  href={item.href}
                  className={cn(
                    "relative inline-block px-4 py-2 font-display text-sm tracking-wide uppercase transition-colors duration-200",
                    active
                      ? "text-heading"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 h-0.5 w-3/4 -translate-x-1/2 bg-brand"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
