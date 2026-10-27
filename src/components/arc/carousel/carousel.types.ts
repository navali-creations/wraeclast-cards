import type { ReactNode } from "react";

export interface CarouselProps {
  label: string;
  children: ReactNode;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  slideSize?: string;
  slideLabel?: (index: number, count: number) => string;
  interval?: number;
  autoplay?: boolean;
  smallScreenFadeOnly?: boolean;
  className?: string;
}

export type CarouselSlideLabel = (index: number, count: number) => string;

export const defaultSlideLabel: CarouselSlideLabel = (index, count) =>
  `${index + 1} of ${count}`;
