import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getReleasesByType, getTypeFromSlug } from "@/lib/releases";
import { ReleaseGrid } from "@/components/content";
import { SubNavigation, PageHero } from "@/components/layout";

interface PageProps {
  params: Promise<{ type: string }>;
}

const typeTitles: Record<string, string> = {
  albums: "Albums",
  singles: "Singles",
  compilations: "Compilations",
  collaborations: "Collaborations",
};

export async function generateStaticParams(): Promise<{ type: string }[]> {
  return [
    { type: "albums" },
    { type: "singles" },
    { type: "compilations" },
    { type: "collaborations" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const title = typeTitles[type];

  if (!title) {
    return {};
  }

  return {
    title,
    description: `Browse Robby Valentine's ${title.toLowerCase()} discography.`,
  };
}

export default async function TypePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { type } = await params;
  const releaseType = getTypeFromSlug(type);

  if (!releaseType) {
    notFound();
  }

  const releases = await getReleasesByType(releaseType);
  const title = typeTitles[type];

  return (
    <PageHero title={title} image="/images/headers/alliance9.jpg">
      <SubNavigation />
      <div className="container mx-auto px-4 py-8 md:py-12">
        {releases.length === 0 ? (
          <p className="text-muted-foreground">No {title.toLowerCase()} found.</p>
        ) : (
          <ReleaseGrid releases={releases} />
        )}
      </div>
    </PageHero>
  );
}
