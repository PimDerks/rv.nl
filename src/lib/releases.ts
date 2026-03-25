import { getContentFiles, getContentFile } from "./content";
import { markdownToHtml } from "./markdown";
import type { Release, ReleaseDisc, ReleaseCredit } from "@/types";

interface ReleaseFrontmatter {
  type: "album" | "single" | "compilation" | "collaboration";
  title: string;
  date: string;
  img: string;
  discs?: ReleaseDisc[];
  credits?: ReleaseCredit[];
  lyrics?: boolean;
  permalink?: string;
  spotify?: string;
}

export async function getAllReleases(): Promise<Release[]> {
  const files = getContentFiles<ReleaseFrontmatter>("_releases");

  const releases = await Promise.all(
    files.map(async (file) => {
      const content = await markdownToHtml(file.content);

      return {
        slug: file.slug,
        title: file.frontmatter.title,
        date: file.frontmatter.date,
        type: file.frontmatter.type,
        img: file.frontmatter.img,
        discs: file.frontmatter.discs,
        credits: file.frontmatter.credits,
        content,
        spotify: file.frontmatter.spotify,
      };
    })
  );

  // Sort by date descending (newest first)
  // Defensive: invalid/missing dates sort to the end
  return releases.sort((a, b) => {
    const tsA = new Date(a.date).getTime();
    const tsB = new Date(b.date).getTime();

    if (isNaN(tsA) && isNaN(tsB)) return 0;
    if (isNaN(tsA)) return 1;
    if (isNaN(tsB)) return -1;

    return tsB - tsA;
  });
}

export async function getReleaseBySlug(slug: string): Promise<Release | null> {
  const file = getContentFile<ReleaseFrontmatter>("_releases", slug);

  if (!file) {
    return null;
  }

  const content = await markdownToHtml(file.content);

  return {
    slug: file.slug,
    title: file.frontmatter.title,
    date: file.frontmatter.date,
    type: file.frontmatter.type,
    img: file.frontmatter.img,
    discs: file.frontmatter.discs,
    credits: file.frontmatter.credits,
    content,
    spotify: file.frontmatter.spotify,
  };
}

export async function getReleasesByType(
  type: Release["type"]
): Promise<Release[]> {
  const releases = await getAllReleases();

  return releases.filter((release) => release.type === type);
}

export function getTypeSlug(
  type: Release["type"]
): "albums" | "singles" | "compilations" | "collaborations" {
  const typeMap: Record<
    Release["type"],
    "albums" | "singles" | "compilations" | "collaborations"
  > = {
    album: "albums",
    single: "singles",
    compilation: "compilations",
    collaboration: "collaborations",
  };

  return typeMap[type];
}

export function getTypeFromSlug(
  slug: string
): Release["type"] | null {
  const slugMap: Record<string, Release["type"]> = {
    albums: "album",
    singles: "single",
    compilations: "compilation",
    collaborations: "collaboration",
  };

  return slugMap[slug] || null;
}
