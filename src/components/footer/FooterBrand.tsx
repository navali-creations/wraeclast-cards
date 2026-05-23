import { Link } from "@tanstack/react-router";

export function FooterBrand() {
  return (
    <div className="max-w-64">
      <Link
        to="/"
        className="font-cinzel text-base font-bold tracking-widest uppercase text-(--wc-gold)"
      >
        Wraeclast<span className="text-(--color-primary)">.</span>Cards
      </Link>
      <p className="mt-2 text-sm text-(--wc-text-50)">
        Divination card database, price tracking, and stacked deck analytics for
        Path of Exile.
      </p>
    </div>
  );
}
