# Migration Plan: Jekyll → Next.js

**Project:** Robby Valentine Official Website  
**Date:** 2026-03-23  
**Status:** Approved, ready for implementation

---

## Decisions Log

| Topic | Decision |
|---|---|
| Visual design | Modernise significantly — same structure, cleaner contemporary aesthetic |
| Email transport | Resend API |
| Hosting | Vercel |
| Release filtering | Separate routes per type, shared layout component |
| Carousel source | New `content/_carousel/` folder, one `.md` per slide |
| Song → Release cross-reference | Reverse-index tracklist data at build time |
| Theme toggle | Header nav |
| Live page rendering | Dynamic SSR (accurate past/upcoming split at request time) |
| News pagination | 6 per page, `/news?page=N` |
| Release type derivation | `type` front matter field (not `permalink`) |
| Release type audit | One fix needed: `pride-heart-magic-infinity-demos.md` has `type: compilation` but `permalink: /music/albums/:title/` — fix to `/music/compilations/:title/` |
| Post format | MDX (handles YouTube embeds + richer content going forward) |
| Song format | Plain `.md` (uniform structure, no embeds) |
| Band member format | MDX (future-proof for bios) |
| YouTube embeds in posts | `<YouTubeEmbed>` MDX component (3 posts affected: 2017-04-26, 2017-10-22, 2018-03-09) |
| CTA buttons in posts | Downgrade to plain Markdown links (2 posts: 2018-02-28, 2018-03-09) |
| Song structure labels | `<p class="em">` → `**Chorus:**` bold in Markdown |
| About page | MDX file at `content/about.mdx` |
| SEO | Full JSON-LD structured data (MusicAlbum, MusicComposition, MusicEvent, BlogPosting, Person, WebSite) + og:image per page type |
| Search | Out of scope |
| Fonts | Playfair Display (headings) + Inter (body) via `next/font/google` |
| Contact page layout | Two-column: form left, info + social links right sidebar |
| Live page collapsed | `/live/past/` merged into `/live/` (split by date at runtime) |

---

## Tech Stack

| Concern | Package |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| Styling | Tailwind CSS v4 |
| Variants | `class-variance-authority` |
| Theming | `next-themes` + Tailwind `darkMode: 'class'` |
| UI components | Shadcn/ui (Carousel/Embla, Table, Button, Dialog, Form, Input, Textarea) |
| Posts / band content | `next-mdx-remote` |
| Songs / live / releases | `gray-matter` + `remark` + `rehype-stringify` + `rehype-raw` |
| YAML data files | `js-yaml` |
| Icons | `lucide-react` (ships with Shadcn) |
| Fonts | `next/font/google` |
| Email | `resend` SDK |
| Form | `react-hook-form` + `zod` |
| JSON-LD | Inline `<script type="application/ld+json">` via `generateMetadata` |

---

## Project Structure (Target)

