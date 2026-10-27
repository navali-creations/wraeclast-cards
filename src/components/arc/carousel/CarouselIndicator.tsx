import { type MotionValue, m, useTransform } from "motion/react";
import type { Ref } from "react";
import styles from "./carousel.module.css";

const DOT_WIDTH = 6;
const PILL_WIDTH = 22;

export function CarouselIndicator({
  index,
  progress,
  drain,
  selected,
  label,
  controls,
  count,
  tabRef,
  onSelect,
}: {
  index: number;
  progress: MotionValue<number>;
  drain: MotionValue<number>;
  selected: boolean;
  label: string;
  controls: string;
  count: number;
  tabRef: Ref<HTMLButtonElement>;
  onSelect: () => void;
}) {
  const emphasis = useTransform(progress, (value) => {
    const realPosition = index + 1;
    const distance = Math.min(
      ...[realPosition - count, realPosition, realPosition + count].map(
        (position) => Math.abs(value - position),
      ),
    );
    return Math.max(0, 1 - distance);
  });
  const width = useTransform(
    emphasis,
    (value) => DOT_WIDTH + (PILL_WIDTH - DOT_WIDTH) * value,
  );
  const remaining = useTransform(drain, (value) => 1 - value);

  return (
    <button
      ref={tabRef}
      type="button"
      role="tab"
      className={styles.tab}
      aria-selected={selected}
      aria-controls={controls}
      aria-label={label}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
    >
      <m.span className={styles.dot} style={{ width }} aria-hidden="true">
        <m.span
          className={styles.dotFill}
          style={{ opacity: emphasis, scaleX: remaining }}
        />
      </m.span>
    </button>
  );
}
