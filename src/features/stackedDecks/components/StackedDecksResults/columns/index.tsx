import { CardNamePreview } from "../CardNamePreview/CardNamePreview";
import { ComparedToResearchCell } from "./cells";
import { col, columnHelper, dualCol } from "./helper";

function formatPercent(value: number | null) {
  return value === null ? "—" : `${(value * 100).toFixed(4)}%`;
}

function formatNumber(value: number | null) {
  return value === null
    ? "—"
    : Number(value).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

function formatSignedNumber(value: number | null) {
  if (value === null) return "—";
  const formatted = formatNumber(value);
  return value > 0 ? `+${formatted}` : formatted;
}

function rankColumn() {
  return columnHelper.display({
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
  });
}

function nameColumn() {
  return col("name", "Card", {
    tdClassName: "font-fontin-sc text-(--wc-accent-border)",
    cell: (ctx) => <CardNamePreview name={ctx.getValue()} />,
    sortDescFirst: false,
    filterFn: (row, _id, value: string) =>
      row.original.name.toLowerCase().includes(value.toLowerCase().trim()),
  });
}

export function createColumns(verified: boolean) {
  return [
    rankColumn(),
    nameColumn(),
    col("research_chance", "Research Chance", {
      align: "right",
      tdClassName: "tabular-nums text-(--wc-text-30)",
      cell: (ctx) => formatPercent(ctx.getValue()),
    }),
    dualCol("players_saw", "verified_players_saw", verified, "Players Saw", {
      align: "right",
      tdClassName: "font-semibold tabular-nums text-(--wc-text-30)",
      cell: (ctx) => formatPercent(ctx.getValue()),
    }),
    dualCol(
      "seen_vs_research",
      "verified_seen_vs_research",
      verified,
      "Compared to Research",
      {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
        cell: ComparedToResearchCell,
      },
    ),
    dualCol("count", "verified_count", verified, "Drops Reported", {
      align: "right",
      tdClassName: "tabular-nums text-(--wc-text-30)",
      cell: (ctx) => ctx.getValue().toLocaleString(),
    }),
  ];
}

export function createAdvancedColumns(verified: boolean) {
  return [
    rankColumn(),
    nameColumn(),
    col("research_weight", "Research Weight", {
      align: "right",
      tdClassName: "tabular-nums text-(--wc-text-30)",
      cell: (ctx) => formatNumber(ctx.getValue()),
    }),
    dualCol(
      "community_estimated_weight",
      "verified_community_estimated_weight",
      verified,
      "Community Weight",
      {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
        cell: (ctx) => formatNumber(ctx.getValue()),
      },
    ),
    dualCol(
      "expected_drops",
      "verified_expected_drops",
      verified,
      "Expected Drops",
      {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
        cell: (ctx) => formatNumber(ctx.getValue()),
      },
    ),
    dualCol(
      "drop_difference",
      "verified_drop_difference",
      verified,
      "Difference",
      {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
        cell: (ctx) => formatSignedNumber(ctx.getValue()),
      },
    ),
    dualCol("count", "verified_count", verified, "Drops Reported", {
      align: "right",
      tdClassName: "tabular-nums text-(--wc-text-30)",
      cell: (ctx) => ctx.getValue().toLocaleString(),
    }),
  ];
}
