export const STACKED_DECKS_COMPARISON_VIEWS = [
  "movers",
  "matrix",
  "history",
] as const;

export type StackedDecksComparisonView =
  (typeof STACKED_DECKS_COMPARISON_VIEWS)[number];
