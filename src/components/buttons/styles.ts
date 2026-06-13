export const baseClass = "text-sm transition-all active:scale-[0.98]";

const cta = "w-full rounded-lg px-6 py-2.5 font-medium";

export const variantClasses = {
  unstyled: "",
  primary: `${cta} mb-4 bg-primary text-primary-content hover:bg-(--wc-primary-hover)`,
  subtle: `${cta} border border-base-content/20 text-(--wc-text-60) hover:bg-base-content/5`,
  error: `${cta} mb-3 bg-error text-error-content hover:brightness-110`,
  page: "flex h-9 w-9 items-center justify-center rounded border duration-150 select-none font-cinzel cursor-pointer border-(--wc-border) text-(--wc-text-60) hover:border-(--wc-accent-border) hover:bg-(--wc-glow)/40 hover:text-(--wc-gold-muted)",
  pageActive:
    "flex h-9 w-9 items-center justify-center rounded border duration-150 select-none font-cinzel cursor-default border-(--wc-gold-dim) bg-(--wc-glow) text-(--wc-gold) shadow-[0_0_10px_color-mix(in_oklch,var(--wc-gold-dim)_35%,transparent)]",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
