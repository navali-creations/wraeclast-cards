import { clsx } from "clsx";
import { FiCheckCircle } from "react-icons/fi";
import { Button } from "../../../../components/buttons";
import { createSearchUpdater } from "../../../../lib/searchNavigation";
import {
  Route,
  type StackedDecksSearchParams,
} from "../../../../routes/$game/stacked-decks";

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
      className={clsx(
        "flex h-9 cursor-pointer items-center gap-1.5 rounded border px-3 font-medium duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold)",
        verified
          ? "border-(--wc-hero-accent) bg-(--wc-glow) text-(--wc-gold)"
          : "border-(--wc-border) bg-(--wc-glow)/80 text-(--wc-text-70) hover:border-(--wc-accent-border) hover:bg-(--wc-primary-hover) hover:text-(--wc-text-90)",
        className,
      )}
    >
      <FiCheckCircle className="size-4 shrink-0 transition-colors duration-150" />
      Verified
    </Button>
  );
}
