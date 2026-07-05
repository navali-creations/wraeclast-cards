import clsx from "clsx";
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
            className={clsx(
              "rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-colors",
              isActive
                ? "border-(--wc-accent-border) bg-(--wc-glow) font-semibold text-(--wc-gold-bright)"
                : "border-(--wc-border) text-(--wc-text-60) hover:border-(--wc-accent-border) hover:text-(--wc-text-80)",
            )}
          >
            {label}
            {isActive && <span className="ml-1">{activeDesc ? "↓" : "↑"}</span>}
          </Button>
        );
      })}
    </div>
  );
}
