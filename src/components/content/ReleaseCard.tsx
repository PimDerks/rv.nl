import Image from "next/image";
import Link from "next/link";

import { getTypeSlug } from "@/lib/releases";
import { formatYear } from "@/lib/utils";
import type { Release } from "@/types";

interface ReleaseCardProps {
  release: Release;
}

export function ReleaseCard({ release }: ReleaseCardProps): React.ReactElement {
  const typeSlug = getTypeSlug(release.type);
  const href = `/music/${typeSlug}/${release.slug}`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden bg-black"
      data-testid="release-card"
    >
      {/* Album artwork fills the card */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={release.img}
          alt={release.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-80"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Overlay: appears on hover, centred title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
          <div className="px-4 text-center" style={{ textShadow: "0 0 2px rgba(0,0,0,0.5)" }}>
            <p className="font-display text-base text-white">{release.title}</p>
            <p className="mt-1 font-body text-sm text-brand-off">{formatYear(release.date)}</p>
          </div>
        </div>
      </div>

      {/* Title below image (visible always, complements the overlay) */}
      <div className="px-2 py-2">
        <p className="font-display text-sm text-brand-off truncate">{release.title}</p>
        <p className="font-body text-xs text-muted-foreground">{formatYear(release.date)}</p>
      </div>
    </Link>
  );
}
