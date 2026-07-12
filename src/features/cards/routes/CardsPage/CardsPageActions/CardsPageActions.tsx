import { CardsFilters } from "../../../components";
import { SortChips } from "../SortChips";

interface CardsPageActionsProps {
  searchTerm: string;
  suggestions: string[];
  sortLabels: readonly string[];
  activeSortLabel: string | null;
  activeDesc: boolean;
  onSearchChange: (value: string) => void;
  onSortClick: () => void;
}

export function CardsPageActions({
  searchTerm,
  suggestions,
  sortLabels,
  activeSortLabel,
  activeDesc,
  onSearchChange,
  onSortClick,
}: CardsPageActionsProps) {
  return (
    <>
      <CardsFilters
        value={searchTerm}
        onChange={onSearchChange}
        suggestions={suggestions}
      />

      <SortChips
        labels={sortLabels}
        activeLabel={activeSortLabel}
        activeDesc={activeDesc}
        onSelect={onSortClick}
      />
    </>
  );
}
