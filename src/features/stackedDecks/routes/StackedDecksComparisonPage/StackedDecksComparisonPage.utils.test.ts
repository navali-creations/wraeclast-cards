import { describe, expect, it } from "vitest";
import type {
  DropRateCard,
  DropRateLeague,
  LeagueDropRates,
} from "../../../../lib/dropRates";
import { sortComparisonRows } from "./MatrixView/MatrixView.utils";
import { rankComparisonTransitionMovers } from "./MoversView/MoversView.utils";
import {
  formatComparisonMetricValue,
  formatComparisonSubtitle,
  formatObservationCount,
} from "./StackedDecksComparisonPage.utils";
import {
  buildComparisonRows,
  getLeagueObservationCount,
} from "./useStackedDecksComparisonData/useStackedDecksComparisonData.utils";
import {
  findDefaultBaselineId,
  getComparableLeagues,
  getComparisonTransitions,
  getSelectedComparisonLeagueIds,
  orderComparisonLeagues,
  resolveBaselineId,
  resolveComparisonTransitionId,
  validateStackedDecksComparisonSearch,
} from "./useStackedDecksComparisonRouteState/useStackedDecksComparisonRouteState.utils";

const LEAGUES: DropRateLeague[] = [
  {
    id: "old",
    name: "Old League",
    historical: true,
    url: "",
    card_count: 1,
    generated_at: "",
  },
  {
    id: "latest",
    name: "Latest League",
    historical: false,
    url: "",
    card_count: 1,
    generated_at: "",
  },
];

function card(
  name: string,
  ratio: number,
  count = 100,
  verifiedRatio = ratio,
  verifiedCount = count,
): DropRateCard {
  return {
    name,
    ratio,
    count,
    verified_ratio: verifiedRatio,
    verified_count: verifiedCount,
    reference_estimated_chance: null,
    seen_vs_reference: null,
    verified_seen_vs_reference: null,
    reference_weight: null,
    community_estimated_weight: null,
    verified_community_estimated_weight: null,
    community_estimated_weight_delta_vs_reference: null,
    verified_community_estimated_weight_delta_vs_reference: null,
  };
}

function leagueData(
  league: DropRateLeague,
  cards: DropRateCard[],
): LeagueDropRates {
  return {
    schema_version: 1,
    generated_at: "",
    game: "poe1",
    league,
    reference: null,
    cards,
  };
}

