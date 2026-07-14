import { FilterBar } from "./FilterBar/FilterBar";
import type { FilterFacet, FilterValue } from "./FilterBar/FilterBar.utils";

interface CardsFiltersProps {
  filterFacets: FilterFacet[];
  filterValue: FilterValue;
  onFilterValueChange: (value: FilterValue) => void;
}

export function CardsFilters({
  filterFacets,
  filterValue,
  onFilterValueChange,
}: CardsFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <FilterBar
        facets={filterFacets}
        value={filterValue}
        onChange={onFilterValueChange}
        className="w-full"
      />
    </div>
  );
}
