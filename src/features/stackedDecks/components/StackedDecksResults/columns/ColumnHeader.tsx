import { FiInfo } from "react-icons/fi";

interface ColumnHeaderProps {
  label: string;
  tooltip: string;
  placement?: "bottom" | "bottom-end";
}

export function ColumnHeader({
  label,
  tooltip,
  placement = "bottom",
}: ColumnHeaderProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{label}</span>
      <span className="tooltip tooltip-bottom z-30 [--tt-bg:var(--wc-card-darker)]">
        <span
          role="tooltip"
          className="tooltip-content max-w-64 rounded-md border border-(--wc-border) bg-(--wc-card-darker)! px-3! py-2! font-medium text-(--wc-text-90)! shadow-xl"
          style={
            placement === "bottom-end"
              ? {
                  right: 0,
                  left: "auto",
                  transform: "translateY(var(--tt-pos, -0.25rem))",
                }
              : undefined
          }
        >
          {tooltip}
        </span>
        <button
          type="button"
          aria-label={`${label}: ${tooltip}`}
          className="inline-flex cursor-help rounded-sm text-(--wc-text-50) transition-colors hover:text-(--wc-gold) focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-(--wc-gold)"
          onClick={(event) => event.stopPropagation()}
        >
          <FiInfo className="size-3.5" aria-hidden="true" />
        </button>
      </span>
    </span>
  );
}
