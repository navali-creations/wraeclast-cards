import { HiMagnifyingGlass } from "react-icons/hi2";

export function CardsFilters() {
  return (
    <div className="relative w-full sm:max-w-sm">
      <HiMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[color-mix(in_oklch,var(--wc-text-50)_75%,var(--color-info)_25%)]" />
      <input
        type="text"
        placeholder="Search cards or rewards…"
        className="h-10 w-full rounded-xl border border-[color-mix(in_oklch,var(--color-info)_28%,var(--wc-border))] bg-[color-mix(in_oklch,var(--wc-card-darker)_84%,black)] py-1.5 pl-10 pr-3 text-sm text-(--wc-text-80) shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--color-info)_12%,transparent)] transition-colors placeholder:text-(--wc-text-40) hover:border-(--color-primary) focus:border-(--color-info) focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklch,var(--color-info)_24%,transparent)]"
      />
    </div>
  );
}
