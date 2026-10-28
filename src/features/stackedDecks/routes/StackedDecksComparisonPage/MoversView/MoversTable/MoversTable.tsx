import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { Pagination } from "../../../../../../components/pagination";
import { divinationCardSlug } from "../../../../../../lib/divinationCards";
import { CardNamePreview } from "../../../../components/StackedDecksResults/CardNamePreview/CardNamePreview";
import { DeltaPercentCell } from "../../../../components/StackedDecksResults/columns/cells/DeltaPercentCell";
import {
  StackedDecksDataTable,
  StackedDecksTableFooter,
  StackedDecksTableFrame,
} from "../../../../components/StackedDecksTable";
import { useStackedDecksComparison } from "../../StackedDecksComparisonContext/StackedDecksComparisonContext";
import { formatComparisonMetricValue } from "../../StackedDecksComparisonPage.utils";
import {
  type ComparisonTransitionMover,
  rankComparisonTransitionMovers,
} from "../MoversView.utils";

const PAGE_SIZE = 20;
const coreRowModel = getCoreRowModel<ComparisonTransitionMover>();
const paginationRowModel = getPaginationRowModel<ComparisonTransitionMover>();
const sortedRowModel = getSortedRowModel<ComparisonTransitionMover>();

export function MoversTable() {
  const {
    rows,
    moverTransition,
    metric,
    minimumObservations,
    sortBy,
    sortAscending,
    page,
    setTableSort,
    setPage,
  } = useStackedDecksComparison();
  const movers = useMemo(
    () =>
      rankComparisonTransitionMovers(
        rows,
        moverTransition,
        minimumObservations,
      ),
    [minimumObservations, moverTransition, rows],
  );
  const columns = useMemo<ColumnDef<ComparisonTransitionMover>[]>(
    () => [
      {
        id: "rank",
        header: "#",
        enableSorting: false,
        meta: {
          thClassName: "w-10",
          tdClassName: "text-xs tabular-nums text-(--wc-text-70)",
        },
        cell: ({ row, table }) => {
          const visibleIndex = table
            .getRowModel()
            .rows.findIndex((visibleRow) => visibleRow.id === row.id);
          const { pageIndex, pageSize } = table.getState().pagination;

          return (
            pageIndex * pageSize +
            (visibleIndex === -1 ? row.index : visibleIndex) +
            1
          );
        },
      },
      {
        accessorKey: "name",
        header: "Card",
        sortDescFirst: false,
        meta: {
          thClassName: "min-w-56",
          tdClassName: "font-fontin-sc text-(--wc-accent-border)",
        },
        cell: ({ row }) => (
          <CardNamePreview
            cardId={divinationCardSlug(row.original.name)}
            name={row.original.name}
          />
        ),
      },
      {
        id: "from",
        header: moverTransition?.fromLeague.name ?? "From",
        accessorFn: (row) => row.fromValue.value,
        cell: ({ row }) =>
          formatComparisonMetricValue(metric, row.original.fromValue.value),
        sortDescFirst: true,
        meta: {
          align: "right",
          thClassName: "min-w-32",
          tdClassName: "font-semibold tabular-nums text-(--wc-card-name)",
        },
      },
      {
        id: "to",
        header: moverTransition?.toLeague.name ?? "To",
        accessorFn: (row) => row.toValue.value,
        cell: ({ row }) =>
          formatComparisonMetricValue(metric, row.original.toValue.value),
        sortDescFirst: true,
        meta: {
          align: "right",
          thClassName: "min-w-32",
          tdClassName: "font-semibold tabular-nums text-(--wc-card-name)",
        },
      },
      {
        accessorKey: "relativeDelta",
        header: "Change",
        sortDescFirst: true,
        cell: ({ row }) => (
          <DeltaPercentCell value={row.original.relativeDelta} />
        ),
        meta: {
          align: "right",
          thClassName: "min-w-32",
          tdClassName: "font-semibold tabular-nums text-(--wc-card-name)",
        },
      },
    ],
    [metric, moverTransition],
  );
  const activeSortBy = ["name", "from", "to", "relativeDelta"].includes(
    sortBy ?? "",
  )
    ? sortBy
    : undefined;
  const sorting: SortingState = useMemo(
    () =>
      activeSortBy ? [{ id: activeSortBy, desc: sortAscending !== true }] : [],
    [activeSortBy, sortAscending],
  );
  const requestedPageCount = Math.max(1, Math.ceil(movers.length / PAGE_SIZE));
  const pagination = useMemo(
    () => ({
      pageIndex: Math.min(Math.max(0, page - 1), requestedPageCount - 1),
      pageSize: PAGE_SIZE,
    }),
    [page, requestedPageCount],
  );
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const nextSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    const next = nextSorting[0];
    setTableSort(next?.id, next ? !next.desc : undefined);
  };
  const table = useReactTable({
    data: movers,
    columns,
    state: { sorting, pagination },
    onSortingChange: handleSortingChange,
    getRowId: (row) => row.key,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
    getPaginationRowModel: paginationRowModel,
  });
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const currentPage = pageIndex + 1;
  const firstVisibleCard = pageIndex * pageSize + 1;
  const lastVisibleCard = Math.min((pageIndex + 1) * pageSize, movers.length);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage, true);
  }, [currentPage, page, setPage]);

  function handlePageChange(pageNumber: number) {
    setPage(pageNumber);
  }

  if (movers.length === 0) {
    return (
      <div className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-8 text-center text-(--wc-text-dimmed)">
        No cards can be compared for this transition. Try lowering the minimum
        drops or changing the search.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <StackedDecksTableFrame>
        <StackedDecksDataTable
          table={table}
          ariaLabel={`${moverTransition?.fromLeague.name ?? "Older league"} to ${moverTransition?.toLeague.name ?? "newer league"} movers`}
          className="min-w-168"
        />

        <StackedDecksTableFooter>
          <span className="leading-none">
            Showing{" "}
            <span className="tabular-nums text-(--wc-gold-muted)">
              {firstVisibleCard}–{lastVisibleCard}
            </span>{" "}
            of{" "}
            <span className="tabular-nums text-(--wc-gold-muted)">
              {movers.length.toLocaleString("en-US")}
            </span>{" "}
            cards
          </span>
        </StackedDecksTableFooter>
      </StackedDecksTableFrame>

      <Pagination
        page={currentPage}
        totalPages={pageCount}
        onChange={handlePageChange}
      />
    </div>
  );
}
