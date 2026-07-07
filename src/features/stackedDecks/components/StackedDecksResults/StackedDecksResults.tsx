import { ColumnVisibilityToggles } from "../../../../components/columnVisibilityToggles";
import { SECONDARY_COLUMNS } from "./columns/toggles/secondaryColumns";
import { StackedDecksResultsTable } from "./StackedDecksResultsTable";
import { useStackedDecksTable } from "./useStackedDecksTable";

export function StackedDecksResults() {
  const { table, ...data } = useStackedDecksTable();

  return (
    <StackedDecksResultsTable
      table={table}
      {...data}
      toggles={
        <ColumnVisibilityToggles table={table} columns={SECONDARY_COLUMNS} />
      }
    />
  );
}
