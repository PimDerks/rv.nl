import Image from "next/image";
import Link from "next/link";

import { Navigation } from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Header(): React.ReactElement {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
    >
      {/* Three-column grid: left nav | centred logo | right nav + toggle */}
      <div className="container mx-auto grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 md:py-0">
        {/* Left half of nav */}
        <Navigation side="left" />

        {/* Logo — centred */}
        <Link href="/" className="flex justify-center py-2 md:py-3" aria-label="Robby Valentine — home">
          <Image
            src="/images/logo.svg"
            alt="Robby Valentine"
            width={120}
            height={60}
            className="h-10 w-auto md:h-14 lg:h-16 transition-all duration-300"
            priority
          />
        </Link>

        {/* Right half of nav + theme toggle */}
        <div className="flex items-center justify-end gap-2">
          <Navigation side="right" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
