import clsx from "clsx";
import type { MouseEvent, ReactNode } from "react";

type SegmentedOption = {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
};

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  size?: "sm" | "md" | "lg";
  onChange: (value: string) => void;
  className?: string;
}

const buttonSizeClasses = {
  sm: "btn-sm text-xs",
  md: "btn-md text-sm",
  lg: "btn-lg text-sm",
} as const;

export function SegmentedControl({
  options,
  value,
  size = "md",
  onChange,
  className,
}: SegmentedControlProps) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const segmentWidth = options.length > 0 ? 100 / options.length : 100;

  const handleOptionClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget.dataset;
    if (value) onChange(value);
  };

  if (options.length === 0) return null;

  return (
    <div
      className={clsx(
        "relative grid overflow-hidden rounded-lg border border-[var(--segmented-border,var(--color-base-300))] bg-[var(--segmented-bg,var(--color-base-100))] p-1 shadow-sm",
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-md bg-[var(--segmented-active-bg,var(--color-base-200))] shadow-sm transition-transform duration-200 ease-out"
        style={{
          width: `calc(${segmentWidth}% - 0.25rem)`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            aria-pressed={isActive}
            data-value={option.value}
            onClick={handleOptionClick}
            style={{ fontWeight: 400 }}
            className={clsx(
              "btn relative z-10 min-h-0 w-full border-0 bg-transparent px-3 font-normal! normal-case shadow-none transition-colors hover:bg-transparent active:scale-100",
              buttonSizeClasses[size],
              {
                "text-[var(--segmented-active-text,var(--color-base-content))] hover:text-[var(--segmented-active-text,var(--color-base-content))]":
                  isActive,
                "text-[var(--segmented-inactive-text,var(--color-base-content))]/70 hover:text-[var(--segmented-inactive-text,var(--color-base-content))]":
                  !isActive,
              },
              "disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-50",
            )}
          >
            {option.icon}
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
