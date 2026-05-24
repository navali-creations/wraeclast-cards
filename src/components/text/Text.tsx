import clsx from "clsx";
import type { ElementType, HTMLAttributes } from "react";

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
} as const;

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

type TextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  size?: keyof typeof sizeClasses;
  weight?: keyof typeof weightClasses;
  uppercase?: boolean;
  dimmed?: boolean;
  muted?: boolean;
};

export function Text({
  as: Tag = "p",
  size,
  weight,
  uppercase,
  dimmed,
  muted,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={clsx(
        size && sizeClasses[size],
        weight && weightClasses[weight],
        uppercase && "uppercase",
        dimmed && "text-(--wc-text-40)",
        muted && "text-(--wc-text-50)",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
