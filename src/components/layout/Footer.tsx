import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

import { siteConfig } from "@/config/site";

export function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border/50 bg-card text-card-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        {/* Copyright */}
        <p className="font-ui text-xs text-muted-foreground">
          &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </p>

        {/* Social links */}
        <div className="flex items-center gap-5">
          <Link
            href={siteConfig.socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Facebook"
          >
            <Facebook className="h-4 w-4" />
          </Link>
          <Link
            href={siteConfig.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </Link>
          <Link
            href={siteConfig.socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="YouTube"
          >
            <Youtube className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
