import { FiTable } from "react-icons/fi";
import { Button } from "../../../../components/buttons";
import { createSearchUpdater } from "../../../../lib/searchNavigation";
import {
  Route,
  type StackedDecksSearchParams,
} from "../../../../routes/$game/$league/stacked-decks";

export type StackedDecksView = "standard" | "advanced";

interface ViewToggleProps {
  className?: string;
}

export function ViewToggle({ className }: ViewToggleProps) {
  const { view = "standard" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = createSearchUpdater<StackedDecksSearchParams>(navigate);
  const isAdvanced = view === "advanced";

  return (
    <Button
      onClick={() =>
        updateSearch({ view: isAdvanced ? undefined : "advanced" })
      }
      aria-pressed={isAdvanced}
      variant={isAdvanced ? "controlActive" : "control"}
      className={className}
    >
      <FiTable className="size-4 shrink-0 transition-colors duration-150" />
      Advanced
    </Button>
  );
}
