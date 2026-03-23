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
      { label: "News", href: "/news" },
      { label: "Music", href: "/music" },
      { label: "Live", href: "/live" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
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
