export function Methodology() {
  return (
    <section className="rounded-lg border border-[color-mix(in_oklch,var(--wc-gold-dim)_36%,transparent)] bg-[color-mix(in_oklch,var(--wc-text-90)_80%,var(--wc-gold)_20%)] px-4 py-3.5">
      <p className="text-sm leading-6 text-[color-mix(in_oklch,var(--wc-text-30)_70%,var(--color-primary)_30%)]">
        <span className="font-semibold">Methodology:</span> Drop rates are
        observed from real stacked deck openings captured by Soothsayer. Weight
        data sourced from the Prohibited Library spreadsheet by{" "}
        <a
          href="https://github.com/nerdyjoe"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[color-mix(in_oklch,var(--color-primary)_88%,black)] hover:underline"
        >
          @nerdyjoe
        </a>
        . Rates may vary across leagues.
      </p>
    </section>
  );
}