describe("stacked deck comparison utilities", () => {
  it("uses the latest published non-historical league as the default baseline", () => {
    expect(findDefaultBaselineId(LEAGUES)).toBe("latest");
  });

  it("falls back to a selected baseline when the current one is removed", () => {
    expect(resolveBaselineId(LEAGUES, ["old"], "latest")).toBe("old");
  });

  it("excludes Standard and orders selected leagues from newest to oldest", () => {
    const newerHistorical: DropRateLeague = {
      ...LEAGUES[0],
      id: "newer-history",
      name: "Newer History",
    };
    const standard: DropRateLeague = {
      ...LEAGUES[1],
      id: "standard",
      name: "Standard",
    };

    const allLeagues = [LEAGUES[0], newerHistorical, LEAGUES[1], standard];

    const comparableLeagues = getComparableLeagues(allLeagues);

    expect(comparableLeagues.map((league) => league.id)).toEqual([
      "latest",
      "newer-history",
      "old",
    ]);
    expect(
      orderComparisonLeagues(comparableLeagues, [
        "old",
        "newer-history",
        "latest",
        "standard",
      ]).map((league) => league.id),
    ).toEqual(["latest", "newer-history", "old"]);
  });

  it("builds every directed transition with the newest transition first", () => {
    const middleLeague: DropRateLeague = {
      ...LEAGUES[0],
      id: "middle",
      name: "Middle League",
    };
    const comparableLeagues = getComparableLeagues([
      LEAGUES[0],
      middleLeague,
      LEAGUES[1],
    ]);
    const transitions = getComparisonTransitions(
      comparableLeagues,
      comparableLeagues.map((league) => league.id),
    );

    expect(
      transitions.map(
        (transition) =>
          `${transition.fromLeague.id}->${transition.toLeague.id}`,
      ),
    ).toEqual([
      "middle->latest",
      "old->latest",
      "old->middle",
      "latest->middle",
      "latest->old",
      "middle->old",
    ]);
    expect(resolveComparisonTransitionId(transitions, "missing")).toBe(
      transitions[0].id,
    );
  });

  it("joins cards and calculates relative and absolute changes", () => {
    const rows = buildComparisonRows({
      leagues: LEAGUES,
      dataByLeagueId: new Map([
        ["old", leagueData(LEAGUES[0], [card("The Card", 0.015)])],
        ["latest", leagueData(LEAGUES[1], [card("The Card", 0.01)])],
      ]),
      baselineLeagueId: "latest",
      verified: false,
      metric: "players-saw",
      minimumObservations: 0,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].strongestValue?.leagueId).toBe("old");
    expect(rows[0].strongestValue?.relativeDelta).toBeCloseTo(0.5);
    expect(rows[0].strongestValue?.difference).toBeCloseTo(0.005);
  });

  it("uses verified values and hides deltas below the observation threshold", () => {
    const rows = buildComparisonRows({
      leagues: LEAGUES,
      dataByLeagueId: new Map([
        ["old", leagueData(LEAGUES[0], [card("The Card", 0.4, 100, 0.02, 4)])],
        [
          "latest",
          leagueData(LEAGUES[1], [card("The Card", 0.2, 100, 0.01, 20)]),
        ],
      ]),
      baselineLeagueId: "latest",
      verified: true,
      metric: "players-saw",
      minimumObservations: 5,
    });

    expect(rows[0].values[0]).toMatchObject({
      value: 0.02,
      count: 4,
      isEligible: false,
      relativeDelta: null,
    });
    expect(rows[0].values[1]).toMatchObject({
      count: 20,
      isEligible: true,
    });
  });

  it("uses an em dash state for missing cards and a zero baseline", () => {
    const rows = buildComparisonRows({
      leagues: LEAGUES,
      dataByLeagueId: new Map([
        ["old", leagueData(LEAGUES[0], [card("Missing", 0.02)])],
        ["latest", leagueData(LEAGUES[1], [card("Zero", 0)])],
      ]),
      baselineLeagueId: "latest",
      verified: false,
      metric: "players-saw",
      minimumObservations: 0,
    });

    expect(rows.find((row) => row.name === "Missing")?.strongestValue).toBe(
      undefined,
    );
    expect(rows.find((row) => row.name === "Zero")?.strongestValue).toBe(
      undefined,
    );
    expect(formatObservationCount(null)).toBe("—");
  });

  it("uses reported counts when the drops metric is selected", () => {
    const rows = buildComparisonRows({
      leagues: LEAGUES,
      dataByLeagueId: new Map([
        ["old", leagueData(LEAGUES[0], [card("The Card", 0.015, 150)])],
        ["latest", leagueData(LEAGUES[1], [card("The Card", 0.01, 100)])],
      ]),
      baselineLeagueId: "latest",
      verified: false,
      metric: "drops-reported",
      minimumObservations: 0,
    });

    expect(rows[0].baselineValue?.value).toBe(100);
    expect(rows[0].strongestValue?.value).toBe(150);
    expect(formatComparisonMetricValue("drops-reported", 1500)).toBe("1,500");
  });

  it("sorts matrix rows by card name or a league metric", () => {
    const rows = buildComparisonRows({
      leagues: LEAGUES,
      dataByLeagueId: new Map([
        [
          "old",
          leagueData(LEAGUES[0], [card("Alpha", 0.01), card("Beta", 0.03)]),
        ],
        [
          "latest",
          leagueData(LEAGUES[1], [card("Alpha", 0.02), card("Beta", 0.01)]),
        ],
      ]),
      baselineLeagueId: "latest",
      verified: false,
      metric: "players-saw",
      minimumObservations: 0,
    });

    expect(
      sortComparisonRows(rows, {
        column: "old",
        direction: "descending",
      }).map((row) => row.name),
    ).toEqual(["Beta", "Alpha"]);
    expect(
      sortComparisonRows(rows, {
        column: "card",
        direction: "descending",
      }).map((row) => row.name),
    ).toEqual(["Beta", "Alpha"]);
  });

  it("ranks movers within one league transition", () => {
    const comparableLeagues = getComparableLeagues(LEAGUES);
    const transition = getComparisonTransitions(
      comparableLeagues,
      comparableLeagues.map((league) => league.id),
    )[0];
    const rows = buildComparisonRows({
      leagues: comparableLeagues,
      dataByLeagueId: new Map([
        [
          "old",
          leagueData(LEAGUES[0], [card("Alpha", 0.01), card("Beta", 0.03)]),
        ],
        [
          "latest",
          leagueData(LEAGUES[1], [card("Alpha", 0.02), card("Beta", 0.01)]),
        ],
      ]),
      baselineLeagueId: "latest",
      verified: false,
      metric: "players-saw",
      minimumObservations: 0,
    });

    const movers = rankComparisonTransitionMovers(rows, transition, 0);

    expect(movers.map((mover) => mover.name)).toEqual(["Alpha", "Beta"]);
    expect(movers[0].relativeDelta).toBeCloseTo(1);
    expect(rankComparisonTransitionMovers(rows, transition, 101)).toEqual([]);
  });

  it("validates every shareable comparison setting", () => {
    expect(
      validateStackedDecksComparisonSearch({
        metric: "drops-reported",
        leagues: "latest,old",
        baseline: "old",
        from: "old",
        to: "latest",
        minDrops: "100",
        verified: "true",
        search: "Rain",
        card: "The Rain",
        sortBy: "latest",
        sortAsc: "true",
        page: "3",
      }),
    ).toEqual({
      metric: "drops-reported",
      leagues: "latest,old",
      baseline: "old",
      from: "old",
      to: "latest",
      minDrops: 100,
      verified: true,
      search: "Rain",
      card: "The Rain",
      sortBy: "latest",
      sortAsc: true,
      page: 3,
    });
  });

  it("falls back to every league for an invalid one-league selection", () => {
    expect(getSelectedComparisonLeagueIds("old", LEAGUES)).toEqual([
      "old",
      "latest",
    ]);
  });

  it("formats compared leagues with their active observation totals", () => {
    const data = leagueData(LEAGUES[0], [
      card("Alpha", 0.01, 1_500, 0.01, 125),
      card("Beta", 0.02, 250, 0.02, 25),
    ]);
    const counts = new Map([
      ["old", getLeagueObservationCount(data, false)],
      ["latest", 4_087_187],
    ]);

    expect(getLeagueObservationCount(data, true)).toBe(150);
    expect(formatComparisonSubtitle(LEAGUES, counts)).toBe(
      "Comparing Old League (~1k observations) with Latest League (~4M observations)",
    );

    const ancestors: DropRateLeague = {
      id: "ancestors",
      name: "Ancestors",
      historical: true,
      url: "",
      card_count: 386,
      generated_at: "",
    };

    expect(
      formatComparisonSubtitle(
        [
          { ...LEAGUES[1], name: "Mirage" },
          { ...LEAGUES[0], name: "Keepers" },
          ancestors,
        ],
        new Map([
          ["latest", 4_207_137],
          ["old", 31_393],
          ["ancestors", 7_846],
        ]),
      ),
    ).toBe(
      "Comparing Mirage (~4.2M observations), Keepers (~31k observations) and Ancestors (~7k observations)",
    );
  });
});
