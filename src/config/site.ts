export const siteConfig = {
  name: "Robby Valentine",
  title: "Robby Valentine: The Official Website",
  description:
    "The official website for multi-instrumentalist, songwriter and producer Robby Valentine from the Netherlands.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://robbyvalentine.com",
  contactEmail: "info@pimderks.com",
  defaultOgImage: "/images/og-default.jpg",
  socialLinks: {
    facebook: "https://www.facebook.com/robbyvalentineofficial",
    instagram: "https://www.instagram.com/robbyvalentineofficial",
    youtube: "https://www.youtube.com/user/RobbyValentineMusic",
    spotify:
      "https://open.spotify.com/artist/5nGIFgo0shDenQYSE0Writ?si=yTl5k0muTMSqVl1MV3W2WQ",
    appleMusic:
      "https://music.apple.com/us/artist/robby-valentine/152abortrson566",
  },
  navigation: {
    main: [
      { label: "News", href: "/news", side: "left" as const, external: false },
      { label: "Music", href: "/music", side: "left" as const, external: false },
      { label: "Live", href: "/live", side: "left" as const, external: false },
      { label: "About", href: "/about", side: "right" as const, external: false },
      { label: "Shop", href: "https://robbyvalentine.myonline.store/", side: "right" as const, external: true },
      { label: "Contact", href: "/contact", side: "right" as const, external: false },
    ],
    music: [
      { label: "All Releases", href: "/music" },
      { label: "Albums", href: "/music/albums" },
      { label: "Singles", href: "/music/singles" },
      { label: "Compilations", href: "/music/compilations" },
      { label: "Collaborations", href: "/music/collaborations" },
      { label: "Songs", href: "/music/songs" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
