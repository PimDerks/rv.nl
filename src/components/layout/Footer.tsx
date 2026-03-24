import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

import { siteConfig } from "@/config/site";

export function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-black text-white">
      <div className="container mx-auto px-4 py-8 text-center">
        {/* Social links */}
        <div className="mb-6 flex items-center justify-center gap-6">
          <Link
            href={siteConfig.socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 transition-colors hover:text-brand"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </Link>
          <Link
            href={siteConfig.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 transition-colors hover:text-brand"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href={siteConfig.socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 transition-colors hover:text-brand"
            aria-label="YouTube"
          >
            <Youtube className="h-5 w-5" />
          </Link>
        </div>

        {/* Footer nav */}
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="font-display text-sm text-white/60 transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="font-body text-xs text-white/40">
          &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
