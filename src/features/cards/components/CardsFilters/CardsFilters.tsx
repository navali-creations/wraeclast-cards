import { HiMagnifyingGlass } from "react-icons/hi2";
import { SearchInput } from "../../../../components/input";

interface CardsFiltersProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export function CardsFilters({
  value,
  onChange,
  suggestions,
}: CardsFiltersProps) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      suggestions={suggestions}
      placeholder="Search cards or rewards…"
      leftIcon={<HiMagnifyingGlass className="size-4" />}
      containerClassName="w-full sm:max-w-sm"
    />
  );
}
