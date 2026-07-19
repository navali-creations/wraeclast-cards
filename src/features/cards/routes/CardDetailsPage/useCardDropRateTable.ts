import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { StackedDecksRow } from "../../../stackedDecks/hooks";
import { useCardStackedDecksRow } from "../../hooks";
import type { Card } from "../../types";

const coreRowModel = getCoreRowModel();

// Builds a single-row variant of the Stacked Decks results table, scoped to
// one card, so its basic/advanced columns can be reused on the card details
// page without the search/sort/pagination state those tables bind to their
// own route.
export function useCardDropRateTable(
  card: Card,
  // biome-ignore lint/suspicious/noExplicitAny: column defs mix per-field value types (string, number, ...), so the array can only be typed against TanStack's own any-based ColumnDef escape hatch
  createColumns: (verified: boolean) => ColumnDef<StackedDecksRow, any>[],
) {
  const { row, league, leagueData, totalCount, isLoading, error } =
    useCardStackedDecksRow(card);

  // This page has no verified-data toggle, so columns always render the raw (unverified) values.
  const columns = useMemo(() => createColumns(false), [createColumns]);
  const data = useMemo(() => (row ? [row] : []), [row]);

  const table = useReactTable({
    data,
    columns,
    enableSorting: false,
    getCoreRowModel: coreRowModel,
    // Rank and card name are redundant on the card details page: there's
    // only ever one row, and it's already the card the page is about.
    state: { columnVisibility: { rank: false, name: false } },
  });

  return {
    table,
    league,
    leagueData,
    allRows: data,
    row,
    totalCount,
    isLoading,
    error,
  };
}
