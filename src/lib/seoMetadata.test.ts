import { describe, expect, it } from "vitest";
import {
  AGPL_3_LICENSE_URL,
  createCardSeoMetadata,
  createLeagueSeoMetadata,
  createStaticPageSeoMetadata,
  type SeoMetadata,
} from "./seoMetadata";
import { STACKED_DECKS_COMPARISON_VIEWS } from "./stackedDecksComparisonViews";

function structuredDataGraph(metadata: SeoMetadata) {
  const document = metadata.structuredData?.[0] as
    | { "@graph": Array<Record<string, unknown>> }
    | undefined;

  expect(document).toBeDefined();
  return document?.["@graph"] ?? [];
}

describe("SEO structured data", () => {
  it("puts the card count on the ItemList rather than the CollectionPage", () => {
    const metadata = createLeagueSeoMetadata({
      gameLabel: "PoE 1",
      gameSeoLabel: "Path of Exile",
      gameSlug: "path-of-exile",
      leagueName: "Keepers",
      leagueSlug: "keepers",
      page: "cards",
      facts: { cardCount: 451 },
    });
    const collectionPage = structuredDataGraph(metadata)[0];

    expect(collectionPage).not.toHaveProperty("numberOfItems");
    expect(collectionPage.mainEntity).toMatchObject({
      "@type": "ItemList",
      numberOfItems: 451,
    });
  });

  it("includes the site license on stacked deck datasets", () => {
    const metadata = createLeagueSeoMetadata({
      gameLabel: "PoE 1",
      gameSeoLabel: "Path of Exile",
      gameSlug: "path-of-exile",
      leagueName: "Keepers",
      leagueSlug: "keepers",
      page: "stacked-decks",
      facts: {
        observedTotal: 4207137,
        dataPath: "/data/drop-rates/poe1/keepers.json",
      },
    });
    const dataset = structuredDataGraph(metadata)[0];

    expect(dataset).toMatchObject({
      "@type": "Dataset",
      license: AGPL_3_LICENSE_URL,
      isAccessibleForFree: true,
    });
  });

  it("builds metadata for every nested comparison route", () => {
    for (const comparisonView of STACKED_DECKS_COMPARISON_VIEWS) {
      const metadata = createLeagueSeoMetadata({
        gameLabel: "PoE 1",
        gameSeoLabel: "Path of Exile",
        gameSlug: "path-of-exile",
        leagueName: "Mirage",
        leagueSlug: "mirage",
        page: "stacked-decks-compare",
        comparisonView,
      });
      const [page, breadcrumbs] = structuredDataGraph(metadata);

      expect(metadata.pathname).toBe(
        `/path-of-exile/mirage/stacked-decks/compare/${comparisonView}`,
      );
      expect(metadata.title).toContain("Compare Stacked Deck");
      expect(page).toMatchObject({ "@type": "WebPage" });
      expect(breadcrumbs.itemListElement).toContainEqual(
        expect.objectContaining({ name: "Compare Leagues" }),
      );
    }
  });

  it("expresses observed rates as percentages and builds one breadcrumb trail", () => {
    const metadata = createCardSeoMetadata({
      gameLabel: "PoE 1",
      gameSeoLabel: "Path of Exile",
      gameSlug: "path-of-exile",
      leagueName: "Keepers",
      leagueSlug: "keepers",
      facts: {
        name: "A Chilling Wind",
        slug: "a-chilling-wind",
        observedRate: 0.0125,
      },
    });
    const [itemPage, breadcrumbs] = structuredDataGraph(metadata);
    const thing = itemPage.mainEntity as Record<string, unknown>;
    const properties = thing.additionalProperty as Array<
      Record<string, unknown>
    >;

    expect(properties).toContainEqual(
      expect.objectContaining({
        name: "Observed drop rate",
        value: 1.25,
        unitText: "%",
      }),
    );
    expect(breadcrumbs.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: "wraeclast.cards" }),
      expect.objectContaining({ position: 2, name: "PoE 1 Keepers" }),
      expect.objectContaining({ position: 3, name: "Divination Cards" }),
      expect.objectContaining({ position: 4, name: "A Chilling Wind" }),
    ]);
  });
});

describe("static page SEO metadata", () => {
  it("describes the privacy policy data handling", () => {
    expect(createStaticPageSeoMetadata("privacy")).toEqual({
      pathname: "/privacy-policy",
      title: "Privacy Policy | wraeclast.cards",
      description:
        "How wraeclast.cards handles error reporting, Cloudflare delivery and web performance data, and aggregated Soothsayer drop-rate data.",
    });
  });

  it("describes the attribution page credits", () => {
    expect(createStaticPageSeoMetadata("attributions")).toEqual({
      pathname: "/attributions",
      title: "Credits and Attributions | wraeclast.cards",
      description:
        "Design, codebase, data-source, and community attributions for wraeclast.cards, including Bloderyn, Prohibited Library, poe.ninja, and the Path of Exile Wiki.",
    });
  });
});
