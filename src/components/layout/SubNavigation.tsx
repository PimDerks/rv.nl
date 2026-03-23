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
    <nav className="border-b bg-muted/50">
      <div className="container mx-auto px-4">
        <ul className="flex overflow-x-auto gap-1 py-2 -mx-4 px-4 md:mx-0 md:px-0 md:gap-2">
          {siteConfig.navigation.music.map((item) => (
            <li key={item.href} className="flex-shrink-0">
              <Link
                href={item.href}
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
