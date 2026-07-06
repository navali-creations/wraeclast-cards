import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useUrlPagination } from "../../../../lib/useUrlPagination";
import type { StackedDecksSearchParams } from "../../../../routes/stacked-decks";
import type { StackedDecksRow } from "../useStackedDecksData";
import { useStackedDecksTableData } from "./useStackedDecksTableData";

const PAGE_SIZE = 20;

const coreRowModel = getCoreRowModel();
const sortedRowModel = getSortedRowModel();
const filteredRowModel = getFilteredRowModel();
const paginationRowModel = getPaginationRowModel();

interface UseStackedDecksTableCoreOptions {
  searchTerm: string;
  verified: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: column defs mix per-field value types (string, number, ...), so the array can only be typed against TanStack's own any-based ColumnDef escape hatch
  columns: ColumnDef<StackedDecksRow, any>[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
}

export function useStackedDecksTableCore({
  searchTerm,
  verified,
  columns,
  sorting,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
}: UseStackedDecksTableCoreOptions) {
  const {
    data,
    columnFilters,
    league,
    leagueData,
    allRows,
    totalCount,
    isLoading,
    error,
  } = useStackedDecksTableData({ searchTerm, verified });

  const search = useSearch({ from: "/stacked-decks" });
  const navigate = useNavigate({ from: "/stacked-decks" });
  const { page, setPage } = useUrlPagination<StackedDecksSearchParams>({
    page: search.page,
    navigate,
  });

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: PAGE_SIZE,
  };

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    setPage(next.pageIndex + 1);
  };

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting, columnFilters, pagination, columnVisibility },
    onSortingChange,
    onPaginationChange,
    onColumnVisibilityChange,
    meta: { pageOffset: pagination.pageIndex * pagination.pageSize },
    sortDescFirst: true,
    enableSortingRemoval: false,
    autoResetPageIndex: false,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
    getFilteredRowModel: filteredRowModel,
    getPaginationRowModel: paginationRowModel,
  });

  return { table, league, leagueData, allRows, totalCount, isLoading, error };
}
