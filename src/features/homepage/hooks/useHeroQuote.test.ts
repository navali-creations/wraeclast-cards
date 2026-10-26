// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HERO_QUOTE_ATTRIBUTION, HERO_QUOTES } from "./heroQuotes";
import { getHeroQuote, getRandomHeroQuote, useHeroQuote } from "./useHeroQuote";

beforeEach(() => {
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getHeroQuote", () => {
  it("maps an index to a quote and attribution", () => {
    expect(getHeroQuote(17)).toEqual({
      quote: HERO_QUOTES[17],
      attribution: HERO_QUOTE_ATTRIBUTION,
      sizeClass: "sm:text-2xl lg:text-[2.35rem]",
    });
  });
});

describe("getRandomHeroQuote", () => {
  it("does not select an excluded quote", () => {
    expect(getRandomHeroQuote([HERO_QUOTES[0]], 0).quote).toBe(HERO_QUOTES[1]);
  });

  it("can select the last available quote", () => {
    expect(getRandomHeroQuote([], 0.999).quote).toBe(HERO_QUOTES.at(-1));
  });
});

describe("useHeroQuote", () => {
  it("selects a new quote each time the homepage mounts", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const firstVisit = renderHook(() => useHeroQuote());
    expect(firstVisit.result.current.quote).toBe(HERO_QUOTES[1]);
    firstVisit.unmount();

    const returnVisit = renderHook(() => useHeroQuote());
    expect(returnVisit.result.current.quote).toBe(HERO_QUOTES[2]);
  });
});
