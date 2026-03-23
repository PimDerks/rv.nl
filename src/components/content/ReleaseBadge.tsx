import Link from "next/link";

import { getTypeSlug } from "@/lib/releases";
import type { Release } from "@/types";

interface ReleaseBadgeProps {
  releases: Release[];
}

export function ReleaseBadge({
  releases,
}: ReleaseBadgeProps): React.ReactElement | null {
  if (releases.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-heading font-semibold mb-3">Appears on</h3>
      <div className="flex flex-wrap gap-2">
        {releases.map((release) => {
          const typeSlug = getTypeSlug(release.type);

          return (
            <Link
              key={release.slug}
              href={`/music/${typeSlug}/${release.slug}`}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
            >
              {release.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
