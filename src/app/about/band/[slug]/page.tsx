import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getAllBandMembers, getBandMemberBySlug } from "@/lib/band";
import { mdxComponents } from "@/components/mdx";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const members = getAllBandMembers();

  return members.map((member) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getBandMemberBySlug(slug);

  if (!member) {
    return {};
  }

  return {
    title: member.title,
    description: `${member.title} - ${member.role || "Band member"} of Robby Valentine.`,
    openGraph: {
      title: member.title,
      description: member.role,
      images: member.img ? [member.img] : undefined,
    },
  };
}

export default async function BandMemberPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const member = getBandMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          {member.img && (
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={member.img}
                alt={member.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            {member.title}
          </h1>
          {member.role && (
            <p className="text-xl text-muted-foreground mb-6">{member.role}</p>
          )}

          {member.content && (
            <div className="prose-content">
              <MDXRemote source={member.content} components={mdxComponents} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
