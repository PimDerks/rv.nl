import { getContentFiles, getContentFile } from "./content";
import type { BandMember } from "@/types";

interface BandFrontmatter {
  title: string;
  img?: string;
  subtitle?: string;
  instrument?: string;
  header?: string;
  meta?: Array<{ key: string; value: string }>;
}

export function getAllBandMembers(): BandMember[] {
  const files = getContentFiles<BandFrontmatter>("_band");

  // Filter out the index file if present
  const members = files
    .filter((file) => file.slug !== "index")
    .map((file) => ({
      slug: file.slug,
      title: file.frontmatter.title,
      img: file.frontmatter.img,
      role: file.frontmatter.subtitle || file.frontmatter.instrument,
      content: file.content,
    }));

  return members;
}

export function getBandMemberBySlug(slug: string): BandMember | null {
  const file = getContentFile<BandFrontmatter>("_band", slug);

  if (!file || file.slug === "index") {
    return null;
  }

  return {
    slug: file.slug,
    title: file.frontmatter.title,
    img: file.frontmatter.img,
    role: file.frontmatter.subtitle || file.frontmatter.instrument,
    content: file.content,
  };
}
