"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Navigation({ isOpen, onClose }: NavigationProps): React.ReactElement {
  const pathname = usePathname();

  const isActive = (href: string, external: boolean): boolean => {
    if (external) {
      return false;
    }

    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const allItems = siteConfig.navigation.main;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500",
        "bg-background/97 backdrop-blur-xl",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      {/* Close zone — clicking outside nav items closes the menu */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Nav links */}
      <nav className="relative z-10">
        <ul className="flex flex-col items-center gap-2 md:gap-3">
          {allItems.map((item, index) => {
            const active = isActive(item.href, item.external);

            return (
              <li
                key={item.href}
                className={cn(
                  "transition-all duration-500",
                  isOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{
                  transitionDelay: isOpen ? `${index * 60}ms` : "0ms",
                }}
              >
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "block font-display text-5xl md:text-6xl lg:text-7xl tracking-wider uppercase transition-colors duration-200",
                    active
                      ? "text-heading"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Social links at the bottom */}
      <div
        className={cn(
          "relative z-10 mt-12 flex items-center gap-6 transition-all duration-500",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        )}
        style={{
          transitionDelay: isOpen ? `${allItems.length * 60 + 100}ms` : "0ms",
        }}
      >
        <Link
          href={siteConfig.socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Facebook"
        >
          <Facebook className="h-5 w-5" />
        </Link>
        <Link
          href={siteConfig.socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Instagram"
        >
          <Instagram className="h-5 w-5" />
        </Link>
        <Link
          href={siteConfig.socialLinks.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="YouTube"
        >
          <Youtube className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
