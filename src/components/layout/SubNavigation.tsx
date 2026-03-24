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
    <nav
      className="sticky top-[var(--header-height,4rem)] z-40 overflow-hidden"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="container mx-auto px-4">
        {/* Horizontal scroll strip — no scrollbar visible */}
        <ul className="flex items-center gap-0 overflow-x-auto py-2 scrollbar-none text-center">
          {siteConfig.navigation.music.map((item) => {
            const active = isActive(item.href);

            return (
              <li key={item.href} className="flex-shrink-0">
                <Link
                  href={item.href}
                  className={cn(
                    "relative inline-block px-4 py-2 font-display text-sm transition-colors duration-200",
                    active
                      ? "text-brand-off"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {item.label}
                  {/* Active/hover underline indicator */}
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
