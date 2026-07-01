import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { type HeadingSize, headingBaseClass, sizeClasses } from "./styles";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const defaultSizeByTag: Record<HeadingTag, HeadingSize> = {
  h1: "3xl",
  h2: "2xl",
  h3: "xl",
  h4: "lg",
  h5: "md",
  h6: "sm",
};

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as: HeadingTag;
  size?: HeadingSize;
}

export function Heading({ as: Tag, size, className, ...props }: HeadingProps) {
  return (
    <Tag
      className={clsx(
        headingBaseClass,
        sizeClasses[size ?? defaultSizeByTag[Tag]],
        className,
      )}
      {...props}
    />
  );
}
