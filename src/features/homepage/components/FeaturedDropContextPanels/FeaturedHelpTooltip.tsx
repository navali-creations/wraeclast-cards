import { useId } from "react";

export function FeaturedHelpTooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  const tooltipId = useId();

  return (
    <span className="tooltip tooltip-top z-20 [--tt-bg:var(--wc-card-darker)]">
      <button
        type="button"
        aria-describedby={tooltipId}
        className="rounded-sm border-0 bg-transparent p-0 cursor-help focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold)"
      >
        {children}
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className="tooltip-content max-w-72 rounded-md border border-(--wc-border) bg-(--wc-card-darker)! px-3! py-2! text-left text-sm text-(--wc-text-90)! shadow-xl"
      >
        {content}
      </span>
    </span>
  );
}
