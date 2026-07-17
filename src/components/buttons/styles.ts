export const baseClass = "text-sm transition-all active:scale-[0.98]";

const cta = "w-full rounded-lg px-6 py-2.5 font-medium";
const controlBase = "btn btn-md gap-1.5 font-medium normal-case";

export const variantClasses = {
  ghost: "btn btn-ghost",
  primary: `${cta} mb-4 bg-primary text-primary-content hover:bg-(--wc-primary-hover)`,
  subtle: `${cta} border border-base-content/20 text-(--wc-text-60) hover:bg-base-content/5`,
  error: `${cta} mb-3 bg-error text-error-content hover:brightness-110`,
  control: `${controlBase} px-5 border-(--wc-border)/70 bg-(--wc-glow)/60 text-(--wc-text-70) backdrop-blur-sm hover:border-(--wc-accent-border) hover:bg-(--wc-primary-hover) hover:text-(--wc-text-90)`,
  controlActive: `${controlBase} px-5 border-(--wc-hero-accent) bg-(--wc-glow) text-(--wc-gold) backdrop-blur-sm hover:border-(--wc-hero-accent) hover:bg-(--wc-glow) hover:text-(--wc-gold)`,
  secondary:
    "flex h-9 w-9 items-center justify-center rounded border duration-150 select-none cursor-pointer border-(--wc-border) text-(--wc-text-60) hover:border-(--wc-accent-border) hover:bg-(--wc-glow)/40 hover:text-(--wc-gold-muted)",
  secondaryActive:
    "flex h-9 w-9 items-center justify-center rounded border duration-150 select-none cursor-default border-(--wc-gold-dim) bg-(--wc-glow) text-(--wc-gold) shadow-[0_0_10px_var(--wc-gold-dim)]/35",
  pagination:
    "flex h-8 min-w-8 items-center justify-center rounded-sm border border-transparent px-2 font-medium text-(--wc-text-60) duration-150 select-none cursor-pointer hover:text-(--wc-gold-muted) focus-visible:outline focus-visible:outline-1 focus-visible:outline-(--wc-gold-dim) sm:h-9 sm:min-w-9",
  paginationActive:
    "wc-text-glow-hero relative flex h-8 min-w-8 items-center justify-center rounded-sm border border-transparent px-2 font-bold text-(--wc-hero-accent) duration-150 select-none cursor-default after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:bg-(--wc-hero-accent) sm:h-9 sm:min-w-9",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
