export const baseClass = "text-sm transition-all active:scale-[0.98]";

const cta = "w-full rounded-lg px-6 py-2.5 font-medium";
const controlBase = "btn btn-md gap-1.5 font-medium normal-case";

export const variantClasses = {
  ghost: "btn btn-ghost",
  primary: `${cta} mb-4 bg-primary text-primary-content hover:bg-(--wc-primary-hover)`,
  subtle: `${cta} border border-base-content/20 text-(--wc-text-60) hover:bg-base-content/5`,
  error: `${cta} mb-3 bg-error text-error-content hover:brightness-110`,
  control: `${controlBase} border-(--wc-border) bg-(--wc-glow)/80 text-(--wc-text-70) hover:border-(--wc-accent-border) hover:bg-(--wc-primary-hover) hover:text-(--wc-text-90)`,
  controlActive: `${controlBase} border-(--wc-hero-accent) bg-(--wc-glow) text-(--wc-gold) hover:border-(--wc-hero-accent) hover:bg-(--wc-glow) hover:text-(--wc-gold)`,
  secondary:
    "flex h-9 w-9 items-center justify-center rounded border duration-150 select-none cursor-pointer border-(--wc-border) text-(--wc-text-60) hover:border-(--wc-accent-border) hover:bg-(--wc-glow)/40 hover:text-(--wc-gold-muted)",
  secondaryActive:
    "flex h-9 w-9 items-center justify-center rounded border duration-150 select-none cursor-default border-(--wc-gold-dim) bg-(--wc-glow) text-(--wc-gold) shadow-[0_0_10px_color-mix(in_oklch,var(--wc-gold-dim)_35%,transparent)]",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
