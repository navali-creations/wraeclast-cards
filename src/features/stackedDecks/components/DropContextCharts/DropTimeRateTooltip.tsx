import type { RefObject } from "react";
import { DropTimePerspectiveNotice } from "./DropTimePerspectiveNotice";
import {
  formatReportCount,
  type TimeDistributionProfileData,
} from "./dropContext.utils";
import { TimeDistributionProfile } from "./TimeDistributionProfile";
import type { DropTimePopoverPosition } from "./useDropTimePopover";

interface DropTimeRateTooltipProps {
  localProfile: TimeDistributionProfileData;
  popoverRef: RefObject<HTMLDivElement | null>;
  position: DropTimePopoverPosition;
  total: number;
  utcProfile: TimeDistributionProfileData;
}

export function DropTimeRateTooltip({
  localProfile,
  popoverRef,
  position,
  total,
  utcProfile,
}: DropTimeRateTooltipProps) {
  return (
    <div
      ref={popoverRef}
      role="tooltip"
      className="pointer-events-none fixed z-100 w-80 max-w-[calc(100vw-1rem)] rounded-lg border border-(--wc-border) bg-(--wc-card-darker) p-3 text-left text-xs text-(--wc-text-70) shadow-2xl"
      style={{
        left: position.left,
        top: position.top,
        transform:
          position.placement === "above" ? "translateY(-100%)" : undefined,
      }}
    >
      <div className="mb-2 flex items-baseline justify-between gap-4 border-b border-(--wc-border-dimmed) pb-2">
        <span className="font-semibold text-(--wc-gold-bright)">
          When drops were reported
        </span>
        <span className="tabular-nums text-(--wc-text-70)">
          {formatReportCount(total)}
        </span>
      </div>
      <DropTimePerspectiveNotice />
      <div className="flex items-center gap-4 text-[0.65rem] text-(--wc-text-70)">
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2 rounded-sm bg-(--color-primary-content)"
          />
          This card
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2 rounded-sm bg-(--wc-table-odd) opacity-70"
          />
          All reported cards with time data
        </span>
      </div>
      <TimeDistributionProfile profile={utcProfile} label="Global (UTC)" />
      <TimeDistributionProfile profile={localProfile} label="Player timezone" />
    </div>
  );
}
