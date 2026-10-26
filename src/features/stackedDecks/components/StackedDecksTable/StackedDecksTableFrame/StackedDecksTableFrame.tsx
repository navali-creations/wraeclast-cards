import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export function StackedDecksTableFrame({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)",
        className,
      )}
      {...props}
    />
  );
}
