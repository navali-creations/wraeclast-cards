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
    <span className="tooltip tooltip-bottom z-30 inline-flex items-baseline whitespace-nowrap [--tt-bg:var(--wc-card-darker)]">
      <span className="inline-flex items-baseline gap-0.5 whitespace-nowrap cursor-help">
        <span className="border-b border-dotted border-current leading-tight">
          {label}
        </span>
        <button
          type="button"
          aria-label={`${label}: ${tooltip}`}
          className="inline-flex appearance-none items-baseline border-0 bg-transparent p-0 leading-none text-current transition-colors cursor-help hover:text-(--wc-gold) focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-(--wc-gold)"
          onClick={(event) => event.stopPropagation()}
        >
          <sup className="text-[0.65rem] leading-none">?</sup>
        </button>
      </span>
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
    </span>
  );
}
