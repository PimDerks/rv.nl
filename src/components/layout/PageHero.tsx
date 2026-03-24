interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Path to the header image. Falls back to a default background. */
  image?: string;
  centered?: boolean;
}

export function PageHero({
  title,
  subtitle,
  image = "/images/background.jpg",
  centered = false,
}: PageHeroProps): React.ReactElement {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `url('${image}')`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        paddingTop: "15%",
        paddingBottom: "6rem",
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(48,48,48,0.35)" }}
        aria-hidden="true"
      />

      {/* Gradient fade to page background at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--color-background))",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className={`relative z-10 container mx-auto px-4 ${centered ? "text-center" : ""}`}
        style={{ textShadow: "0 0 0.5em rgba(0,0,0,0.5)" }}
      >
        {subtitle && (
          <div className="mb-4">
            <span className="inline-block bg-black px-3 py-1 font-display text-sm text-brand">
              {subtitle}
            </span>
          </div>
        )}
        <h1 className="font-display text-4xl text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
