import clsx from "clsx";
import { type ButtonVariant, baseClass, variantClasses } from "./styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        baseClass,
        variantClasses?.[variant as ButtonVariant],
        className,
      )}
      {...props}
    />
  );
}
