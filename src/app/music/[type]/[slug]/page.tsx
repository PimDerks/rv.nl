import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  getAllReleases,
  getReleaseBySlug,
  getTypeFromSlug,
  getTypeSlug,
} from "@/lib/releases";
import { getAvailableSongSlugs } from "@/lib/songs";
import { formatDate, formatYear } from "@/lib/utils";
import { formatSectionTitle } from "@/lib/format-section-title";
import { generateMusicAlbumJsonLd } from "@/lib/jsonld";
import { Tracklist, SpotifyEmbed } from "@/components/content";
import { PageHero } from "@/components/layout";

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

  const availableSongSlugs = getAvailableSongSlugs();
  const typeLabel = releaseType.charAt(0).toUpperCase() + releaseType.slice(1);

  const albumArt = (
    <div className="relative w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 overflow-hidden rounded-lg shadow-2xl">
      <Image
        src={release.img}
        alt={release.title}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 192px, 256px"
      />
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateMusicAlbumJsonLd(release, type),
        }}
      />

      <PageHero
        title={release.title}
        subtitle={`${typeLabel} — ${formatYear(release.date)}`}
        image={release.img}
        heroContent={albumArt}
      >
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <p className="font-ui text-sm text-muted-foreground mb-8">
              Released: {formatDate(release.date)}
            </p>

            {release.spotify && (
              <section className="mb-8">
                <SpotifyEmbed 
                  spotifyId={release.spotify}
                  title={formatSectionTitle('Listen', 'to')}
                />
              </section>
            )}

            {release.discs && release.discs.length > 0 && (
              <section className="mb-8">
                <h2 
                  className="mb-4 text-center"
                  dangerouslySetInnerHTML={{ __html: formatSectionTitle('Tracklist', 'for') }}
                />
                <Tracklist
                  discs={release.discs}
                  availableSongSlugs={availableSongSlugs}
                />
              </section>
            )}

            {release.credits && release.credits.length > 0 && (
              <section className="mb-8">
                <h2 
                  className="mb-4 text-center"
                  dangerouslySetInnerHTML={{ __html: formatSectionTitle('Credits', 'for') }}
                />
                <dl className="space-y-2">
                  {release.credits.map((credit, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-1">
                      <dt className="font-ui text-muted-foreground flex-shrink-0 sm:w-48">
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
                <h2 className="mb-4">About</h2>
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: release.content }}
                />
              </section>
            )}
          </div>
        </div>
      </PageHero>
    </>
  );
}
