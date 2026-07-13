import { useEffect, useState } from "react";

const CARDS_GRID_ROWS = 4;
const CARDS_GRID_WIDE_COLUMNS = 5;
const CARDS_GRID_WIDE_ROWS = 5;

// Keep these in sync with the Tailwind breakpoint tokens used by the grid
// classes below (`sm:`, `md:`, `lg:`, `xl:`). These are Tailwind's default
// responsive breakpoints: https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints
//
// The project currently only adds a custom `--breakpoint-xs` in `src/index.css`;
// it does not override `sm`/`md`/`lg`/`xl`. If those theme breakpoints ever
// change, update these values and the grid class names together.
const TAILWIND_SM = 640;
const TAILWIND_MD = 768;
const TAILWIND_LG = 1024;
const TAILWIND_XL = 1280;

export const CARDS_GRID_CLASS_NAME =
  "grid grid-cols-1 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

export const CARDS_GRID_SCALE_CLASS_NAME =
  "[--wc-card-scale:0.9] sm:[--wc-card-scale:0.86] md:[--wc-card-scale:0.7] xl:[--wc-card-scale:0.68]";

export const CARDS_GRID_SKELETON_CARD_CLASS_NAME = `wc-card-shimmer h-[calc(29.75rem*var(--wc-card-scale))] w-[calc(20rem*var(--wc-card-scale))] rounded-sm border border-(--wc-gold-dim) ${CARDS_GRID_SCALE_CLASS_NAME}`;

const CARDS_GRID_BREAKPOINT_QUERIES = [
  `(min-width: ${TAILWIND_SM}px)`,
  `(min-width: ${TAILWIND_MD}px)`,
  `(min-width: ${TAILWIND_LG}px)`,
  `(min-width: ${TAILWIND_XL}px)`,
];

function getViewportWidth() {
  return typeof window === "undefined" ? TAILWIND_XL : window.innerWidth;
}

export function getCardsGridColumnCount(width: number) {
  if (width >= TAILWIND_XL) return CARDS_GRID_WIDE_COLUMNS;
  if (width >= TAILWIND_LG) return 4;
  if (width >= TAILWIND_MD) return 3;
  if (width >= TAILWIND_SM) return 2;
  return 1;
}

export function getCardsPageSize(width: number) {
  const columns = getCardsGridColumnCount(width);
  return columns === CARDS_GRID_WIDE_COLUMNS
    ? columns * CARDS_GRID_WIDE_ROWS
    : columns * CARDS_GRID_ROWS;
}

export function useCardsPageSize() {
  const [pageSize, setPageSize] = useState(() =>
    getCardsPageSize(getViewportWidth()),
  );

  useEffect(() => {
    const updatePageSize = () => {
      const nextPageSize = getCardsPageSize(getViewportWidth());
      setPageSize((currentPageSize) =>
        currentPageSize === nextPageSize ? currentPageSize : nextPageSize,
      );
    };

    updatePageSize();
    const mediaQueries = CARDS_GRID_BREAKPOINT_QUERIES.map((query) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", updatePageSize);
      return mediaQuery;
    });

    return () => {
      for (const mediaQuery of mediaQueries) {
        mediaQuery.removeEventListener("change", updatePageSize);
      }
    };
  }, []);

  return pageSize;
}