```
/
├── content/
│   ├── _releases/            # 72 .md — unchanged except one permalink fix
│   ├── _songs/               # 188 .md — HTML bodies converted to Markdown
│   ├── _live/                # 136 .md — unchanged
│   ├── _posts/               # 36 .mdx — HTML bodies converted to Markdown, renamed
│   ├── _band/                # 7 .mdx — renamed from .md (bodies empty, future-proof)
│   ├── _carousel/            # NEW: one .md per slide (replaces _data/carousel.yml)
│   │   └── embrace-the-unknown.md
│   ├── _data/
│   │   └── navigation.yml    # unchanged
│   └── about.mdx             # Migrated from src/jekyll/about/index.html
├── public/
│   └── images/               # Moved from src/jekyll/images/ — unchanged
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                          # Homepage
│   │   ├── news/
│   │   │   ├── page.tsx                      # Paginated index (?page=N, 6 per page)
│   │   │   └── [slug]/
│   │   │       └── page.tsx                  # MDX rendered post
│   │   ├── music/
│   │   │   ├── page.tsx                      # All releases
│   │   │   ├── [type]/
│   │   │   │   ├── page.tsx                  # Shared listing layout (albums/singles/etc.)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx              # Shared release detail layout
│   │   │   └── songs/
│   │   │       ├── page.tsx                  # All songs A-Z
│   │   │       └── [slug]/
│   │   │           └── page.tsx              # Song detail: lyrics + credits + release back-links
│   │   ├── live/
│   │   │   └── page.tsx                      # dynamic — SSR, split by today's date
│   │   ├── about/
│   │   │   ├── page.tsx                      # Renders content/about.mdx
│   │   │   └── band/
│   │   │       └── [slug]/
│   │   │           └── page.tsx              # Band member profile
│   │   └── contact/
│   │       ├── page.tsx                      # Two-column: form + info sidebar
│   │       └── actions.ts                    # Server Action → Resend API
│   ├── components/
│   │   ├── ui/                               # Shadcn primitives (auto-generated)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx                # Reads navigation.yml at build time
│   │   │   ├── SubNavigation.tsx             # Music section tabs (horizontal scroll on mobile)
│   │   │   └── ThemeToggle.tsx               # Client component — Sun/Moon, lives in header
│   │   ├── content/
│   │   │   ├── ReleaseCard.tsx
│   │   │   ├── ReleaseGrid.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── Tracklist.tsx
│   │   │   ├── EventTable.tsx                # Renders upcoming + past, receives pre-split arrays
│   │   │   ├── BandMemberCard.tsx
│   │   │   ├── HeroCarousel.tsx              # Client component (Shadcn/Embla)
│   │   │   ├── SongCredits.tsx
│   │   │   ├── ReleaseBadge.tsx              # "Appears on: X, Y" — derived from tracklist reverse-index
│   │   │   └── ContactForm.tsx               # Client component (react-hook-form + zod)
│   │   └── mdx/
│   │       └── YouTubeEmbed.tsx              # Used inline in 3 MDX posts
│   ├── lib/
│   │   ├── content.ts                        # Generic gray-matter file loader utility
│   │   ├── releases.ts                       # getAllReleases(), getBySlug(), getByType()
│   │   ├── posts.ts                          # getAllPosts(), getBySlug() — MDX source
│   │   ├── songs.ts                          # getAllSongs(), getBySlug(), getReleasesBySong()
│   │   ├── live.ts                           # getAllLive() sorted by date ascending
│   │   ├── band.ts                           # getAllBandMembers(), getBySlug() — MDX source
│   │   ├── carousel.ts                       # getCarouselSlides() sorted by order field
│   │   └── markdown.ts                       # Shared remark + rehype pipeline for .md content
│   ├── config/
│   │   └── site.ts                           # siteUrl, contactEmail, siteName, socialLinks, etc.
│   ├── types/
│   │   ├── release.ts
│   │   ├── post.ts
│   │   ├── song.ts
│   │   ├── live.ts
│   │   ├── band.ts
│   │   └── carousel.ts
│   └── styles/
│       └── globals.css                       # Tailwind @import + CSS custom properties for themes
├── .env.local                                # RESEND_API_KEY (not committed)
├── .env.example                              # Documented env vars stub
├── components.json                           # Shadcn config
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Content Migration Work

### Files preserved with zero changes

- `content/_releases/*.md` (72 files) — except one fix below
- `content/_live/*.md` (136 files)
- `content/_data/navigation.yml`
- `public/images/**` (208 files moved, not modified)

### File fixes and conversions

| Task | Files | Complexity | Notes |
|---|---|---|---|
| Fix `pride-heart-magic-infinity-demos.md` | 1 `.md` | Trivial | Change `permalink: /music/albums/:title/` → `/music/compilations/:title/` |
| Convert `_songs` HTML → Markdown | 188 `.md` | Trivial (mechanical) | `<p>` → blank-line paragraph; `<br />` → two trailing spaces + newline; `<p class="em">` → `**Label:**`; 15 files have no body (leave as-is); 3 have plain text body (leave as-is) |
| Convert `_posts` HTML → Markdown + rename `.mdx` | 36 files | Moderate | `<p>`, `<a>`, `<ul>/<ol>/<li>`, `<h2>` → standard Markdown; `<a class="button">` → plain link (2 posts); `<iframe>` YouTube → `<YouTubeEmbed url="...">` component (3 posts); `<p style="font-style:italic;">` → `*...*` (1 post); `<img>` → `![](...)` (2 posts); fix unclosed `</p>` in `2012-01-19-queen-convention.mdx`; `<div class="u-ratio...">` wrapper → remove, embed component handles aspect ratio |
| Rename `_band/*.md` → `.mdx` | 7 files | Trivial | File rename only — bodies are empty |
| Create `content/_carousel/` | 1 new `.md` | Trivial | Extract from `_data/carousel.yml`; add `order: 1` field |
| Create `content/about.mdx` | 1 new `.mdx` | Moderate | Strip Liquid template tags; convert HTML to Markdown prose; extract sidebar profile data to front matter; keep all internal links intact |

### Carousel slide front matter format (new)

```yaml
---
title: "Embrace The Unknown"
subtitle: "Order now!"
link: "https://robbyvalentine.myonline.store/..."
external: true
image: /images/albums/embrace-the-unknown.jpg
order: 1
---
```

### About page front matter format (new)

```yaml
---
title: About
subtitle: Biography
headerImage: /images/headers/alliance3.jpg
profile:
  name: Robby Valentine
  dateOfBirth: December 4th, 1968
  influences: "Queen, Electric Light Orchestra, Beatles"
  instruments: "Piano, guitar"
  maritalState: "Married, 1 child"
---
```

---

## Route Map

| Jekyll URL | Next.js route | Rendering |
|---|---|---|
| `/` | `app/page.tsx` | Static (ISR) |
| `/news/` `/news/2/` | `app/news/page.tsx?page=2` | Static |
| `/news/:title/` | `app/news/[slug]/page.tsx` | Static (`generateStaticParams`) |
| `/music/` | `app/music/page.tsx` | Static |
| `/music/albums/` | `app/music/albums/page.tsx` | Static via `[type]` |
| `/music/albums/:title/` | `app/music/albums/[slug]/page.tsx` | Static via `[type]/[slug]` |
| `/music/singles/:title/` | `app/music/singles/[slug]/page.tsx` | Static |
| `/music/compilations/:title/` | `app/music/compilations/[slug]/page.tsx` | Static |
| `/music/collaborations/:title/` | `app/music/collaborations/[slug]/page.tsx` | Static |
| `/music/songs/` | `app/music/songs/page.tsx` | Static |
| `/music/songs/:title/` | `app/music/songs/[slug]/page.tsx` | Static |
| `/live/` + `/live/past/` | `app/live/page.tsx` | **Dynamic SSR** |
| `/about/` | `app/about/page.tsx` | Static |
| `/about/band/:title/` | `app/about/band/[slug]/page.tsx` | Static |
| `/contact/` | `app/contact/page.tsx` | Static |

---

## JSON-LD Structured Data

| Route | Schema type |
|---|---|
| `/` | `WebSite` + `MusicGroup` |
| `/music/albums/[slug]` | `MusicAlbum` |
| `/music/singles/[slug]` | `MusicAlbum` (type: Single) |
| `/music/songs/[slug]` | `MusicComposition` |
| `/live/` | `Event` per upcoming gig |
| `/news/[slug]` | `BlogPosting` |
| `/about/` | `Person` |

---

## OG Image Strategy

| Page type | og:image source |
|---|---|
| Release detail | `release.img` |
| News post | `post.img` |
| Band member | `member.img` |
| Song | First release the song appears on → `release.img` |
| All others | Site-wide fallback (to be created at `public/images/og-default.jpg`) |

---

## Contact Form

- **`app/contact/page.tsx`** — Two-column layout: form left, press/bookings info + social links right
- **`app/contact/actions.ts`** — Next.js Server Action; calls `resend.emails.send()` with data from form
- **`src/config/site.ts`** — `contactEmail` field is the single place to configure the recipient address
- Fields: Name, Email, Subject, Message
- Validation: `zod` schema, errors surfaced via `react-hook-form`
- Success/error feedback: inline form state (no page redirect)

---

## Dark / Light Theme

- `next-themes` `ThemeProvider` wraps the root layout
- Tailwind configured with `darkMode: 'class'`
- CSS custom properties in `globals.css`:
  - `:root` — light mode tokens
  - `.dark` — dark mode tokens
- Semantic token names used throughout (`bg-background`, `text-foreground`, `border-border`, etc.) — never raw colour values
- `ThemeToggle.tsx` — client component in header, Shadcn `Button` variant ghost, Lucide `Sun`/`Moon` icons

---

## Typography

- **Headings:** Playfair Display — high-contrast serif, theatrical quality that suits the artist's glam rock heritage
- **Body:** Inter — neutral, highly legible, strong complement to the display serif
- Both loaded via `next/font/google`, self-hosted by Next.js (zero FOUC, no external requests)

---

## Files to Delete After Migration

- `gulpfile.js`
- `gulp/` (entire directory)
- `src/static/scss/` (all SCSS — replaced by Tailwind)
- `src/static/js/` (VanillaTilt + polyfills — obsolete)
- `src/jekyll/_layouts/`
- `src/jekyll/_includes/`
- `src/jekyll/_data/carousel.yml` (replaced by `content/_carousel/`)
- `src/jekyll/_faq/` (dropped — placeholder content only)
- `src/jekyll/_timeline/` (dropped — single unused entry)
- `src/jekyll/` (all remaining after content has been moved)
- `_config.yml`
- `.scss-lint.yml`
- `.jshintrc`
- `.jscsrc`
- `.htmlhintrc`
- `package.json` (rewritten from scratch for Next.js)

---

## Implementation Phases

### Phase 1 — Scaffold
- `create-next-app` with TypeScript, App Router, Tailwind
- Install all dependencies
- Configure Tailwind v4, `next-themes`, Shadcn (`components.json`)
- Set up `next.config.ts` (MDX support via `next-mdx-remote`, image domains)
- Create `.env.example` with `RESEND_API_KEY` documented

### Phase 2 — Site config
- `src/config/site.ts` — `siteName`, `siteUrl`, `contactEmail`, `socialLinks`, `defaultOgImage`

### Phase 3 — Content migration
- Copy `src/jekyll/images/` → `public/images/`
- Copy `src/jekyll/_releases/` → `content/_releases/`; fix `pride-heart-magic-infinity-demos.md`
- Copy `src/jekyll/_live/` → `content/_live/`
- Copy `src/jekyll/_data/navigation.yml` → `content/_data/navigation.yml`
- Convert + copy `src/jekyll/_songs/` → `content/_songs/` (HTML → Markdown)
- Convert + rename + copy `src/jekyll/_posts/` → `content/_posts/` (HTML → MDX)
- Rename + copy `src/jekyll/_band/` → `content/_band/` (`.md` → `.mdx`)
- Create `content/_carousel/embrace-the-unknown.md`
- Create `content/about.mdx` from `src/jekyll/about/index.html`

### Phase 4 — Content layer
- `lib/content.ts` — generic file loader
- `lib/markdown.ts` — remark + rehype pipeline
- `lib/releases.ts` — `getAllReleases()`, `getBySlug()`, `getByType()`
- `lib/posts.ts` — `getAllPosts()`, `getBySlug()` (MDX source string)
- `lib/songs.ts` — `getAllSongs()`, `getBySlug()`, `getReleasesBySong()` (reverse index)
- `lib/live.ts` — `getAllLive()` sorted ascending
- `lib/band.ts` — `getAllBandMembers()`, `getBySlug()` (MDX source string)
- `lib/carousel.ts` — `getCarouselSlides()` sorted by `order`
- All TypeScript types in `src/types/`

### Phase 5 — Root layout + global components
- `globals.css` — Tailwind `@import`, CSS custom properties (light + dark tokens)
- `app/layout.tsx` — `ThemeProvider`, fonts, `Header`, `Footer`
- `Header.tsx`, `Navigation.tsx`, `ThemeToggle.tsx`, `Footer.tsx`

### Phase 6 — Homepage
- `app/page.tsx`
- `HeroCarousel.tsx` — client component, Shadcn/Embla
- Latest news grid (6 posts)
- Latest releases grid (4 releases)

### Phase 7 — Music section
- `app/music/page.tsx` — all releases
- `app/music/[type]/page.tsx` — filtered listing (albums / singles / compilations / collaborations)
- `app/music/[type]/[slug]/page.tsx` — release detail with tracklist and JSON-LD MusicAlbum
- `app/music/songs/page.tsx` — all songs A-Z
- `app/music/songs/[slug]/page.tsx` — lyrics + credits + release back-links + JSON-LD MusicComposition
- `SubNavigation.tsx` — horizontal scroll tabs on mobile
- `ReleaseCard.tsx`, `ReleaseGrid.tsx`, `Tracklist.tsx`, `SongCredits.tsx`, `ReleaseBadge.tsx`

### Phase 8 — News section
- `app/news/page.tsx` — paginated (`?page=N`, 6 per page)
- `app/news/[slug]/page.tsx` — MDX rendering with `next-mdx-remote`, JSON-LD BlogPosting
- `NewsCard.tsx`
- `mdx/YouTubeEmbed.tsx`

### Phase 9 — Live page
- `app/live/page.tsx` — `export const dynamic = 'force-dynamic'`
- Split `getAllLive()` result into upcoming/past at request time using `new Date()`
- `EventTable.tsx` — two sections: upcoming first, past grouped by year below
- JSON-LD `Event` array for upcoming gigs

### Phase 10 — About section
- `app/about/page.tsx` — renders `content/about.mdx`, profile sidebar from front matter, JSON-LD Person
- `app/about/band/[slug]/page.tsx` — MDX rendering, band member profile
- `BandMemberCard.tsx`

### Phase 11 — Contact page
- `app/contact/page.tsx` — two-column layout
- `ContactForm.tsx` — client component, `react-hook-form` + `zod`
- `app/contact/actions.ts` — Server Action calling Resend
- Inline success/error feedback states

### Phase 12 — SEO
- `generateMetadata` on every dynamic route
- OG images sourced from content (see strategy above)
- JSON-LD `<script>` blocks (see schema map above)
- `next-sitemap` for `sitemap.xml` + `robots.txt`

### Phase 13 — Cleanup
- Delete all Jekyll, Gulp, SCSS, and legacy config files (see list above)
- Remove `src/jekyll/` entirely once all content has been confirmed migrated
- Archive old `package.json` if needed, replace entirely
