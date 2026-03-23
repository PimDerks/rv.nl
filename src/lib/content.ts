import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface ContentFile<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

export function getContentFiles<T>(
  directory: string
): ContentFile<T>[] {
  const dir = path.join(contentDirectory, directory);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((file) => {
    const ext = path.extname(file);

    return ext === ".md" || ext === ".mdx";
  });

  return files.map((file) => {
    const filePath = path.join(dir, file);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContents);
    const slug = path.basename(file, path.extname(file));

    return {
      slug,
      frontmatter: data as T,
      content,
    };
  });
}

export function getContentFile<T>(
  directory: string,
  slug: string
): ContentFile<T> | null {
  const dir = path.join(contentDirectory, directory);

  // Try .md first, then .mdx
  const extensions = [".md", ".mdx"];

  for (const ext of extensions) {
    const filePath = path.join(dir, `${slug}${ext}`);

    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        frontmatter: data as T,
        content,
      };
    }
  }

  return null;
}

export function getContentFileByPath<T>(
  filePath: string
): ContentFile<T> | null {
  const fullPath = path.join(contentDirectory, filePath);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);
  const slug = path.basename(filePath, path.extname(filePath));

  return {
    slug,
    frontmatter: data as T,
    content,
  };
}
