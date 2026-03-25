import Link from "next/link";

import type { ReleaseDisc, ReleaseTrack } from "@/types";
import { slugify } from "@/lib/utils";

interface TracklistProps {
  discs: ReleaseDisc[];
  linkSongs?: boolean;
  availableSongSlugs?: Set<string>;
}

function getTrackTitle(track: ReleaseTrack): string {
  return typeof track === "string" ? track : track.title;
}

function getTrackSubtitle(track: ReleaseTrack): string | undefined {
  return typeof track === "string" ? undefined : track.subtitle;
}

export function Tracklist({
  discs,
  linkSongs = true,
  availableSongSlugs,
}: TracklistProps): React.ReactElement {
  return (
    <div className="space-y-6">
      {discs.map((disc, discIndex) => (
        <div key={discIndex}>
          {disc.title && (
            <h3 className="font-heading font-semibold text-lg mb-3">
              {disc.title}
            </h3>
          )}
          <ol className="space-y-1">
            {disc.tracks.map((track, trackIndex) => {
              const title = getTrackTitle(track);
              const subtitle = getTrackSubtitle(track);
              const songSlug = slugify(title);
              const hasLyrics = availableSongSlugs
                ? availableSongSlugs.has(songSlug)
                : true;

              return (
                <li
                  key={trackIndex}
                  className="flex items-baseline gap-3 py-1.5 border-b border-border last:border-0"
                >
                  <span className="text-muted-foreground text-sm w-6 flex-shrink-0">
                    {trackIndex + 1}.
                  </span>
                  <div className="flex-1">
                    {linkSongs && hasLyrics ? (
                      <Link
                        href={`/music/songs/${songSlug}`}
                        className="hover:text-foreground/80 transition-colors"
                      >
                        {title}
                      </Link>
                    ) : (
                      <span>{title}</span>
                    )}
                    {subtitle && (
                      <span className="text-muted-foreground text-sm ml-2">
                        ({subtitle})
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
