import { BarCell, DropRateBadgeCell } from "./cells";
import { col, columnHelper } from "./helper";

export function createColumns() {
  return [
    columnHelper.display({
      id: "rank",
      header: "#",
      enableSorting: false,
      meta: {
        thClassName: "w-10 hidden sm:table-cell",
        tdClassName:
          "text-xs tabular-nums text-(--wc-text-70) hidden sm:table-cell",
      },
      cell: ({ row, table }) =>
        (table.options.meta?.pageOffset ?? 0) + row.index + 1,
    }),
    col("name", "Card Name", {
      tdClassName: "font-fontin-sc text-(--wc-accent-border)",
      sortDescFirst: false,
      filterFn: (row, _id, value: string) =>
        row.original.name.toLowerCase().includes(value.toLowerCase().trim()),
    }),
    col("count", "Observations", {
      align: "right",
      tdClassName: "font-semibold tabular-nums text-(--wc-text-30)",
    }),
    col("ratio", "Drop Rate %", {
      align: "right",
      cell: DropRateBadgeCell,
    }),
    col("weight", "Weight", {
      align: "right",
      tdClassName: "tabular-nums text-(--wc-text-30)",
      cell: BarCell,
    }),
  ];
}
