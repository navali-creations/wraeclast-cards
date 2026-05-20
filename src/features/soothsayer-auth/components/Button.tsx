import clsx from "clsx";

const baseClass =
  "w-full rounded-lg py-2.5 font-medium text-sm transition-all active:scale-[0.98]";

const variantClasses = {
  primary: "mb-4 bg-primary text-primary-content hover:bg-(--wc-primary-hover)",
  subtle:
    "border border-base-content/20 text-(--wc-text-60) hover:bg-base-content/5",
  error: "mb-3 bg-error text-error-content hover:brightness-110",
} as const;

type ButtonVariant = keyof typeof variantClasses;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
}

export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(baseClass, variantClasses[variant], className)}
      {...props}
    />
  );
}
