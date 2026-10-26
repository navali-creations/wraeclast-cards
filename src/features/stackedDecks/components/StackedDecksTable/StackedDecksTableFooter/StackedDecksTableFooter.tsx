import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export function StackedDecksTableFooter({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between border-t border-(--wc-accent-border) bg-(--wc-glow) px-3 py-2 text-[11px] text-(--wc-text-70)",
        className,
      )}
      {...props}
    />
  );
}
