import { type PointerEvent, useEffect, useRef, useState } from "react";
import { clamp } from "../CardDropContext.utils/CardDropContext.utils";

interface HoveredBucket {
  index: number;
  pointerX: number;
  pointerY: number;
}

export function useTimeChartHover(visibleBucketCount: number) {
  const [hoveredBucket, setHoveredBucket] = useState<HoveredBucket | null>(
    null,
  );
  const animationFrame = useRef<number | null>(null);
  const hoverLineRef = useRef<HTMLSpanElement>(null);
  const latestPointer = useRef({ clientX: 0, clientY: 0, left: 0, width: 0 });

  useEffect(
    () => () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    },
    [],
  );

  function handlePlotPointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0) return;
    latestPointer.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      left: bounds.left,
      width: bounds.width,
    };
    if (animationFrame.current !== null) return;

    animationFrame.current = requestAnimationFrame(() => {
      animationFrame.current = null;
      const pointer = latestPointer.current;
      const pointerRatio = clamp(
        (pointer.clientX - pointer.left) / pointer.width,
        0,
        1,
      );
      const index = Math.min(
        visibleBucketCount - 1,
        Math.floor(pointerRatio * visibleBucketCount),
      );
      if (hoverLineRef.current) {
        hoverLineRef.current.style.left = `${((index + 0.5) / visibleBucketCount) * 100}%`;
        hoverLineRef.current.style.visibility = "visible";
      }
      setHoveredBucket({
        index,
        pointerX: pointer.clientX,
        pointerY: pointer.clientY,
      });
    });
  }

  function handlePlotPointerLeave() {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    if (hoverLineRef.current) {
      hoverLineRef.current.style.visibility = "hidden";
    }
    setHoveredBucket(null);
  }

  return {
    handlePlotPointerLeave,
    handlePlotPointerMove,
    hoverLineRef,
    hoveredBucket,
  };
}
