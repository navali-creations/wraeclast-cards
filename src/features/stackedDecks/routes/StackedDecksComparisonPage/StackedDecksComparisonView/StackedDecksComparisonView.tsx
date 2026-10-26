import { HistoryView } from "../HistoryView/HistoryView";
import { MatrixView } from "../MatrixView/MatrixView";
import { MoversView } from "../MoversView/MoversView";
import { useStackedDecksComparison } from "../StackedDecksComparisonContext/StackedDecksComparisonContext";

export function StackedDecksComparisonView() {
  const { view } = useStackedDecksComparison();

  if (view === "matrix") return <MatrixView />;
  if (view === "history") return <HistoryView />;
  return <MoversView />;
}
