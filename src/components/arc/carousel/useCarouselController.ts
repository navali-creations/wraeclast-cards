import {
  type AnimationPlaybackControls,
  animate,
  motionValue,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  type DragEvent as ReactDragEvent,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motionTokens } from "../motion-tokens";
import type { CarouselSlideLabel } from "./carousel.types";
import {
  CAROUSEL_FLICK_VELOCITY,
  CAROUSEL_SLOP,
  carouselVelocity,
  clamp,
  projectCarouselVelocity,
  removeRubberBand,
  rubberBand,
} from "./carousel.utils";

interface DragState {
  pointer: number;
  startX: number;
  startY: number;
  origin: number;
  from: number;
  locked: "x" | "y" | null;
  caught: boolean;
  samples: [number, number][];
}

const subscribeNothing = () => () => {};

export function useCarouselController({
  autoplay,
  controlledIndex,
  count,
  defaultIndex,
  interval,
  onIndexChange,
  slideLabel,
}: {
  autoplay: boolean;
  controlledIndex?: number;
  count: number;
  defaultIndex: number;
  interval?: number;
  onIndexChange?: (index: number) => void;
  slideLabel: CarouselSlideLabel;
}) {
  const last = Math.max(0, count - 1);
  const looping = count > 1;
  const trackLast = looping ? count + 1 : last;
  const firstRealPosition = looping ? 1 : 0;
  const lastRealPosition = looping ? count : 0;
  const reduced = useReducedMotion() ?? false;
  const hydrated = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const [ownIndex, setOwnIndex] = useState(() => clamp(defaultIndex, 0, last));
  const index = clamp(controlledIndex ?? ownIndex, 0, last);
  const [startIndex] = useState(index + firstRealPosition);
  const [visualPosition, setVisualPosition] = useState(startIndex);
  const [playing, setPlaying] = useState(autoplay);
  const [hovered, setHovered] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const x = useMotionValue(0);
  const progress = useMotionValue(startIndex);
  const direction = useMotionValue(0);
  const drains = useMemo(
    () => Array.from({ length: count }, () => motionValue(0)),
    [count],
  );
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLFieldSetElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const metrics = useRef({ step: 0, width: 0 });
  const target = useRef(startIndex);
  const travel = useRef<AnimationPlaybackControls | null>(null);
  const drag = useRef<DragState | null>(null);
  const wheel = useRef({ active: false, raw: 0, timer: 0 });
  const swallowClick = useRef(false);
  const canRotate = Boolean(interval) && count > 1 && !(hydrated && reduced);
  const running =
    canRotate &&
    playing &&
    !hovered &&
    !focusPaused &&
    !dragging &&
    inView &&
    pageVisible;

  const logicalIndexAt = (position: number) => {
    if (!looping) return clamp(Math.round(position), 0, last);
    return (
      (((Math.round(position) - firstRealPosition) % count) + count) % count
    );
  };
  const normalizePosition = (position: number) => {
    if (!looping) return clamp(position, 0, trackLast);
    if (position <= 0) return lastRealPosition;
    if (position >= trackLast) return firstRealPosition;
    return position;
  };
  const closestPositionFor = (logicalIndex: number, from: number) => {
    const realPosition = logicalIndex + firstRealPosition;
    if (!looping) return realPosition;
    return [realPosition - count, realPosition, realPosition + count]
      .filter((position) => position >= 0 && position <= trackLast)
      .reduce((closest, position) =>
        Math.abs(position - from) < Math.abs(closest - from)
          ? position
          : closest,
      );
  };
  const bounds = () => ({ min: -trackLast * metrics.current.step, max: 0 });
  const band = (raw: number) => {
    const { min, max } = bounds();
    const size = metrics.current.width || 1;
    return raw > max
      ? max + rubberBand(raw - max, size)
      : raw < min
        ? min - rubberBand(min - raw, size)
        : raw;
  };
  const unband = (shown: number) => {
    const { min, max } = bounds();
    const size = metrics.current.width || 1;
    return shown > max
      ? max + removeRubberBand(shown - max, size)
      : shown < min
        ? min - removeRubberBand(min - shown, size)
        : shown;
  };

  function settleLoop(position: number) {
    const normalized = normalizePosition(position);
    travel.current = null;
    if (normalized === position) return;

    const { step } = metrics.current;
    target.current = normalized;
    setVisualPosition(normalized);
    x.jump(-normalized * step);
    progress.jump(normalized);
  }

  function glide(to: number, velocity = 0) {
    const { step } = metrics.current;
    travel.current?.stop();
    travel.current = null;
    if (!step) return;
    if (reduced) {
      x.jump(-to * step);
      return;
    }
    travel.current = animate(x, -to * step, {
      ...motionTokens.spring.smooth,
      velocity,
      onComplete: () => settleLoop(to),
    });
  }

  function select(
    to: number,
    {
      velocity = 0,
      announce = true,
    }: { velocity?: number; announce?: boolean } = {},
  ) {
    const next = reduced
      ? normalizePosition(clamp(to, 0, trackLast))
      : clamp(to, 0, trackLast);
    const nextLogicalIndex = logicalIndexAt(next);
    target.current = next;
    setVisualPosition(next);
    drains.forEach((drainValue, drainIndex) => {
      if (drainIndex !== nextLogicalIndex && drainValue.get() !== 0) {
        drainValue.jump(0);
      }
    });
    glide(next, velocity);
    if (nextLogicalIndex === index) return;
    if (controlledIndex === undefined) setOwnIndex(nextLogicalIndex);
    onIndexChange?.(nextLogicalIndex);
    if (announce) setAnnouncement(slideLabel(nextLogicalIndex, count));
  }

  const measure = useEffectEvent(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const [first, second] = Array.from(track?.children ?? []) as HTMLElement[];
    if (!track || !viewport || !first) return;

    const center = (node: HTMLElement) => {
      const rect = node.getBoundingClientRect();
      return rect.left + rect.width / 2;
    };
    const step = second ? center(second) - center(first) : first.offsetWidth;
    const changed = step !== metrics.current.step;
    metrics.current = { step, width: viewport.clientWidth };
    track.dataset.measured = "";
    if (changed && !drag.current) {
      travel.current?.stop();
      travel.current = null;
      x.jump(-target.current * step);
      progress.set(target.current);
    }
  });

  useLayoutEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () =>
      x.on("change", (value) => {
        const { step } = metrics.current;
        if (!step) return;
        const position = -value / step;
        const previousPosition = progress.get();
        if (Math.abs(position - previousPosition) > 0.0001) {
          direction.set(Math.sign(position - previousPosition));
        }
        progress.set(position);
      }),
    [direction, progress, x],
  );

  const followIndexProp = useEffectEvent((next: number) => {
    if (logicalIndexAt(target.current) === next) return;
    const nextPosition = closestPositionFor(next, target.current);
    target.current = nextPosition;
    setVisualPosition(nextPosition);
    glide(nextPosition);
  });
  useEffect(() => {
    followIndexProp(index);
  }, [index]);

  const advance = useEffectEvent(() =>
    select(target.current + 1, { announce: false }),
  );
  useEffect(() => {
    if (!running || !interval) return;
    const drain = drains[index];
    if (!drain) return;

    if (drain.get() >= 1) drain.jump(0);
    const remainingMs = Math.max(1, (1 - drain.get()) * interval);
    const controls = animate(drain, 1, {
      duration: remainingMs / 1000,
      ease: "linear",
    });
    const timer = window.setTimeout(advance, remainingMs);
    return () => {
      controls.stop();
      window.clearTimeout(timer);
    };
  }, [drains, index, interval, running]);

  useEffect(() => {
    const root = rootRef.current;
    if (!interval || !root) return;
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            if (entry) setInView(entry.isIntersecting);
          });
    observer?.observe(root);
    const onVisibility = () =>
      setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [interval]);

  const onWheel = useEffectEvent((event: WheelEvent) => {
    const state = wheel.current;
    if (count < 2 || drag.current || !metrics.current.step) return;
    if (!state.active && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
      return;
    }
    event.preventDefault();
    if (!state.active) {
      state.active = true;
      travel.current?.stop();
      travel.current = null;
      state.raw = unband(x.get());
    }
    state.raw -= event.deltaX * (event.deltaMode === 1 ? 16 : 1);
    x.set(band(state.raw));
    window.clearTimeout(state.timer);
    state.timer = window.setTimeout(() => {
      state.active = false;
      select(Math.round(-x.get() / metrics.current.step), {
        velocity: x.getVelocity(),
      });
    }, 120);
  });
  useEffect(() => {
    const viewport = viewportRef.current;
    const state = wheel.current;
    if (!viewport) return;
    const listener = (event: WheelEvent) => onWheel(event);
    viewport.addEventListener("wheel", listener, { passive: false });
    return () => {
      viewport.removeEventListener("wheel", listener);
      window.clearTimeout(state.timer);
    };
  }, []);

  function slideAt(clientX: number) {
    const nodes = Array.from(trackRef.current?.children ?? []);
    const hit = nodes.findIndex((node) => {
      const rect = node.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right;
    });
    return hit < 0 ? null : hit;
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLFieldSetElement>) {
    if (
      count < 2 ||
      drag.current ||
      !metrics.current.step ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }
    swallowClick.current = false;
    const caught =
      travel.current !== null &&
      x.isAnimating() &&
      Math.abs(x.get() + target.current * metrics.current.step) > 12;
    if (caught) {
      travel.current?.stop();
      travel.current = null;
    }
    drag.current = {
      pointer: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: 0,
      from: target.current,
      locked: null,
      caught,
      samples: [],
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLFieldSetElement>) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    if (!current.locked) {
      const dx = event.clientX - current.startX;
      const dy = event.clientY - current.startY;
      if (Math.abs(dx) < CAROUSEL_SLOP && Math.abs(dy) < CAROUSEL_SLOP) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        current.locked = "y";
        return;
      }
      current.locked = "x";
      travel.current?.stop();
      travel.current = null;
      current.startX = event.clientX;
      current.origin = unband(x.get());
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    if (current.locked !== "x") return;
    x.set(band(current.origin + event.clientX - current.startX));
    current.samples.push([event.timeStamp, event.clientX]);
    if (current.samples.length > 16) current.samples.shift();
  }

  function finishPointer(
    event: ReactPointerEvent<HTMLFieldSetElement>,
    cancelled: boolean,
  ) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    drag.current = null;
    const { step } = metrics.current;
    if (current.locked === "x") {
      swallowClick.current = true;
      setDragging(false);
      const velocity = cancelled
        ? 0
        : carouselVelocity(current.samples, event.timeStamp);
      let to = Math.round(
        -(x.get() + projectCarouselVelocity(velocity)) / step,
      );
      if (Math.abs(velocity) > CAROUSEL_FLICK_VELOCITY) {
        const movementDirection = velocity < 0 ? 1 : -1;
        if ((to - current.from) * movementDirection < 1) {
          to = current.from + movementDirection;
        }
      }
      const { min, max } = bounds();
      const shown = x.get();
      select(to, {
        velocity: shown >= min && shown <= max ? velocity : x.getVelocity(),
      });
    } else if (current.caught) {
      swallowClick.current = true;
      select(Math.round(-x.get() / step));
    } else if (!cancelled && current.locked === null) {
      const hit = slideAt(event.clientX);
      if (hit !== null && hit !== target.current) {
        swallowClick.current = true;
        select(hit);
      }
    } else if (cancelled) {
      select(target.current);
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || count < 2) return;
    const node = event.target as HTMLElement;
    if (node.closest("input, textarea, select, [contenteditable]")) return;
    const from = target.current;
    const to =
      event.key === "ArrowLeft"
        ? from - 1
        : event.key === "ArrowRight"
          ? from + 1
          : event.key === "Home"
            ? firstRealPosition
            : event.key === "End"
              ? lastRealPosition
              : null;
    if (to === null) return;
    event.preventDefault();
    const next = clamp(to, 0, trackLast);
    const nextLogicalIndex = logicalIndexAt(next);
    select(next);
    tabRefs.current[nextLogicalIndex]?.focus({ preventScroll: true });
  }

  function toggleRotation() {
    const drain = drains[index];
    if (!playing) {
      drain?.jump(0);
      setFocusPaused(false);
      setPlaying(true);
      return;
    }
    setPlaying(false);
    if (drain) {
      if (reduced) drain.jump(0);
      else {
        animate(drain, 0, {
          duration: motionTokens.duration.standard,
          ease: [...motionTokens.ease.standard],
        });
      }
    }
  }

  return {
    announcement,
    canRotate,
    direction,
    drains,
    dragging,
    firstRealPosition,
    handleBlur: (event: ReactFocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setFocusPaused(false);
      }
    },
    handleClickCapture: (event: ReactMouseEvent<HTMLFieldSetElement>) => {
      if (swallowClick.current) {
        event.preventDefault();
        event.stopPropagation();
        swallowClick.current = false;
      }
    },
    handleDragStart: (event: ReactDragEvent<HTMLFieldSetElement>) =>
      event.preventDefault(),
    handleFocus: (event: ReactFocusEvent<HTMLElement>) =>
      setFocusPaused(
        event.target !== playRef.current &&
          event.target.matches(":focus-visible"),
      ),
    handleKeyDown,
    handlePointerCancel: (event: ReactPointerEvent<HTMLFieldSetElement>) =>
      finishPointer(event, true),
    handlePointerDown,
    handlePointerEnter: (event: ReactPointerEvent<HTMLFieldSetElement>) => {
      if (event.pointerType === "mouse") setHovered(true);
    },
    handlePointerLeave: (event: ReactPointerEvent<HTMLFieldSetElement>) => {
      if (event.pointerType === "mouse") setHovered(false);
    },
    handlePointerMove,
    handlePointerUp: (event: ReactPointerEvent<HTMLFieldSetElement>) =>
      finishPointer(event, false),
    index,
    next: () => select(target.current + 1),
    playRef,
    playing,
    previous: () => select(target.current - 1),
    progress,
    reduced,
    rootRef,
    selectLogicalIndex: (logicalIndex: number) =>
      select(closestPositionFor(logicalIndex, target.current)),
    setTabRef: (tabIndex: number, node: HTMLButtonElement | null) => {
      tabRefs.current[tabIndex] = node;
    },
    startIndex,
    toggleRotation,
    trackRef,
    viewportRef,
    visualPosition,
    x,
  };
}
