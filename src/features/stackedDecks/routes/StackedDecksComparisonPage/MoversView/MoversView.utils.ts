import type {
  ComparisonLeagueValue,
  ComparisonRow,
} from "../useStackedDecksComparisonData/useStackedDecksComparisonData.utils";
import type { ComparisonTransition } from "../useStackedDecksComparisonRouteState/useStackedDecksComparisonRouteState.utils";

export interface ComparisonTransitionMover {
  key: string;
  name: string;
  fromValue: ComparisonLeagueValue;
  toValue: ComparisonLeagueValue;
  relativeDelta: number;
}

export function rankComparisonTransitionMovers(
  rows: readonly ComparisonRow[],
  transition: ComparisonTransition | undefined,
  minimumObservations: number,
): ComparisonTransitionMover[] {
  if (!transition) return [];

  return rows
    .flatMap((row): ComparisonTransitionMover[] => {
      const fromValue = row.values.find(
        (value) => value.leagueId === transition.fromLeague.id,
      );
      const toValue = row.values.find(
        (value) => value.leagueId === transition.toLeague.id,
      );
      const canCompare =
        fromValue?.value != null &&
        fromValue.value > 0 &&
        (fromValue.count ?? 0) >= minimumObservations &&
        toValue?.value != null &&
        (toValue.count ?? 0) >= minimumObservations;

      if (!canCompare || fromValue.value == null || toValue.value == null) {
        return [];
      }

      return [
        {
          key: row.key,
          name: row.name,
          fromValue,
          toValue,
          relativeDelta: (toValue.value - fromValue.value) / fromValue.value,
        },
      ];
    })
    .sort(
      (left, right) =>
        Math.abs(right.relativeDelta) - Math.abs(left.relativeDelta) ||
        left.name.localeCompare(right.name),
    );
}
