# Post-Migration Feature Plan

## Overview

This plan outlines 13 features across 3 phases for the Robby Valentine website after migrating to Next.js, plus a backlog of future enhancements. The site uses markdown-based content with no CMS.

**Reference:** Steven Wilson HQ (stevenwilsonhq.com) for rich release page design inspiration.

---

## Phase 1 — Core Features

### 1. Rich Release Pages

**Goal:** Transform release detail pages into immersive, visually stunning experiences with big photography, bold typography, and dynamic sections.

**Design Elements:**

- Full-bleed hero with album artwork
- Dynamic gradient background extracted from cover colors
- Sectioned layout: Hero, About, Tracklist, Credits, Gallery, Listen
- Spotify embed prominently placed
- Available formats icons (CD, vinyl, digital)
- Buy/Stream CTA buttons
- Full-width photography sections as visual breaks

**Schema Changes (`content/_releases/*.md`):**

```yaml
---
type: album
title: "Album Title"
date: 2024-01-15
img: /images/releases/album-cover.jpg
spotify: "https://open.spotify.com/album/..."      # NEW
discogs: "https://www.discogs.com/release/..."     # NEW
buyLink: "https://store.example.com/album"         # NEW
formats: [cd, vinyl, digital]                      # NEW
gallery:                                           # NEW
  - /images/releases/promo-1.jpg
  - /images/releases/promo-2.jpg
discs:
  - tracks:
    - "Track 1"
    - "Track 2"
credits:
  - key: "Produced by"
    value: "Name"
---

Long-form description about the album...
```

**Components to Build:**

- `ReleaseHero` — Full-bleed hero with cover art and metadata
- `ReleaseAbout` — Description section with large typography
- `ReleaseGallery` — Masonry or carousel image gallery
- `SpotifyEmbed` — Reusable Spotify player component
- `FormatBadges` — Icons for available formats
- `GradientBackground` — Animated gradient from album colors

**Technical Notes:**

- Use `node-vibrant` at build time to extract dominant colors
- Store extracted colors in release data for runtime use
- CSS custom properties per release for theming

---

### 2. Spotify Integration

**Goal:** Embed Spotify players on release pages where a Spotify URL exists.

**Implementation:**

- Parse Spotify URL to extract album/track ID
- Render Spotify iframe embed
- Support album, track, and playlist embeds
- Fallback gracefully when no Spotify URL provided

**Spotify Embed URL Format:**

```
https://open.spotify.com/embed/album/{album_id}?utm_source=generator&theme=0
```

**Component:**

```tsx
interface SpotifyEmbedProps {
  url: string;
  height?: number;
}
```

---

### 3. Map with Events

**Goal:** Interactive Leaflet map showing all events with markers, filterable by upcoming/past.

**Schema Changes (`content/_live/*.md`):**

```yaml
---
venue: Paradiso
city: Amsterdam
country: The Netherlands
date: 2024-06-15
lat: 52.3622       # NEW - auto-generated at build time
lng: 4.8837        # NEW - auto-generated at build time
setlist:
  - Song 1
  - Song 2
link: https://tickets.example.com
---
```

**Auto-Geocoding Strategy:**

- Use Nominatim (OpenStreetMap) API at build time
- Query: `{venue}, {city}, {country}`
- Cache results to avoid repeated API calls
- Store lat/lng in frontmatter or a generated JSON file
- Rate limit: 1 request/second (Nominatim policy)

**Build Script (`scripts/geocode-events.ts`):**

```ts
// Reads all _live files
// For each file missing lat/lng:
//   1. Query Nominatim with city + country
//   2. Cache result
//   3. Update file or generate lookup JSON
```

**Components to Build:**

- `EventMap` — Leaflet map with clustered markers
- `EventMarker` — Custom marker with popup
- `EventMapFilters` — Toggle upcoming/past, date range

**Dependencies:**

- `react-leaflet` — React wrapper for Leaflet
- `leaflet` — Map library
- `leaflet.markercluster` — Marker clustering

---

### 4. Scrollable Timeline

**Goal:** Visual timeline showing releases, milestones, and career highlights.

**New Collection (`content/_timeline/*.md`):**

```yaml
---
date: 1992-02-01
title: "First Album Released"
type: release | milestone | tour | award | personal
release: robby-valentine    # Optional link to release slug
image: /images/timeline/event.jpg
---

Optional longer description...
```

**Sample Timeline Entries:**

