"use client";

import { useEffect, useState } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  /** Content rendered above the h1 in the hero area (e.g. album art) */
  heroContent?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHero({
  title,
  subtitle,
  image = "/images/background.jpg",
  heroContent,
  children,
}: PageHeroProps): React.ReactElement {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onScroll = (): void => setScrollY(window.scrollY);
    const onMouse = (e: MouseEvent): void => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        // Y-axis: only move a small amount — dampen to 15% of actual movement, anchored near centre
        y: 40 + ((e.clientY / window.innerHeight) - 0.5) * 15,
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const parallax = scrollY * -0.08;
  const blur = 20 + Math.min(scrollY / 30, 20);
  const darkOpacity = Math.min(0.45 + scrollY / 1200, 0.8);

  // Spotlight mask size shrinks as user scrolls down
  const spotlightSize = Math.max(70 - scrollY / 20, 30);

  return (
    <div className="relative">
      <div
        className="fixed inset-x-0 top-0 h-screen overflow-hidden -z-10"
        aria-hidden="true"
      >
        {/* Layer 1: Greyscale base — always visible */}
        <div
          className="absolute inset-[-10%]"
          style={{
            backgroundImage: `url('${image}')`,
            backgroundPosition: "center 20%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            transform: `translateY(${parallax}px)`,
            filter: `blur(${blur}px) saturate(0) contrast(1.3) brightness(0.5)`,
          }}
        />

        {/* Layer 2: Dark wash over greyscale */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${darkOpacity})` }}
        />

        {/* Layer 3: Colour reveal — saturated image masked by a radial
            gradient that follows the mouse. Only visible where the
            spotlight shines through. */}
        <div
          className="absolute inset-[-10%]"
          style={{
            backgroundImage: `url('${image}')`,
            backgroundPosition: "center 20%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            transform: `translateY(${parallax}px)`,
            filter: `blur(${blur + 10}px) saturate(2) brightness(0.8)`,
            maskImage: `radial-gradient(ellipse ${spotlightSize}% ${spotlightSize}% at ${mousePos.x}% ${mousePos.y}%, rgba(0,0,0,0.6) 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse ${spotlightSize}% ${spotlightSize}% at ${mousePos.x}% ${mousePos.y}%, rgba(0,0,0,0.6) 0%, transparent 100%)`,
            transition: "mask-image 600ms ease-out, -webkit-mask-image 600ms ease-out",
          }}
        />

        {/* Gradient fade into page background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/3"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-background))",
          }}
        />
      </div>

      {/* Hero title */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-28 pb-10 md:pt-36 md:pb-14 text-center">
        {heroContent && (
          <div className="mb-6 md:mb-8">
            {heroContent}
          </div>
        )}
        <h1
          className="font-display tracking-wide text-white max-w-4xl"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)", textWrap: "balance" }}
        >
          {title}
        </h1>
        {subtitle && (
          <div className="mt-4">
            <span className="inline-block bg-brand px-4 py-1.5 font-display text-sm tracking-wider uppercase text-primary-foreground">
              {subtitle}
            </span>
          </div>
        )}
      </div>

      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}
