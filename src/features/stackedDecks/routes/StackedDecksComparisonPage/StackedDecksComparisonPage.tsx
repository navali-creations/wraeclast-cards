import { StackedDecksComparisonProvider } from "./StackedDecksComparisonProvider/StackedDecksComparisonProvider";
import { StackedDecksComparisonWorkspace } from "./StackedDecksComparisonWorkspace/StackedDecksComparisonWorkspace";

export function StackedDecksComparisonPage() {
  return (
    <StackedDecksComparisonProvider>
      <StackedDecksComparisonWorkspace />
    </StackedDecksComparisonProvider>
  );
}
