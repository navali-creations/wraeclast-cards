import { ColumnVisibilityToggles } from "../../../../components/columnVisibilityToggles";
import { StackedDecksResultsTable } from "../StackedDecksResults/StackedDecksResultsTable";
import { ADVANCED_SECONDARY_COLUMNS } from "./secondaryColumns";
import { useAdvancedStackedDecksTable } from "./useAdvancedStackedDecksTable";

export function StackedDecksAdvancedResults() {
  const { table, ...data } = useAdvancedStackedDecksTable();

  return (
    <StackedDecksResultsTable
      table={table}
      {...data}
      toggles={
        <ColumnVisibilityToggles
          table={table}
          columns={ADVANCED_SECONDARY_COLUMNS}
        />
      }
    />
  );
}
