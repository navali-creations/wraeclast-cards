import { HiMagnifyingGlass } from "react-icons/hi2";
import { SearchInput } from "../../../../components/input";

interface StackedDecksFiltersProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export function StackedDecksFilters({
  value,
  onChange,
  suggestions,
}: StackedDecksFiltersProps) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      suggestions={suggestions}
      placeholder="Search..."
      leftIcon={<HiMagnifyingGlass className="size-4" />}
      containerClassName="w-full sm:max-w-sm"
    />
  );
}
