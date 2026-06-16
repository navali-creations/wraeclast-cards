import clsx from "clsx";
import { type ButtonVariant, baseClass, variantClasses } from "./styles";

interface ButtonExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
}

export function ButtonExternalLink({
  variant,
  className,
  ...props
}: ButtonExternalLinkProps) {
  return (
    <a
      className={clsx(baseClass, variant && variantClasses[variant], className)}
      {...props}
    />
  );
}
