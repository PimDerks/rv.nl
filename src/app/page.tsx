import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCarouselSlides } from "@/lib/carousel";
import { getAllPosts } from "@/lib/posts";
import { getAllReleases } from "@/lib/releases";
import { generateWebSiteJsonLd, generateMusicGroupJsonLd } from "@/lib/jsonld";
import { HeroCarousel, NewsCard, ReleaseGrid } from "@/components/content";

export default async function HomePage(): Promise<React.ReactElement> {
  const slides = getCarouselSlides();
  const posts = getAllPosts().slice(0, 6);
  const releases = await getAllReleases();
  const latestReleases = releases.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebSiteJsonLd() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateMusicGroupJsonLd() }}
      />

      <HeroCarousel slides={slides} />

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            Latest News
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="bg-muted/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">
              Latest Releases
            </h2>
            <Link
              href="/music"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ReleaseGrid releases={latestReleases} />
        </div>
      </section>
    </>
  );
}
