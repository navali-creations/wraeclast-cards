import type { VisibilityState } from "@tanstack/react-table";
import { useState } from "react";
import { useClientLayoutEffect } from "../../lib/useClientLayoutEffect/useClientLayoutEffect";

export interface ResponsiveColumnVisibilityConfig {
  /** Columns hidden once the viewport drops below 768px. */
  tabletHidden: string[];
  /** Additional columns hidden once the viewport drops below 640px. */
  mobileHidden: string[];
}

export function getVisibilityForViewport(
  config: ResponsiveColumnVisibilityConfig,
  width = typeof window === "undefined"
    ? Number.POSITIVE_INFINITY
    : window.innerWidth,
): VisibilityState {
  if (width >= 768) return {};
  const hidden = width >= 640 ? config.tabletHidden : config.mobileHidden;
  return Object.fromEntries(hidden.map((id) => [id, false]));
}

const BREAKPOINT_QUERIES = ["(min-width: 640px)", "(min-width: 768px)"];

export function useResponsiveColumnVisibility(
  config: ResponsiveColumnVisibilityConfig,
) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useClientLayoutEffect(() => {
    const update = () => setColumnVisibility(getVisibilityForViewport(config));
    update();
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
