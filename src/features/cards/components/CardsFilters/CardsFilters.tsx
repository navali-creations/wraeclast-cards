import type { ChangeEvent } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Input } from "../../../../components/input";

interface CardsFiltersProps {
  value: string;
  onChange: (value: string) => void;
}

export function CardsFilters({ value, onChange }: CardsFiltersProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.currentTarget.value);

  return (
    <Input
      type="text"
      value={value}
      onChange={handleInputChange}
      placeholder="Search cards or rewards…"
      leftIcon={<HiMagnifyingGlass className="size-4" />}
      containerClassName="w-full sm:max-w-sm"
    />
  );
}
