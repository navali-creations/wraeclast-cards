import type { StackedDecksRow } from "../../../../stackedDecks/hooks";
import type { TableViewMode } from "../CardDetailsDropRateTables";
import { buildTiles } from "./buildTiles";
import { StatusMessage } from "./StatusMessage";
import { SummaryTile } from "./SummaryTile";

interface CardDetailsDropRateSummaryProps {
  row: StackedDecksRow | undefined;
  leagueName: string | undefined;
  totalCount: number;
  isLoading: boolean;
  error: unknown;
  mode: TableViewMode;
}

export function CardDetailsDropRateSummary({
  row,
  leagueName,
  totalCount,
  isLoading,
  error,
  mode,
}: CardDetailsDropRateSummaryProps) {
  if (isLoading) {
    return <StatusMessage>Loading drop-rate evidence...</StatusMessage>;
  }

  if (error || !row) {
    return (
      <StatusMessage>
        Drop-rate evidence is unavailable right now.
      </StatusMessage>
    );
  }

  const tiles = buildTiles(mode, row);

  return (
    <section className="space-y-3 rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-3">
      <div className="flex items-center justify-between gap-2 text-[11px] text-(--wc-text-60)">
        <span className="truncate">{leagueName ?? "Selected league"}</span>
        <span className="tabular-nums">
          {totalCount.toLocaleString()} observations
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <SummaryTile key={tile.label} {...tile} />
        ))}
      </div>
    </section>
  );
}
