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
      className="group relative block overflow-hidden bg-muted rounded"
      data-testid="release-card"
    >
      {/* Album artwork fills the card */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={release.img}
          alt={release.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Overlay on hover — sits on image, so hard-coded dark + white is correct */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus:opacity-100">
          <div className="px-4 text-center" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            <p className="font-display text-lg tracking-wide uppercase text-white">{release.title}</p>
            <p className="mt-1 font-ui text-sm text-white/80">{formatYear(release.date)}</p>
          </div>
        </div>
      </div>

      {/* Title below image — theme-aware */}
      <div className="px-2 py-2">
        <p className="font-display text-sm tracking-wide uppercase text-heading truncate">{release.title}</p>
        <p className="font-ui text-xs text-muted-foreground">{formatYear(release.date)}</p>
      </div>
    </Link>
  );
}
