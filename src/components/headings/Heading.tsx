import clsx from "clsx";
import type { ElementType, HTMLAttributes } from "react";
import {
  fontClasses,
  type HeadingFont,
  type HeadingSize,
  headingBaseClass,
  sizeClasses,
} from "./styles";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
  size?: HeadingSize;
  font?: HeadingFont;
}

export function Heading({
  as: Tag = "h2",
  size = "lg",
  font = "cinzel",
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={clsx(
        headingBaseClass,
        fontClasses[font],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
