import { getContentFiles } from "./content";
import type { CarouselSlide } from "@/types";

interface CarouselFrontmatter {
  title: string;
  subtitle?: string;
  link: string;
  external?: boolean;
  image: string;
  order: number;
}

export function getCarouselSlides(): CarouselSlide[] {
  const files = getContentFiles<CarouselFrontmatter>("_carousel");

  const slides = files.map((file) => ({
    slug: file.slug,
    title: file.frontmatter.title,
    subtitle: file.frontmatter.subtitle,
    link: file.frontmatter.link,
    external: file.frontmatter.external,
    image: file.frontmatter.image,
    order: file.frontmatter.order,
  }));

  // Sort by order ascending
  return slides.sort((a, b) => a.order - b.order);
}
