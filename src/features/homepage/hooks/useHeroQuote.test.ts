import { describe, expect, it } from "vitest";
import { HERO_QUOTE_ATTRIBUTION, HERO_QUOTES } from "./heroQuotes";
import { getHeroQuote } from "./useHeroQuote";

describe("getHeroQuote", () => {
  it("maps a pathname to a stable quote and attribution", () => {
    expect(getHeroQuote("/path-of-exile/keepers")).toEqual({
      quote: HERO_QUOTES[20],
      attribution: HERO_QUOTE_ATTRIBUTION,
      sizeClass: "sm:text-2xl lg:text-[2.35rem]",
    });
  });

  it("uses the pathname when selecting a quote", () => {
    expect(getHeroQuote("/").quote).not.toBe(
      getHeroQuote("/path-of-exile/keepers").quote,
    );
  });
});
