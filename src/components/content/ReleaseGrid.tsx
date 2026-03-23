import { ReleaseCard } from "./ReleaseCard";
import type { Release } from "@/types";

interface ReleaseGridProps {
  releases: Release[];
}

export function ReleaseGrid({ releases }: ReleaseGridProps): React.ReactElement {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {releases.map((release) => (
        <ReleaseCard key={release.slug} release={release} />
      ))}
    </div>
  );
}
