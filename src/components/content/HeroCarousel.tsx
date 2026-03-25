"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import type { CarouselSlide } from "@/types";

interface HeroCarouselProps {
  slides: CarouselSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps): React.ReactElement {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (slides.length === 0) {
    return <div className="aspect-[21/9] bg-muted" />;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.slug}
              className="relative flex-[0_0_100%] min-w-0 aspect-[21/9]"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              {/* Image overlay context — hard-coded dark gradient + white text is intentional */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <h2
                  className="font-display text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase text-white mb-2"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
                >
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl text-white/90 mb-4">
                    {slide.subtitle}
                  </p>
                )}
                {slide.external ? (
                  <a
                    href={slide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md font-display text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
                  >
                    Order Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={slide.link}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md font-display text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
                  >
                    Learn More
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/70 text-foreground"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/70 text-foreground"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}
