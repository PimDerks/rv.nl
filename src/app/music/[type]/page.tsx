import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getReleasesByType, getTypeFromSlug } from "@/lib/releases";
import { ReleaseGrid } from "@/components/content";

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
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">
        {title}
      </h1>

      {releases.length === 0 ? (
        <p className="text-muted-foreground">No {title.toLowerCase()} found.</p>
      ) : (
        <ReleaseGrid releases={releases} />
      )}
    </div>
  );
}
