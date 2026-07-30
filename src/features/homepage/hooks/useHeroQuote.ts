import { useRouterState } from "@tanstack/react-router";
import { HERO_QUOTE_ATTRIBUTION, HERO_QUOTES } from "./heroQuotes";

const LONG_QUOTE_LENGTH = 65;
const VERY_LONG_QUOTE_LENGTH = 95;

function getQuoteSizeClass(quote: string): string {
  if (quote.length > VERY_LONG_QUOTE_LENGTH) return "sm:text-2xl lg:text-3xl";
  if (quote.length > LONG_QUOTE_LENGTH) return "sm:text-2xl lg:text-[2.35rem]";
  return "sm:text-3xl lg:text-[2.8rem]";
}

export type HeroQuote = {
  quote: string;
  attribution: string;
  sizeClass: string;
};

function hashPathname(pathname: string): number {
  let hash = 0;
  for (const character of pathname) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash;
}

export function getHeroQuote(pathname: string): HeroQuote {
  const quote = HERO_QUOTES[hashPathname(pathname) % HERO_QUOTES.length];
  return {
    quote,
    attribution: HERO_QUOTE_ATTRIBUTION,
    sizeClass: getQuoteSizeClass(quote),
  };
}

export function useHeroQuote(): HeroQuote {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  return getHeroQuote(pathname);
}
