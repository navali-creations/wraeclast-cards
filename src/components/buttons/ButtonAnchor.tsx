import clsx from "clsx";
import { type ButtonVariant, baseClass, variantClasses } from "./styles";

interface ButtonExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
}

export function ButtonExternalLink({
  variant = "unstyled",
  className,
  ...props
}: ButtonExternalLinkProps) {
  return (
    <a
      className={clsx(baseClass, variantClasses[variant], className)}
      {...props}
    />
  );
}
