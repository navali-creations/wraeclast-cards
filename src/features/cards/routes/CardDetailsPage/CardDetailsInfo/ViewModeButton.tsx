import clsx from "clsx";
import type { ReactNode } from "react";
import { Button } from "../../../../../components/buttons";
import type { TableViewMode } from "../CardDetailsDropRateTables";

export function ViewModeButton({
  mode,
  currentMode,
  onChange,
  children,
}: {
  mode: TableViewMode;
  currentMode: TableViewMode;
  onChange: (nextMode: TableViewMode) => void;
  children: ReactNode;
}) {
  const isActive = mode === currentMode;

  return (
    <Button
      className={clsx(
        "relative z-10 inline-flex h-8 min-w-22 items-center justify-center rounded-md border border-transparent bg-transparent px-3 text-xs font-semibold normal-case",
        "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold-dim)",
        isActive
          ? "text-(--wc-hero-accent)"
          : "text-(--wc-text-50) hover:text-(--wc-card-name)",
      )}
      aria-pressed={isActive}
      onClick={() => onChange(mode)}
    >
      {children}
    </Button>
  );
}
