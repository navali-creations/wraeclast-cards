import { type MotionValue, m, useTransform } from "motion/react";
import { type ReactNode, useMemo } from "react";
import styles from "./carousel.module.css";
import {
  type CarouselSlideMotion,
  CarouselSlideMotionContext,
} from "./carousel-motion";

const SIBLING_SCALE = 0.9;
const SIBLING_OPACITY = 0.5;

export function CarouselSlide({
  id,
  index,
  progress,
  direction,
  active,
  clone,
  label,
  children,
}: {
  id: string;
  index: number;
  progress: MotionValue<number>;
  direction: MotionValue<number>;
  active: boolean;
  clone: boolean;
  label: string;
  children: ReactNode;
}) {
  const scale = useTransform(
    progress,
    [index - 1, index, index + 1],
    [SIBLING_SCALE, 1, SIBLING_SCALE],
  );
  const opacity = useTransform(
    progress,
    [index - 1, index, index + 1],
    [SIBLING_OPACITY, 1, SIBLING_OPACITY],
  );
  const motionContext = useMemo<CarouselSlideMotion>(
    () => ({ direction, index, progress }),
    [direction, index, progress],
  );

  return (
    <CarouselSlideMotionContext.Provider value={motionContext}>
      <m.div
        id={id}
        className={styles.slide}
        role="tabpanel"
        aria-roledescription="slide"
        aria-label={label}
        aria-hidden={clone || undefined}
        inert={!active || clone}
        style={{ scale, opacity }}
      >
        {children}
      </m.div>
    </CarouselSlideMotionContext.Provider>
  );
}
