import type { MouseEvent } from "react";
import { Tooltip } from "../../../../../components/Tooltip/Tooltip";

interface ColumnHeaderProps {
  label: string;
  tooltip: string;
  placement?: "bottom" | "bottom-end";
}

function handleHelpClick(event: MouseEvent<HTMLButtonElement>) {
  event.stopPropagation();
}

export function ColumnHeader({
  label,
  tooltip,
  placement = "bottom",
}: ColumnHeaderProps) {
  return (
    <Tooltip
      content={tooltip}
      placement={placement}
      className="inline-flex items-baseline whitespace-nowrap"
      tooltipClassName="max-w-64! font-medium!"
    >
      <span className="inline-flex items-baseline gap-0.5 whitespace-nowrap cursor-help">
        <span className="border-b border-dotted border-current leading-tight">
          {label}
        </span>
        <button
          type="button"
          aria-label={`${label}: ${tooltip}`}
          className="inline-flex appearance-none items-baseline border-0 bg-transparent p-0 leading-none text-current transition-colors cursor-help hover:text-(--wc-gold) focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-(--wc-gold)"
          onClick={handleHelpClick}
        >
          <sup className="text-[0.65rem] leading-none">?</sup>
        </button>
      </span>
    </Tooltip>
  );
}
