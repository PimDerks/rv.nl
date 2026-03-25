import { cache } from "react";

import { getContentFiles, getContentFile } from "./content";
import { markdownToHtml } from "./markdown";
import { getAllReleases } from "./releases";
import type { Song, SongCredit, Release, ReleaseTrack } from "@/types";

interface SongFrontmatter {
  title: string;
  year?: number;
  writer?: string;
  composer?: string;
  credits?: SongCredit[];
  order?: boolean | number;
}

export async function getAllSongs(): Promise<Song[]> {
  const files = getContentFiles<SongFrontmatter>("_songs");

  const songs = await Promise.all(
    files.map(async (file) => {
      const content = await markdownToHtml(file.content);

      return {
        slug: file.slug,
        title: file.frontmatter.title,
        year: file.frontmatter.year,
        writer: file.frontmatter.writer,
        composer: file.frontmatter.composer,
        credits: file.frontmatter.credits,
        order: file.frontmatter.order,
        content,
      };
    })
  );

  // Sort alphabetically by title
  return songs.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getSongBySlug(slug: string): Promise<Song | null> {
  const file = getContentFile<SongFrontmatter>("_songs", slug);

  if (!file) {
    return null;
  }

  const content = await markdownToHtml(file.content);

  return {
    slug: file.slug,
    title: file.frontmatter.title,
    year: file.frontmatter.year,
    writer: file.frontmatter.writer,
    composer: file.frontmatter.composer,
    credits: file.frontmatter.credits,
    order: file.frontmatter.order,
    content,
  };
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getTrackTitle(track: ReleaseTrack): string {
  if (typeof track === "string") {
    return track;
  }

  return track.title;
}

export async function getReleasesBySong(songTitle: string): Promise<Release[]> {
  const releases = await getAllReleases();
  const normalizedSongTitle = normalizeTitle(songTitle);

  return releases.filter((release) => {
    if (!release.discs) {
      return false;
    }

    return release.discs.some((disc) =>
      disc.tracks.some(
        (track) => normalizeTitle(getTrackTitle(track)) === normalizedSongTitle
      )
    );
  });
}

// Build a reverse index: song title -> releases that contain it
export async function buildSongReleaseIndex(): Promise<
  Map<string, Release[]>
> {
  const releases = await getAllReleases();
  const index = new Map<string, Release[]>();

  for (const release of releases) {
    if (!release.discs) continue;

    for (const disc of release.discs) {
      for (const track of disc.tracks) {
        const title = normalizeTitle(getTrackTitle(track));

        if (!index.has(title)) {
          index.set(title, []);
        }

        index.get(title)!.push(release);
      }
    }
  }

  return index;
}

// Get a set of all available song slugs (songs that have lyric files)
// Cached to prevent multiple filesystem reads per request
export const getAvailableSongSlugs = cache((): Set<string> => {
  const files = getContentFiles<SongFrontmatter>("_songs");

  return new Set(files.map((file) => file.slug));
});
