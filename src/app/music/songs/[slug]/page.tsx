import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllSongs, getSongBySlug, getReleasesBySong } from "@/lib/songs";
import { generateMusicCompositionJsonLd } from "@/lib/jsonld";
import { formatSectionTitle } from "@/lib/format-section-title";
import { SongCredits } from "@/components/content/SongCredits";
import { ReleaseGrid } from "@/components/content/ReleaseGrid";
import { SpotifyEmbed } from "@/components/content";
import { PageHero } from "@/components/layout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const songs = await getAllSongs();

  return songs.map((song) => ({
    slug: song.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = await getSongBySlug(slug);

  if (!song) {
    return {};
  }

  return {
    title: song.title,
    description: `Lyrics and credits for "${song.title}" by Robby Valentine.`,
  };
}

export default async function SongDetailPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const song = await getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  const releases = await getReleasesBySong(song.title);

  const subtitleParts: string[] = [];

  if (song.writer) {
    subtitleParts.push(`Written by ${song.writer}`);
  }

  if (song.year) {
    subtitleParts.push(String(song.year));
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateMusicCompositionJsonLd(song) }}
      />

      <PageHero
        title={song.title}
        subtitle={subtitleParts.join(" — ") || undefined}
        image="/images/headers/alliance9.jpg"
      >
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto text-center">
            {song.spotify && (
              <section className="mb-8">
                <SpotifyEmbed 
                  spotifyId={song.spotify} 
                  type="track"
                  title={formatSectionTitle('Listen', 'to')}
                />
              </section>
            )}

            {song.content && (
              <section className="mb-8">
                <h2 className="mb-4">Lyrics</h2>
                <div
                  className="lyrics"
                  dangerouslySetInnerHTML={{ __html: song.content }}
                />
              </section>
            )}

            {song.credits && song.credits.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4">Credits</h2>
                <SongCredits credits={song.credits} />
              </section>
            )}

            {releases.length > 0 && (
              <section>
                <h2 className="mb-6">This song appears on the following releases</h2>
                <div className="flex justify-center">
                  <ReleaseGrid releases={releases} />
                </div>
              </section>
            )}
          </div>
        </div>
      </PageHero>
    </>
  );
}
