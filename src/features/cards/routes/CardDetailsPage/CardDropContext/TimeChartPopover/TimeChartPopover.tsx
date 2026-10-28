import { useLayoutEffect, useRef } from "react";
import {
  formatMinuteOfDay,
  formatReportCount,
  type TimeDistributionDatum,
} from "../../../../../stackedDecks/components/DropContextCharts/dropContext.utils";
import {
  clamp,
  formatShare,
} from "../CardDropContext.utils/CardDropContext.utils";

interface TimeChartPopoverProps {
  bucket: TimeDistributionDatum;
  label: string;
  pointerX: number;
  pointerY: number;
}

const CURSOR_GAP = 14;
const VIEWPORT_PADDING = 8;

export function TimeChartPopover({
  bucket,
  label,
  pointerX,
  pointerY,
}: TimeChartPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const popover = popoverRef.current;
    popover?.showPopover?.();
    return () => popover?.hidePopover?.();
  }, []);

  useLayoutEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;
    const bounds = popover.getBoundingClientRect();
    const hasRoomOnRight =
      pointerX + CURSOR_GAP + bounds.width <=
      window.innerWidth - VIEWPORT_PADDING;
    const hasRoomAbove =
      pointerY - CURSOR_GAP - bounds.height >= VIEWPORT_PADDING;
    const left = hasRoomOnRight
      ? pointerX + CURSOR_GAP
      : pointerX - CURSOR_GAP - bounds.width;
    const top = hasRoomAbove
      ? pointerY - CURSOR_GAP - bounds.height
      : pointerY + CURSOR_GAP;
    const maximumLeft = Math.max(
      VIEWPORT_PADDING,
      window.innerWidth - bounds.width - VIEWPORT_PADDING,
    );
    const maximumTop = Math.max(
      VIEWPORT_PADDING,
      window.innerHeight - bounds.height - VIEWPORT_PADDING,
    );
    popover.style.left = `${clamp(left, VIEWPORT_PADDING, maximumLeft)}px`;
    popover.style.top = `${clamp(top, VIEWPORT_PADDING, maximumTop)}px`;
  }, [pointerX, pointerY]);

  const start = formatMinuteOfDay(bucket.minute);
  const end = formatMinuteOfDay(bucket.minute + 15);

  return (
    <div
      ref={popoverRef}
      role="tooltip"
      popover="manual"
      className="m-0 w-max max-w-[min(18rem,calc(100vw-1rem))] rounded-md border border-(--wc-border) bg-(--wc-card-darker) px-3 py-2.5 text-left text-xs leading-snug text-(--wc-text-90) shadow-2xl pointer-events-none"
      style={{
        inset: "auto",
        left: pointerX + CURSOR_GAP,
        position: "fixed",
        top: pointerY + CURSOR_GAP,
      }}
    >
      <strong className="block border-b border-(--wc-text-dimmed) pb-2 text-sm text-(--wc-gold-bright)">
        {start}–{end} · {label}
      </strong>
      <span className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1.5">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-(--wc-accent-border)"
        />
        <span>This card</span>
        <span className="text-right tabular-nums">
          {formatReportCount(bucket.count)} · {formatShare(bucket.cardShare)}
        </span>
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-(--wc-text-60)"
        />
        <span>All timed reports</span>
        <span className="text-right tabular-nums text-(--wc-text-70)">
          {bucket.sampleSize.toLocaleString()} ·{" "}
          {formatShare(bucket.activityShare)}
        </span>
      </span>
    </div>
  );
}