```yaml
# content/_timeline/1992-02-01-first-album.md
---
date: 1992-02-01
title: "Debut Album 'Robby Valentine' Released"
type: release
release: robby-valentine
image: /images/timeline/1992-debut.jpg
---

# content/_timeline/1995-06-15-first-tour.md
---
date: 1995-06-15
title: "First European Tour"
type: tour
image: /images/timeline/1995-tour.jpg
---
Headline tour across 12 countries...
```

**Components to Build:**

- `Timeline` — Vertical scrollable timeline container
- `TimelineItem` — Individual entry with date, title, image
- `TimelineFilters` — Filter by type (releases, milestones, etc.)

**Data Aggregation:**

Timeline can pull from multiple sources:

1. Dedicated `_timeline` collection for milestones
2. Auto-generated entries from `_releases` (release dates)
3. Auto-generated entries from `_live` (notable shows)

---

### 5. Press Kit / EPK

**Goal:** Simple downloadable press kit on contact page.

**Implementation:**

- Add EPK file to `/public/downloads/press-kit.zip` or PDF
- Add download button/link on contact page
- Include: bio, hi-res photos, logos, rider, tech specs

**Contact Page Update:**

```tsx
<section>
  <h2>Press Kit</h2>
  <p>Download our electronic press kit for booking and media inquiries.</p>
  <a href="/downloads/press-kit.zip" download>
    Download Press Kit (ZIP, 15MB)
  </a>
</section>
```

---

## Phase 2 — Engagement Features

### 6. "On This Day" Component

**Goal:** Site-wide component showing what happened on today's date in history.

**Data Sources:**

- `_timeline` entries matching today's month/day
- `_releases` with matching release date
- `_live` events from past years on this date

**Component (`OnThisDay.tsx`):**

```tsx
interface OnThisDayEvent {
  date: string;
  title: string;
  type: 'release' | 'milestone' | 'event';
  link?: string;
  image?: string;
}
```

**Placement:**

- Add to main layout (header, footer, or floating widget)
- Can be toggled off via user preference (localStorage)

**Build-Time Data Generation:**

- Create a JSON lookup keyed by "MM-DD"
- At runtime, check today's date and display matches

---

### 7. Song of the Day

**Goal:** Random/rotating song discovery feature.

**Implementation: Daily Rotation (Deterministic)**

- Use date as seed for pseudo-random selection
- Same song all day, changes at midnight
- More shareable ("Check out today's song!")

**Component:**

```tsx
// SongOfTheDay.tsx
// Uses date-seeded random to pick song
// Displays: title, album, year, link to song page
// Optional: Play button if song has Spotify/audio preview
```

**Placement:**

- Homepage widget
- Dedicated `/song-of-the-day` page with history

---

### 8. Setlist Archive

**Goal:** Display and browse setlist data from past events.

**Existing Data:**

9 events already have setlist data in `_live` markdown files:

```yaml
setlist:
  - Fear of Heights
  - Deadbeat Boy
  - Close The Door
```

**Features to Build:**

- Display setlist on individual event pages
- Setlist statistics: most played songs, rare songs
- Browse: "All shows where X was played"
- Link setlist songs to song detail pages (if they exist in `_songs`)

**Components:**

- `Setlist` — Ordered list display
- `SetlistStats` — Aggregate statistics page
- `SongAppearances` — Shows where a song was played

---

### 9. Dynamic Album Gradients

**Goal:** Animated gradient backgrounds extracted from album cover colors.

**Implementation:**

1. At build time, extract 3-5 dominant colors from each album cover
2. Store colors in release frontmatter or generated JSON
3. Create CSS custom properties per release
4. Animate gradient using CSS or Framer Motion

**Build Script (`scripts/extract-colors.ts`):**

```ts
import Vibrant from 'node-vibrant';

// For each release:
// 1. Load cover image
// 2. Extract palette (Vibrant, Muted, DarkVibrant, etc.)
// 3. Write to release data or JSON lookup
```

**CSS Animation:**

