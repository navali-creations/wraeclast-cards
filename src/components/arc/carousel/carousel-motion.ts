import type { MotionValue } from "motion/react";
import { createContext, useContext } from "react";

export interface CarouselSlideMotion {
  direction: MotionValue<number>;
  index: number;
  progress: MotionValue<number>;
}

export const CarouselSlideMotionContext =
  createContext<CarouselSlideMotion | null>(null);

export function useCarouselSlideMotion() {
  const value = useContext(CarouselSlideMotionContext);
  if (!value) {
    throw new Error(
      "useCarouselSlideMotion must be used inside a Carousel slide",
    );
  }
  return value;
}
