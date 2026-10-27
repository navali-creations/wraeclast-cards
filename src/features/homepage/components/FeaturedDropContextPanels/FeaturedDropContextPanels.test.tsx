import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Card } from "../../../cards/types";
import { FeaturedCardsCarouselView } from "./FeaturedCardsCarouselView";
import { FeaturedLocationsChart } from "./FeaturedLocationsChart";
import type { FeaturedCardCarouselEntry } from "./types";

vi.mock("../../../../components/buttons/ButtonLink", () => ({
  ButtonInternalLink: ({ children }: { children: React.ReactNode }) => (
    <a href="/action">{children}</a>
  ),
}));

vi.mock("../../../../components/DivinationCard", () => ({
  DivinationCard: ({ card }: { card: Card }) => (
    <div data-card-preview={card.id}>{card.name}</div>
  ),
}));

vi.mock("../../../../components/DivinationCard/CardLink/CardLink", () => ({
  CardLink: ({ children }: { children: React.ReactNode }) => (
    <a href="/card">{children}</a>
  ),
}));

function featuredCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "a-dab-of-ink",
    name: "A Dab of Ink",
    frameUrl: "/frame.png",
    separatorUrl: "/separator.png",
    rewardText: "Reward",
    rewardHtml: "Reward",
    rewardSearchText: "reward",
    rewardTags: [],
    stackSize: 9,
    dropLocations: [],
    rarity: 4,
    fromBoss: false,
    isDisabled: false,
    ...overrides,
  };
}

const entries: FeaturedCardCarouselEntry[] = [
  {
    card: featuredCard(),
    rate: "0.42%",
    timeBuckets: { utc: { 0: 2, 180: 4 }, local: { 60: 3 } },
    timeBucketTotals: {
      utc: { 0: 200, 180: 400 },
      local: { 60: 300, 180: 300 },
    },
    locations: { "Atlas Hideout": 18, "Azurite Mine": 11 },
    locationTotals: { "Atlas Hideout": 1_000, "Azurite Mine": 500 },
    locatedCardTotal: 29,
  },
  {
    card: featuredCard({
      id: "the-doctor",
      name: "The Doctor",
      rarity: 1,
    }),
    rate: "<0.01%",
    timeBuckets: { utc: {}, local: {} },
    timeBucketTotals: { utc: {}, local: {} },
    locations: {},
    locationTotals: {},
    locatedCardTotal: 0,
  },
];

describe("FeaturedCardsCarouselView", () => {
  it("shows the active card visual, rate, time chart, and locations", () => {
    const markup = renderToStaticMarkup(
      <FeaturedCardsCarouselView entries={entries} isLoading={false} />,
    );

    expect(markup).toContain("Stacked Deck insights");
    expect(markup).toContain("0.42%");
    expect(markup).toContain("share of all reported Stacked Deck drops");
    expect(markup).toContain('type="button"');
    expect(markup).toContain("aria-describedby=");
    expect(markup).toContain(
      "Compare when this card was reported with all reported cards that include time data",
    );
    expect(markup).toContain("By time of day");
    expect(markup).toContain("By opening location");
    expect(markup).not.toContain(">1,000 openings<");
    expect(markup).toContain("Atlas Hideout");
    expect(markup).toContain(
      "Atlas Hideout: 0.93× from 18 card observations among 1,000 openings",
    );
    expect(markup).toContain("The Doctor");
  });

  it("places a value after the bar when the bar is too short to contain it", () => {
    const markup = renderToStaticMarkup(
      <FeaturedLocationsChart
        cardName="A Dab of Ink"
        locations={{ Highgate: 50, "The Menagerie": 10 }}
        locationTotals={{ Highgate: 100, "The Menagerie": 1_000 }}
        locatedCardTotal={60}
      />,
    );

    expect(markup).toContain('data-label-placement="inside"');
    expect(markup).toContain('data-label-placement="outside"');
  });

  it("shows an unavailable state instead of stale carousel content", () => {
    const markup = renderToStaticMarkup(
      <FeaturedCardsCarouselView
        entries={entries}
        error={new Error("Unavailable")}
        isLoading={false}
      />,
    );

    expect(markup).toContain("Featured card insights are unavailable.");
    expect(markup).not.toContain("A Dab of Ink");
  });
});
