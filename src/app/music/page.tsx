import type { Metadata } from "next";

import { getAllReleases } from "@/lib/releases";
import { SubNavigation, PageHero } from "@/components/layout";
import { ReleaseGrid } from "@/components/content";

export const metadata: Metadata = {
  title: "Music",
  description: "Discography of Robby Valentine - Albums, singles, compilations, and collaborations.",
};

export default async function MusicPage(): Promise<React.ReactElement> {
  const releases = await getAllReleases();

  return (
    <>
      <PageHero
        title="Music"
        subtitle="25+ years of Valentine music"
        image="/images/headers/alliance9.jpg"
      />
      <SubNavigation />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <ReleaseGrid releases={releases} />
      </div>
    </>
  );
}
