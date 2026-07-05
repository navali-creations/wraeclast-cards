import type { VisibilityState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export interface ResponsiveColumnVisibilityConfig {
  /** Columns hidden once the viewport drops below 768px. */
  tabletHidden: string[];
  /** Additional columns hidden once the viewport drops below 640px. */
  mobileHidden: string[];
}

function getVisibilityForViewport(
  config: ResponsiveColumnVisibilityConfig,
): VisibilityState {
  if (typeof window === "undefined") return {};
  const w = window.innerWidth;
  if (w >= 768) return {};
  const hidden = w >= 640 ? config.tabletHidden : config.mobileHidden;
  return Object.fromEntries(hidden.map((id) => [id, false]));
}

const BREAKPOINT_QUERIES = ["(min-width: 640px)", "(min-width: 768px)"];

export function useResponsiveColumnVisibility(
  config: ResponsiveColumnVisibilityConfig,
) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => getVisibilityForViewport(config),
  );

  useEffect(() => {
    const update = () => setColumnVisibility(getVisibilityForViewport(config));
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
  }, [config]);

  return [columnVisibility, setColumnVisibility] as const;
}
