import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { generateBlogPostingJsonLd } from "@/lib/jsonld";
import { mdxComponents } from "@/components/mdx";
import { PageHero } from "@/components/layout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.lead || `${post.title} - News from Robby Valentine`,
    openGraph: {
      title: post.title,
      description: post.lead,
      images: post.img ? [post.img] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const heroImage = post.header || post.img || "/images/headers/alliance9.jpg";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateBlogPostingJsonLd(post) }}
      />

      <PageHero
        title={post.title}
        subtitle={formatDate(post.date)}
        image={heroImage}
      >
        <article className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            {post.lead && (
              <p className="text-xl text-muted-foreground mb-8">{post.lead}</p>
            )}

            {post.img && (
              <div className="overflow-hidden rounded-lg bg-muted mb-8">
                <Image
                  src={post.img}
                  alt={post.title}
                  width={768}
                  height={0}
                  className="w-full h-auto"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            <div className="prose-content">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>
          </div>
        </article>
      </PageHero>
    </>
  );
}
