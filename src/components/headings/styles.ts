export const headingBaseClass = "font-bold";

export const sizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-3xl",
  "3xl": "text-4xl",
} as const;

export type HeadingSize = keyof typeof sizeClasses;
