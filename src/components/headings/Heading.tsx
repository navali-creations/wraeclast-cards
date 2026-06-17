import clsx from "clsx";
import type { ElementType, HTMLAttributes } from "react";
import { type HeadingSize, headingBaseClass, sizeClasses } from "./styles";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
  size?: HeadingSize;
}

export function Heading({
  as: Tag = "h2",
  size = "lg",
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={clsx(headingBaseClass, sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
