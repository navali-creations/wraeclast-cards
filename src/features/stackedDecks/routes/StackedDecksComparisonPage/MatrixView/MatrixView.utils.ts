import type { ComparisonRow } from "../useStackedDecksComparisonData/useStackedDecksComparisonData.utils";

export type ComparisonSortDirection = "ascending" | "descending";

export interface ComparisonSort {
  column: "card" | string;
  direction: ComparisonSortDirection;
}

export function sortComparisonRows(
  rows: readonly ComparisonRow[],
  sort: ComparisonSort,
): ComparisonRow[] {
  const direction = sort.direction === "ascending" ? 1 : -1;

  return [...rows].sort((left, right) => {
    if (sort.column === "card") {
      return direction * left.name.localeCompare(right.name);
    }

    const leftValue = left.values.find(
      (value) => value.leagueId === sort.column,
    )?.value;
    const rightValue = right.values.find(
      (value) => value.leagueId === sort.column,
    )?.value;

    if (leftValue == null && rightValue == null) {
      return left.name.localeCompare(right.name);
    }
    if (leftValue == null) return 1;
    if (rightValue == null) return -1;

    return (
      direction * (leftValue - rightValue) ||
      left.name.localeCompare(right.name)
    );
  });
}
