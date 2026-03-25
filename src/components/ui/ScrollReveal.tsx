"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/lib/hooks/use-scroll-reveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before animation starts */
  delay?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps): React.ReactElement {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={cn("reveal", isVisible && "visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
