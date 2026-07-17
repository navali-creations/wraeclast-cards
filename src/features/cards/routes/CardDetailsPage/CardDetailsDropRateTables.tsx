import {
  createAdvancedColumns,
  createColumns,
} from "../../../stackedDecks/components/StackedDecksResults/columns";
import { StackedDecksResultsTable } from "../../../stackedDecks/components/StackedDecksResults/StackedDecksResultsTable";
import type { Card } from "../../types";
import { CardDetailsDropRateSummary } from "./CardDetailsDropRateSummary";
import { useCardDropRateTable } from "./useCardDropRateTable";

export type TableViewMode = "basic" | "advanced";

export function CardDetailsDropRateTables({
  card,
  viewMode,
}: {
  card: Card;
  viewMode: TableViewMode;
}) {
  const activeTable = useCardDropRateTable(
    card,
    viewMode === "advanced" ? createAdvancedColumns : createColumns,
  );

  return (
    <div className="space-y-4">
      <div className="sm:hidden">
        <CardDetailsDropRateSummary
          row={activeTable.row}
          leagueName={activeTable.league?.name}
          totalCount={activeTable.totalCount}
          isLoading={activeTable.isLoading}
          error={activeTable.error}
          mode={viewMode}
        />
      </div>

      <div className="hidden sm:block">
        <StackedDecksResultsTable {...activeTable} />
      </div>
    </div>
  );
}
