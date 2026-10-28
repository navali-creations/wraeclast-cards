import {
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";

export interface DropTimePopoverPosition {
  left: number;
  placement: "above" | "below";
  top: number;
}

const POPOVER_WIDTH = 320;
const POPOVER_ESTIMATED_HEIGHT = 360;
const POPOVER_GAP = 8;
const VIEWPORT_GUTTER = 8;

export function useDropTimePopover(
  chartRef: RefObject<HTMLButtonElement | null>,
  popoverRef: RefObject<HTMLDivElement | null>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DropTimePopoverPosition>();

  const updatePosition = useCallback(() => {
    const chart = chartRef.current;
    if (!chart || typeof window === "undefined") return;

    const chartRect = chart.getBoundingClientRect();
    const popoverHeight =
      popoverRef.current?.getBoundingClientRect().height ??
      POPOVER_ESTIMATED_HEIGHT;
    const spaceAbove = chartRect.top;
    const spaceBelow = window.innerHeight - chartRect.bottom;
    const placement =
      spaceBelow >= popoverHeight + POPOVER_GAP || spaceBelow >= spaceAbove
        ? "below"
        : "above";
    const idealLeft = chartRect.left + chartRect.width / 2 - POPOVER_WIDTH / 2;
    const maximumLeft = Math.max(
      VIEWPORT_GUTTER,
      window.innerWidth - POPOVER_WIDTH - VIEWPORT_GUTTER,
    );

    setPosition({
      left: Math.min(Math.max(VIEWPORT_GUTTER, idealLeft), maximumLeft),
      placement,
      top:
        placement === "below"
          ? chartRect.bottom + POPOVER_GAP
          : chartRect.top - POPOVER_GAP,
    });
  }, [chartRef, popoverRef]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    updatePosition();
    const frame = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  function show() {
    updatePosition();
    setIsOpen(true);
  }

  function hide() {
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") hide();
  }

  return { handleKeyDown, hide, isOpen, position, show };
}
