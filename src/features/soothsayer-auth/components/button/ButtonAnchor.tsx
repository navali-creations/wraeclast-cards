import clsx from "clsx";
import { type ButtonVariant, baseClass, variantClasses } from "./styles";

interface ButtonAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: ButtonVariant;
}

export function ButtonAnchor({
  variant,
  className,
  ...props
}: ButtonAnchorProps) {
  return (
    <a
      className={clsx(baseClass, variantClasses[variant], className)}
      {...props}
    />
  );
}
