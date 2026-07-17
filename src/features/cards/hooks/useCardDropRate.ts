import type { Card } from "../types";
import { useCardStackedDecksRow } from "./useCardStackedDecksRow";

// Actual community-reported drop rate for one card, sourced from the same
// per-league drop-rate dataset the Stacked Decks results table uses.
export function useCardDropRate(card: Card) {
  const { row, isLoading, error } = useCardStackedDecksRow(card);
  const dropRate = row ? (row.players_saw ?? row.ratio) : null;

  return { dropRate, isLoading, error };
}
