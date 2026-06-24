import type { VisibilityState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

function getVisibilityForViewport(): VisibilityState {
  if (typeof window === "undefined") return {};
  const w = window.innerWidth;
  if (w >= 768) return {};
  if (w >= 640) return { weight: false };
  return { count: false, weight: false };
}

const BREAKPOINT_QUERIES = ["(min-width: 640px)", "(min-width: 768px)"];

export function useResponsiveColumnVisibility() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getVisibilityForViewport,
  );

  useEffect(() => {
    const update = () => setColumnVisibility(getVisibilityForViewport());
    const queries = BREAKPOINT_QUERIES.map((q) => {
      const mediaQuery = window.matchMedia(q);
      mediaQuery.addEventListener("change", update);
      return mediaQuery;
    });
    return () => {
      for (const mediaQuery of queries) {
        mediaQuery.removeEventListener("change", update);
      }
    };
  }, []);

  return [columnVisibility, setColumnVisibility] as const;
}
