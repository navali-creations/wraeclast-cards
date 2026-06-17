export const headingBaseClass = "font-cinzel font-bold";

export const sizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-3xl",
} as const;

export type HeadingSize = keyof typeof sizeClasses;
