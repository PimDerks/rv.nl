import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllSongs, getSongBySlug, getReleasesBySong } from "@/lib/songs";
import { generateMusicCompositionJsonLd } from "@/lib/jsonld";
import { SongCredits } from "@/components/content/SongCredits";
import { ReleaseBadge } from "@/components/content/ReleaseBadge";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateMusicCompositionJsonLd(song) }}
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
          {song.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-muted-foreground mb-8">
          {song.year && <span>Year: {song.year}</span>}
          {song.writer && <span>Written by: {song.writer}</span>}
          {song.composer && song.composer !== song.writer && (
            <span>Composed by: {song.composer}</span>
          )}
        </div>

        {song.content && (
          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-4">Lyrics</h2>
            <div
              className="lyrics"
              dangerouslySetInnerHTML={{ __html: song.content }}
            />
          </section>
        )}

        {song.credits && song.credits.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-4">Credits</h2>
            <SongCredits credits={song.credits} />
          </section>
        )}

        {releases.length > 0 && (
            <section>
              <ReleaseBadge releases={releases} />
            </section>
          )}
        </div>
      </div>
    </>
  );
}
