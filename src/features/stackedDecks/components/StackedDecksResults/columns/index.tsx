import type { StackedDecksRow } from "../../../hooks";
import { CardNamePreview } from "../CardNamePreview/CardNamePreview";
import { ColumnHeader } from "./ColumnHeader";
import { ComparedToReferenceCell, DeltaPercentCell } from "./cells";
import { col, columnHelper, dualCol } from "./helper";

const headerWithTooltip = (
  label: string,
  tooltip: string,
  placement?: "bottom" | "bottom-end",
) =>
  function HeaderWithTooltip() {
    return (
      <ColumnHeader label={label} tooltip={tooltip} placement={placement} />
    );
  };

function formatPercent(value: number | null | undefined) {
  return value == null ? "—" : `${(value * 100).toFixed(6)}%`;
}

function formatEstimatedPercent(value: number | null | undefined) {
  return value == null ? "—" : `≈${formatPercent(value)}`;
}

function formatSignedPercent(value: number | null | undefined) {
  if (value == null) return "—";

  const displayedPercent = (Math.abs(value) * 100).toFixed(6);
  if (displayedPercent === "0.000000") return "0.000000%";

  return `${value > 0 ? "+" : "-"}${displayedPercent}%`;
}

function formatPlainInteger(value: number | null | undefined) {
  if (value == null) return "—";
  return `${Math.floor(value)}`;
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
    cell: (ctx) => (
      <CardNamePreview
        cardId={ctx.row.original.card_id ?? ctx.row.original.name}
        name={ctx.getValue()}
      />
    ),
    sortDescFirst: false,
    filterFn: (row, _id, value: string) =>
      row.original.name.toLowerCase().includes(value.toLowerCase().trim()),
  });
}

function playersSaw(row: StackedDecksRow, verified: boolean) {
  return verified
    ? (row.verified_players_saw ??
        (row.verified_count > 0 ? row.verified_ratio : null))
    : (row.players_saw ?? row.ratio);
}

function playersSawColumn(verified: boolean) {
  return columnHelper.accessor(
    (row) => playersSaw(row, verified) ?? undefined,
    {
      id: "players_saw",
      header: headerWithTooltip(
        "Players Saw",
        "This card's share of reported drops for the selected league and verification mode.",
      ),
      sortUndefined: "last",
      cell: (ctx) => formatPercent(ctx.getValue()),
      meta: {
        align: "right",
        tdClassName: "font-semibold tabular-nums text-(--wc-text-30)",
      },
    },
  );
}

function chanceDifferenceColumn(verified: boolean) {
  return columnHelper.accessor(
    (row) => {
      const observedChance = playersSaw(row, verified);
      return observedChance === null || row.reference_estimated_chance === null
        ? undefined
        : observedChance - row.reference_estimated_chance;
    },
    {
      id: "chance_difference",
      header: headerWithTooltip(
        "Chance Difference",
        "Players Saw minus Reference Estimate, shown as a raw percentage-point difference.",
      ),
      sortUndefined: "last",
      cell: (ctx) => formatSignedPercent(ctx.getValue()),
      meta: {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
      },
    },
  );
}

function dropsReportedColumn(verified: boolean) {
  return dualCol(
    "count",
    "verified_count",
    verified,
    headerWithTooltip(
      "Drops Reported",
      "Total reported copies of this card for the selected league and verification mode.",
      "bottom-end",
    ),
    {
      align: "right",
      tdClassName: "tabular-nums text-(--wc-text-30)",
      cell: (ctx) => ctx.getValue().toLocaleString(),
    },
  );
}

export function createColumns(verified: boolean) {
  return [
    rankColumn(),
    nameColumn(),
    col(
      "reference_estimated_chance",
      headerWithTooltip(
        "Reference Estimate",
        "Modeled chance derived from the Prohibited Library average-weight formula; it is not a known drop probability.",
      ),
      {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
        sortUndefined: "last",
        cell: (ctx) => formatEstimatedPercent(ctx.getValue()),
      },
    ),
    playersSawColumn(verified),
    chanceDifferenceColumn(verified),
    dualCol(
      "seen_vs_reference",
      "verified_seen_vs_reference",
      verified,
      headerWithTooltip(
        "Compared to Reference",
        "Relative difference from the reference after treating the first ±3% as about expected.",
      ),
      {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
        sortUndefined: "last",
        cell: ComparedToReferenceCell,
      },
    ),
    dropsReportedColumn(verified),
  ];
}

export function createAdvancedColumns(verified: boolean) {
  return [
    rankColumn(),
    nameColumn(),
    col(
      "reference_weight",
      headerWithTooltip(
        "Reference Weight",
        "Modeled comparison value based on the Prohibited Library average-weight formula.",
      ),
      {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
        sortUndefined: "last",
        cell: (ctx) => formatPlainInteger(ctx.getValue()),
      },
    ),
    dualCol(
      "community_estimated_weight",
      "verified_community_estimated_weight",
      verified,
      headerWithTooltip(
        "Community Weight",
        "Weight inferred from this league's Soothsayer observations using Rain of Chaos as the anchor.",
      ),
      {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
        sortUndefined: "last",
        cell: (ctx) => formatPlainInteger(ctx.getValue()),
      },
    ),
    dualCol(
      "community_estimated_weight_delta_vs_reference",
      "verified_community_estimated_weight_delta_vs_reference",
      verified,
      headerWithTooltip(
        "Weight Difference",
        "Relative difference between Community Weight and Reference Weight.",
      ),
      {
        align: "right",
        tdClassName: "tabular-nums text-(--wc-text-30)",
        sortUndefined: "last",
        cell: (ctx) => <DeltaPercentCell value={ctx.getValue()} />,
      },
    ),
    dropsReportedColumn(verified),
  ];
}
