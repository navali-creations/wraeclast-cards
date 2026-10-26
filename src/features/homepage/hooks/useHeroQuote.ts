import { useEffect, useState } from "react";
import { HERO_QUOTE_ATTRIBUTION, HERO_QUOTES } from "./heroQuotes";

const LONG_QUOTE_LENGTH = 65;
const VERY_LONG_QUOTE_LENGTH = 95;
const HERO_QUOTE_STORAGE_KEY = "wraeclast-cards:hero-quote";

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

export function getHeroQuote(index: number): HeroQuote {
  const quote = HERO_QUOTES[index];
  return {
    quote,
    attribution: HERO_QUOTE_ATTRIBUTION,
    sizeClass: getQuoteSizeClass(quote),
  };
}

export function getRandomHeroQuote(
  excludedQuotes: readonly string[] = [],
  randomValue = Math.random(),
): HeroQuote {
  const availableQuotes = HERO_QUOTES.filter(
    (quote) => !excludedQuotes.includes(quote),
  );
  const quotePool = availableQuotes.length > 0 ? availableQuotes : HERO_QUOTES;
  const index = Math.min(
    Math.floor(randomValue * quotePool.length),
    quotePool.length - 1,
  );

  return getHeroQuote(HERO_QUOTES.indexOf(quotePool[index]));
}

const INITIAL_HERO_QUOTE = getHeroQuote(0);

export function useHeroQuote(): HeroQuote {
  const [heroQuote, setHeroQuote] = useState(INITIAL_HERO_QUOTE);

  useEffect(() => {
    let previousQuote: string | null = null;

    try {
      previousQuote = window.sessionStorage.getItem(HERO_QUOTE_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }

    const nextQuote = getRandomHeroQuote(
      previousQuote
        ? [INITIAL_HERO_QUOTE.quote, previousQuote]
        : [INITIAL_HERO_QUOTE.quote],
    );

    try {
      window.sessionStorage.setItem(HERO_QUOTE_STORAGE_KEY, nextQuote.quote);
    } catch {
      // The quote can still be shuffled without persisting the last choice.
    }

    setHeroQuote(nextQuote);
  }, []);

  return heroQuote;
}
