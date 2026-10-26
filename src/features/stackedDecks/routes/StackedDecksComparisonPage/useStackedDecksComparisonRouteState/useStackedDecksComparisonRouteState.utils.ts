import type { DropRateLeague } from "../../../../../lib/dropRates";
import { asPage, asString, asTrueFlag } from "../../../../../lib/searchParams";
import {
  type ComparisonMetric,
  isComparisonMetric,
} from "../StackedDecksComparisonPage.utils";

export interface StackedDecksComparisonSearchParams {
  metric?: ComparisonMetric;
  leagues?: string;
  baseline?: string;
  from?: string;
  to?: string;
  minDrops?: number;
  verified?: true;
  search?: string;
  card?: string;
  sortBy?: string;
  sortAsc?: true;
  page?: number;
}

export interface ComparisonTransition {
  id: string;
  fromLeague: DropRateLeague;
  toLeague: DropRateLeague;
}

const MINIMUM_OBSERVATION_OPTIONS = new Set([10, 100, 1000]);

export function validateStackedDecksComparisonSearch(
  search: Record<string, unknown>,
): StackedDecksComparisonSearchParams {
  const minimumObservations = Number(search.minDrops);

  return {
    metric: isComparisonMetric(search.metric) ? search.metric : undefined,
    leagues: asString(search.leagues) || undefined,
    baseline: asString(search.baseline) || undefined,
    from: asString(search.from) || undefined,
    to: asString(search.to) || undefined,
    minDrops: MINIMUM_OBSERVATION_OPTIONS.has(minimumObservations)
      ? minimumObservations
      : undefined,
    verified: asTrueFlag(search.verified),
    search: asString(search.search) || undefined,
    card: asString(search.card) || undefined,
    sortBy: asString(search.sortBy) || undefined,
    sortAsc: asTrueFlag(search.sortAsc),
    page: asPage(search.page),
  };
}

export function getComparableLeagues(
  leagues: readonly DropRateLeague[],
): DropRateLeague[] {
  const comparable = leagues.filter(
    (league) => league.name.trim().toLocaleLowerCase("en-US") !== "standard",
  );
  const current = comparable.filter((league) => !league.historical);
  const historical = comparable.filter((league) => league.historical).reverse();

  return [...current, ...historical];
}

export function getSelectedComparisonLeagueIds(
  serializedIds: string | undefined,
  leagues: readonly DropRateLeague[],
): string[] {
  const allIds = leagues.map((league) => league.id);
  if (!serializedIds) return allIds;

  const requestedIds = new Set(serializedIds.split(",").filter(Boolean));
  const selectedIds = allIds.filter((id) => requestedIds.has(id));
  const minimumSelection = Math.min(2, allIds.length);

  return selectedIds.length >= minimumSelection ? selectedIds : allIds;
}

export function serializeComparisonLeagueIds(
  selectedIds: readonly string[],
  leagues: readonly DropRateLeague[],
): string | undefined {
  const allIds = leagues.map((league) => league.id);
  const selectedAll =
    selectedIds.length === allIds.length &&
    selectedIds.every((id, index) => id === allIds[index]);

  return selectedAll ? undefined : selectedIds.join(",");
}

export function findDefaultBaselineId(
  leagues: readonly DropRateLeague[],
): string {
  return (
    leagues.find((league) => !league.historical)?.id ?? leagues[0]?.id ?? ""
  );
}

export function resolveBaselineId(
  leagues: readonly DropRateLeague[],
  selectedLeagueIds: readonly string[],
  currentBaselineId: string,
): string {
  if (selectedLeagueIds.includes(currentBaselineId)) return currentBaselineId;

  const selectedLeagues = leagues.filter((league) =>
    selectedLeagueIds.includes(league.id),
  );
  return findDefaultBaselineId(selectedLeagues);
}

export function orderComparisonLeagues(
  leagues: readonly DropRateLeague[],
  selectedLeagueIds: readonly string[],
): DropRateLeague[] {
  return leagues.filter(
    (league) =>
      selectedLeagueIds.includes(league.id) &&
      league.name.trim().toLocaleLowerCase("en-US") !== "standard",
  );
}

export function getComparisonTransitions(
  leagues: readonly DropRateLeague[],
  selectedLeagueIds: readonly string[],
): ComparisonTransition[] {
  const newestFirst = orderComparisonLeagues(leagues, selectedLeagueIds);
  const forwardTransitions: ComparisonTransition[] = [];

  for (let toIndex = 0; toIndex < newestFirst.length - 1; toIndex += 1) {
    for (
      let fromIndex = toIndex + 1;
      fromIndex < newestFirst.length;
      fromIndex += 1
    ) {
      const fromLeague = newestFirst[fromIndex];
      const toLeague = newestFirst[toIndex];

      forwardTransitions.push({
        id: `${fromLeague.id}:${toLeague.id}`,
        fromLeague,
        toLeague,
      });
    }
  }

  const reverseTransitions = forwardTransitions.map(
    ({ fromLeague, toLeague }): ComparisonTransition => ({
      id: `${toLeague.id}:${fromLeague.id}`,
      fromLeague: toLeague,
      toLeague: fromLeague,
    }),
  );

  return [...forwardTransitions, ...reverseTransitions];
}

export function resolveComparisonTransitionId(
  transitions: readonly ComparisonTransition[],
  currentTransitionId: string,
): string {
  if (transitions.some((transition) => transition.id === currentTransitionId)) {
    return currentTransitionId;
  }

  return transitions[0]?.id ?? "";
}
