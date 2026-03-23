import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  getAllReleases,
  getReleaseBySlug,
  getTypeFromSlug,
  getTypeSlug,
} from "@/lib/releases";
import { formatDate } from "@/lib/utils";
import { Tracklist } from "@/components/content/Tracklist";

interface PageProps {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateStaticParams(): Promise<
  { type: string; slug: string }[]
> {
  const releases = await getAllReleases();

  return releases.map((release) => ({
    type: getTypeSlug(release.type),
    slug: release.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);

  if (!release) {
    return {};
  }

  return {
    title: release.title,
    description: `${release.title} - ${release.type} by Robby Valentine, released ${formatDate(release.date)}.`,
    openGraph: {
      title: release.title,
      description: `${release.title} - ${release.type} by Robby Valentine`,
      images: [release.img],
    },
  };
}

export default async function ReleaseDetailPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { type, slug } = await params;
  const releaseType = getTypeFromSlug(type);

  if (!releaseType) {
    notFound();
  }

  const release = await getReleaseBySlug(slug);

  if (!release || release.type !== releaseType) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={release.img}
                alt={release.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Released: {formatDate(release.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            {release.title}
          </h1>

          {release.discs && release.discs.length > 0 && (
            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold mb-4">
                Tracklist
              </h2>
              <Tracklist discs={release.discs} />
            </section>
          )}

          {release.credits && release.credits.length > 0 && (
            <section className="mb-8">
              <h2 className="font-heading text-xl font-semibold mb-4">
                Credits
              </h2>
              <dl className="space-y-2">
                {release.credits.map((credit, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-1">
                    <dt className="text-muted-foreground flex-shrink-0 sm:w-48">
                      {credit.key}:
                    </dt>
                    <dd>{credit.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {release.content && (
            <section>
              <h2 className="font-heading text-xl font-semibold mb-4">
                About
              </h2>
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: release.content }}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
