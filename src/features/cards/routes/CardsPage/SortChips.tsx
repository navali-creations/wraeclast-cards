import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Button } from "../../../../components/buttons";

interface SortChipsProps {
  labels: string[];
  activeLabel: string | null;
  activeDesc: boolean;
  onSelect: (label: string) => void;
}

export function SortChips({
  labels,
  activeLabel,
  activeDesc,
  onSelect,
}: SortChipsProps) {
  return (
    <div className="flex items-center gap-2 self-end xs:self-auto">
      {labels.map((label) => {
        const isActive = activeLabel === label;
        return (
          <Button
            key={label}
            onClick={() => onSelect(label)}
            variant={isActive ? "controlActive" : "control"}
            className="whitespace-nowrap"
          >
            {label}
            {isActive && (
              <span className="inline-flex">
                {activeDesc ? <FiChevronDown /> : <FiChevronUp />}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
