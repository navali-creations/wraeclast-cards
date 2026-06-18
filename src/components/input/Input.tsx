import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  containerClassName?: string;
}

export function Input({
  leftIcon,
  className,
  containerClassName,
  ...props
}: InputProps) {
  const input = (
    <input
      className={clsx(
        "h-10 w-full rounded-xl border border-(--wc-accent-border) bg-(--wc-card-darker) py-1.5 text-sm text-(--wc-text-80) ring-1 ring-(--color-info)/12 transition-colors placeholder:text-(--wc-text-40) hover:border-(--color-primary) focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-info)/24",
        leftIcon ? "pl-10 pr-3" : "px-3",
        className,
      )}
      {...props}
    />
  );

  if (!leftIcon) return input;

  return (
    <div className={clsx("relative", containerClassName)}>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--wc-text-50)">
        {leftIcon}
      </span>
      {input}
    </div>
  );
}
