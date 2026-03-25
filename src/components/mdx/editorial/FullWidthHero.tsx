import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface FullWidthHeroProps {
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Darken the overlay more for lighter images */
  darken?: boolean;
}

export function FullWidthHero({
  image,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  darken = false,
}: FullWidthHeroProps): React.ReactElement {
  const isExternal = ctaHref?.startsWith("http");

  return (
    <section className="relative w-screen -ml-[50vw] left-1/2 min-h-[60vh] flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${image}')` }}
        aria-hidden="true"
      />
      <div
        className={`absolute inset-0 ${darken ? "bg-black/60" : "bg-black/35"}`}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))" }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 container mx-auto px-4 pb-12 md:pb-16"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
      >
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase text-white mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            {subtitle}
          </p>
        )}
        {ctaLabel && ctaHref && (
          isExternal ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand text-primary-foreground px-6 py-3 font-display text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-brand text-primary-foreground px-6 py-3 font-display text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
            </Link>
          )
        )}
      </div>
    </section>
  );
}
