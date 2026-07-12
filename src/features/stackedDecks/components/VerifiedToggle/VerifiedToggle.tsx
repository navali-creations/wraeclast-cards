import { FiCheckCircle } from "react-icons/fi";
import { Button } from "../../../../components/buttons";
import { createSearchUpdater } from "../../../../lib/searchNavigation";
import {
  Route,
  type StackedDecksSearchParams,
} from "../../../../routes/$game/$league/stacked-decks";

interface VerifiedToggleProps {
  className?: string;
}

export function VerifiedToggle({ className }: VerifiedToggleProps) {
  const { verified = false } = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = createSearchUpdater<StackedDecksSearchParams>(navigate);

  return (
    <Button
      onClick={() => updateSearch({ verified: !verified || undefined })}
      aria-pressed={verified}
      variant={verified ? "controlActive" : "control"}
      className={className}
    >
      <FiCheckCircle className="size-4 shrink-0 transition-colors duration-150" />
      Verified
    </Button>
  );
}
