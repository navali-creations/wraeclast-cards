import type { ReactNode } from "react";
import { FiInfo } from "react-icons/fi";
import { Tooltip } from "../../../../../../components/Tooltip/Tooltip";

export function ContextInfoTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip
      as="button"
      type="button"
      aria-label={label}
      content={children}
      placement="top"
      className="shrink-0 cursor-help rounded-sm border-0 bg-transparent p-0 leading-none text-info-content focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold)"
      tooltipClassName="max-w-80! text-left!"
    >
      <FiInfo aria-hidden="true" className="size-4" />
    </Tooltip>
  );
}
