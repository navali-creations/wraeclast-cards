import type {
  DropRateCard,
  DropRateLeague,
  LeagueDropRates,
} from "../../../../../lib/dropRates";
import type { ComparisonMetric } from "../StackedDecksComparisonPage.utils";

export interface ComparisonLeagueValue {
  leagueId: string;
  leagueName: string;
  value: number | null;
  count: number | null;
  isEligible: boolean;
  relativeDelta: number | null;
  difference: number | null;
  isBaseline: boolean;
}

export interface ComparisonRow {
  key: string;
  name: string;
  values: ComparisonLeagueValue[];
  baselineValue: ComparisonLeagueValue | undefined;
  strongestValue: ComparisonLeagueValue | undefined;
}

function cardKey(name: string) {
  return name.trim().toLocaleLowerCase("en-US");
}

function observedValue(
  card: DropRateCard | undefined,
  verified: boolean,
  metric: ComparisonMetric,
) {
  if (!card) return { value: null, count: null };

  const count = verified ? card.verified_count : card.count;
  if (metric === "drops-reported") return { value: count, count };
  if (verified && count === 0) return { value: null, count };

  if (metric === "compared-to-reference") {
    return {
      value: verified
        ? card.verified_seen_vs_reference
        : card.seen_vs_reference,
      count,
    };
  }

  if (metric === "community-weight") {
    return {
      value: verified
        ? card.verified_community_estimated_weight
        : card.community_estimated_weight,
      count,
    };
  }

  return {
    value: verified ? card.verified_ratio : card.ratio,
    count,
  };
}

export function buildComparisonRows({
  leagues,
  dataByLeagueId,
  baselineLeagueId,
  verified,
  metric,
  minimumObservations,
}: {
  leagues: readonly DropRateLeague[];
  dataByLeagueId: ReadonlyMap<string, LeagueDropRates | undefined>;
  baselineLeagueId: string;
  verified: boolean;
  metric: ComparisonMetric;
  minimumObservations: number;
}): ComparisonRow[] {
  const cardsByLeagueId = new Map<string, Map<string, DropRateCard>>();
  const namesByKey = new Map<string, string>();

  for (const league of leagues) {
    const cardsByKey = new Map<string, DropRateCard>();
    for (const card of dataByLeagueId.get(league.id)?.cards ?? []) {
      const key = cardKey(card.name);
      cardsByKey.set(key, card);
      namesByKey.set(key, card.name);
    }
    cardsByLeagueId.set(league.id, cardsByKey);
  }

  const baselineCards = cardsByLeagueId.get(baselineLeagueId);

  return [...namesByKey.entries()]
    .map(([key, name]) => {
      const baselineObserved = observedValue(
        baselineCards?.get(key),
        verified,
        metric,
      );
      const baselineIsEligible =
        baselineObserved.value !== null &&
        baselineObserved.value > 0 &&
        (baselineObserved.count ?? 0) >= minimumObservations;

      const values = leagues.map((league): ComparisonLeagueValue => {
        const isBaseline = league.id === baselineLeagueId;
        const current = observedValue(
          cardsByLeagueId.get(league.id)?.get(key),
          verified,
          metric,
        );
        const currentIsEligible =
          current.value !== null && (current.count ?? 0) >= minimumObservations;
        const canCompare =
          !isBaseline &&
          baselineIsEligible &&
          currentIsEligible &&
          baselineObserved.value !== null &&
          current.value !== null;
        const difference =
          canCompare &&
          current.value !== null &&
          baselineObserved.value !== null
            ? current.value - baselineObserved.value
            : null;

        return {
          leagueId: league.id,
          leagueName: league.name,
          value: current.value,
          count: current.count,
          isEligible: currentIsEligible,
          relativeDelta:
            difference === null || baselineObserved.value === null
              ? null
              : difference / baselineObserved.value,
          difference,
          isBaseline,
        };
      });
      const strongestValue = values
        .filter((value) => value.relativeDelta !== null)
        .sort(
          (left, right) =>
            Math.abs(right.relativeDelta ?? 0) -
            Math.abs(left.relativeDelta ?? 0),
        )[0];

      return {
        key,
        name,
        values,
        baselineValue: values.find((value) => value.isBaseline),
        strongestValue,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function filterComparisonRows(
  rows: readonly ComparisonRow[],
  searchTerm: string,
): ComparisonRow[] {
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase("en-US");
  if (!normalizedSearch) return [...rows];

  return rows.filter((row) =>
    row.name.toLocaleLowerCase("en-US").includes(normalizedSearch),
  );
}

export function getLeagueObservationCount(
  leagueData: LeagueDropRates,
  verified: boolean,
): number {
  return leagueData.cards.reduce(
    (total, card) => total + (verified ? card.verified_count : card.count),
    0,
  );
}
