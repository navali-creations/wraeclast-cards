import type { ReactNode } from "react";
import { Tooltip } from "../../../../components/Tooltip/Tooltip";

export function FeaturedHelpTooltip({
  children,
  content,
}: {
  children: ReactNode;
  content: string;
}) {
  return (
    <Tooltip
      as="button"
      type="button"
      content={content}
      placement="top"
      className="rounded-sm border-0 bg-transparent p-0 cursor-help focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold)"
      tooltipClassName="max-w-72! text-left!"
    >
      {children}
    </Tooltip>
  );
}
