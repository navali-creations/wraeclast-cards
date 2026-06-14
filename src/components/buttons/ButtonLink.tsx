import { Link, type LinkProps } from "@tanstack/react-router";
import clsx from "clsx";
import { type ButtonVariant, baseClass, variantClasses } from "./styles";

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  className?: string;
}

export function ButtonInternalLink({
  variant = "unstyled",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={clsx(baseClass, variantClasses[variant], className)}
      {...props}
    />
  );
}
