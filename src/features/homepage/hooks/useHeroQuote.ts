import { useMemo } from "react";
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

export function useHeroQuote(): HeroQuote {
  return useMemo(() => {
    const quote = HERO_QUOTES[Math.floor(Math.random() * HERO_QUOTES.length)];
    return {
      quote,
      attribution: HERO_QUOTE_ATTRIBUTION,
      sizeClass: getQuoteSizeClass(quote),
    };
  }, []);
}
