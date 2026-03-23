import type { Metadata } from "next";

import { getAllReleases } from "@/lib/releases";
import { ReleaseGrid } from "@/components/content";

export const metadata: Metadata = {
  title: "Music",
  description: "Discography of Robby Valentine - Albums, singles, compilations, and collaborations.",
};

export default async function MusicPage(): Promise<React.ReactElement> {
  const releases = await getAllReleases();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">
        All Releases
      </h1>

      <ReleaseGrid releases={releases} />
    </div>
  );
}
