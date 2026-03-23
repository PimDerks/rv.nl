import { getContentFileByPath } from "./content";

interface AboutFrontmatter {
  title: string;
  subtitle?: string;
  headerImage?: string;
  profile?: {
    name: string;
    dateOfBirth: string;
    influences: string;
    instruments: string;
    maritalState: string;
  };
}

export interface AboutPage {
  title: string;
  subtitle?: string;
  headerImage?: string;
  profile?: AboutFrontmatter["profile"];
  content: string;
}

export function getAboutPage(): AboutPage | null {
  const file = getContentFileByPath<AboutFrontmatter>("about.mdx");

  if (!file) {
    return null;
  }

  return {
    title: file.frontmatter.title,
    subtitle: file.frontmatter.subtitle,
    headerImage: file.frontmatter.headerImage,
    profile: file.frontmatter.profile,
    content: file.content,
  };
}
