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
    <Link href={href} className="group block" data-testid="release-card">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={release.img}
          alt={release.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-heading font-semibold text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
          {release.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {formatYear(release.date)}
        </p>
      </div>
    </Link>
  );
}
