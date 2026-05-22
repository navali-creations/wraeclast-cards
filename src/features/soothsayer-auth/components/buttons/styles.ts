export const baseClass =
  "w-full rounded-lg px-6 py-2.5 font-medium text-sm transition-all active:scale-[0.98]";

export const variantClasses = {
  primary: "mb-4 bg-primary text-primary-content hover:bg-(--wc-primary-hover)",
  subtle:
    "border border-base-content/20 text-(--wc-text-60) hover:bg-base-content/5",
  error: "mb-3 bg-error text-error-content hover:brightness-110",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
