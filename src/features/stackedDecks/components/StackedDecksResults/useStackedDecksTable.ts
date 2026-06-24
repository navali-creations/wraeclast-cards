import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useStackedDecksData } from "../../hooks";
import { createColumns } from "./columns";
import { useResponsiveColumnVisibility } from "./columnToggles/useResponsiveColumnVisibility";

const coreRowModel = getCoreRowModel();
const sortedRowModel = getSortedRowModel();
const filteredRowModel = getFilteredRowModel();
const paginationRowModel = getPaginationRowModel();

export function useStackedDecksTable({ searchTerm }: { searchTerm: string }) {
  const { sortBy, sortAsc } = useSearch({ from: "/stacked-decks" });
  const navigate = useNavigate({ from: "/stacked-decks" });
  const {
    league,
    leagueData,
    rows: allRows,
    totalCount,
    isLoading,
    error,
  } = useStackedDecksData("poe1");

  const sorting: SortingState = useMemo(
    () => [{ id: sortBy ?? "ratio", desc: !sortAsc }],
    [sortBy, sortAsc],
  );

  const columnFilters = useMemo(
    () => (searchTerm ? [{ id: "name", value: searchTerm }] : []),
    [searchTerm],
  );

  const maxWeight = useMemo(
    () => allRows?.reduce((m, r) => Math.max(m, r.weight), 0) ?? 0,
    [allRows],
  );

  const columns = useMemo(() => createColumns(), []);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] =
    useResponsiveColumnVisibility();

  const table = useReactTable({
    data: allRows ?? [],
    columns,
    state: { sorting, columnFilters, pagination, columnVisibility },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const first = next[0];
      const column = first?.id ?? "ratio";
      const desc = first?.desc ?? true;
      const isDefault = column === "ratio" && desc;
      navigate({
        search: (prev) => ({
          ...prev,
          sortBy: isDefault ? undefined : column,
          sortAsc: desc ? undefined : true,
        }),
      });
    },
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    meta: { maxWeight, pageOffset: pagination.pageIndex * pagination.pageSize },
    sortDescFirst: true,
    enableSortingRemoval: false,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
    getFilteredRowModel: filteredRowModel,
    getPaginationRowModel: paginationRowModel,
  });

  return { table, league, leagueData, allRows, totalCount, isLoading, error };
}
