import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { type HeadingSize, headingBaseClass, sizeClasses } from "../styles";

interface H1Props extends HTMLAttributes<HTMLHeadingElement> {
  size?: HeadingSize;
}

export function H1({ size = "3xl", className, ...props }: H1Props) {
  return (
    <h1
      className={clsx(headingBaseClass, sizeClasses[size], className)}
      {...props}
    />
  );
}
