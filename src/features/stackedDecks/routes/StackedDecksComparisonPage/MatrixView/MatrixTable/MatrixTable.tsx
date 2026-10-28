import {
  type ColumnDef,
  getCoreRowModel,
  type OnChangeFn,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { clsx } from "clsx";
import { useMemo } from "react";
import { divinationCardSlug } from "../../../../../../lib/divinationCards";
import type { DropRateLeague } from "../../../../../../lib/dropRates";
import { CardNamePreview } from "../../../../components/StackedDecksResults/CardNamePreview/CardNamePreview";
import { DeltaPercentCell } from "../../../../components/StackedDecksResults/columns/cells/DeltaPercentCell";
import {
  StackedDecksDataTable,
  StackedDecksTableFooter,
  StackedDecksTableFrame,
} from "../../../../components/StackedDecksTable";
import { useStackedDecksComparison } from "../../StackedDecksComparisonContext/StackedDecksComparisonContext";
import {
  formatComparisonMetricValue,
  formatMetricDifference,
  formatObservationCount,
} from "../../StackedDecksComparisonPage.utils";
import type { ComparisonRow } from "../../useStackedDecksComparisonData/useStackedDecksComparisonData.utils";
import type { ComparisonSort } from "../MatrixView.utils";

interface MatrixTableProps {
  rows: ComparisonRow[];
  leagues: readonly DropRateLeague[];
  sort: ComparisonSort;
  firstRow: number;
  totalRows: number;
}

const coreRowModel = getCoreRowModel<ComparisonRow>();

export function MatrixTable({
  rows,
  leagues,
  sort,
  firstRow,
  totalRows,
}: MatrixTableProps) {
  const { metric, verified, setTableSort } = useStackedDecksComparison();
  const lastRow = Math.min(firstRow + rows.length - 1, totalRows);
  const columns = useMemo<ColumnDef<ComparisonRow>[]>(
    () => [
      {
        id: "card",
        accessorKey: "name",
        header: "Card",
        sortDescFirst: false,
        meta: {
          thClassName:
            "sticky left-0 z-40 min-w-60 border-r border-(--wc-accent-border) bg-(--wc-glow)",
          tdClassName:
            "sticky left-0 z-20 max-w-60 border-r border-(--wc-border-dimmed) bg-inherit font-fontin-sc text-(--wc-accent-border)",
        },
        cell: ({ row }) => (
          <span className="block truncate">
            <CardNamePreview
              cardId={divinationCardSlug(row.original.name)}
              name={row.original.name}
            />
          </span>
        ),
      },
      ...leagues.map(
        (league, index): ColumnDef<ComparisonRow> => ({
          id: league.id,
          accessorFn: (row) =>
            row.values.find((value) => value.leagueId === league.id)?.value ??
            null,
          header: league.name,
          sortDescFirst: true,
          meta: {
            align: "right",
            thClassName: clsx(
              "min-w-44 border-r border-(--wc-accent-border) bg-(--wc-glow) last:border-r-0",
              index === 0 && "sticky left-60 z-40",
            ),
            tdClassName: clsx(
              "border-r border-(--wc-border-dimmed) last:border-r-0",
              index === 0 && "sticky left-60 z-20 bg-inherit",
            ),
          },
          cell: ({ row }) => {
            const value = row.original.values.find(
              (item) => item.leagueId === league.id,
            );
            const title = `${formatMetricDifference(metric, value?.difference ?? null)} · ${formatObservationCount(value?.count ?? null)} ${verified ? "verified " : ""}drops`;

            return (
              <div title={title}>
                <span className="block font-semibold tabular-nums text-(--wc-card-name)">
                  {formatComparisonMetricValue(metric, value?.value ?? null)}
                </span>
                <span className="mt-1 inline-block">
                  {value?.value != null && !value.isEligible ? (
                    <span className="inline-flex min-w-20 justify-center rounded-sm bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning ring-1 ring-warning/30">
                      Below sample
                    </span>
                  ) : value?.isBaseline ? (
                    <span className="inline-flex min-w-20 justify-center rounded-sm bg-(--wc-bg-dimmed) px-2 py-0.5 text-xs font-semibold text-(--wc-text-50) ring-1 ring-(--wc-border-dimmed)">
                      Baseline
                    </span>
                  ) : (
                    <DeltaPercentCell value={value?.relativeDelta} />
                  )}
                </span>
              </div>
            );
          },
        }),
      ),
    ],
    [leagues, metric, verified],
  );
  const sorting = useMemo<SortingState>(
    () => [
      {
        id: sort.column,
        desc: sort.direction === "descending",
      },
    ],
    [sort.column, sort.direction],
  );
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const nextSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    const next = nextSorting[0];
    const isDefault = next?.id === "card" && next.desc === false;

    setTableSort(
      !next || isDefault ? undefined : next.id,
      !next || isDefault ? undefined : !next.desc,
    );
  };
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getRowId: (row) => row.key,
    getCoreRowModel: coreRowModel,
    manualSorting: true,
    enableSortingRemoval: false,
  });

  return (
    <StackedDecksTableFrame>
      <StackedDecksDataTable
        table={table}
        ariaLabel="Stacked deck league matrix"
        className="min-w-full"
        headClassName="sticky top-0 z-30"
      />

      <StackedDecksTableFooter>
        <span className="leading-none">
          Showing{" "}
          <span className="tabular-nums text-(--wc-gold-muted)">
            {firstRow}–{lastRow}
          </span>{" "}
          of{" "}
          <span className="tabular-nums text-(--wc-gold-muted)">
            {totalRows.toLocaleString("en-US")}
          </span>{" "}
          cards
        </span>
      </StackedDecksTableFooter>
    </StackedDecksTableFrame>
  );
}
