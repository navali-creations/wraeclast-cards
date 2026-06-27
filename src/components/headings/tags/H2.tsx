import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { type HeadingSize, headingBaseClass, sizeClasses } from "../styles";

interface H2Props extends HTMLAttributes<HTMLHeadingElement> {
  size?: HeadingSize;
}

export function H2({ size = "2xl", className, ...props }: H2Props) {
  return (
    <h2
      className={clsx(headingBaseClass, sizeClasses[size], className)}
      {...props}
    />
  );
}
