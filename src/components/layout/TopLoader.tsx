"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

export function TopLoader(): React.ReactElement {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(false);
    setProgress(100);

    const timeout = setTimeout(() => {
      setProgress(0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href.startsWith("#") || href.startsWith("http") || anchor.target === "_blank") {
        return;
      }

      setIsLoading(true);
      setProgress(30);

      setTimeout(() => {
        setProgress(70);
      }, 200);
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-[99999] h-0.5 bg-brand transition-all duration-300",
        isLoading ? "opacity-100" : progress === 100 ? "opacity-0" : "opacity-0"
      )}
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
