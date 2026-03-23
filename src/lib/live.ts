import { getContentFiles } from "./content";
import type { LiveEvent } from "@/types";

interface LiveFrontmatter {
  venue: string;
  city: string;
  country: string;
  date: string;
  link?: string;
  url?: string;
  cancelled?: boolean;
  postponed?: boolean;
  info?: string;
}

export function getAllLive(): LiveEvent[] {
  const files = getContentFiles<LiveFrontmatter>("_live");

  const events = files.map((file) => ({
    slug: file.slug,
    date: file.frontmatter.date,
    venue: file.frontmatter.venue,
    city: file.frontmatter.city,
    country: file.frontmatter.country,
    url: file.frontmatter.link || file.frontmatter.url,
    cancelled: file.frontmatter.cancelled,
    postponed: file.frontmatter.postponed,
    info: file.frontmatter.info,
  }));

  // Sort by date ascending (earliest first)
  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getUpcomingEvents(): LiveEvent[] {
  const events = getAllLive();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.filter((event) => new Date(event.date) >= today);
}

export function getPastEvents(): LiveEvent[] {
  const events = getAllLive();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Past events sorted descending (most recent first)
  return events
    .filter((event) => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function splitEventsByDate(): {
  upcoming: LiveEvent[];
  past: LiveEvent[];
} {
  const events = getAllLive();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming: LiveEvent[] = [];
  const past: LiveEvent[] = [];

  for (const event of events) {
    if (new Date(event.date) >= today) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  }

  // Past events: most recent first
  past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { upcoming, past };
}
