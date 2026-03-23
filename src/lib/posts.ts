import { getContentFiles, getContentFile } from "./content";
import type { Post } from "@/types";

interface PostFrontmatter {
  title: string;
  date: string;
  img?: string;
  header?: string;
  lead?: string;
  subtitle?: string;
  categories?: string;
}

export function getAllPosts(): Post[] {
  const files = getContentFiles<PostFrontmatter>("_posts");

  const posts = files.map((file) => ({
    slug: file.slug,
    title: file.frontmatter.title,
    date: file.frontmatter.date,
    img: file.frontmatter.img,
    header: file.frontmatter.header,
    lead: file.frontmatter.lead,
    subtitle: file.frontmatter.subtitle,
    categories: file.frontmatter.categories,
    content: file.content,
  }));

  // Sort by date descending (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const file = getContentFile<PostFrontmatter>("_posts", slug);

  if (!file) {
    return null;
  }

  return {
    slug: file.slug,
    title: file.frontmatter.title,
    date: file.frontmatter.date,
    img: file.frontmatter.img,
    header: file.frontmatter.header,
    lead: file.frontmatter.lead,
    subtitle: file.frontmatter.subtitle,
    categories: file.frontmatter.categories,
    content: file.content,
  };
}

export function getPaginatedPosts(
  page: number,
  perPage: number = 6
): { posts: Post[]; totalPages: number; currentPage: number } {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * perPage;
  const posts = allPosts.slice(start, start + perPage);

  return { posts, totalPages, currentPage };
}