```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.release-gradient {
  background: linear-gradient(
    -45deg,
    var(--release-color-1),
    var(--release-color-2),
    var(--release-color-3)
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

---

## Phase 3 — Content Depth

### 10. Band Member Timeline / Family Tree

**Goal:** Interactive visualization showing all band members past and present, their roles, years active, and photos.

**Design Concept:**

- Horizontal timeline spanning the band's history (1992 - present)
- Each member represented as a bar/lane showing their tenure
- Click/hover to reveal member details (photo, role, bio)
- Color-coded by instrument/role type
- Visual indication of current vs. past members

**Schema Extension (`content/_band/*.mdx`):**

```yaml
---
title: Paul Coenradie
subtitle: "Guitar/Backings"
instrument: "Guitar/Backings"
img: /images/band/pc.jpg
header: /images/band/pc.jpg
layout: band
current: true                           # NEW - currently in band?
periods:                                # NEW - tenure periods
  - start: 1995
    end: 2003
    role: Guitar
  - start: 2010
    end: null                           # null = present
    role: Guitar/Backings
meta:
  - key: Name
    value: Paul Coenradie
  - key: Role
    value: Guitar/backings
---

Optional bio content...
```

**Components to Build:**

- `BandTimeline` — Main horizontal timeline container
- `MemberLane` — Individual member's tenure visualization
- `MemberCard` — Popup/detail card with photo and info
- `TimelineAxis` — Year markers and scale
- `RoleFilter` — Filter by instrument/role type

**Visualization Options:**

**Option A: Horizontal Swimlanes**
```
1992  1995  2000  2005  2010  2015  2020  2025
|-----|-----|-----|-----|-----|-----|-----|
Robby ████████████████████████████████████████
Paul       ████████        ████████████████████
Johan           ██████████████
Maria                              ████████████
```

**Option B: Vertical Timeline with Overlapping Cards**
- Scrollable vertical timeline
- Members appear/disappear as you scroll through years
- More visual, photo-focused

**Option C: Interactive Network Graph**
- Central node for the band
- Members as connected nodes
- Click to expand details
- Good for showing relationships

**Recommendation:** Option A (Horizontal Swimlanes) — Clear, scannable, works well for showing tenure overlaps.

**Interactivity:**

- Hover over a period to highlight that member
- Click to open detail modal with full bio
- Filter by role (vocals, guitar, bass, drums, keys)
- Toggle "show current only" / "show all"
- Scrub through time to see lineup at any point

**Technical Notes:**

- Use CSS Grid or SVG for the timeline visualization
- Consider `framer-motion` for smooth animations
- Generate timeline data at build time from `_band` collection
- Mobile: collapse to vertical scrollable list

---

### 11. Tour Statistics

**Goal:** Aggregate statistics from all live events.

**Statistics to Calculate:**

- Total shows played
- Unique cities
- Unique countries
- Shows per year (chart)
- Most visited cities (top 10)
- Most visited countries (top 10)
- Average shows per year
- Longest gap between shows
- Busiest year

**Implementation:**

- Build-time aggregation from `_live` collection
- Generate static JSON with all stats
- Display on `/live/stats` or `/about/stats` page

**Components:**

- `TourStats` — Overview cards (total shows, countries, etc.)
- `TourChart` — Shows per year bar/line chart
- `TopCities` — Ranked list of most visited cities

---

### 12. In-Depth Articles

**Goal:** Long-form content beyond news posts, with type filtering.

**New Collection (`content/_articles/*.md`):**

```yaml
---
title: "Robby's Favorite Albums of 2024"
date: 2024-12-15
type: recommendation    # article | recommendation | gear
img: /images/articles/favorites-2024.jpg
lead: "A curated list of albums that inspired me this year."
---

## Introduction
Every year I discover...

## The List

### 1. Album Name - Artist
![Album cover](image.jpg)
Why I love it...

[Listen on Spotify](https://...)
```

**Article Types:**

| Type | Purpose |
|------|---------|
| `article` | General long-form content, behind-the-scenes, essays |
| `recommendation` | Playlist/album recommendations from the artist |
| `gear` | Equipment, instruments, studio setup |

**Filtering:**

- `/articles` — All articles
- `/articles/recommendations` — Filtered by type
- `/articles/gear` — Filtered by type

**Components:**

- `ArticleCard` — Preview card for article listings
- `ArticleHeader` — Hero with image and metadata
- `ArticleFilters` — Type filter tabs/buttons

---

### 13. Gear/Equipment Page

**Goal:** Showcase instruments and gear used.

**Implementation:** Hybrid approach

- Main `/gear` page with categorized equipment
- Articles with `type: gear` for deeper dives

**Gear Page Structure:**

```markdown
# content/gear.mdx
---
title: Gear & Equipment
---

## Keyboards
- Roland JD-800
- Korg M1
- Yamaha DX7

## Guitars
- Gibson Les Paul
- Fender Stratocaster

## Studio
- Recording setup details...
```

---

## Backlog

| Feature | Description | Effort |
|---------|-------------|--------|
| Dynamic OG images | Auto-generated social share images | Medium |
| RSS feed | News/article feed | Easy |
| JSON-LD structured data | SEO schema markup | Easy |
| Printable tour poster | PDF generation of tour dates | Medium |
| Lyrics search | Full-text search across lyrics | Medium |
| Song connections graph | Visual network of songs to releases | Hard |
| Release anniversary countdown | "30th anniversary in X days" | Easy |
| QR codes for releases | Shareable codes to streaming | Easy |
| Album runtime stats | "This album is 47 minutes" | Easy |
| "Where to start" guide | Curated entry points for new fans | Easy |
| Most played cities heatmap | Visual map of frequency | Medium |
| Decade view | Browse discography by decade | Easy |
| Collaboration network | Artists collaborated with | Medium |
| Lyrics word cloud | Visual of common words | Medium |
| Year in review pages | Auto-generated yearly summaries | Medium |
| Album mood tags | Filter by mood/vibe | Easy |
| "If you like X, try Y" | Inter-release recommendations | Easy |
| Release format badges | CD/vinyl/digital icons | Easy |
| Easter eggs | Hidden features (Konami code, etc.) | Easy |
| Newsletter signup | Beehiiv/Mailerlite integration | Easy |
| Instagram feed | Manual curation or API | Medium |
| Headless CMS migration | Migrate from markdown to Sanity | Large |

---

## Technical Infrastructure

### Build Scripts

| Script | Purpose |
|--------|---------|
| `scripts/geocode-events.ts` | Auto-geocode events from city/country using Nominatim |
| `scripts/extract-colors.ts` | Extract album art colors for gradients using node-vibrant |
| `scripts/generate-stats.ts` | Aggregate tour/song statistics |
| `scripts/generate-on-this-day.ts` | Create date-keyed lookup for "On This Day" |

### Dependencies

| Package | Purpose |
|---------|---------|
| `react-leaflet` | Map component |
| `leaflet` | Map library |
| `leaflet.markercluster` | Marker clustering |
| `node-vibrant` | Color extraction from images |
| `date-fns` | Date manipulation |

### New Collections

| Collection | Path | Purpose |
|------------|------|---------|
| `_timeline` | `content/_timeline/*.md` | Milestones and historical events |
| `_articles` | `content/_articles/*.md` | Long-form content with types |

### Schema Extensions

| Collection | New Fields |
|------------|------------|
| `_releases` | `spotify`, `discogs`, `buyLink`, `formats`, `gallery` |
| `_live` | `lat`, `lng` (auto-generated via geocoding) |
| `_band` | `current`, `periods` (array with start/end/role) |

---

## File Structure After Implementation

```
content/
├── _articles/           # NEW
│   ├── 2024-robby-recommends.md
│   └── studio-gear.md
├── _band/
├── _carousel/
├── _data/
├── _live/               # Extended with lat/lng
├── _posts/
├── _releases/           # Extended schema
├── _songs/
├── _timeline/           # NEW
│   ├── 1992-02-01-debut-album.md
│   └── 1995-06-15-first-tour.md
├── about.mdx
└── gear.mdx             # NEW

src/
├── components/
│   ├── content/
│   │   ├── ArticleCard.tsx
│   │   ├── BandTimeline.tsx        # NEW - band member timeline
│   │   ├── EventMap.tsx
│   │   ├── GradientBackground.tsx
│   │   ├── MemberCard.tsx          # NEW - band member detail card
│   │   ├── MemberLane.tsx          # NEW - member tenure visualization
│   │   ├── OnThisDay.tsx
│   │   ├── ReleaseGallery.tsx
│   │   ├── ReleaseHero.tsx
│   │   ├── Setlist.tsx
│   │   ├── SongOfTheDay.tsx
│   │   ├── SpotifyEmbed.tsx
│   │   ├── Timeline.tsx
│   │   └── TourStats.tsx
│   └── ...
├── lib/
│   ├── articles.ts      # NEW
│   ├── colors.ts        # NEW - color utilities
│   ├── geocode.ts       # NEW
│   ├── timeline.ts      # NEW
│   └── ...
└── scripts/
    ├── extract-colors.ts
    ├── geocode-events.ts
    ├── generate-on-this-day.ts
    └── generate-stats.ts
```

---

## Summary

**Total Features:** 13 (across 3 phases) + 21 backlog items

| Phase | Features |
|-------|----------|
| Phase 1 (Core) | Rich release pages, Spotify integration, Event map, Timeline, Press kit |
| Phase 2 (Engagement) | On This Day, Song of the Day, Setlist archive, Dynamic gradients |
| Phase 3 (Content) | Band member timeline, Tour stats, Articles, Gear page |

**Key Technical Work:**

- Auto-geocoding with Nominatim (OpenStreetMap)
- Color extraction from album art using node-vibrant
- Build-time data aggregation for statistics
- New markdown collections and extended schemas
