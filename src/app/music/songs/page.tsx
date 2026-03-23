import type { Metadata } from "next";
import Link from "next/link";

import { getAllSongs } from "@/lib/songs";

export const metadata: Metadata = {
  title: "Songs",
  description: "Complete song catalog of Robby Valentine - lyrics, credits, and more.",
};

export default async function SongsPage(): Promise<React.ReactElement> {
  const songs = await getAllSongs();

  // Group songs by first letter
  const groupedSongs = songs.reduce(
    (acc, song) => {
      const firstLetter = song.title.charAt(0).toUpperCase();
      const key = /[A-Z]/.test(firstLetter) ? firstLetter : "#";

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(song);

      return acc;
    },
    {} as Record<string, typeof songs>
  );

  const sortedLetters = Object.keys(groupedSongs).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;

    return a.localeCompare(b);
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">
        Songs A-Z
      </h1>

      <p className="text-muted-foreground mb-8">
        {songs.length} songs in the catalog
      </p>

      <div className="space-y-8">
        {sortedLetters.map((letter) => (
          <section key={letter}>
            <h2 className="font-heading text-2xl font-bold mb-4 pb-2 border-b">
              {letter}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {groupedSongs[letter].map((song) => (
                <li key={song.slug}>
                  <Link
                    href={`/music/songs/${song.slug}`}
                    className="hover:text-foreground/80 transition-colors"
                  >
                    {song.title}
                    {song.year && (
                      <span className="text-muted-foreground text-sm ml-2">
                        ({song.year})
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
