import type { StackedDecksRow } from "../../../../stackedDecks/hooks";
import type { TableViewMode } from "../CardDetailsDropRateTables";
import {
  formatComparedToReference,
  formatDeltaPercent,
  formatInteger,
  formatPercent,
} from "./format";

export function buildTiles(mode: TableViewMode, row: StackedDecksRow) {
  if (mode === "basic") {
    const observedChance = row.players_saw ?? row.ratio;

    return [
      {
        label: "Reference",
        value: formatPercent(row.reference_estimated_chance, true),
      },
      { label: "Players Saw", value: formatPercent(observedChance) },
      {
        label: "Compared to Reference",
        value: formatComparedToReference(row.seen_vs_reference),
      },
      { label: "Drops Reported", value: row.count.toLocaleString() },
    ];
  }

  return [
    { label: "Reference Weight", value: formatInteger(row.reference_weight) },
    {
      label: "Community Weight",
      value: formatInteger(row.community_estimated_weight),
    },
    {
      label: "Weight Difference",
      value: formatDeltaPercent(
        row.community_estimated_weight_delta_vs_reference,
      ),
    },
    { label: "Drops Reported", value: row.count.toLocaleString() },
  ];
}
