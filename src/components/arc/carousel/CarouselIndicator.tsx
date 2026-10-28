import { type MotionValue, m, useTransform } from "motion/react";
import type { Ref } from "react";
import styles from "./carousel.module.css";
import { carouselIndicatorEmphasis } from "./carousel.utils";

const DOT_WIDTH = 6;
const PILL_WIDTH = 22;

export function CarouselIndicator({
  index,
  firstRealPosition,
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
  firstRealPosition: number;
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
    return carouselIndicatorEmphasis(value, index, {
      count,
      firstRealPosition,
      looping: count > 1,
    });
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
