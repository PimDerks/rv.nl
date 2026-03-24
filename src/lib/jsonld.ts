import { siteConfig } from "@/config/site";
import type { Release, Post, Song, LiveEvent } from "@/types";
import { formatDate } from "./utils";

export function generateWebSiteJsonLd(): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "MusicGroup",
      name: siteConfig.name,
      url: siteConfig.url,
      sameAs: [
        siteConfig.socialLinks.facebook,
        siteConfig.socialLinks.instagram,
        siteConfig.socialLinks.youtube,
        siteConfig.socialLinks.spotify,
        siteConfig.socialLinks.appleMusic,
      ],
    },
  };

  return JSON.stringify(jsonLd);
}

export function generateMusicGroupJsonLd(): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    genre: ["Rock", "Glam Rock", "Melodic Rock"],
    sameAs: [
      siteConfig.socialLinks.facebook,
      siteConfig.socialLinks.instagram,
      siteConfig.socialLinks.youtube,
      siteConfig.socialLinks.spotify,
      siteConfig.socialLinks.appleMusic,
    ],
  };

  return JSON.stringify(jsonLd);
}

export function generateMusicAlbumJsonLd(
  release: Release,
  typeSlug: string
): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: release.title,
    datePublished: release.date,
    image: `${siteConfig.url}${release.img}`,
    url: `${siteConfig.url}/music/${typeSlug}/${release.slug}`,
    byArtist: {
      "@type": "MusicGroup",
      name: siteConfig.name,
    },
    albumProductionType:
      release.type === "compilation"
        ? "CompilationAlbum"
        : release.type === "single"
          ? "SingleRelease"
          : "StudioAlbum",
    numTracks: release.discs?.reduce(
      (acc, disc) => acc + disc.tracks.length,
      0
    ),
  };

  return JSON.stringify(jsonLd);
}

export function generateMusicCompositionJsonLd(song: Song): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    name: song.title,
    composer: song.composer
      ? {
          "@type": "Person",
          name: song.composer,
        }
      : undefined,
    lyricist: song.writer
      ? {
          "@type": "Person",
          name: song.writer,
        }
      : undefined,
    dateCreated: song.year ? `${song.year}` : undefined,
    url: `${siteConfig.url}/music/songs/${song.slug}`,
  };

  return JSON.stringify(jsonLd);
}

export function generateBlogPostingJsonLd(post: Post): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.lead,
    datePublished: post.date,
    image: post.img ? `${siteConfig.url}${post.img}` : undefined,
    url: `${siteConfig.url}/news/${post.slug}`,
    author: {
      "@type": "MusicGroup",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return JSON.stringify(jsonLd);
}

export function generateEventJsonLd(events: LiveEvent[]): string {
  const jsonLd = events.map((event) => ({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `${siteConfig.name} Live at ${event.venue}`,
    startDate: event.date,
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: event.country,
      },
    },
    performer: {
      "@type": "MusicGroup",
      name: siteConfig.name,
    },
    url: event.url,
    eventStatus: event.cancelled
      ? "https://schema.org/EventCancelled"
      : event.postponed
        ? "https://schema.org/EventPostponed"
        : "https://schema.org/EventScheduled",
  }));

  return JSON.stringify(jsonLd);
}

export function generatePersonJsonLd(): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Robby Valentine",
    birthDate: "1968-12-04",
    birthPlace: "Leusden, Netherlands",
    nationality: "Dutch",
    jobTitle: ["Singer", "Pianist", "Producer", "Multi-instrumentalist"],
    url: siteConfig.url,
    sameAs: [
      siteConfig.socialLinks.facebook,
      siteConfig.socialLinks.instagram,
      siteConfig.socialLinks.youtube,
      siteConfig.socialLinks.spotify,
      siteConfig.socialLinks.appleMusic,
    ],
  };

  return JSON.stringify(jsonLd);
}
