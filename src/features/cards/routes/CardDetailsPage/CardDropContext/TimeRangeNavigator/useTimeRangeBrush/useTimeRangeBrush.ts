import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BUCKETS_PER_HOUR,
  clamp,
  getSliderKeyboardAction,
  MINIMUM_VISIBLE_BUCKETS,
} from "../../CardDropContext.utils/CardDropContext.utils";

interface UseTimeRangeBrushOptions {
  onRangeChange: (startBucket: number, visibleBuckets: number) => void;
  startBucket: number;
  totalBuckets: number;
  visibleBuckets: number;
}

type DragMode = "end" | "move" | "start";

interface DragState {
  mode: DragMode;
  originStart: number;
  originVisible: number;
  originX: number;
  trackWidth: number;
}

export function useTimeRangeBrush({
  onRangeChange,
  startBucket,
  totalBuckets,
  visibleBuckets,
}: UseTimeRangeBrushOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const [dragMode, setDragMode] = useState<DragMode | null>(null);

  useEffect(() => {
    if (!dragMode) return;
    const root = document.documentElement;
    const previousCursor = root.style.cursor;
    root.style.cursor = dragMode === "move" ? "grabbing" : "ew-resize";
    return () => {
      root.style.cursor = previousCursor;
    };
  }, [dragMode]);

  function beginDrag(mode: DragMode, event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const track = trackRef.current;
    if (!track) return;
    const bounds = track.getBoundingClientRect();
    track.setPointerCapture(event.pointerId);
    dragState.current = {
      mode,
      originStart: startBucket,
      originVisible: visibleBuckets,
      originX: event.clientX,
      trackWidth: bounds.width,
    };
    setDragMode(mode);
  }

  function handleMovePointerDown(event: PointerEvent<HTMLDivElement>) {
    beginDrag("move", event);
  }

  function handleStartPointerDown(event: PointerEvent<HTMLDivElement>) {
    beginDrag("start", event);
  }

  function handleEndPointerDown(event: PointerEvent<HTMLDivElement>) {
    beginDrag("end", event);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;
    if (!drag || drag.trackWidth <= 0) return;
    const deltaBuckets =
      Math.round(
        (((event.clientX - drag.originX) / drag.trackWidth) * totalBuckets) /
          BUCKETS_PER_HOUR,
      ) * BUCKETS_PER_HOUR;

    if (drag.mode === "move") {
      onRangeChange(
        clamp(
          drag.originStart + deltaBuckets,
          0,
          totalBuckets - drag.originVisible,
        ),
        drag.originVisible,
      );
      return;
    }

    if (drag.mode === "start") {
      const endBucket = drag.originStart + drag.originVisible;
      const nextStart = clamp(
        drag.originStart + deltaBuckets,
        0,
        endBucket - MINIMUM_VISIBLE_BUCKETS,
      );
      onRangeChange(nextStart, endBucket - nextStart);
      return;
    }

    onRangeChange(
      drag.originStart,
      clamp(
        drag.originVisible + deltaBuckets,
        MINIMUM_VISIBLE_BUCKETS,
        totalBuckets - drag.originStart,
      ),
    );
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    dragState.current = null;
    setDragMode(null);
  }

  function handleTrackPointerDown(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0) return;
    const pointerRatio = clamp(
      (event.clientX - bounds.left) / bounds.width,
      0,
      1,
    );
    const centeredStart =
      Math.round(
        (pointerRatio * totalBuckets - visibleBuckets / 2) / BUCKETS_PER_HOUR,
      ) * BUCKETS_PER_HOUR;
    onRangeChange(
      clamp(centeredStart, 0, totalBuckets - visibleBuckets),
      visibleBuckets,
    );
  }

  function handleMoveKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const action = getSliderKeyboardAction(event.key);
    if (!action) return;
    event.preventDefault();
    if (action === "minimum") {
      onRangeChange(0, visibleBuckets);
      return;
    }
    if (action === "maximum") {
      onRangeChange(totalBuckets - visibleBuckets, visibleBuckets);
      return;
    }
    const direction = action === "decrease" ? -1 : 1;
    onRangeChange(
      clamp(
        startBucket + direction * BUCKETS_PER_HOUR,
        0,
        totalBuckets - visibleBuckets,
      ),
      visibleBuckets,
    );
  }

  function handleStartKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const action = getSliderKeyboardAction(event.key);
    if (!action) return;
    event.preventDefault();
    const endBucket = startBucket + visibleBuckets;
    if (action === "minimum") {
      onRangeChange(0, endBucket);
      return;
    }
    if (action === "maximum") {
      const nextStart = endBucket - MINIMUM_VISIBLE_BUCKETS;
      onRangeChange(nextStart, MINIMUM_VISIBLE_BUCKETS);
      return;
    }
    const direction = action === "decrease" ? -1 : 1;
    const nextStart = clamp(
      startBucket + direction * BUCKETS_PER_HOUR,
      0,
      endBucket - MINIMUM_VISIBLE_BUCKETS,
    );
    onRangeChange(nextStart, endBucket - nextStart);
  }

  function handleEndKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const action = getSliderKeyboardAction(event.key);
    if (!action) return;
    event.preventDefault();
    if (action === "minimum") {
      onRangeChange(startBucket, MINIMUM_VISIBLE_BUCKETS);
      return;
    }
    if (action === "maximum") {
      onRangeChange(startBucket, totalBuckets - startBucket);
      return;
    }
    const direction = action === "decrease" ? -1 : 1;
    onRangeChange(
      startBucket,
      clamp(
        visibleBuckets + direction * BUCKETS_PER_HOUR,
        MINIMUM_VISIBLE_BUCKETS,
        totalBuckets - startBucket,
      ),
    );
  }

  return {
    dragMode,
    handleEndKeyDown,
    handleEndPointerDown,
    handleMoveKeyDown,
    handleMovePointerDown,
    handlePointerEnd,
    handlePointerMove,
    handleStartKeyDown,
    handleStartPointerDown,
    handleTrackPointerDown,
    trackRef,
  };
}
