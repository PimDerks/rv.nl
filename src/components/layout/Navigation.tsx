"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface NavigationProps {
  /** Which half of the split nav to render on desktop. On mobile this is ignored — all items render in the overlay. */
  side: "left" | "right";
}

export function Navigation({ side }: NavigationProps): React.ReactElement {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
  const sideItems = allItems.filter((item) => item.side === side);

  return (
    <>
      {/* Mobile hamburger — only rendered once, on the right side slot */}
      {side === "right" && (
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}

      {/* Desktop: half-nav */}
      <ul
        className={cn(
          "hidden md:flex items-center gap-6",
          side === "left" ? "justify-end" : "justify-start"
        )}
      >
        {sideItems.map((item) => {
          const active = isActive(item.href, item.external);

          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "group relative block py-6 text-sm tracking-wide transition-colors duration-200",
                  "font-display uppercase text-white/80 hover:text-white",
                  active && "text-white"
                )}
              >
                <span className="relative">
                  {item.label}
                  {/* Brand-yellow underline — slides in on hover/active */}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-brand transition-all duration-500",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile: full-screen overlay — rendered once from the right side slot */}
      {side === "right" && isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center md:hidden"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setIsOpen(false)}
        >
          <ul className="w-full text-center">
            {allItems.map((item) => (
              <li key={item.href} className="px-4">
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "group relative inline-block py-4 font-display text-2xl text-white transition-colors duration-200",
                    isActive(item.href, item.external) && "text-brand-off"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="relative">
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-brand transition-all duration-500",
                        isActive(item.href, item.external)
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      )}
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
