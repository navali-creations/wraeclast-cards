import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  containerClassName?: string;
  containerRef?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

export function Input({
  leftIcon,
  rightSlot,
  className,
  containerClassName,
  containerRef,
  children,
  ...props
}: InputProps) {
  const input = (
    <input
      className={clsx(
        "h-10 w-full rounded-xl border border-(--wc-accent-border) bg-(--wc-card-darker) py-1.5 text-sm text-(--wc-text-80) ring-1 ring-(--color-info)/12 transition-colors placeholder:text-(--wc-text-40) hover:border-(--color-primary) focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-info)/24",
        leftIcon ? "pl-10" : "pl-3",
        rightSlot ? "pr-9" : "pr-3",
        className,
      )}
      {...props}
    />
  );

  if (!leftIcon && !rightSlot && !children) return input;

  return (
    <div ref={containerRef} className={clsx("relative", containerClassName)}>
      {leftIcon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--wc-text-50)">
          {leftIcon}
        </span>
      )}
      {input}
      {rightSlot && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightSlot}
        </span>
      )}
      {children}
    </div>
  );
}
