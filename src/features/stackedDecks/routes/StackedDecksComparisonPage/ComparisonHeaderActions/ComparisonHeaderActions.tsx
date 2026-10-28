import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Button, ButtonInternalLink } from "../../../../../components/buttons";
import { SearchInput } from "../../../../../components/input";
import { useDebounce } from "../../../../../lib/useDebounce";
import { useStackedDecksComparison } from "../StackedDecksComparisonContext/StackedDecksComparisonContext";

export function ComparisonHeaderActions() {
  const { view, searchTerm, setSearchTerm, rows, verified, setVerified } =
    useStackedDecksComparison();
  const [draftSearchTerm, setDraftSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(draftSearchTerm, 300);
  const suggestions = rows.slice(0, 8).map((row) => row.name);

  useEffect(() => {
    setDraftSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setSearchTerm(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchTerm, setSearchTerm]);

  function handleVerifiedToggle() {
    setVerified(!verified);
  }

  return (
    <div className="grid w-full min-w-0 gap-2 lg:grid-cols-[14rem_auto] lg:items-center">
      <SearchInput
        value={draftSearchTerm}
        onChange={setDraftSearchTerm}
        suggestions={suggestions}
        placeholder={
          view === "history" ? "Find a card to chart…" : "Filter cards…"
        }
        leftIcon={<HiMagnifyingGlass aria-hidden="true" className="size-4" />}
        containerClassName="w-full sm:w-56 sm:max-w-56"
      />
      <div className="flex min-w-0 items-center gap-1 sm:justify-end sm:gap-2">
        <ButtonInternalLink
          gameScoped
          to="/stacked-decks"
          variant="control"
          className="flex-1 justify-center px-2! text-xs! xs:text-sm! sm:flex-none sm:px-5!"
        >
          <FiArrowLeft aria-hidden="true" className="size-4 shrink-0" />
          Drop-rate table
        </ButtonInternalLink>
        <Button
          variant={verified ? "controlActive" : "control"}
          aria-pressed={verified}
          onClick={handleVerifiedToggle}
          className="flex-1 justify-center px-2! text-xs! xs:text-sm! sm:flex-none sm:px-5!"
        >
          <FiCheckCircle aria-hidden="true" className="size-4 shrink-0" />
          Verified
        </Button>
      </div>
    </div>
  );
}
